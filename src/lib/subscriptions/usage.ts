import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getDailyLimit, type PlanId } from "./plans";
import { createHash } from "crypto";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function checkUsageLimit(
  userId: string | undefined,
  ip: string,
  plan: PlanId = "FREE",
): Promise<{ allowed: boolean; remaining: number; used: number }> {
  const limit = getDailyLimit(plan);
  if (limit < 0) return { allowed: true, remaining: -1, used: 0 };

  const date = todayKey();
  const ipHash = hashIp(ip);

  if (!hasDatabase()) {
    return { allowed: true, remaining: limit, used: 0 };
  }

  try {
    let quota = userId
      ? await prisma.usageQuota.findUnique({
          where: { userId_date: { userId, date } },
        })
      : await prisma.usageQuota.findUnique({
          where: { ipHash_date: { ipHash, date } },
        });

    if (!quota) {
      quota = await prisma.usageQuota.create({
        data: userId ? { userId, date, scanCount: 0 } : { ipHash, date, scanCount: 0 },
      });
    }

    const used = quota.scanCount;
    const remaining = Math.max(0, limit - used);
    return { allowed: used < limit, remaining, used };
  } catch {
    return { allowed: true, remaining: limit, used: 0 };
  }
}

export async function incrementUsage(userId: string | undefined, ip: string) {
  if (!hasDatabase()) return;

  const date = todayKey();
  const ipHash = hashIp(ip);
  try {
    if (userId) {
      await prisma.usageQuota.upsert({
        where: { userId_date: { userId, date } },
        create: { userId, date, scanCount: 1 },
        update: { scanCount: { increment: 1 } },
      });
    } else {
      await prisma.usageQuota.upsert({
        where: { ipHash_date: { ipHash, date } },
        create: { ipHash, date, scanCount: 1 },
        update: { scanCount: { increment: 1 } },
      });
    }
  } catch {
    /* no-op without DB */
  }
}
