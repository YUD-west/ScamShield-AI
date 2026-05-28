# ScamShield AI — API Reference

Base URL: `https://your-domain.com` (local: `http://localhost:3010`)

## Authentication

| Method | Endpoint | Auth |
|--------|----------|------|
| Session | Browser cookies | NextAuth |
| API v1 | `Authorization: Bearer <key>` | API key (Enterprise) |

## OpenAI / ChatGPT

### `GET /api/ai/status`

Returns whether `OPENAI_API_KEY` is configured and which model is used.

### `POST /api/ai/chat`

ChatGPT security assistant.

```json
{ "message": "How do I spot a phishing email?" }
```

Or full conversation:

```json
{ "messages": [{ "role": "user", "content": "..." }] }
```

### `POST /api/ai/analyze`

Same analysis engine as `/api/scan` (heuristics + OpenAI when configured).

```json
{ "content": "suspicious message text" }
```

## Scan

### `POST /api/scan`

Synchronous full analysis.

```json
{ "content": "suspicious message text", "type": "MESSAGE" }
```

Response: structured `AnalysisOutput` + `scanId` (if DB connected).

### `POST /api/scan/stream`

SSE stream with agent progress events.

Events:
- `{ "type": "progress", "agent": "...", "message": "...", "progress": 50 }`
- `{ "type": "complete", "result": { ...AnalysisOutput } }`
- `{ "type": "error", "message": "..." }`

### `POST /api/url`

```json
{ "url": "https://example.com" }
```

### `POST /api/ocr`

`multipart/form-data` with `file` (image, max 5MB).

## External API (v1)

### `POST /api/v1/scan`

Headers: `Authorization: Bearer <api_key>`

## Reports

### `GET /api/reports/:id/pdf`

Download PDF threat report (requires scan in database).

## Billing

### `POST /api/stripe/checkout`

```json
{ "plan": "pro" }
```

Returns `{ "url": "https://checkout.stripe.com/..." }`.

## Dashboard

### `GET /api/scans?page=1&limit=20`

Paginated scan history.

### `GET /api/dashboard/stats`

Analytics for threat dashboard.

## Health

### `GET /api/health`

```json
{ "ok": true, "app": "ScamShield AI", "version": "2.0.0" }
```

## AnalysisOutput Schema

```json
{
  "scam_probability": 0,
  "risk_level": "low|medium|high|critical",
  "scam_type": "phishing|crypto_scam|...",
  "detected_tactics": [],
  "detected_attack_vectors": [],
  "suspicious_keywords": [],
  "malicious_links": [],
  "impersonated_brand": null,
  "emotional_manipulation": { "fear": 0, "urgency": 0, "greed": 0, "authority": 0 },
  "urgency_score": 0,
  "ai_summary": "",
  "recommended_actions": [],
  "confidence_score": 0,
  "attack_category": ""
}
```
