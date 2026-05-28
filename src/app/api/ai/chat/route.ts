import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/security/sanitize";
import { runSecurityChat } from "@/lib/ai/unified";

const schema = z.object({
  message: z.string().min(1).max(8000).optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().max(8000),
      }),
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const limit = await rateLimit(`ai-chat:${ip}`, 50, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const chatMessages =
    parsed.data.messages ??
    (parsed.data.message
      ? [{ role: "user" as const, content: sanitizeText(parsed.data.message) }]
      : null);

  if (!chatMessages?.length) {
    return NextResponse.json({ error: "Provide message or messages" }, { status: 400 });
  }

  const { content, engine } = await runSecurityChat(chatMessages);

  return NextResponse.json({
    role: "assistant",
    content,
    engine,
    demo: false,
  });
}
