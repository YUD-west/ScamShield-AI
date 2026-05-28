# Deployment Guide — Vercel + Render

ScamShield AI is a **Next.js 15** full-stack app. For production we recommend:

| Component | Platform | Role |
|-----------|----------|------|
| **Frontend + Auth** | [Vercel](https://vercel.com) | Pages, NextAuth (`/api/auth/*`), middleware |
| **Backend API** | [Render](https://render.com) | Scans, SSE, OCR, chat, Stripe webhooks |
| **Database** | Render PostgreSQL | Users, scans, subscriptions |

---

## Architecture

```
User → Vercel (scamshield.vercel.app)
         ├─ /sign-in, /dashboard, pages
         ├─ /api/auth/*  (stays on Vercel)
         └─ /api/scan/* … (rewrites OR NEXT_PUBLIC_API_URL → Render)

Render Web Service (scamshield-api.onrender.com)
         └─ PostgreSQL (scamshield-db)
```

---

## Step 1 — Render (backend + database)

1. Push repo to GitHub.
2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** → connect repo.
3. Render reads `render.yaml` and creates:
   - **scamshield-db** (PostgreSQL)
   - **scamshield-api** (Node web service)
4. Set environment variables on **scamshield-api**:

| Variable | Value |
|----------|--------|
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | Your Vercel URL (e.g. `https://scamshield.vercel.app`) |
| `NEXTAUTH_URL` | Same as `AUTH_URL` |
| `NEXT_PUBLIC_APP_URL` | Same as `AUTH_URL` |
| `AUTH_TRUST_HOST` | `true` |

5. Wait for deploy; note URL: `https://scamshield-api.onrender.com`
6. Verify: `https://scamshield-api.onrender.com/api/health`

---

## Step 2 — Vercel (frontend)

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Root directory:** `scamshield-ai` (if monorepo) or repo root.
3. Framework: **Next.js** (auto-detected).
4. Environment variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | **Same** connection string as Render Postgres (External URL from Render DB) |
| `AUTH_SECRET` | **Same** value as Render |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `AUTH_TRUST_HOST` | `true` |
| `RENDER_BACKEND_URL` | `https://scamshield-api.onrender.com` |
| `NEXT_PUBLIC_API_URL` | `https://scamshield-api.onrender.com` (for SSE/long scans) |

5. Deploy.

`RENDER_BACKEND_URL` enables server-side rewrites (see `next.config.ts`).  
`NEXT_PUBLIC_API_URL` lets the browser call Render directly for streaming scans (avoids Vercel timeouts).

---

## Step 3 — Stripe webhooks

Point Stripe webhook to **Render** (backend):

```
https://scamshield-api.onrender.com/api/stripe/webhook
```

Events: `checkout.session.completed`, `customer.subscription.deleted`

---

## Step 4 — Seed production database

From your machine (with Render **External** `DATABASE_URL`):

```bash
cd scamshield-ai
export DATABASE_URL="postgresql://..."
npx prisma db push
npm run db:seed
```

Demo accounts after seed:

- `demo@scamshield.ai` / `Demo1234!`
- `admin@scamshield.ai` / `Admin1234!`

---

## All-in-one on Vercel (simpler)

Deploy only to Vercel with:

- `DATABASE_URL` → Render PostgreSQL or [Neon](https://neon.tech)
- Do **not** set `RENDER_BACKEND_URL` or `NEXT_PUBLIC_API_URL`

All `/api/*` routes run on Vercel. Upgrade to Pro if scans hit the 60s limit.

---

## Local development

```bash
docker compose up -d postgres
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3010

---

## Post-launch checklist

- [ ] Rotate `AUTH_SECRET` (never use dev default in production)
- [ ] Custom domain on Vercel + update `AUTH_URL` / `NEXT_PUBLIC_APP_URL`
- [ ] Stripe products + price IDs in env
- [ ] Render DB backups enabled
- [ ] Optional: Redis on Render for rate limiting
- [ ] Optional: `OPENAI_API_KEY` for enhanced reasoning
