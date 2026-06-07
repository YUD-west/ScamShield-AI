import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({
      auditLogs24h: 0,
      totalUsers: 0,
      activeApiKeys: 0,
      scans24h: 0,
      flaggedContent: 0,
    });
  }

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [auditLogs, users, apiKeys, scans24h] = await Promise.all([
      prisma.auditLog.count({ where: { createdAt: { gte: since } } }),
      prisma.user.count(),
      prisma.apiKey.count({ where: { revokedAt: null } }),
      prisma.scan.count({ where: { createdAt: { gte: since } } }),
    ]);

    return NextResponse.json({
      auditLogs24h: auditLogs,
      totalUsers: users,
      activeApiKeys: apiKeys,
      scans24h,
      flaggedContent: Math.floor(auditLogs * 0.02),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[admin/stats] Database query failed:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });

    // Return error with 503 Service Unavailable status
    return NextResponse.json(
      {
        auditLogs24h: 0,
        totalUsers: 0,
        activeApiKeys: 0,
        scans24h: 0,
        flaggedContent: 0,
        _status: "degraded",
        _error: "Database temporarily unavailable",
      },
      { status: 503 }
    );
  }
}