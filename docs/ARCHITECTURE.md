# ScamShield AI — Architecture

## Overview

Monolithic Next.js 15 SaaS with API routes, multi-agent AI pipeline, PostgreSQL persistence, and Redis caching.

```
┌─────────────┐     SSE/REST      ┌──────────────────┐
│  Next.js UI │ ◄──────────────► │  API Routes      │
│  (React)    │                   │  /api/scan/*     │
└─────────────┘                   └────────┬─────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
            ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
            │ AI Pipeline  │      │ Prisma/PG    │      │ Redis Cache  │
            │ 6 Agents     │      │              │      │ Rate Limits  │
            └──────────────┘      └──────────────┘      └──────────────┘
```

## Layers

| Layer | Path | Responsibility |
|-------|------|----------------|
| UI | `src/app`, `src/components` | Landing, dashboard, scan workspace |
| State | `src/stores` | Zustand scan state + SSE client |
| API | `src/app/api` | REST, SSE, Stripe, OCR, v1 extension |
| AI Engine | `src/ai-engine` | Pipeline, RAG retriever |
| Services | `src/services` | Heuristics, OpenAI, URL intel, PDF |
| Lib | `src/lib` | Config, auth, usage limits, sanitize |

## Multi-Agent Pipeline

1. **Intake Agent** — sanitize input
2. **Threat Classification Agent** — NLP heuristics + RAG
3. **URL Intelligence Agent** — WHOIS-style + VirusTotal
4. **Behavioral Pattern Agent** — manipulation signals
5. **Risk Scoring Agent** — composite probability
6. **Report Generator Agent** — summary + actions

## Real-Time Updates

`POST /api/scan/stream` returns Server-Sent Events (SSE) for agent progress. Compatible with Vercel serverless; use WebSocket server on Railway for raw WS if needed.

## Security

- Zod validation on all inputs
- HTML stripping in `sanitizeText`
- Rate limiting (Redis + in-memory fallback)
- Per-plan daily quotas
- Security headers in `next.config.ts`
- JWT sessions via NextAuth

## Deployment

- **Frontend/API**: Vercel
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis
- **Docker**: `docker-compose.yml` for local full stack
