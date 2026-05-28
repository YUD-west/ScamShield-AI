import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { runAnalysisPipeline } from "@/ai-engine/pipeline";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = await rateLimit(`ocr:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Image file required" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Max file size 5MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();

    const result = await runAnalysisPipeline(text.trim() || " ");

    return NextResponse.json({
      ocr_text: text,
      highlighted_phrases: result.suspicious_keywords,
      ...result,
    });
  } catch (e) {
    console.error("[ocr]", e);
    return NextResponse.json({ error: "OCR or analysis failed" }, { status: 500 });
  }
}
