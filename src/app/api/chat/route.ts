import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/security/sanitize";
import { runSecurityChat } from "@/lib/ai/unified";

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(8000),
    }),
  ),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const limit = await rateLimit(`chat:${ip}`, 40, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const messages = parsed.data.messages.map((m) => ({
    role: m.role,
    content: sanitizeText(m.content),
  }));

  const { content, engine } = await runSecurityChat(messages);

  return NextResponse.json({
    role: "assistant",
    content,
    engine,
    demo: false,
  });
}
