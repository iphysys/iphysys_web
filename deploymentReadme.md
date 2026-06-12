# iphysys — Deployment Readme

End-to-end record of how `iphysys.com` was prepared for and shipped to production. Use this as the single source of truth for redeployments, future contributors, and recovery.

> **Production URL**: <https://iphysys.com> (custom domain via Cloudflare DNS → Emergent)
> **Stack**: React (CRA + CRACO) frontend · FastAPI backend · MongoDB
> **Hosting**: Emergent managed Kubernetes (frontend + backend + MongoDB)

---

## 1. Architecture at a glance

```
+------------------------+        +-------------------------+        +-----------------+
|  Cloudflare DNS        |  CNAME |  Emergent Ingress       |  /api  |  FastAPI :8001  |
|  iphysys.com           +------->+  <app>.emergent.host    +------->+  (uvicorn)      |
|  www.iphysys.com       |        |                         |   /    +-----------------+
+------------------------+        |  Frontend served on :3000        |  MongoDB        |
                                  +----------------------------------+  (managed)      |
                                                                       +---------------+
```

- All backend routes are prefixed with `/api` so Kubernetes ingress can route them to port 8001
- Frontend uses `process.env.REACT_APP_BACKEND_URL` for every API call (no hardcoded URLs)
- Both services are supervised; `supervisor` auto-restarts on env or dependency change

---

## 2. Environment variables

### `backend/.env`

| Key | Value used in production | Notes |
| --- | --- | --- |
| `MONGO_URL` | `mongodb://localhost:27017` | Provided by Emergent managed Mongo — do not change |
| `DB_NAME` | `test_database` | Provided by Emergent — do not change |
| `CORS_ORIGINS` | `*` | After domain SSL is verified, tighten to `https://iphysys.com,https://www.iphysys.com,https://<app>.emergent.host` |
| `JWT_SECRET` | 64-char hex (random) | Generate with `python3 -c "import secrets;print(secrets.token_hex(32))"` |
| `ADMIN_EMAIL` | `iphysys@gmail.com` | Seeded on every backend startup |
| `ADMIN_PASSWORD` | `Kohinoor@959` | Re-seeded on startup; rotating in env auto-rotates the DB password |
| `FRONTEND_URL` | `https://iphysys.com` | Used by `seed_data` for logging and CORS fallback |

### `frontend/.env`

| Key | Notes |
| --- | --- |
| `REACT_APP_BACKEND_URL` | Set by Emergent automatically. Do **not** hardcode — always read via `process.env` |
| `WDS_SOCKET_PORT` | Required for hot reload in preview |

---

## 3. Pre-deployment checks (every one of these passed before shipping)

### Static analysis (run via `deployment_agent`)

| Check | Status |
| --- | --- |
| Compilation (frontend + backend) | ✅ |
| No hardcoded URLs or secrets in source | ✅ |
| Frontend uses `REACT_APP_BACKEND_URL` only | ✅ |
| Backend reads `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGINS`, `FRONTEND_URL` from env | ✅ |
| `.env` files well-formed (no inline comments, no quotes around `$` chars) | ✅ |
| CORS allows production origin | ✅ (`*` for now) |
| MongoDB-only database (no Postgres/MySQL/SQLite leaks) | ✅ |
| No ML / blockchain / web3 deps requiring GPUs | ✅ |
| Supervisor config matches FastAPI + React | ✅ |
| `.gitignore` does NOT block `.env`, `/etc`, supervisor config | ✅ (we explicitly removed `.env`, `.env.*`, `*.env` patterns) |
| No `load_dotenv(override=True)` (would clobber prod env) | ✅ |
| Admin queries paginated / projected | ✅ (`/admin/posts` ≤ 200, `/admin/newsletter` and `/admin/contacts` paginated, textbook TOC limited & projected) |

### Functional smoke tests (all green)

| Flow | Verified by |
| --- | --- |
| Public site loads on `/`, `/vision`, `/about`, `/contact`, `/insights`, `/insights/:slug`, `/textbook`, `/legal/:slug` | Manual + Playwright screenshots |
| Signup creates user with role=`user`; duplicate signup returns 409 | curl |
| Signin returns role-appropriate cookies; expired/missing tokens return 401 | curl + Playwright |
| Admin login (`iphysys@gmail.com` / `Kohinoor@959`) returns `role: admin` | curl |
| Posts CRUD (admin) creates → reads → updates → deletes a draft | curl + dashboard |
| Textbook CRUD (admin) creates chapter → section → updates content → cascades delete | curl + dashboard |
| Public `/api/textbook/{ch}/{sec}` returns saved content after admin edit | curl |
| Newsletter signup persists + duplicate dedupes silently | curl |
| Contact form persists + admin sees unread badge | curl + dashboard |

### Issues found & fixed during the readiness pass

| Issue | Fix |
| --- | --- |
| `.gitignore` blocked all `.env*` files → Emergent could not pick up env config | Removed `.env`, `.env.*`, `*.env` patterns from `/app/.gitignore` |
| Backend CORS was hardcoded to a single origin | Refactored to parse `CORS_ORIGINS` env var (comma-separated, `*` supported) |
| `/admin/posts` returned full `content` for every post (heavy) | Added projection that drops `content` and lowered limit to 200 |
| `/admin/newsletter` and `/admin/contacts` fetched up to 2000 docs in one go | Replaced with skip/limit pagination, default 100, max 500, returns total |
| `_build_toc` fetched up to 5000 sections with full payloads | Added explicit projections and lowered bounds to 200 chapters / 1000 sections |

---

## 4. Cloudflare DNS configuration for `iphysys.com`

Domain purchased through Cloudflare. DNS records:

