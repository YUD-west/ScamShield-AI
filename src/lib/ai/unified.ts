import { isOpenAIConfigured, chatCompletion } from "@/lib/openai";
import { runLocalSecurityChat } from "@/services/ai/local-assistant";
import { enhanceWithLocalAI } from "@/services/ai/local-enhancer";
import { analyzeWithOpenAI } from "@/services/ai/openai-client";
import type { AnalysisOutput } from "@/types/analysis";

const CHAT_SYSTEM = `You are ScamShield AI Security Assistant (ChatGPT-powered).
Help users detect scams, phishing, and social engineering. Be concise and actionable.`;

export type AiEngine = "openai" | "builtin";

export function getActiveEngine(): AiEngine {
  return isOpenAIConfigured() ? "openai" : "builtin";
}

/** Threat analysis — OpenAI when configured, otherwise built-in AI (always works). */
export async function runThreatAnalysis(content: string): Promise<AnalysisOutput> {
  if (isOpenAIConfigured()) {
    try {
      return await analyzeWithOpenAI(content);
    } catch {
      return enhanceWithLocalAI(content);
    }
  }
  return enhanceWithLocalAI(content);
}

/** Security chat — always returns a real answer (no API key required). */
export async function runSecurityChat(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
): Promise<{ content: string; engine: AiEngine }> {
  if (isOpenAIConfigured()) {
    try {
      const content = await chatCompletion(
        [
          { role: "system", content: CHAT_SYSTEM },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
          })),
        ],
        { maxTokens: 900 },
      );
      return { content, engine: "openai" };
    } catch {
      /* fall through to builtin */
    }
  }

  return {
    content: runLocalSecurityChat(messages),
    engine: "builtin",
  };
}
