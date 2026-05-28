import type { AnalysisOutput, ScamType } from "@/types/analysis";
import { chatCompletion, isOpenAIConfigured } from "@/lib/openai";
import { runHeuristicAnalysis } from "./heuristic-engine";

const SYSTEM_PROMPT = `You are ScamShield AI, an elite cybersecurity threat analyst powered by GPT.
Analyze suspicious messages for scams, phishing, and social engineering.
Return ONLY valid JSON with this exact schema:
{
  "scam_probability": number 0-100,
  "risk_level": "low"|"medium"|"high"|"critical",
  "scam_type": "phishing"|"credential_harvesting"|"crypto_scam"|"romance_scam"|"job_scam"|"giveaway_scam"|"impersonation"|"otp_theft"|"tech_support"|"unknown",
  "detected_tactics": string[],
  "detected_attack_vectors": string[],
  "suspicious_keywords": string[],
  "malicious_links": string[],
  "impersonated_brand": string|null,
  "emotional_manipulation": {"fear":0-1,"urgency":0-1,"greed":0-1,"authority":0-1},
  "urgency_score": number 0-100,
  "ai_summary": string (2-4 sentences, specific and actionable),
  "recommended_actions": string[] (3-6 items),
  "confidence_score": number 0-1,
  "attack_category": string
}
Be specific. Never return vague summaries.`;

function normalizeScamType(value: unknown): ScamType {
  const allowed: ScamType[] = [
    "phishing",
    "credential_harvesting",
    "crypto_scam",
    "romance_scam",
    "job_scam",
    "giveaway_scam",
    "impersonation",
    "otp_theft",
    "tech_support",
    "unknown",
  ];
  return allowed.includes(value as ScamType) ? (value as ScamType) : "unknown";
}

function mergeAnalysis(heuristic: AnalysisOutput, ai: Partial<AnalysisOutput>): AnalysisOutput {
  return {
    ...heuristic,
    ...ai,
    scam_probability: Math.min(
      98,
      Math.max(heuristic.scam_probability, ai.scam_probability ?? heuristic.scam_probability),
    ),
    scam_type: normalizeScamType(ai.scam_type ?? heuristic.scam_type),
    detected_tactics: [...new Set([...heuristic.detected_tactics, ...(ai.detected_tactics ?? [])])],
    detected_attack_vectors: [
      ...new Set([
        ...heuristic.detected_attack_vectors,
        ...(ai.detected_attack_vectors ?? ai.detected_tactics ?? []),
      ]),
    ],
    suspicious_keywords: [
      ...new Set([...heuristic.suspicious_keywords, ...(ai.suspicious_keywords ?? [])]),
    ],
    malicious_links: [...new Set([...heuristic.malicious_links, ...(ai.malicious_links ?? [])])],
    recommended_actions: ai.recommended_actions?.length
      ? ai.recommended_actions
      : heuristic.recommended_actions,
    ai_summary: ai.ai_summary?.trim() || heuristic.ai_summary,
    confidence_score: Math.max(ai.confidence_score ?? 0.85, heuristic.confidence_score),
    reasoning_trace: [
      ...(heuristic.reasoning_trace ?? []),
      `OpenAI ${process.env.OPENAI_MODEL ?? "gpt-4o-mini"} threat analysis`,
    ],
  };
}

export async function analyzeWithOpenAI(content: string): Promise<AnalysisOutput> {
  const heuristic = runHeuristicAnalysis(content);
  if (!isOpenAIConfigured()) return heuristic;

  try {
    const raw = await chatCompletion(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this suspicious content:\n\n${content.slice(0, 12000)}` },
      ],
      { json: true },
    );
    const parsed = JSON.parse(raw) as Partial<AnalysisOutput>;
    return mergeAnalysis(heuristic, parsed);
  } catch {
    return {
      ...heuristic,
      reasoning_trace: [...(heuristic.reasoning_trace ?? []), "OpenAI unavailable — heuristics only"],
    };
  }
}
