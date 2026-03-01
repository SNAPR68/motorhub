/* GET /api/admin/overview — Platform-wide KPIs for founder dashboard */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  try {
    const [
      totalDealers,
      dealersThisMonth,
      dealersLastMonth,
      totalBuyers,
      buyersThisMonth,
      buyersLastMonth,
      totalVehicles,
      availableVehicles,
      soldVehicles,
      reservedVehicles,
      vehiclesThisMonth,
      totalLeads,
      leadsThisMonth,
      leadsLastMonth,
      hotLeads,
      warmLeads,
      coolLeads,
      closedWonLeads,
      totalLeadsForConversion,
      starterDealers,
      growthDealers,
      enterpriseDealers,
      activeSubscriptions,
      trialingSubscriptions,
      cancelledSubscriptions,
      totalServices,
      completedServices,
      autoReplies,
      totalMessages,
      recentDealerSignups,
      recentLeads,
      recentServices,
    ] = await Promise.all([
      // Dealers
      db.dealerProfile.count(),
      db.dealerProfile.count({ where: { createdAt: { gte: thisMonthStart } } }),
      db.dealerProfile.count({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
      // Buyers
      db.user.count({ where: { role: "BUYER" } }),
      db.user.count({ where: { role: "BUYER", createdAt: { gte: thisMonthStart } } }),
      db.user.count({ where: { role: "BUYER", createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
      // Vehicles
      db.vehicle.count(),
      db.vehicle.count({ where: { status: "AVAILABLE" } }),
      db.vehicle.count({ where: { status: "SOLD" } }),
      db.vehicle.count({ where: { status: "RESERVED" } }),
      db.vehicle.count({ where: { createdAt: { gte: thisMonthStart } } }),
      // Leads
      db.lead.count(),
      db.lead.count({ where: { createdAt: { gte: thisMonthStart } } }),
      db.lead.count({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
      db.lead.count({ where: { sentimentLabel: "HOT" } }),
      db.lead.count({ where: { sentimentLabel: "WARM" } }),
      db.lead.count({ where: { sentimentLabel: "COOL" } }),
      db.lead.count({ where: { status: "CLOSED_WON" } }),
      db.lead.count({ where: { status: { in: ["CLOSED_WON", "CLOSED_LOST"] } } }),
      // Subscriptions by plan
      db.dealerProfile.count({ where: { plan: "STARTER" } }),
      db.dealerProfile.count({ where: { plan: "GROWTH" } }),
      db.dealerProfile.count({ where: { plan: "ENTERPRISE" } }),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({ where: { status: "TRIALING" } }),
      db.subscription.count({ where: { status: "CANCELLED" } }),
      // Services
      db.serviceBooking.count(),
      db.serviceBooking.count({ where: { status: "COMPLETED" } }),
      // AI activity
      db.leadMessage.count({ where: { type: "AUTO" } }),
      db.leadMessage.count(),
      // Recent activity
      db.dealerProfile.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, dealershipName: true, city: true, plan: true, createdAt: true },
      }),
      db.lead.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, buyerName: true, source: true, sentimentLabel: true, createdAt: true, vehicle: { select: { name: true } } },
      }),
      db.serviceBooking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, type: true, status: true, city: true, amount: true, createdAt: true },
      }),
    ]);

    // Service revenue
    const serviceRevenue = await db.serviceBooking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    });

    // Stale inventory
    const days30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const days60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const days90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const [stale30, stale60, stale90] = await Promise.all([
      db.vehicle.count({ where: { status: "AVAILABLE", createdAt: { lt: days30 } } }),
      db.vehicle.count({ where: { status: "AVAILABLE", createdAt: { lt: days60 } } }),
      db.vehicle.count({ where: { status: "AVAILABLE", createdAt: { lt: days90 } } }),
    ]);

    // AI score average
    const avgAiScore = await db.vehicle.aggregate({ _avg: { aiScore: true } });

    // Lead source breakdown
    const leadSources = await db.lead.groupBy({
      by: ["source"],
      _count: true,
    });

    // Quick alerts: thresholds for overview
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const [cancelledThisMonth, unrespondedLeadIds] = await Promise.all([
      db.subscription.count({ where: { status: "CANCELLED", updatedAt: { gte: thisMonthStart } } }),
      db.lead.findMany({
        where: { createdAt: { lt: yesterday }, status: "NEW" },
        select: { id: true },
      }),
    ]);
    let unresponsiveLeads = 0;
    if (unrespondedLeadIds.length > 0) {
      const ids = unrespondedLeadIds.map((l) => l.id);
      const responded = await db.leadMessage.groupBy({
        by: ["leadId"],
        where: { leadId: { in: ids } },
      });
      unresponsiveLeads = ids.length - responded.length;
    }

    const conversionRate = totalLeadsForConversion > 0
      ? Math.round((closedWonLeads / totalLeadsForConversion) * 100)
      : 0;

    const sellThroughRate = totalVehicles > 0
      ? Math.round((soldVehicles / totalVehicles) * 100)
      : 0;

    function growthPct(current: number, previous: number) {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    }

    return NextResponse.json({
      dealers: {
        total: totalDealers,
        thisMonth: dealersThisMonth,
        lastMonth: dealersLastMonth,
        growth: growthPct(dealersThisMonth, dealersLastMonth),
      },
      buyers: {
        total: totalBuyers,
        thisMonth: buyersThisMonth,
        lastMonth: buyersLastMonth,
        growth: growthPct(buyersThisMonth, buyersLastMonth),
      },
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        sold: soldVehicles,
        reserved: reservedVehicles,
        listedThisMonth: vehiclesThisMonth,
        sellThroughRate,
        avgAiScore: Math.round(avgAiScore._avg.aiScore ?? 0),
        stale: { over30: stale30, over60: stale60, over90: stale90 },
      },
      leads: {
        total: totalLeads,
        thisMonth: leadsThisMonth,
        lastMonth: leadsLastMonth,
        growth: growthPct(leadsThisMonth, leadsLastMonth),
        hot: hotLeads,
        warm: warmLeads,
        cool: coolLeads,
        closedWon: closedWonLeads,
        conversionRate,
        sources: Object.fromEntries(leadSources.map((s) => [s.source, s._count])),
      },
      subscriptions: {
        starter: starterDealers,
        growth: growthDealers,
        enterprise: enterpriseDealers,
        active: activeSubscriptions,
        trialing: trialingSubscriptions,
        cancelled: cancelledSubscriptions,
      },
      services: {
        total: totalServices,
        completed: completedServices,
        revenue: serviceRevenue._sum.amount ?? 0,
      },
      aiActivity: {
        autoReplies,
        totalMessages,
      },
      recent: {
        dealers: recentDealerSignups,
        leads: recentLeads,
        services: recentServices,
      },
      quickAlerts: {
        staleOver60: stale60,
        unresponsiveLeads,
        cancelledThisMonth,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/overview error:", error);
    return NextResponse.json({ error: "Failed to fetch admin overview" }, { status: 500 });
  }
}
