import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json(getMockStats());
  }

  try {
    const [totalScans, recentScans, byRisk] = await Promise.all([
      prisma.scan.count(),
      prisma.scan.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          scamProbability: true,
          riskLevel: true,
          createdAt: true,
          input: true,
        },
      }),
      prisma.scan.groupBy({
        by: ["riskLevel"],
        _count: true,
      }),
    ]);

    const categoryData = byRisk.map((r) => ({
      name: r.riskLevel,
      value: r._count,
    }));

    return NextResponse.json({
      totalScans,
      recentScans: recentScans.map((s) => ({
        ...s,
        input: s.input.slice(0, 80) + (s.input.length > 80 ? "…" : ""),
      })),
      categoryData,
      trends: generateMockTrends(),
      topBrands: [
        { brand: "PayPal", count: 1240 },
        { brand: "Amazon", count: 980 },
        { brand: "Microsoft", count: 756 },
        { brand: "IRS", count: 542 },
      ],
    });
  } catch {
    return NextResponse.json(getMockStats());
  }
}

function generateMockTrends() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    scans: Math.floor(200 + Math.random() * 400),
    threats: Math.floor(50 + Math.random() * 150),
  }));
}

function getMockStats() {
  return {
    totalScans: 24891,
    recentScans: [],
    categoryData: [
      { name: "LOW", value: 8200 },
      { name: "MEDIUM", value: 6100 },
      { name: "HIGH", value: 5400 },
      { name: "CRITICAL", value: 5191 },
    ],
    trends: generateMockTrends(),
    topBrands: [
      { brand: "PayPal", count: 1240 },
      { brand: "Amazon", count: 980 },
    ],
  };
}
