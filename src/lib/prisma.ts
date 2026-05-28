import { PrismaClient } from "@prisma/client";
import { hasDatabase } from "./db";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? [] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Safe prisma access — only call when hasDatabase() is true. */
export function getPrisma(): PrismaClient | null {
  if (!hasDatabase()) return null;
  return prisma;
}