| Type | Name | Target | Proxy | TTL |
| --- | --- | --- | --- | --- |
| CNAME | `@` (or `iphysys.com`) | `<app-name>.emergent.host` | DNS only (grey cloud) initially | Auto |
| CNAME | `www` | `<app-name>.emergent.host` | DNS only initially | Auto |

> Replace `<app-name>` with the value Emergent shows on the Deployment page (in our case `mission-aware-ai`).
> Once SSL is verified end-to-end, switch the proxy status to **Proxied** (orange cloud) for Cloudflare CDN + DDoS protection.

### SSL

- Emergent issues a Let's Encrypt cert for the custom domain via ACME
- In Cloudflare → SSL/TLS, set encryption mode to **Full (Strict)** once the cert is live
- Do NOT enable "Always Use HTTPS" on the proxy before the cert is verified — it causes a redirect loop

---

## 5. Deployment procedure (step-by-step)

1. **Confirm preview is healthy** — open the preview URL, run admin login, verify Insights and Textbook load
2. **Run deployment readiness check** — invoked `deployment_agent`; all blockers fixed
3. **Click "Deploy" in the Emergent workspace** (top-right of the IDE)
4. Emergent provisions a `<app-name>.emergent.host` URL and runs the backend + frontend in production
5. **Copy the deploy URL** and configure Cloudflare DNS records (see §4)
6. In **Emergent → Deployment → Custom Domain**, add `iphysys.com` and `www.iphysys.com`
7. Wait for DNS propagation (a few minutes — `dig iphysys.com` should resolve to the Emergent target)
8. Verify production:
   - `https://iphysys.com` loads the home page
   - `https://iphysys.com/api/` returns `{"service":"iphysys","status":"ok"}`
   - `https://iphysys.com/signin` accepts `iphysys@gmail.com` / `Kohinoor@959`
9. (Recommended) Narrow `CORS_ORIGINS` to the production origin list and redeploy

---

## 6. Post-deployment hardening

- [ ] Tighten `CORS_ORIGINS` to `https://iphysys.com,https://www.iphysys.com,https://<app>.emergent.host`
- [ ] Rotate `JWT_SECRET` after any contributor leaves the project (invalidates all sessions)
- [ ] Change `ADMIN_PASSWORD` from any default value — current production password is `Kohinoor@959`
- [ ] Configure Cloudflare WAF rules to rate-limit `/api/auth/login` and `/api/auth/signup`
- [ ] Set Cloudflare SSL mode to **Full (Strict)** once the origin cert is verified
- [ ] Add an analytics provider (Plausible / Cloudflare Web Analytics / Google Analytics) — placeholders exist in design but no script is loaded yet

---

## 7. Local development quickstart

```bash
# Backend
cd /app/backend
pip install -r requirements.txt
# Make sure MongoDB is reachable at MONGO_URL
sudo supervisorctl restart backend     # (in Emergent preview env)
# Or, locally:
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd /app/frontend
yarn install
yarn start
```

Admin will be seeded automatically on backend startup using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The seed runs:
- Creates `users` admin if absent
- Updates admin password if env value changed
- Seeds ~20 placeholder posts on a fresh DB
- Seeds 12 textbook chapters / 51 sections on a fresh DB
- Creates indexes on `users.email`, `posts.slug`, `newsletter.email`, `textbook_chapters.key`, and the composite `textbook_sections.(chapter_id, key)`

---

## 8. Rollback

In Emergent, every successful deploy creates an immutable revision. To roll back:

1. Go to **Deployment → History**
2. Select a previous green revision
3. Click **Promote** — the platform repoints traffic instantly

Rolling back does NOT alter MongoDB data. If a deploy ran a destructive migration, restore from the Emergent Mongo backup (Deployment → Backups → Restore).

---

## 9. Useful API quick reference

| Endpoint | Auth | Purpose |
| --- | --- | --- |
| `GET /api/` | public | Liveness check |
| `GET /api/posts` | public | List published insights (query: `category`, `tag`, `q`, `limit`, `skip`, `featured`) |
| `GET /api/posts/{slug}` | public | Single insight + related |
| `GET /api/textbook` | public | Full TOC (chapters + section headers) |
| `GET /api/textbook/{chapter}/{section}` | public | Section content |
| `POST /api/newsletter` | public | Subscribe |
| `POST /api/contact` | public | Submit contact form |
| `POST /api/auth/login` | public | Email + password |
| `POST /api/auth/signup` | public | Create user account (role=`user`) |
| `GET /api/auth/me` | session | Current user |
| `POST /api/auth/logout` | session | Clear session cookies |
| `*` `/api/admin/posts` | admin | CRUD posts |
| `*` `/api/admin/textbook/...` | admin | CRUD chapters + sections + content |
| `*` `/api/admin/newsletter` | admin | List + remove subscribers |
| `*` `/api/admin/contacts` | admin | List + mark read + delete |
| `GET /api/admin/stats` | admin | Counts for dashboard overview |

---

## 10. Decisions worth remembering

- **No login required to read content.** Insights and Textbook are public; signup exists so future personalisation (bookmarks, progress tracking) is straightforward to add.
- **JWT in HTTP-only cookies (not localStorage).** Reduces XSS impact; required `withCredentials: true` on axios.
- **Idempotent seed.** Safe to restart backend after env changes; admin row is updated, not duplicated.
- **Textbook content lives in MongoDB**, not in source files. Constants files were used only for initial seeding.
- **Branding**: red `i` inside gold `[ ... ]` brackets, blackish-gray base, blood-red + gold + white accent palette. Updates should preserve those tokens (see `/app/frontend/src/index.css`).

---

_Last updated: deployment to `iphysys.com` via Emergent + Cloudflare DNS._
