/* GET /api/analytics/trends — Historical metric trends for dealer
 * Returns weekly snapshots for trend graphs: health score, conversion, response time over months.
 * Query: ?weeks=12 (default 12 weeks = 3 months)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireDealerAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-error";

export async function GET(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const weeks = parseInt(request.nextUrl.searchParams.get("weeks") ?? "12", 10);
    const dpId = dealer.dealerProfileId;
    const cutoff = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

    const snapshots = await db.dealerMetricSnapshot.findMany({
      where: { dealerProfileId: dpId, weekStart: { gte: cutoff } },
      orderBy: { weekStart: "asc" },
    });

    // Also get platform averages for comparison
    const platformAvgs = await db.dealerMetricSnapshot.groupBy({
      by: ["weekStart"],
      where: { weekStart: { gte: cutoff } },
      _avg: {
        healthScore: true,
        responseScore: true,
        conversionScore: true,
        listingScore: true,
        aiScoreAvg: true,
        avgResponseHrs: true,
      },
      orderBy: { weekStart: "asc" },
    });

    const platformMap = new Map(
      platformAvgs.map((p) => [p.weekStart.toISOString(), p._avg])
    );

    const trends = snapshots.map((s) => {
      const platformAvg = platformMap.get(s.weekStart.toISOString());
      return {
        week: s.weekStart.toISOString().slice(0, 10),
        healthScore: s.healthScore,
        responseScore: s.responseScore,
        conversionScore: s.conversionScore,
        listingScore: s.listingScore,
        aiScoreAvg: s.aiScoreAvg,
        totalLeads: s.totalLeads,
        closedWon: s.closedWon,
        activeListings: s.activeListings,
        avgResponseHrs: s.avgResponseHrs,
        platformAvg: platformAvg ? {
          healthScore: Math.round(platformAvg.healthScore ?? 0),
          conversionScore: Math.round(platformAvg.conversionScore ?? 0),
          avgResponseHrs: Math.round((platformAvg.avgResponseHrs ?? 0) * 10) / 10,
        } : null,
      };
    });

    return NextResponse.json({ trends, weekCount: snapshots.length });
  } catch (error) {
    return handleApiError(error, "GET /api/analytics/trends");
  }
}
