/* GET /api/analytics/reports — Monthly report data from DB */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get current month bounds
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      monthLeads,
      lastMonthLeads,
      monthClosedWon,
      lastMonthClosedWon,
      monthVehiclesSold,
      lastMonthVehiclesSold,
      allLeads,
      recentActivities,
      totalRevenue,
      monthRevenue,
      totalVehicles,
    ] = await Promise.all([
      // Current month leads
      db.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      // Last month leads
      db.lead.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      // Current month closed won
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: startOfMonth } } }),
      // Last month closed won
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      // Current month vehicles sold
      db.vehicle.count({ where: { status: "SOLD", updatedAt: { gte: startOfMonth } } }),
      // Last month vehicles sold
      db.vehicle.count({ where: { status: "SOLD", updatedAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
      // All leads for funnel
      db.lead.findMany({
        select: { status: true, sentimentLabel: true, source: true },
      }),
      // Recent activities
      db.activity.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      // Total revenue (all time)
      db.vehicle.aggregate({ where: { status: "SOLD" }, _sum: { price: true } }),
      // This month revenue
      db.vehicle.aggregate({ where: { status: "SOLD", updatedAt: { gte: startOfMonth } }, _sum: { price: true } }),
      // Total vehicle stock
      db.vehicle.count(),
    ]);

    // Lead sources breakdown
    const sourceBreakdown: Record<string, number> = {};
    allLeads.forEach((l) => {
      sourceBreakdown[l.source] = (sourceBreakdown[l.source] || 0) + 1;
    });

    // Status funnel
    const statusBreakdown: Record<string, number> = {};
    allLeads.forEach((l) => {
      statusBreakdown[l.status] = (statusBreakdown[l.status] || 0) + 1;
    });

    const formatRevenue = (v: number) =>
      v >= 10000000
        ? `₹${(v / 10000000).toFixed(2)}Cr`
        : v >= 100000
        ? `₹${(v / 100000).toFixed(1)}L`
        : `₹${v.toLocaleString("en-IN")}`;

    const leadGrowth = lastMonthLeads > 0
      ? Math.round(((monthLeads - lastMonthLeads) / lastMonthLeads) * 100)
      : 100;

    const salesGrowth = lastMonthVehiclesSold > 0
      ? Math.round(((monthVehiclesSold - lastMonthVehiclesSold) / lastMonthVehiclesSold) * 100)
      : 100;

    const conversionRate = monthLeads > 0 ? Math.round((monthClosedWon / monthLeads) * 100) : 0;
    const lastConversionRate = lastMonthLeads > 0 ? Math.round((lastMonthClosedWon / lastMonthLeads) * 100) : 0;

    return NextResponse.json({
      period: {
        month: now.toLocaleString("en-IN", { month: "long", year: "numeric" }),
        year: now.getFullYear(),
      },
      summary: {
        leads: monthLeads,
        leadGrowth,
        salesVolume: monthVehiclesSold,
        salesGrowth,
        conversionRate,
        conversionGrowth: conversionRate - lastConversionRate,
        revenue: formatRevenue(monthRevenue._sum.price || 0),
        totalRevenue: formatRevenue(totalRevenue._sum.price || 0),
        totalVehicles,
      },
      breakdown: {
        sources: sourceBreakdown,
        statuses: statusBreakdown,
      },
      activities: recentActivities,
    });
  } catch (error) {
    console.error("GET /api/analytics/reports error:", error);
    return NextResponse.json({ error: "Failed to fetch report data" }, { status: 500 });
  }
}
