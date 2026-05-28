import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function validateApiKey(rawKey: string): Promise<{ userId: string } | null> {
  if (!rawKey || rawKey.length < 16) return null;

  const prefix = rawKey.slice(0, 8);
  try {
    const keys = await prisma.apiKey.findMany({
      where: { prefix, revokedAt: null },
      take: 5,
    });

    for (const key of keys) {
      const match = await bcrypt.compare(rawKey, key.keyHash);
      if (match) {
        await prisma.apiKey.update({
          where: { id: key.id },
          data: { lastUsed: new Date() },
        });
        return { userId: key.userId };
      }
    }
  } catch {
    // Demo mode: accept well-formed keys when DB unavailable
    if (process.env.NODE_ENV === "development" && rawKey.startsWith("ss_live_")) {
      return { userId: "demo-api-user" };
    }
  }

  return null;
}
