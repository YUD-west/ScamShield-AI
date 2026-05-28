import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeText } from "@/lib/security/sanitize";
import { rateLimit } from "@/lib/rate-limit";
import { runThreatAnalysis, getActiveEngine } from "@/lib/ai/unified";

const schema = z.object({
  content: z.string().min(1).max(50000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = await rateLimit(`ai-analyze:${ip}`, 30, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await runThreatAnalysis(sanitizeText(parsed.data.content));
  return NextResponse.json({
    ...result,
    engine: getActiveEngine(),
  });
}
