from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import re
import uuid
import logging
import bcrypt
import jwt as pyjwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict

# ---------------- DB ----------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------------- App ----------------
app = FastAPI(title="iphysys API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return now_utc().isoformat()


# ---------------- Auth utils ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": now_utc() + timedelta(hours=12),
        "type": "access",
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": now_utc() + timedelta(days=7),
        "type": "refresh",
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=43200, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# ---------------- Models ----------------
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=200)
    name: Optional[str] = ""


class NewsletterIn(BaseModel):
    email: EmailStr


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    organization: Optional[str] = ""
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)
    interest_type: str = "General Inquiry"


class PostIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    slug: Optional[str] = None
    excerpt: str = ""
    content: str = ""
    category: str = "Physical AI"
    tags: List[str] = []
    featured: bool = False
    published: bool = False
    reading_time: Optional[int] = None


# ---------------- Helpers ----------------
def slugify(value: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", value.lower()).strip()
    s = re.sub(r"[\s_-]+", "-", s)
    return s[:80] or str(uuid.uuid4())[:8]


def estimate_reading_time(text: str) -> int:
    words = len(re.findall(r"\w+", text or ""))
    return max(1, round(words / 220))


def public_post(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


CATEGORIES = [
    "Physical AI",
    "Multi-Agent Systems",
    "Edge AI",
    "Distributed Optimization",
    "Engineering Intelligence",
    "Trustworthy AI",
    "Digital Engineering",
    "Mission Systems",
    "Defence Technology",
    "Systems Thinking",
]


# ---------------- Public endpoints ----------------
@api_router.get("/")
async def root():
    return {"service": "iphysys", "status": "ok"}


@api_router.get("/categories")
async def list_categories():
    return CATEGORIES


@api_router.get("/posts")
async def list_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    q: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    query: dict = {"published": True}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"excerpt": {"$regex": q, "$options": "i"}},
            {"content": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.posts.find(query, {"_id": 0}).sort("published_at", -1).skip(skip).limit(limit)
    items = await cursor.to_list(length=limit)
    total = await db.posts.count_documents(query)
    return {"items": items, "total": total}


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    doc = await db.posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    related = (
        await db.posts.find(
            {"slug": {"$ne": slug}, "published": True, "category": doc.get("category")},
            {"_id": 0, "title": 1, "slug": 1, "excerpt": 1, "category": 1, "published_at": 1, "reading_time": 1},
        )
        .sort("published_at", -1)
        .limit(3)
        .to_list(length=3)
    )
    return {"post": doc, "related": related}


@api_router.post("/newsletter")
async def newsletter_subscribe(payload: NewsletterIn):
    email = payload.email.lower()
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"status": "already-subscribed"}
    await db.newsletter.insert_one(
        {"id": str(uuid.uuid4()), "email": email, "created_at": iso_now()}
    )
    return {"status": "subscribed"}


@api_router.post("/contact")
async def contact_submit(payload: ContactIn):
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "organization": payload.organization or "",
        "email": payload.email.lower(),
        "message": payload.message,
        "interest_type": payload.interest_type,
        "created_at": iso_now(),
        "read": False,
    }
    await db.contacts.insert_one(doc)
    return {"status": "received"}


# ---------------- Auth endpoints ----------------
@api_router.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access = create_access_token(user["id"], user["email"])
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "admin"),
        "access_token": access,
    }


@api_router.post("/auth/signup")
async def signup(payload: SignupIn, response: Response):
    email = payload.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": (payload.name or "").strip(),
        "role": "user",
        "created_at": iso_now(),
    }
    await db.users.insert_one(user_doc)
    access = create_access_token(user_doc["id"], user_doc["email"])
    refresh = create_refresh_token(user_doc["id"])
    set_auth_cookies(response, access, refresh)
    return {
        "id": user_doc["id"],
        "email": user_doc["email"],
        "name": user_doc["name"],
        "role": user_doc["role"],
        "access_token": access,
    }


