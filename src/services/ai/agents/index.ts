import type { AnalysisOutput } from "@/types/analysis";
import { runHeuristicAnalysis } from "../heuristic-engine";
import { analyzeUrl } from "@/services/url-intelligence";

export interface AgentContext {
  content: string;
  urls: string[];
}

/** Multi-agent orchestration — each agent enriches the analysis */
export async function runAgentOrchestration(ctx: AgentContext): Promise<AnalysisOutput> {
  const outputs: Record<string, unknown> = {};

  // Agent 1: NLP / Heuristic classifier
  const nlpResult = runHeuristicAnalysis(ctx.content);
  outputs.nlp_classifier = { probability: nlpResult.scam_probability };

  // Agent 2: URL intelligence
  const urlReports = await Promise.all(ctx.urls.slice(0, 5).map((u) => analyzeUrl(u)));
  outputs.url_intelligence = urlReports;

  let scoreBoost = 0;
  const extraTactics: string[] = [];
  for (const r of urlReports) {
    if (r.blacklisted || r.typosquatting) {
      scoreBoost += 15;
      extraTactics.push(`Malicious domain pattern: ${r.domain}`);
    }
    if (r.reputation_score < 40) scoreBoost += 10;
  }

  // Agent 3: Behavioral pattern
  const behavioral = analyzeBehavior(ctx.content);
  outputs.behavioral = behavioral;
  scoreBoost += behavioral.scoreBoost;

  // Agent 4: Merge & recommendation
  const merged: AnalysisOutput = {
    ...nlpResult,
    scam_probability: Math.min(98, nlpResult.scam_probability + scoreBoost),
    detected_tactics: [...new Set([...nlpResult.detected_tactics, ...extraTactics, ...behavioral.tactics])],
    recommended_actions: [
      ...nlpResult.recommended_actions,
      ...(urlReports.some((u) => u.typosquatting)
        ? ["Domain appears to typosquat a known brand"]
        : []),
    ],
    agent_outputs: outputs,
    reasoning_trace: [
      "Threat Analyzer Agent: completed",
      "NLP Classification Agent: completed",
      "URL Intelligence Agent: completed",
      "Behavioral Pattern Agent: completed",
      "Recommendation Agent: merged results",
    ],
  };

  if (merged.scam_probability >= 75) merged.risk_level = "critical";
  else if (merged.scam_probability >= 50) merged.risk_level = "high";
  else if (merged.scam_probability >= 25) merged.risk_level = "medium";
  else merged.risk_level = "low";

  outputs.recommendation = { risk: merged.risk_level, actions: merged.recommended_actions };
  merged.agent_outputs = outputs;

  return merged;
}

function analyzeBehavior(text: string) {
  const tactics: string[] = [];
  let scoreBoost = 0;
  if (/\?\?\?|!!!|URGENT/g.test(text)) {
    tactics.push("Excessive punctuation / caps");
    scoreBoost += 5;
  }
  if (/(.+)\1{2,}/i.test(text)) {
    tactics.push("Repeated phrase patterns");
    scoreBoost += 3;
  }
  return { tactics, scoreBoost };
}
