import { sanitizeText } from "@/lib/security/sanitize";
import { checkUsageLimit, incrementUsage } from "@/lib/subscriptions/usage";
import { rateLimit } from "@/lib/rate-limit";
import { runAnalysisPipeline } from "@/ai-engine/pipeline";
import { persistScan } from "@/lib/db/save-scan";
import { auth } from "@/auth";
import { getUserPlan } from "@/lib/subscriptions/get-user-plan";
import { z } from "zod";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const schema = z.object({
  content: z.string().min(1).max(50_000),
});

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "anonymous";

  const limit = await rateLimit(ip, 40, 60_000);
  if (!limit.success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
    });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  const session = await auth();
  const plan = await getUserPlan(session?.user?.id);
  const usage = await checkUsageLimit(session?.user?.id, ip, plan);
  if (!usage.allowed) {
    return new Response(
      JSON.stringify({
        error: "Daily scan limit reached. Upgrade to Pro for unlimited scans.",
        used: usage.used,
        remaining: usage.remaining,
      }),
      { status: 402 },
    );
  }

  const content = sanitizeText(parsed.data.content);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const result = await runAnalysisPipeline(content, async (event) => {
          send({ type: "progress", ...event });
        });

        await incrementUsage(session?.user?.id, ip);

        const scanId = await persistScan(session?.user?.id, content, result);
        send({ type: "complete", result: { ...result, scanId } });
      } catch (e) {
        send({
          type: "error",
          message: e instanceof Error ? e.message : "Analysis failed",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
