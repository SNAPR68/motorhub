/* GET /api/analytics/performance — Real performance metrics from DB */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalVehicles,
      soldVehicles,
      availableVehicles,
      reservedVehicles,
      totalLeads,
      closedWon,
      hotLeads,
      warmLeads,
      coolLeads,
      aiReplies,
      topVehicles,
      revenueResult,
    ] = await Promise.all([
      db.vehicle.count(),
      db.vehicle.count({ where: { status: "SOLD" } }),
      db.vehicle.count({ where: { status: "AVAILABLE" } }),
      db.vehicle.count({ where: { status: "RESERVED" } }),
      db.lead.count(),
      db.lead.count({ where: { status: "CLOSED_WON" } }),
      db.lead.count({ where: { sentimentLabel: "HOT" } }),
      db.lead.count({ where: { sentimentLabel: "WARM" } }),
      db.lead.count({ where: { sentimentLabel: "COOL" } }),
      db.leadMessage.count({ where: { type: "AUTO" } }),
      db.vehicle.findMany({
        where: { status: { in: ["SOLD", "AVAILABLE"] } },
        orderBy: { price: "desc" },
        take: 5,
        select: { id: true, name: true, price: true, priceDisplay: true, status: true, aiScore: true, images: true },
      }),
      db.vehicle.aggregate({
        where: { status: "SOLD" },
        _sum: { price: true },
        _avg: { price: true },
      }),
    ]);

    const revenue = revenueResult._sum.price || 0;
    const avgPrice = revenueResult._avg.price || 0;
    const conversionRate = totalLeads > 0 ? Math.round((closedWon / totalLeads) * 100) : 0;
    const soldRate = totalVehicles > 0 ? Math.round((soldVehicles / totalVehicles) * 100) : 0;

    const revenueDisplay =
      revenue >= 10000000
        ? `₹${(revenue / 10000000).toFixed(2)}Cr`
        : revenue >= 100000
        ? `₹${(revenue / 100000).toFixed(1)}L`
        : `₹${revenue.toLocaleString("en-IN")}`;

    const avgPriceDisplay =
      avgPrice >= 100000
        ? `₹${(avgPrice / 100000).toFixed(1)}L`
        : `₹${Math.round(avgPrice).toLocaleString("en-IN")}`;

    return NextResponse.json({
      inventory: {
        total: totalVehicles,
        sold: soldVehicles,
        available: availableVehicles,
        reserved: reservedVehicles,
        soldRate,
      },
      leads: {
        total: totalLeads,
        closedWon,
        hot: hotLeads,
        warm: warmLeads,
        cool: coolLeads,
        conversionRate,
      },
      revenue: {
        total: revenue,
        display: revenueDisplay,
        avgPrice: Math.round(avgPrice),
        avgPriceDisplay,
      },
      ai: {
        repliesSent: aiReplies,
      },
      topVehicles: topVehicles.map((v) => ({
        id: v.id,
        name: v.name,
        price: v.price,
        priceDisplay: v.priceDisplay,
        status: v.status,
        aiScore: v.aiScore,
        image: v.images[0] ?? null,
      })),
    });
  } catch (error) {
    console.error("GET /api/analytics/performance error:", error);
    return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 });
  }
}
