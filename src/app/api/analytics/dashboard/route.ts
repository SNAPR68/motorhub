/* GET /api/analytics/dashboard — Aggregate dashboard stats from real data */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run all aggregation queries in parallel
    const [
      totalVehicles,
      availableVehicles,
      activeLeads,
      hotLeads,
      recentLeads,
      activities,
      appointments,
      soldVehicles,
    ] = await Promise.all([
      db.vehicle.count(),
      db.vehicle.count({ where: { status: "AVAILABLE" } }),
      db.lead.count({ where: { status: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } } }),
      db.lead.count({ where: { sentimentLabel: "HOT" } }),
      db.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          vehicle: { select: { name: true, priceDisplay: true } },
        },
      }),
      db.activity.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      db.appointment.count({
        where: { status: { in: ["SCHEDULED", "CONFIRMED"] } },
      }),
      db.vehicle.count({ where: { status: "SOLD" } }),
    ]);

    // Calculate revenue from sold vehicles
    const revenueResult = await db.vehicle.aggregate({
      where: { status: "SOLD" },
      _sum: { price: true },
    });

    const revenue = revenueResult._sum.price || 0;
    const revenueDisplay =
      revenue >= 10000000
        ? `₹ ${(revenue / 10000000).toFixed(2)} Cr`
        : revenue >= 100000
        ? `₹ ${(revenue / 100000).toFixed(2)} Lakh`
        : `₹ ${revenue.toLocaleString("en-IN")}`;

    // Conversion rate: closed-won / total non-new leads
    const closedWon = await db.lead.count({ where: { status: "CLOSED_WON" } });
    const totalProcessed = await db.lead.count({
      where: { status: { not: "NEW" } },
    });
    const conversionRate =
      totalProcessed > 0 ? Math.round((closedWon / totalProcessed) * 100) : 0;

    const stats = {
      totalVehicles,
      availableVehicles,
      activeLeads,
      hotLeads,
      monthlySales: soldVehicles,
      revenue: revenueDisplay,
      avgDaysToSell: 18, // TODO: calculate from actual sold dates
      conversionRate: `${conversionRate}%`,
      upcomingAppointments: appointments,
      aiRepliesSent: await db.leadMessage.count({ where: { type: "AUTO" } }),
    };

    return NextResponse.json({
      stats,
      activities,
      recentLeads,
    });
  } catch (error) {
    console.error("GET /api/analytics/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
