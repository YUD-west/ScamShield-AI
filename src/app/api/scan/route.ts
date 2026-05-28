import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { runAnalysisPipeline } from "@/ai-engine/pipeline";
import { sanitizeText } from "@/lib/security/sanitize";
import { checkUsageLimit, incrementUsage } from "@/lib/subscriptions/usage";
import { getUserPlan } from "@/lib/subscriptions/get-user-plan";
const schema = z.object({
  content: z.string().min(1).max(50000),
  type: z.enum(["MESSAGE", "URL", "SCREENSHOT", "EMAIL_HEADER", "QR_CODE"]).optional(),
});

function toPrismaRisk(level: string): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  const map: Record<string, "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
    critical: "CRITICAL",
  };
  return map[level] ?? "MEDIUM";
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const limit = await rateLimit(ip, 30, 60_000);
    if (!limit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const session = await auth();
    const plan = await getUserPlan(session?.user?.id);
    const usage = await checkUsageLimit(session?.user?.id, ip, plan);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Daily scan limit reached", used: usage.used },
        { status: 402 },
      );
    }

    const analysis = await runAnalysisPipeline(sanitizeText(parsed.data.content));
    await incrementUsage(session?.user?.id, ip);

    let scanId: string | null = null;
    try {
      const scan = await prisma.scan.create({
        data: {
          userId: session?.user?.id,
          type: parsed.data.type ?? "MESSAGE",
          input: parsed.data.content.slice(0, 10000),
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
      scanId = scan.id;
    } catch {
      /* DB optional in dev without postgres */
    }

    return NextResponse.json({
      scanId,
      ...analysis,
    });
  } catch (e) {
    console.error("[scan]", e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
