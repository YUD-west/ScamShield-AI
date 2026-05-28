import { NextResponse } from "next/server";
import { getActiveEngine } from "@/lib/ai/unified";
import { isOpenAIConfigured, getOpenAIModel } from "@/lib/openai";
import { hasDatabase } from "@/lib/db";

export async function GET() {
  let database = false;
  let redis = false;

  if (hasDatabase()) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRawUnsafe("SELECT 1");
      database = true;
    } catch {
      database = false;
    }
  }

  if (process.env.REDIS_URL?.trim()) {
    try {
      const { redis: redisClient } = await import("@/lib/redis");
      if (redisClient) {
        await redisClient.ping();
        redis = true;
      }
    } catch {
      redis = false;
    }
  }

  return NextResponse.json({
    ok: true,
    app: "ScamShield AI",
    version: "3.0.0",
    port: 3011,
    services: {
      ai: getActiveEngine(),
      ai_ready: true,
      openai_optional: isOpenAIConfigured(),
      openai_model: isOpenAIConfigured() ? getOpenAIModel() : null,
      database,
      redis,
      stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    },
  });
}
