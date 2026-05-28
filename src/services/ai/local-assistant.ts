import { retrieveContext } from "@/ai-engine/rag/retriever";
import { runHeuristicAnalysis } from "./heuristic-engine";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

function lastUserMessage(messages: ChatMsg[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content.trim();
  }
  return "";
}

function looksLikeSuspiciousContent(text: string): boolean {
  if (text.length < 40) return false;
  return (
    /urgent|verify|click|password|otp|bitcoin|won|prize|suspended|http/i.test(text) ||
    text.split(/\s+/).length > 15
  );
}

function formatScanReply(analysis: ReturnType<typeof runHeuristicAnalysis>): string {
  return `**Threat analysis (Built-in AI)**

**Risk:** ${analysis.risk_level.toUpperCase()} — **${Math.round(analysis.scam_probability)}%** scam probability

**Type:** ${analysis.scam_type.replace(/_/g, " ")}

**Summary:** ${analysis.ai_summary}

**Tactics detected:**
${analysis.detected_tactics.map((t) => `• ${t}`).join("\n") || "• None specific"}

**What to do:**
${analysis.recommended_actions.map((a) => `• ${a}`).join("\n")}

*Powered by ScamShield multi-layer detection — no external API required.*`;
}

export function runLocalSecurityChat(messages: ChatMsg[]): string {
  const input = lastUserMessage(messages);
  if (!input) {
    return "Ask me about phishing, scams, suspicious messages, or paste text you want analyzed.";
  }

  const lower = input.toLowerCase();

  if (looksLikeSuspiciousContent(input)) {
    const analysis = runHeuristicAnalysis(input);
    const chunks = retrieveContext(input, 2);
    let reply = formatScanReply(analysis);
    if (chunks.length) {
      reply += `\n\n**Related threat intel:** ${chunks.map((c) => c.content).join(" ")}`;
    }
    return reply;
  }

  if (/^(hi|hello|hey|help)\b/i.test(lower)) {
    return `Hello! I'm **ScamShield AI**, your security assistant.

I can help you:
• **Analyze** suspicious SMS, emails, or DMs — paste the full message
• Explain **phishing** and **social engineering** tactics
• Advise on **safe practices** for links, OTPs, and payments

Paste any suspicious message and I'll run a full threat analysis instantly.`;
  }

  if (/phish|phishing|fake email|suspicious email/i.test(lower)) {
    return `**Phishing red flags to watch for:**

1. **Urgent language** — "act now", "account suspended", "verify within 24h"
2. **Generic greetings** — "Dear customer" instead of your name
3. **Suspicious links** — hover before clicking; check the real domain
4. **Credential requests** — banks never ask for passwords or OTPs via email/SMS
5. **Mismatched sender** — email domain doesn't match the claimed company

**If you received one:** don't click links, go to the official website directly, and report as phishing.

Paste the message here and I'll analyze it for you.`;
  }

  if (/otp|verification code|2fa|two.factor/i.test(lower)) {
    return `**Never share OTP or verification codes** with anyone — including people claiming to be from your bank, Amazon, or tech support.

Scammers use **OTP theft** to hijack accounts in real time. Legitimate companies will **never** ask you to read a code aloud or enter it on a third-party site.

If you already shared a code: change passwords immediately, enable 2FA on a device you control, and contact your bank.`;
  }

  if (/crypto|bitcoin|usdt|gift card|wire/i.test(lower)) {
    return `**Crypto & gift card scams** are extremely common because payments are **irreversible**.

Red flags:
• Urgent payment in Bitcoin, USDT, or gift cards
• Romance or job scam progressing to money requests
• "Investment" opportunities via WhatsApp/Telegram

**Rule:** If someone you met online asks for crypto or gift cards — it's almost certainly a scam.`;
  }

  if (/url|link|website|domain|safe to click/i.test(lower)) {
    return `**Before clicking any link:**

1. Check the domain spelling (paypa1.com vs paypal.com)
2. Use the **URL Scanner** in Dashboard → URL Intelligence
3. On mobile, long-press to preview the URL
4. When in doubt, open the official app or type the address manually

Paste a suspicious URL or message containing a link and I'll analyze it.`;
  }

  if (/romance|dating|love scam/i.test(lower)) {
    return `**Romance scams** build trust over weeks, then invent emergencies requiring money.

Warning signs:
• Moving chat off the dating platform quickly (WhatsApp, Telegram)
• Refusing video calls or meeting in person
• Sudden financial emergencies, medical bills, or "investment opportunities"

Never send money to someone you haven't met in person.`;
  }

  if (/report|what should i do|i clicked/i.test(lower)) {
    return `**If you think you were scammed:**

1. **Disconnect** — don't reply or click more links
2. **Secure accounts** — change passwords from a clean device; enable 2FA
3. **Contact your bank** if you shared payment info or transferred money
4. **Report** — forward phishing emails to report@phishing.gov (US) or your national cybercrime unit
5. **Document** — save screenshots for reports

Paste the suspicious message for a detailed risk assessment.`;
  }

  const chunks = retrieveContext(input, 2);
  if (chunks.length) {
    return `**Security guidance:**

${chunks.map((c) => `**${c.title}:** ${c.content}`).join("\n\n")}

For a full threat scan, paste the suspicious message (SMS, email, or DM) and I'll analyze scam probability, tactics, and recommended actions.`;
  }

  return `I'm here to help with cybersecurity questions.

**Try asking:**
• "How do I spot phishing?"
• "Is it safe to share OTP codes?"
• Or **paste a suspicious message** for automatic threat analysis

ScamShield uses built-in AI + threat intelligence — always active, no setup required.`;
}
