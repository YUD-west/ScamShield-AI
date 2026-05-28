/**
 * Chrome extension / Telegram bot / external API entry point
 * Header: Authorization: Bearer <api_key>
 */
import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "@/ai-engine/pipeline";
import { sanitizeText } from "@/lib/security/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { validateApiKey } from "@/lib/auth/api-key";

const schema = z.object({ content: z.string().min(1).max(50000) });

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "API key required" }, { status: 401 });
  }

  const rawKey = authHeader.slice(7).trim();
  const keyAuth = await validateApiKey(rawKey);
  if (!keyAuth) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "api";
  const limit = await rateLimit(`api:${ip}`, 100, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await runAnalysisPipeline(sanitizeText(parsed.data.content));
  return NextResponse.json(result);
}
