import { NextResponse } from "next/server";
import { getOpenAIModel, isOpenAIConfigured } from "@/lib/openai";
import { getActiveEngine } from "@/lib/ai/unified";

export async function GET() {
  const engine = getActiveEngine();
  return NextResponse.json({
    ready: true,
    engine,
    openai: {
      configured: isOpenAIConfigured(),
      model: getOpenAIModel(),
      optional: true,
    },
    builtin: {
      active: true,
      name: "ScamShield Built-in AI",
      features: ["threat_scan", "security_chat", "rag", "heuristics"],
    },
    features: {
      scan_enhancement: true,
      security_chat: true,
      requires_api_key: false,
    },
  });
}
