/* Autovinci — Dealer Benchmarks API
 * Cross-dealer comparisons that improve with scale.
 * "Your conversion: 18%. Platform avg: 24%. Top dealers: 32%."
 * Network effect: more dealers = more accurate benchmarks.
 */

import { NextResponse } from "next/server";
import { requireDealerAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dpId = dealer.dealerProfileId;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // ── Gather platform-wide and dealer-specific stats ──
    const [
      // Platform aggregates
      allDealerLeadCounts,
      allDealerWonCounts,
      platformAvgAiScore,
      totalDealers,
      // Dealer specific
      dealerLeads,
      dealerWon,
      dealerAvgAiScore,
      dealerVehicleCount,
      // Platform vehicle stats
      platformVehicleCount,
      // Response time: dealer's leads with first message time
      dealerLeadsWithResponse,
    ] = await Promise.all([
      db.lead.groupBy({ by: ["dealerProfileId"], where: { createdAt: { gte: thirtyDaysAgo } }, _count: true }),
      db.lead.groupBy({ by: ["dealerProfileId"], where: { status: "CLOSED_WON", updatedAt: { gte: thirtyDaysAgo } }, _count: true }),
      db.vehicle.aggregate({ where: { aiScore: { not: null } }, _avg: { aiScore: true } }),
      db.dealerProfile.count(),
      db.lead.count({ where: { dealerProfileId: dpId, createdAt: { gte: thirtyDaysAgo } } }),
      db.lead.count({ where: { dealerProfileId: dpId, status: "CLOSED_WON", updatedAt: { gte: thirtyDaysAgo } } }),
      db.vehicle.aggregate({ where: { dealerProfileId: dpId, aiScore: { not: null } }, _avg: { aiScore: true } }),
      db.vehicle.count({ where: { dealerProfileId: dpId, status: { not: "ARCHIVED" } } }),
      db.vehicle.count({ where: { status: { not: "ARCHIVED" } } }),
      db.lead.findMany({
        where: { dealerProfileId: dpId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: "asc" } } },
        take: 100,
      }),
    ]);

    // ── Compute conversion rates ──
    const conversionRates = allDealerLeadCounts
      .map((d) => {
        const won = allDealerWonCounts.find((w) => w.dealerProfileId === d.dealerProfileId)?._count ?? 0;
        return d._count > 0 ? (won / d._count) * 100 : 0;
      })
      .filter((r) => r > 0)
      .sort((a, b) => b - a);

    const platformAvgConversion = conversionRates.length > 0
      ? Math.round(conversionRates.reduce((s, r) => s + r, 0) / conversionRates.length)
      : 0;
    const topDealerConversion = conversionRates.length > 0 ? Math.round(conversionRates[0]) : 0;
    const dealerConversion = dealerLeads > 0 ? Math.round((dealerWon / dealerLeads) * 100) : 0;

    // ── Compute response time ──
    const responseTimes: number[] = [];
    for (const lead of dealerLeadsWithResponse) {
      if (lead.messages.length > 0) {
        const hours = (lead.messages[0].createdAt.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60);
        responseTimes.push(hours);
      }
    }
    const dealerAvgResponseHours = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length * 10) / 10
      : null;

    // ── Platform avg response time (estimated from events if available) ──
    const platformAvgResponseHours = 4.2; // Placeholder — would compute from all dealers' events at scale

    return NextResponse.json({
      dealerCount: totalDealers,
      benchmarks: [
        {
          metric: "Conversion Rate",
          yours: `${dealerConversion}%`,
          platformAvg: `${platformAvgConversion}%`,
          topDealers: `${topDealerConversion}%`,
          yourValue: dealerConversion,
          isAboveAvg: dealerConversion >= platformAvgConversion,
        },
        {
          metric: "Avg AI Score",
          yours: `${Math.round(dealerAvgAiScore._avg.aiScore ?? 0)}`,
          platformAvg: `${Math.round(platformAvgAiScore._avg.aiScore ?? 0)}`,
          topDealers: "95+",
          yourValue: Math.round(dealerAvgAiScore._avg.aiScore ?? 0),
          isAboveAvg: (dealerAvgAiScore._avg.aiScore ?? 0) >= (platformAvgAiScore._avg.aiScore ?? 0),
        },
        {
          metric: "Avg Response Time",
          yours: dealerAvgResponseHours ? `${dealerAvgResponseHours}h` : "N/A",
          platformAvg: `${platformAvgResponseHours}h`,
          topDealers: "< 1h",
          yourValue: dealerAvgResponseHours,
          isAboveAvg: dealerAvgResponseHours !== null && dealerAvgResponseHours <= platformAvgResponseHours,
        },
        {
          metric: "Active Listings",
          yours: `${dealerVehicleCount}`,
          platformAvg: `${totalDealers > 0 ? Math.round(platformVehicleCount / totalDealers) : 0}`,
          topDealers: "50+",
          yourValue: dealerVehicleCount,
          isAboveAvg: dealerVehicleCount >= (totalDealers > 0 ? platformVehicleCount / totalDealers : 0),
        },
      ],
    });
  } catch (error) {
    return handleApiError(error, "GET /api/analytics/benchmarks");
  }
}
