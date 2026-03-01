/* Autovinci — Admin AI Quality Monitor API */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") || "descriptions";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    if (tab === "descriptions") {
      const [vehicles, total, avgScore] = await Promise.all([
        db.vehicle.findMany({
          where: { description: { not: null } },
          select: {
            id: true, name: true, year: true,
            description: true, aiScore: true, status: true, createdAt: true,
            dealerProfile: { select: { dealershipName: true } },
          },
          orderBy: { aiScore: "asc" },
          take: limit,
          skip: offset,
        }),
        db.vehicle.count({ where: { description: { not: null } } }),
        db.vehicle.aggregate({ _avg: { aiScore: true } }),
      ]);
      return NextResponse.json({
        vehicles,
        total,
        avgAiScore: Math.round(avgScore._avg.aiScore ?? 0),
        tab,
      });
    }

    if (tab === "replies") {
      const [messages, total] = await Promise.all([
        db.leadMessage.findMany({
          where: { type: "AUTO", role: "AI" },
          select: {
            id: true, text: true, createdAt: true,
            lead: {
              select: {
                buyerName: true, sentimentLabel: true,
                dealerProfile: { select: { dealershipName: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        db.leadMessage.count({ where: { type: "AUTO", role: "AI" } }),
      ]);
      return NextResponse.json({ messages, total, tab });
    }

    if (tab === "sentiment") {
      const [sentimentGroups, conversionByLabel] = await Promise.all([
        db.lead.groupBy({
          by: ["sentimentLabel"],
          _count: true,
        }),
        db.lead.groupBy({
          by: ["sentimentLabel", "status"],
          _count: true,
        }),
      ]);

      // Build sentiment stats with conversion rates
      const sentimentStats = sentimentGroups.map((g) => {
        const label = g.sentimentLabel;
        const total = g._count;
        const closedWon = conversionByLabel.find(
          (c) => c.sentimentLabel === label && c.status === "CLOSED_WON"
        )?._count ?? 0;
        const closedLost = conversionByLabel.find(
          (c) => c.sentimentLabel === label && c.status === "CLOSED_LOST"
        )?._count ?? 0;
        const closed = closedWon + closedLost;
        return {
          label,
          total,
          closedWon,
          closedLost,
          conversionRate: closed > 0 ? Math.round((closedWon / closed) * 100) : 0,
        };
      });

      return NextResponse.json({ sentimentStats, tab });
    }

    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  } catch (err) {
    console.error("Admin quality error:", err);
    return NextResponse.json({ error: "Failed to fetch quality data" }, { status: 500 });
  }
}
