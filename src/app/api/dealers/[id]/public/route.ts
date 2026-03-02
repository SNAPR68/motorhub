/* GET /api/dealers/[id]/public — Public dealer profile with health score badge
 * No auth required. Returns dealer info + health score for buyer-facing pages.
 * Health score is proprietary — only available on Autovinci.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-error";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rl = checkRateLimit(`public-dealer:${ip}`, { maxRequests: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  try {
    const dealer = await db.dealerProfile.findFirst({
      where: { OR: [{ id }, { dealershipId: id }] },
      select: {
        id: true,
        dealershipName: true,
        dealershipId: true,
        city: true,
        state: true,
        address: true,
        phone: true,
        logoUrl: true,
        plan: true,
        createdAt: true,
        stores: { select: { name: true, city: true, address: true, phone: true }, where: { status: "ACTIVE" } },
        _count: { select: { vehicles: { where: { status: "AVAILABLE" } }, leads: true } },
      },
    });

    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    // Compute health score on-the-fly for public display
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [vehicles, totalLeads, closedWon, avgAiScore, leadsWithMessages] = await Promise.all([
      db.vehicle.findMany({
        where: { dealerProfileId: dealer.id, status: { not: "ARCHIVED" } },
        select: { description: true, images: true, aiScore: true },
      }),
      db.lead.count({ where: { dealerProfileId: dealer.id, createdAt: { gte: thirtyDaysAgo } } }),
      db.lead.count({ where: { dealerProfileId: dealer.id, status: "CLOSED_WON", updatedAt: { gte: thirtyDaysAgo } } }),
      db.vehicle.aggregate({ where: { dealerProfileId: dealer.id, aiScore: { not: null } }, _avg: { aiScore: true } }),
      db.lead.findMany({
        where: { dealerProfileId: dealer.id, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: "asc" } } },
      }),
    ]);

    let respondedIn24h = 0;
    for (const lead of leadsWithMessages) {
      if (lead.messages.length > 0) {
        const diff = lead.messages[0].createdAt.getTime() - lead.createdAt.getTime();
        if (diff < 24 * 60 * 60 * 1000) respondedIn24h++;
      }
    }
    const responseScore = totalLeads > 0 ? Math.round((respondedIn24h / totalLeads) * 100) : 50;
    const conversionRate = totalLeads > 0 ? closedWon / totalLeads : 0;
    const conversionScore = Math.min(100, Math.round(conversionRate * 200));

    let qualityTotal = 0;
    for (const v of vehicles) {
      let q = 0;
      if (v.description) q += 33;
      if (v.images && v.images.length >= 3) q += 34;
      if (v.aiScore && v.aiScore >= 70) q += 33;
      qualityTotal += q;
    }
    const listingScore = vehicles.length > 0 ? Math.round(qualityTotal / vehicles.length) : 0;
    const aiScoreAvg = Math.round(avgAiScore._avg.aiScore ?? 0);

    const healthScore = Math.round(
      responseScore * 0.30 + conversionScore * 0.25 + listingScore * 0.25 + aiScoreAvg * 0.20
    );

    // Determine badge tier
    let badge = "Verified";
    if (healthScore >= 85) badge = "Platinum";
    else if (healthScore >= 70) badge = "Gold";
    else if (healthScore >= 50) badge = "Silver";

    return NextResponse.json({
      dealer: {
        id: dealer.id,
        dealershipId: dealer.dealershipId,
        name: dealer.dealershipName,
        city: dealer.city,
        state: dealer.state,
        address: dealer.address,
        phone: dealer.phone,
        logoUrl: dealer.logoUrl,
        plan: dealer.plan,
        memberSince: dealer.createdAt,
        storeCount: dealer.stores.length,
        availableVehicles: dealer._count.vehicles,
      },
      healthScore: {
        score: healthScore,
        badge,
        responseScore,
        listingScore,
      },
    }, { headers: rateLimitHeaders(rl) });
  } catch (error) {
    return handleApiError(error, "GET /api/dealers/[id]/public");
  }
}