@api_router.post("/auth/logout")
async def logout(response: Response, user: dict = Depends(get_current_user)):
    clear_auth_cookies(response)
    return {"status": "ok"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------------- Admin endpoints ----------------
@api_router.get("/admin/posts")
async def admin_list_posts(_: dict = Depends(require_admin)):
    items = await db.posts.find({}, {"_id": 0}).sort("updated_at", -1).to_list(length=500)
    return {"items": items}


@api_router.post("/admin/posts")
async def admin_create_post(payload: PostIn, _: dict = Depends(require_admin)):
    pid = str(uuid.uuid4())
    slug = payload.slug or slugify(payload.title)
    # ensure unique slug
    if await db.posts.find_one({"slug": slug}):
        slug = f"{slug}-{pid[:6]}"
    doc = payload.model_dump()
    doc.update(
        {
            "id": pid,
            "slug": slug,
            "reading_time": payload.reading_time or estimate_reading_time(payload.content),
            "created_at": iso_now(),
            "updated_at": iso_now(),
            "published_at": iso_now() if payload.published else None,
        }
    )
    await db.posts.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/posts/{post_id}")
async def admin_update_post(post_id: str, payload: PostIn, _: dict = Depends(require_admin)):
    existing = await db.posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Not found")
    updates = payload.model_dump()
    if not updates.get("slug"):
        updates["slug"] = existing.get("slug") or slugify(payload.title)
    updates["reading_time"] = payload.reading_time or estimate_reading_time(payload.content)
    updates["updated_at"] = iso_now()
    if payload.published and not existing.get("published_at"):
        updates["published_at"] = iso_now()
    await db.posts.update_one({"id": post_id}, {"$set": updates})
    doc = await db.posts.find_one({"id": post_id}, {"_id": 0})
    return doc


@api_router.delete("/admin/posts/{post_id}")
async def admin_delete_post(post_id: str, _: dict = Depends(require_admin)):
    res = await db.posts.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"status": "deleted"}


@api_router.get("/admin/newsletter")
async def admin_list_newsletter(_: dict = Depends(require_admin)):
    items = await db.newsletter.find({}, {"_id": 0}).sort("created_at", -1).to_list(length=2000)
    return {"items": items, "total": len(items)}


@api_router.delete("/admin/newsletter/{sub_id}")
async def admin_delete_newsletter(sub_id: str, _: dict = Depends(require_admin)):
    await db.newsletter.delete_one({"id": sub_id})
    return {"status": "deleted"}


