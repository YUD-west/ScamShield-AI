import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { AnalysisOutput } from "@/types/analysis";

function toPrismaRisk(level: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const map: Record<string, "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
    critical: "CRITICAL",
  };
  return map[level] ?? "MEDIUM";
}

export async function persistScan(
  userId: string | undefined,
  content: string,
  analysis: AnalysisOutput,
  type: "MESSAGE" | "URL" | "SCREENSHOT" = "MESSAGE",
): Promise<string | null> {
  if (!hasDatabase()) return null;

  try {
    const scan = await prisma.scan.create({
      data: {
        userId,
        type,
        input: content.slice(0, 10000),
        scamProbability: analysis.scam_probability,
        riskLevel: toPrismaRisk(analysis.risk_level),
        confidence: analysis.confidence_score,
        aiResult: {
          create: {
            scamProbability: analysis.scam_probability,
            riskLevel: toPrismaRisk(analysis.risk_level),
            detectedTactics: analysis.detected_tactics,
            suspiciousKeywords: analysis.suspicious_keywords,
            maliciousLinks: analysis.malicious_links,
            impersonatedBrand: analysis.impersonated_brand,
            emotionalManipulation: analysis.emotional_manipulation,
            urgencyScore: analysis.urgency_score,
            aiSummary: analysis.ai_summary,
            recommendedActions: analysis.recommended_actions,
            confidenceScore: analysis.confidence_score,
            reasoningTrace: analysis.reasoning_trace ?? [],
            agentOutputs: (analysis.agent_outputs ?? {}) as any,
          },
        },
        threatReport: {
          create: {
            attackCategory: analysis.attack_category,
            indicators: analysis.detected_tactics,
            entities: analysis.suspicious_keywords,
            heatmapData: analysis.heatmap_words ?? [],
          },
        },
      },
    });
    return scan.id;
  } catch {
    return null;
  }
}
