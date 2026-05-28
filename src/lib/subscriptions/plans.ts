import type { SubscriptionPlan } from "@prisma/client";

export type PlanId = "FREE" | "PRO" | "ENTERPRISE";

export const PLAN_LIMITS: Record<
  PlanId,
  { dailyScans: number; label: string; price: string }
> = {
  FREE: { dailyScans: 10, label: "Free", price: "$0" },
  PRO: { dailyScans: -1, label: "Pro", price: "$29/mo" },
  ENTERPRISE: { dailyScans: -1, label: "Enterprise", price: "Custom" },
};

export function getDailyLimit(plan: SubscriptionPlan | PlanId | string): number {
  const key = plan as PlanId;
  return PLAN_LIMITS[key]?.dailyScans ?? PLAN_LIMITS.FREE.dailyScans;
}
