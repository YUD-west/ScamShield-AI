import type { AnalysisOutput } from "@/types/analysis";
import { cacheGet, cacheSet } from "@/lib/redis";
import { analyzeWithOpenAI } from "./openai-client";
import { runAgentOrchestration } from "./agents";

function extractUrls(text: string): string[] {
  return text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+/gi) ?? [];
}

function cacheKey(content: string) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) hash = (hash << 5) - hash + content.charCodeAt(i);
  return `scan:${hash}`;
}

/** Main entry: RAG-ready orchestration with Redis cache */
export async function analyzeContent(content: string): Promise<AnalysisOutput> {
  const trimmed = content.trim();
  if (!trimmed) {
    return {
      scam_probability: 0,
      risk_level: "low",
      scam_type: "unknown",
      detected_tactics: [],
      detected_attack_vectors: [],
      suspicious_keywords: [],
      malicious_links: [],
      impersonated_brand: null,
      emotional_manipulation: { fear: 0, urgency: 0, greed: 0, authority: 0 },
      urgency_score: 0,
      ai_summary: "No content provided.",
      recommended_actions: ["Paste a suspicious message to analyze"],
      confidence_score: 0,
      attack_category: "none",
    };
  }

  const key = cacheKey(trimmed);
  const cached = await cacheGet<AnalysisOutput>(key);
  if (cached) return { ...cached, reasoning_trace: [...(cached.reasoning_trace ?? []), "Cache hit"] };

  const urls = extractUrls(trimmed);

  // Multi-agent pipeline
  let result = await runAgentOrchestration({ content: trimmed, urls });

  // Enhance with OpenAI when available
  if (process.env.OPENAI_API_KEY) {
    const aiEnhanced = await analyzeWithOpenAI(trimmed);
    result = {
      ...result,
      ai_summary: aiEnhanced.ai_summary,
      confidence_score: Math.max(result.confidence_score, aiEnhanced.confidence_score),
      attack_category: aiEnhanced.attack_category || result.attack_category,
    };
  }

  await cacheSet(key, result, 1800);
  return result;
}
