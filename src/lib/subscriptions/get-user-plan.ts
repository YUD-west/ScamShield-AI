import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { PlanId } from "./plans";

export async function getUserPlan(userId: string | undefined): Promise<PlanId> {
  if (!userId || !hasDatabase()) return "FREE";
  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
      select: { plan: true, status: true },
    });
    if (!sub || sub.status === "CANCELED") return "FREE";
    return sub.plan as PlanId;
  } catch {
    return "FREE";
  }
}
