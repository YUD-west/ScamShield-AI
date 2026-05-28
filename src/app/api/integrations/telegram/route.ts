/**
 * Telegram bot webhook — forward message text to analysis pipeline.
 * Set webhook: https://api.telegram.org/bot<TOKEN>/setWebhook?url=<APP_URL>/api/integrations/telegram
 */
import { NextRequest, NextResponse } from "next/server";
import { runAnalysisPipeline } from "@/ai-engine/pipeline";
import { sanitizeText } from "@/lib/security/sanitize";

interface TelegramUpdate {
  message?: { text?: string; chat?: { id: number } };
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;
  const text = update.message?.text;
  const chatId = update.message?.chat?.id;

  if (!text?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = await runAnalysisPipeline(sanitizeText(text));
  const reply = `🛡 ScamShield AI\nRisk: ${result.risk_level.toUpperCase()} (${Math.round(result.scam_probability)}%)\n${result.ai_summary.slice(0, 400)}`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (token && chatId) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, analysis: result });
}
