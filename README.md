# ScamShield AI

AI-powered scam and phishing detection — demo app on **http://localhost:3011**

## Run demo (Windows)

```powershell
cd C:\Users\Administrator\Desktop\scamsheild.ai
.\FIX-ALL.bat
```

Login: **demo@scamshield.ai** / **Demo1234!**

## Push to GitHub

```powershell
.\PUSH-TO-GITHUB.bat
```

Repo: https://github.com/Ethiopian-Cursor-Community/scamshield-ai

## Deploy

| Platform | Notes |
|----------|--------|
| **Vercel** | Import repo; set env from `.env.example`; use **Neon PostgreSQL** for production DB |
| **Render** | Use `render.yaml` in repo |

Local dev uses **SQLite** (no Docker). Production needs **PostgreSQL**.

## Stack

Next.js 15 · Prisma · SQLite (local) · NextAuth · Built-in AI (no OpenAI key required)
