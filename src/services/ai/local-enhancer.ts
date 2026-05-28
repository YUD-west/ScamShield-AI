import type { AnalysisOutput } from "@/types/analysis";
import { retrieveContext, formatRagContext } from "@/ai-engine/rag/retriever";
import { runHeuristicAnalysis } from "./heuristic-engine";

/** Built-in AI layer — no API key required. Uses heuristics + RAG knowledge. */
export function enhanceWithLocalAI(content: string): AnalysisOutput {
  const base = runHeuristicAnalysis(content);
  const chunks = retrieveContext(content, 4);
  const ragLines = formatRagContext(chunks);

  const riskLabel = base.risk_level.toUpperCase();
  const tacticsList = base.detected_tactics.slice(0, 4).join(", ") || "general suspicious patterns";
  const brandNote = base.impersonated_brand
    ? ` Possible impersonation of **${base.impersonated_brand}**.`
    : "";

  const ragInsight =
    chunks.length > 0
      ? ` Intelligence match: ${chunks.map((c) => c.title).join("; ")}.`
      : "";

  const summary = [
    `**${riskLabel} risk** (${Math.round(base.scam_probability)}% scam probability).`,
    `Detected: ${tacticsList}.${brandNote}`,
    ragInsight,
    base.malicious_links.length
      ? ` Contains ${base.malicious_links.length} link(s) — do not click.`
      : " No URLs detected in this message.",
  ].join("");

  const extraActions: string[] = [];
  if (base.emotional_manipulation.urgency > 0.7) {
    extraActions.push("Ignore artificial deadlines — scammers use urgency to bypass your judgment");
  }
  if (base.scam_type === "crypto_scam") {
    extraActions.push("Crypto and gift card payments are irreversible — legitimate companies do not demand them");
  }
  if (chunks.some((c) => c.category === "otp_theft")) {
    extraActions.push("Never share OTP or verification codes — banks never ask for these via message");
  }

  return {
    ...base,
    ai_summary: summary,
    recommended_actions: [...new Set([...base.recommended_actions, ...extraActions])].slice(0, 6),
    confidence_score: Math.min(0.92, base.confidence_score + (chunks.length > 0 ? 0.08 : 0)),
    rag_context_used: ragLines,
    reasoning_trace: [
      ...(base.reasoning_trace ?? []),
      "ScamShield Built-in AI Engine (RAG + NLP)",
      ...(chunks.length ? [`Matched ${chunks.length} threat intelligence chunk(s)`] : []),
    ],
    agent_outputs: {
      ...base.agent_outputs,
      engine: "scamshield-builtin-v2",
    },
  };
}
