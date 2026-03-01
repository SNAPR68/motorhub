/* Autovinci — Market Insights Feed API
 * Cross-dealer intelligence that gets more valuable with scale.
 * "Nexon demand up 23% this week" — only possible on Autovinci.
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
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      // Demand signals: wishlists this week vs last week
      wishlistsThisWeek,
      wishlistsLastWeek,
      // Top wishlisted vehicles (demand indicator)
      topWishlisted,
      // Lead source performance across platform
      leadSourceBreakdown,
      // Average pricing by vehicle name patterns
      dealerVehicles,
      platformPricing,
      // Market velocity: deals closed this week
      dealsThisWeek,
      dealsLastWeek,
    ] = await Promise.all([
      db.wishlist.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.wishlist.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
      db.wishlist.groupBy({
        by: ["vehicleId"],
        _count: true,
        orderBy: { _count: { vehicleId: "desc" } },
        take: 5,
      }),
      db.lead.groupBy({
        by: ["source"],
        where: { createdAt: { gte: sevenDaysAgo } },
        _count: true,
      }),
      db.vehicle.findMany({
        where: { dealerProfileId: dpId, status: "AVAILABLE" },
        select: { id: true, name: true, price: true, priceDisplay: true },
      }),
      db.vehicle.groupBy({
        by: ["name"],
        where: { status: "AVAILABLE" },
        _avg: { price: true },
        _count: true,
      }),
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: sevenDaysAgo } } }),
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
    ]);

    // ── Build insights ──
    const insights: Array<{ type: string; icon: string; title: string; detail: string; trend?: "up" | "down" | "neutral" }> = [];

    // Demand trend
    const demandChange = wishlistsLastWeek > 0
      ? Math.round(((wishlistsThisWeek - wishlistsLastWeek) / wishlistsLastWeek) * 100)
      : wishlistsThisWeek > 0 ? 100 : 0;
    insights.push({
      type: "demand",
      icon: "trending_up",
      title: `Buyer demand ${demandChange >= 0 ? "up" : "down"} ${Math.abs(demandChange)}% this week`,
      detail: `${wishlistsThisWeek} wishlists this week vs ${wishlistsLastWeek} last week`,
      trend: demandChange >= 0 ? "up" : "down",
    });

    // Top wishlisted vehicles
    if (topWishlisted.length > 0) {
      const topVehicleIds = topWishlisted.map((w) => w.vehicleId);
      const topVehicles = await db.vehicle.findMany({
        where: { id: { in: topVehicleIds } },
        select: { id: true, name: true },
      });
      const vehicleMap = new Map(topVehicles.map((v) => [v.id, v.name]));
      const topName = vehicleMap.get(topWishlisted[0].vehicleId) || "Unknown";
      insights.push({
        type: "trending",
        icon: "local_fire_department",
        title: `${topName} is trending`,
        detail: `${topWishlisted[0]._count} wishlists. ${topWishlisted.length > 1 ? `Also hot: ${vehicleMap.get(topWishlisted[1]?.vehicleId) || ""}` : ""}`,
        trend: "up",
      });
    }

    // Lead source performance
    const totalLeadsThisWeek = leadSourceBreakdown.reduce((s, g) => s + g._count, 0);
    if (totalLeadsThisWeek > 0) {
      const topSource = leadSourceBreakdown.sort((a, b) => b._count - a._count)[0];
      const pct = Math.round((topSource._count / totalLeadsThisWeek) * 100);
      insights.push({
        type: "source",
        icon: "campaign",
        title: `Top converting source: ${topSource.source} (${pct}%)`,
        detail: `${totalLeadsThisWeek} total leads this week across all dealers`,
        trend: "neutral",
      });
    }

    // Pricing comparison for dealer's vehicles
    for (const vehicle of dealerVehicles.slice(0, 3)) {
      const platformMatch = platformPricing.find((p) => p.name === vehicle.name && p._count > 1);
      if (platformMatch && platformMatch._avg.price) {
        const avgPrice = Math.round(platformMatch._avg.price);
        const diff = vehicle.price - avgPrice;
        const pctDiff = Math.round((diff / avgPrice) * 100);
        if (Math.abs(pctDiff) >= 5) {
          insights.push({
            type: "pricing",
            icon: pctDiff > 0 ? "arrow_upward" : "arrow_downward",
            title: `Your ${vehicle.name} is ${Math.abs(pctDiff)}% ${pctDiff > 0 ? "above" : "below"} market avg`,
            detail: `Your price: ${vehicle.priceDisplay}. Market avg: ~${Math.round(avgPrice / 100000).toFixed(1)}L (${platformMatch._count} listings)`,
            trend: pctDiff > 0 ? "up" : "down",
          });
        }
      }
    }

    // Market velocity
    const velocityChange = dealsLastWeek > 0
      ? Math.round(((dealsThisWeek - dealsLastWeek) / dealsLastWeek) * 100)
      : 0;
    insights.push({
      type: "velocity",
      icon: "speed",
      title: `${dealsThisWeek} deals closed platform-wide this week`,
      detail: velocityChange !== 0 ? `${velocityChange >= 0 ? "+" : ""}${velocityChange}% vs last week` : "Same as last week",
      trend: velocityChange >= 0 ? "up" : "down",
    });

    return NextResponse.json({ insights, generatedAt: now.toISOString() });
  } catch (error) {
    return handleApiError(error, "GET /api/intelligence/market-feed");
  }
}
