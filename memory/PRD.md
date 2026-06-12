# iphysys — Product Requirements (Living Doc)

## Problem statement
Production-ready marketing + content site for "iphysys" — a deep-tech startup positioned as the *Intelligence Layer for Physical Systems*. Tone is serious, technical, visionary, minimalistic, engineering-first. The site must project credibility without falsely implying deployed defence products.

## Architecture (delivered)
- Frontend: React (CRA + CRACO) + TailwindCSS + shadcn/ui + Sonner
- Backend: FastAPI + Motor (async MongoDB)
- Database: MongoDB (collections: users, posts, newsletter, contacts, textbook_chapters, textbook_sections)
- Auth: JWT (HTTP-only cookies, 12h access / 7d refresh) with bcrypt password hashing
- Routes prefixed `/api`, frontend uses REACT_APP_BACKEND_URL

## User personas
- Visitor / decision maker — browses Home, Vision, Insights, Textbook, About, Contact
- Registered user — same as visitor (signup currently structural)
- Admin (iphysys@gmail.com / admin123) — full CRUD on posts, textbook chapters/sections/content, contacts, newsletter

## Implemented (rolling log)
- Home, Vision, About, Contact, Legal pages with engineering-first copy
- Insights list + detail with categories, search, pagination, related posts
- Insights left sidebar with nested topic / sub-topic taxonomy
- AI Textbook page driven entirely from MongoDB (12 chapters / 51 sections seeded)
- Admin dashboard with Overview, Posts, Textbook, Newsletter, Contacts tabs (full CRUD)
- Auth: signup, signin, signout endpoints; admin seeded from env vars
- Theme: futuristic blackish-gray base with blood-red + gold + white accents
- Hero canvas: 90 nodes (50 gold / 20 red / 20 white) with halving on mobile
- Brand mark: red "i" inside gold `[ ... ]` brackets
- CORS reads from CORS_ORIGINS env var; .gitignore no longer blocks .env files
- Deployment health check: PASS

## Backlog (next phases)
P1
- Markdown rendering + preview pane in section/post editor
- Drag-to-reorder for chapters and sections (admin)
- Bookmarks for signed-in users (save insights / chapters)
- Newsletter / contact email notifications (Resend or SendGrid)

P2
- MDX support for richer insight articles
- Analytics integration (Plausible or self-hosted)
- Founder profile section with team expansion
- Auth: optional Google social login (Emergent-managed)
- Real-time admin activity feed
