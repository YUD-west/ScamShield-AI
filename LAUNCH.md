# Launch checklist — ScamShield AI

## 1. Environment

```powershell
cd C:\Users\Administrator\scamshield-ai
copy .env.example .env
```

Set at minimum:

| Variable | Required for |
|----------|----------------|
| `AUTH_SECRET` | Sessions (32+ chars) |
| `OPENAI_API_KEY` | Optional ChatGPT boost (not required) |
| `DATABASE_URL` | History, PDF by ID, billing |
| `REDIS_URL` | Cache + rate limits |
| `STRIPE_*` | Payments |

## 2. Install & database

```powershell
npm install
docker compose up -d postgres redis   # optional
npx prisma db push
npm run db:seed
```

## 3. Run

```powershell
npm run dev
```

Open http://localhost:3010

## 4. Verify APIs

```powershell
.\scripts\verify-e2e.ps1
```

Or manually:

- `GET /api/health` — `services.openai: true` when key set
- `POST /api/ai/analyze` — `{ "content": "suspicious text..." }`
- `POST /api/ai/chat` — `{ "message": "Is this a scam?" }`
- Landing page → paste demo → Analyze Threat

## 5. Production deploy

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

- Vercel: frontend + API routes
- Railway: PostgreSQL + Redis
- Stripe webhook → `/api/stripe/webhook`

## 6. Pre-launch security

- [ ] Rotate `AUTH_SECRET` and API keys
- [ ] Enable Stripe webhook signing
- [ ] Restrict admin `role` in database
- [ ] Set production `NEXT_PUBLIC_APP_URL`
