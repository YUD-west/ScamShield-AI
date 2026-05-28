import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const skip = (page - 1) * limit;

  if (!hasDatabase()) {
    return NextResponse.json({
      scans: [],
      pagination: { page: 1, limit, total: 0, pages: 0 },
    });
  }

  try {
    const where = { userId: session.user.id };

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          scamProbability: true,
          riskLevel: true,
          confidence: true,
          createdAt: true,
          input: true,
        },
      }),
      prisma.scan.count({ where }),
    ]);

    return NextResponse.json({
      scans: scans.map((s) => ({
        ...s,
        input: s.input.slice(0, 120) + (s.input.length > 120 ? "…" : ""),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ scans: [], pagination: { page: 1, limit, total: 0, pages: 0 } });
  }
}
