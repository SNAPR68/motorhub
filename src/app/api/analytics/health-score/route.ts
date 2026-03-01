/* Autovinci — Dealer Health Score API
 * Proprietary composite metric: response time, conversion rate, AI score avg, listing quality.
 * Autovinci-exclusive — leaving means losing your score.
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

    const [
      vehicles,
      totalLeads,
      closedWon,
      avgAiScore,
      recentLeadsWithMessages,
      totalVehicles,
    ] = await Promise.all([
      // Listing quality: vehicles with descriptions, images, AI scores
      db.vehicle.findMany({
        where: { dealerProfileId: dpId, status: { not: "ARCHIVED" } },
        select: { description: true, images: true, aiScore: true },
      }),
      // Conversion funnel
      db.lead.count({ where: { dealerProfileId: dpId, createdAt: { gte: thirtyDaysAgo } } }),
      db.lead.count({ where: { dealerProfileId: dpId, status: "CLOSED_WON", updatedAt: { gte: thirtyDaysAgo } } }),
      // AI score average
      db.vehicle.aggregate({ where: { dealerProfileId: dpId, aiScore: { not: null } }, _avg: { aiScore: true } }),
      // Response rate: leads that got at least 1 message within 24h
      db.lead.findMany({
        where: { dealerProfileId: dpId, createdAt: { gte: thirtyDaysAgo } },
        select: { id: true, createdAt: true, messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: "asc" } } },
      }),
      db.vehicle.count({ where: { dealerProfileId: dpId } }),
    ]);

    // ── Calculate sub-scores (each 0-100) ──

    // 1. Response Score: % of leads responded to within 24h
    let respondedIn24h = 0;
    for (const lead of recentLeadsWithMessages) {
      if (lead.messages.length > 0) {
        const diff = lead.messages[0].createdAt.getTime() - lead.createdAt.getTime();
        if (diff < 24 * 60 * 60 * 1000) respondedIn24h++;
      }
    }
    const responseScore = totalLeads > 0 ? Math.round((respondedIn24h / totalLeads) * 100) : 50;

    // 2. Conversion Score: close rate * 200 (capped at 100)
    const conversionRate = totalLeads > 0 ? closedWon / totalLeads : 0;
    const conversionScore = Math.min(100, Math.round(conversionRate * 200));

    // 3. Listing Quality Score: avg of (has description + has 3+ images + has AI score)
    let qualityTotal = 0;
    for (const v of vehicles) {
      let q = 0;
      if (v.description) q += 33;
      if (v.images && v.images.length >= 3) q += 34;
      if (v.aiScore && v.aiScore >= 70) q += 33;
      qualityTotal += q;
    }
    const listingScore = vehicles.length > 0 ? Math.round(qualityTotal / vehicles.length) : 0;

    // 4. AI Score: direct average
    const aiScoreAvg = Math.round(avgAiScore._avg.aiScore ?? 0);

    // ── Composite Health Score ──
    // Weighted: Response 30%, Conversion 25%, Listing Quality 25%, AI Score 20%
    const healthScore = Math.round(
      responseScore * 0.30 +
      conversionScore * 0.25 +
      listingScore * 0.25 +
      aiScoreAvg * 0.20
    );

    return NextResponse.json({
      healthScore,
      breakdown: {
        response: { score: responseScore, respondedIn24h, totalLeads },
        conversion: { score: conversionScore, closedWon, totalLeads, rate: Math.round(conversionRate * 100) },
        listingQuality: { score: listingScore, totalVehicles, withDescription: vehicles.filter((v) => v.description).length },
        aiScore: { score: aiScoreAvg, vehiclesScored: vehicles.filter((v) => v.aiScore).length },
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/analytics/health-score");
  }
}
