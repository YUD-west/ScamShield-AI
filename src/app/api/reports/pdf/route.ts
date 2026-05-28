import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateScanPdf } from "@/services/pdf/report-generator";
import type { AnalysisOutput } from "@/types/analysis";

const schema = z.object({
  result: z.record(z.unknown()),
  inputPreview: z.string().max(5000).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = parsed.data.result as unknown as AnalysisOutput;
  const scanId = `local-${Date.now()}`;
  const pdf = generateScanPdf(scanId, result, parsed.data.inputPreview ?? "");

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="scamshield-report.pdf"`,
    },
  });
}
