import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeUrl } from "@/services/url-intelligence";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  url: z.union([z.string().url(), z.string().min(4).max(2048)]),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = await rateLimit(`url:${ip}`, 50, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    let target = parsed.data.url.trim();
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    const intel = await analyzeUrl(target);
    return NextResponse.json(intel);
  } catch (e) {
    console.error("[url]", e);
    return NextResponse.json({ error: "URL analysis failed" }, { status: 500 });
  }
}
