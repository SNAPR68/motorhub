/* Autovinci — Admin Analytics API
 * MRR, ARPU, churn, LTV, monthly trends, geographic breakdown
 */

import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

const PLAN_PRICES: Record<string, number> = {
  STARTER: 0,
  GROWTH: 2999,
  ENTERPRISE: 9999,
};

export async function GET() {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();

    // Monthly trends — last 6 months
    const months: { label: string; start: Date; end: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      months.push({
        label: start.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
        start,
        end,
      });
    }

    const [
      // Subscription data for MRR/churn
      activeSubs,
      cancelledSubs,
      totalSubs,
      activeByPlan,
      // Geographic data
      dealersByCity,
      leadsByCity,
      closedWonByCity,
      // Monthly trends (parallel per month)
      ...monthlyData
    ] = await Promise.all([
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({ where: { status: "CANCELLED" } }),
      db.subscription.count(),
      db.subscription.groupBy({ by: ["plan"], where: { status: "ACTIVE" }, _count: true }),
      db.dealerProfile.groupBy({ by: ["city"], _count: true, orderBy: { _count: { city: "desc" } } }),
      db.lead.groupBy({ by: ["dealerProfileId"], _count: true }),
      db.lead.groupBy({ by: ["dealerProfileId"], where: { status: "CLOSED_WON" }, _count: true }),
      // 6 months x 2 queries (dealers + subscriptions)
      ...months.flatMap((m) => [
        db.dealerProfile.count({ where: { createdAt: { gte: m.start, lt: m.end } } }),
        db.subscription.count({ where: { createdAt: { gte: m.start, lt: m.end } } }),
      ]),
    ]);

    // Build plan distribution for MRR
    const planCounts: Record<string, number> = {};
    activeByPlan.forEach((g) => { planCounts[g.plan] = g._count; });

    const mrr = Object.entries(planCounts).reduce(
      (sum, [plan, count]) => sum + (PLAN_PRICES[plan] ?? 0) * count,
      0
    );
    const arpu = activeSubs > 0 ? Math.round(mrr / activeSubs) : 0;
    const churnRate = totalSubs > 0 ? Math.round((cancelledSubs / totalSubs) * 100) : 0;

    // LTV per plan (simplified: ARPU * avg months active)
    const ltvByPlan = Object.entries(PLAN_PRICES).map(([plan, price]) => ({
      plan,
      price,
      activeSubs: planCounts[plan] ?? 0,
      monthlyRevenue: price * (planCounts[plan] ?? 0),
      estimatedLtv: price * 12, // assume 12-month average lifetime
    }));

    // Monthly trends
    const monthlyTrends = months.map((m, i) => ({
      label: m.label,
      dealers: monthlyData[i * 2] as number,
      subscriptions: monthlyData[i * 2 + 1] as number,
    }));

    // Funnel: total dealers -> active subs -> paid subs
    const totalDealers = await db.dealerProfile.count();
    const paidSubs = activeSubs - (planCounts["STARTER"] ?? 0);
    const funnel = {
      totalDealers,
      activeSubs,
      paidSubs,
      conversionToActive: totalDealers > 0 ? Math.round((activeSubs / totalDealers) * 100) : 0,
      conversionToPaid: activeSubs > 0 ? Math.round((paidSubs / activeSubs) * 100) : 0,
    };

    // Geographic table — merge dealer, lead, closed-won by city
    const dealerCityMap = new Map<string, { dealers: number; leads: number; closedWon: number }>();

    // Get dealer IDs per city
    const dealerProfiles = await db.dealerProfile.findMany({
      select: { id: true, city: true },
    });
    const dealerIdToCity = new Map<string, string>();
    dealerProfiles.forEach((d) => {
      const city = d.city || "Unknown";
      dealerIdToCity.set(d.id, city);
      if (!dealerCityMap.has(city)) dealerCityMap.set(city, { dealers: 0, leads: 0, closedWon: 0 });
      dealerCityMap.get(city)!.dealers++;
    });

    leadsByCity.forEach((g) => {
      const city = dealerIdToCity.get(g.dealerProfileId) || "Unknown";
      if (!dealerCityMap.has(city)) dealerCityMap.set(city, { dealers: 0, leads: 0, closedWon: 0 });
      dealerCityMap.get(city)!.leads += g._count;
    });

    closedWonByCity.forEach((g) => {
      const city = dealerIdToCity.get(g.dealerProfileId) || "Unknown";
      if (!dealerCityMap.has(city)) dealerCityMap.set(city, { dealers: 0, leads: 0, closedWon: 0 });
      dealerCityMap.get(city)!.closedWon += g._count;
    });

    const geographic = Array.from(dealerCityMap.entries())
      .map(([city, data]) => ({ city, ...data }))
      .sort((a, b) => b.dealers - a.dealers);

    return NextResponse.json({
      revenue: { mrr, arpu, churnRate, activeSubs, cancelledSubs, totalSubs },
      ltvByPlan,
      funnel,
      monthlyTrends,
      geographic,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
