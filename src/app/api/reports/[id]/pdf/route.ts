import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateScanPdf } from "@/services/pdf/report-generator";
import type { AnalysisOutput } from "@/types/analysis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { aiResult: true },
    });

    if (!scan?.aiResult) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const result: AnalysisOutput = {
      scam_probability: scan.scamProbability,
      risk_level: scan.riskLevel.toLowerCase() as AnalysisOutput["risk_level"],
      scam_type: "unknown",
      detected_tactics: scan.aiResult.detectedTactics as string[],
      detected_attack_vectors: scan.aiResult.detectedTactics as string[],
      suspicious_keywords: scan.aiResult.suspiciousKeywords as string[],
      malicious_links: scan.aiResult.maliciousLinks as string[],
      impersonated_brand: scan.aiResult.impersonatedBrand,
      emotional_manipulation: scan.aiResult.emotionalManipulation as AnalysisOutput["emotional_manipulation"],
      urgency_score: scan.aiResult.urgencyScore,
      ai_summary: scan.aiResult.aiSummary,
      recommended_actions: scan.aiResult.recommendedActions as string[],
      confidence_score: scan.aiResult.confidenceScore,
      attack_category: "phishing",
    };

    const pdf = generateScanPdf(id, result, scan.input);
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="scamshield-report-${id}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not generate PDF" }, { status: 500 });
  }
}