@api_router.get("/admin/contacts")
async def admin_list_contacts(_: dict = Depends(require_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(length=2000)
    return {"items": items, "total": len(items)}


@api_router.put("/admin/contacts/{cid}/read")
async def admin_mark_contact_read(cid: str, _: dict = Depends(require_admin)):
    await db.contacts.update_one({"id": cid}, {"$set": {"read": True}})
    return {"status": "ok"}


@api_router.delete("/admin/contacts/{cid}")
async def admin_delete_contact(cid: str, _: dict = Depends(require_admin)):
    await db.contacts.delete_one({"id": cid})
    return {"status": "deleted"}


@api_router.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    posts_total = await db.posts.count_documents({})
    posts_published = await db.posts.count_documents({"published": True})
    subs = await db.newsletter.count_documents({})
    contacts = await db.contacts.count_documents({})
    unread = await db.contacts.count_documents({"read": False})
    return {
        "posts_total": posts_total,
        "posts_published": posts_published,
        "newsletter": subs,
        "contacts": contacts,
        "contacts_unread": unread,
    }


# ---------------- Seed ----------------
SEED_POSTS = [
    ("Why Physical AI Is Different From Language Intelligence", "Physical AI", ["physical-ai", "foundations"], True),
    ("Edge Intelligence: Why the Cloud Cannot Own Every Decision", "Edge AI", ["edge", "latency"], True),
    ("Human-Machine Teaming in Mission-Critical Environments", "Mission Systems", ["hmt", "operators"], False),
    ("The Case for Explainable Autonomy", "Trustworthy AI", ["explainability", "trust"], True),
    ("Engineering Intelligence: Beyond Copilots", "Engineering Intelligence", ["copilots", "tooling"], False),
    ("Distributed Optimization for Real-World Systems", "Distributed Optimization", ["optimization"], False),
    ("Trust, Confidence, and Risk in Autonomous Systems", "Trustworthy AI", ["risk", "confidence"], False),
    ("The Emerging Role of Multi-Agent Coordination", "Multi-Agent Systems", ["coordination"], False),
    ("Mission-Aware Systems: The Next Frontier", "Mission Systems", ["mission"], False),
    ("Digital Engineering and the Future of Complex Systems", "Digital Engineering", ["digital-engineering"], False),
    ("Perception Stacks for Distributed Sensor Networks", "Physical AI", ["perception", "sensors"], False),
    ("Latency Budgets in Edge Inference Pipelines", "Edge AI", ["latency", "inference"], False),
    ("Decentralized Consensus for Agent Swarms", "Multi-Agent Systems", ["consensus", "swarms"], False),
    ("Risk-Aware Planning Under Uncertainty", "Distributed Optimization", ["planning", "uncertainty"], False),
    ("From Specifications to Trustworthy Code", "Engineering Intelligence", ["specifications"], False),
    ("Calibration: The Quiet Foundation of Autonomy", "Trustworthy AI", ["calibration"], False),
    ("Model-Based Engineering Meets Learned Components", "Digital Engineering", ["mbse"], False),
    ("Defence Technology and the Demand for Engineering Rigor", "Defence Technology", ["defence", "rigor"], False),
    ("Designing for Operator Cognitive Load", "Mission Systems", ["operators", "ux"], False),
    ("Why Systems Thinking Belongs in AI Research", "Systems Thinking", ["systems"], False),
]


def _seed_content(title: str, category: str) -> str:
    return (
        f"This is an initial placeholder draft for the article \"{title}\" in the {category} category.\n\n"
        "It exists as a starting point inside the iphysys insights archive. Replace this body with a "
        "production-grade technical article through the admin dashboard. The article should reflect "
        "iphysys' engineering-first perspective on intelligent physical systems: precise, technical, "
        "and free of marketing language.\n\n"
        "Outline ideas:\n"
        "- Problem framing rooted in real physical constraints.\n"
        "- Why prevailing approaches fall short for distributed, mission-aware systems.\n"
        "- A perspective on how iphysys thinks about the problem.\n"
        "- Open questions worth investigating next."
    )


async def seed_data():
    # admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@iphysys.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "iphysys-admin-2026")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "iphysys Admin",
                "role": "admin",
                "created_at": iso_now(),
            }
        )
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}}
        )

    # indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.posts.create_index("slug", unique=True)
    await db.posts.create_index("category")
    await db.posts.create_index("published")
    await db.newsletter.create_index("email", unique=True)

    # posts
    if await db.posts.count_documents({}) == 0:
        base = now_utc()
        docs = []
        for i, (title, category, tags, featured) in enumerate(SEED_POSTS):
            slug = slugify(title)
            content = _seed_content(title, category)
            published_at = (base - timedelta(days=i)).isoformat()
            docs.append(
                {
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "slug": slug,
                    "excerpt": f"An iphysys perspective on {category.lower()} — initial draft for the insights archive.",
                    "content": content,
                    "category": category,
                    "tags": tags,
                    "featured": featured,
                    "published": True,
                    "reading_time": estimate_reading_time(content),
                    "created_at": published_at,
                    "updated_at": published_at,
                    "published_at": published_at,
                }
            )
        if docs:
            await db.posts.insert_many(docs)


# ---------------- App init ----------------
app.include_router(api_router)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
allow_origins = [frontend_url, "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("iphysys")


@app.on_event("startup")
async def on_startup():
    try:
        await seed_data()
        logger.info("Seed complete")
    except Exception as e:
        logger.exception("Seed failed: %s", e)


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
