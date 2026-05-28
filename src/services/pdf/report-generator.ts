import { jsPDF } from "jspdf";
import type { AnalysisOutput } from "@/types/analysis";

export function generateScanPdf(scanId: string, result: AnalysisOutput, inputPreview: string) {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  doc.setFontSize(18);
  doc.setTextColor(34, 211, 238);
  doc.text("ScamShield AI — Threat Analysis Report", margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Report ID: ${scanId} | Generated: ${new Date().toISOString()}`, margin, y);
  y += 15;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text(`Risk Level: ${result.risk_level.toUpperCase()}`, margin, y);
  y += 8;
  doc.text(`Scam Probability: ${Math.round(result.scam_probability)}%`, margin, y);
  y += 8;
  doc.text(`Confidence: ${Math.round(result.confidence_score * 100)}%`, margin, y);
  y += 12;

  doc.setFontSize(11);
  doc.text("Executive Summary", margin, y);
  y += 7;
  doc.setFontSize(10);
  const summary = doc.splitTextToSize(result.ai_summary, 170);
  doc.text(summary, margin, y);
  y += summary.length * 5 + 8;

  doc.setFontSize(11);
  doc.text("Detected Tactics", margin, y);
  y += 7;
  doc.setFontSize(10);
  for (const t of result.detected_tactics.slice(0, 8)) {
    doc.text(`• ${t}`, margin + 2, y);
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }

  y += 6;
  doc.setFontSize(11);
  doc.text("Recommended Actions", margin, y);
  y += 7;
  doc.setFontSize(10);
  for (const a of result.recommended_actions) {
    doc.text(`• ${a}`, margin + 2, y);
    y += 6;
  }

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Input preview (redacted):", margin, y);
  y += 5;
  const preview = doc.splitTextToSize(inputPreview.slice(0, 500), 170);
  doc.text(preview, margin, y);

  doc.setFontSize(8);
  doc.text(
    "Confidential — ScamShield AI heuristic + AI analysis. Not legal advice.",
    margin,
    285,
  );

  return doc.output("arraybuffer");
}
