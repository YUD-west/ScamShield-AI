import type { AnalysisOutput, ScanProgressEvent, ScamType } from "@/types/analysis";
import { runHeuristicAnalysis } from "@/services/ai/heuristic-engine";
import { runThreatAnalysis } from "@/lib/ai/unified";
import { analyzeUrl } from "@/services/url-intelligence";
import { scanUrlVirusTotal } from "@/services/threat-intel/virustotal";
import { retrieveContext, formatRagContext } from "@/ai-engine/rag/retriever";
import { cacheGet, cacheSet } from "@/lib/redis";

const AGENTS = [
  "Intake Agent",
  "Threat Classification Agent",
  "URL Intelligence Agent",
  "Behavioral Pattern Agent",
  "Risk Scoring Agent",
  "Report Generator Agent",
] as const;

export type ProgressCallback = (event: ScanProgressEvent) => void | Promise<void>;

function extractUrls(text: string): string[] {
  return text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+/gi) ?? [];
}

function mapCategoryToScamType(category: string): ScamType {
  const map: Record<string, ScamType> = {
    phishing: "phishing",
    crypto_scam: "crypto_scam",
    job_scam: "job_scam",
    romance_scam: "romance_scam",
    giveaway_scam: "giveaway_scam",
    impersonation: "impersonation",
    otp_theft: "otp_theft",
    social_engineering: "phishing",
  };
  return map[category] ?? "unknown";
}

function cacheKey(content: string) {
  let h = 0;
  for (let i = 0; i < content.length; i++) h = (h << 5) - h + content.charCodeAt(i);
  return `scan:v2:${h}`;
}

export async function runAnalysisPipeline(
  content: string,
  onProgress?: ProgressCallback,
): Promise<AnalysisOutput> {
  const trimmed = content.trim();
  if (!trimmed) {
    return emptyResult();
  }

  const cached = await cacheGet<AnalysisOutput>(cacheKey(trimmed));
  if (cached) {
    await onProgress?.({
      agent: "Cache",
      status: "done",
      message: "Retrieved cached analysis",
      progress: 100,
    });
    return { ...cached, reasoning_trace: [...(cached.reasoning_trace ?? []), "Cache hit"] };
  }

  const emit = async (index: number, message: string) => {
    await onProgress?.({
      agent: AGENTS[index] ?? "Agent",
      status: index < AGENTS.length - 1 ? "running" : "done",
      message,
      progress: Math.round(((index + 1) / AGENTS.length) * 100),
    });
  };

  await emit(0, "Normalizing and sanitizing input…");
  const urls = extractUrls(trimmed);

  await emit(1, "Running NLP classification and heuristics…");
  const ragChunks = retrieveContext(trimmed);
  const ragContext = formatRagContext(ragChunks);
  let result = runHeuristicAnalysis(trimmed);
  result.rag_context_used = ragContext;
  result.detected_attack_vectors = [...result.detected_tactics];

  await emit(2, "Analyzing URLs and threat intelligence…");
  const urlIntel = await Promise.all(urls.slice(0, 5).map((u) => analyzeUrl(u)));
  for (const u of urlIntel) {
    const vt = await scanUrlVirusTotal(u.url);
    if (vt && vt.positives > 0) {
      result.detected_tactics.push(`VirusTotal: ${vt.positives}/${vt.total} engines flagged URL`);
      result.scam_probability = Math.min(98, result.scam_probability + vt.positives * 5);
    }
    if (u.typosquatting || u.blacklisted) {
      result.scam_probability = Math.min(98, result.scam_probability + 15);
    }
  }

  await emit(3, "Detecting behavioral manipulation patterns…");
  if (/!!!|URGENT|DEAR CUSTOMER/i.test(trimmed)) {
    result.detected_attack_vectors.push("High-pressure language pattern");
  }

  await emit(4, "Computing composite risk score (AI engine)…");
  const enhanced = await runThreatAnalysis(
    trimmed + (ragContext.length ? `\n\nContext:\n${ragContext.join("\n")}` : ""),
  );
  result = {
    ...result,
    ...enhanced,
    scam_type: enhanced.scam_type ?? mapCategoryToScamType(enhanced.attack_category),
    detected_attack_vectors: [
      ...new Set([...result.detected_attack_vectors, ...enhanced.detected_attack_vectors]),
    ],
    agent_outputs: {
      ...result.agent_outputs,
      rag: ragChunks.map((c) => c.id),
      url_intel: urlIntel,
      ai_engine: enhanced.agent_outputs?.engine ?? "unified",
    },
  };

  if (result.scam_probability >= 75) result.risk_level = "critical";
  else if (result.scam_probability >= 50) result.risk_level = "high";
  else if (result.scam_probability >= 25) result.risk_level = "medium";
  else result.risk_level = "low";

  await emit(5, "Generating security report…");
  result.reasoning_trace = [
    ...AGENTS.map((a) => `${a}: completed`),
    ...(ragContext.length ? [`RAG: ${ragChunks.length} knowledge chunks`] : []),
  ];
  result.agent_outputs = {
    ...result.agent_outputs,
    pipeline_version: "2.0",
  };

  await cacheSet(cacheKey(trimmed), result, 1800);
  return result;
}

function emptyResult(): AnalysisOutput {
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
    recommended_actions: ["Paste suspicious content to analyze"],
    confidence_score: 0,
    attack_category: "none",
  };
}
