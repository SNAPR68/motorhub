/* Autovinci — Nightly Cron Job
 * Runs daily at 2 AM IST via Vercel Cron.
 * - Re-scores vehicles with stale AI scores (>7 days)
 * - Re-analyzes NEW leads with no sentiment update in 48h
 * - Executes due follow-up messages (3-day, 7-day)
 * - Suggests/applies auto-price adjustments for stale inventory
 * - Takes weekly metric snapshots for trend tracking
 * - Creates Activity records for significant changes
 *
 * Protected by CRON_SECRET header (set in Vercel env vars).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";
import { autoAnalyzeSentiment } from "@/lib/agents/actions";
import { executeDueFollowUps } from "@/lib/agents/follow-ups";
import { suggestPriceAdjustments } from "@/lib/agents/auto-pricing";

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this automatically for cron jobs)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    vehiclesScored: 0,
    leadsAnalyzed: 0,
    followUpsSent: 0,
    followUpsSkipped: 0,
    priceAdjustments: 0,
    snapshotsTaken: 0,
    errors: 0,
  };

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // ── Re-score stale vehicles ──
    const staleVehicles = await db.vehicle.findMany({
      where: {
        status: { in: ["AVAILABLE", "RESERVED"] },
        OR: [
          { aiScore: null },
          { updatedAt: { lt: sevenDaysAgo } },
        ],
      },
      select: { id: true, name: true, year: true, km: true, fuel: true, transmission: true, owner: true, dealerProfileId: true, aiScore: true },
      take: 50,
    });

    for (const vehicle of staleVehicles) {
      try {
        let score = 70;
        const kmNum = parseInt(vehicle.km.replace(/,/g, ""));
        if (!isNaN(kmNum)) {
          if (kmNum < 20000) score += 15;
          else if (kmNum < 50000) score += 10;
          else if (kmNum > 100000) score -= 10;
        }
        if (vehicle.owner === "1st Owner") score += 10;
        if (vehicle.year >= new Date().getFullYear() - 3) score += 5;
        score = Math.max(0, Math.min(100, score));

        const previousScore = vehicle.aiScore;
        await db.vehicle.update({
          where: { id: vehicle.id },
          data: { aiScore: score },
        });

        emitEvent({
          type: "VEHICLE_SCORED",
          entityType: "Vehicle",
          entityId: vehicle.id,
          dealerProfileId: vehicle.dealerProfileId,
          metadata: { previousScore, newScore: score, source: "CRON" },
        });

        results.vehiclesScored++;
      } catch {
        results.errors++;
      }
    }

    // ── Re-analyze stale leads ──
    const staleLeads = await db.lead.findMany({
      where: {
        status: "NEW",
        sentimentLabel: "COOL",
        createdAt: { lt: twoDaysAgo },
      },
      select: { id: true, dealerProfileId: true },
      take: 30,
    });

    for (const lead of staleLeads) {
      try {
        await autoAnalyzeSentiment(lead.id, lead.dealerProfileId);
        results.leadsAnalyzed++;
      } catch {
        results.errors++;
      }
    }

    // ── Execute due follow-ups ──
    try {
      const followUpResults = await executeDueFollowUps();
      results.followUpsSent = followUpResults.sent;
      results.followUpsSkipped = followUpResults.skipped;
      results.errors += followUpResults.errors;
    } catch {
      results.errors++;
    }

    // ── Auto-price adjustments ──
    try {
      const adjustments = await suggestPriceAdjustments();
      results.priceAdjustments = adjustments.length;
    } catch {
      results.errors++;
    }

    // ── Weekly metric snapshots (only on Mondays, or if no snapshot this week) ──
    try {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      thisMonday.setHours(0, 0, 0, 0);

      // Only take snapshots on Mondays (or first run of the week)
      if (dayOfWeek === 1) {
        const allDealers = await db.dealerProfile.findMany({
          select: { id: true },
        });

        for (const dealer of allDealers) {
          try {
            await takeMetricSnapshot(dealer.id, thisMonday);
            results.snapshotsTaken++;
          } catch {
            results.errors++;
          }
        }
      }
    } catch {
      results.errors++;
    }

    // Log summary as Activity
    const allDealerIds = [
      ...new Set([
        ...staleVehicles.map((v) => v.dealerProfileId),
        ...staleLeads.map((l) => l.dealerProfileId),
      ]),
    ];
    for (const dpId of allDealerIds) {
      await db.activity.create({
        data: {
          dealerProfileId: dpId,
          title: "Nightly AI Processing",
          description: `Scored ${results.vehiclesScored} vehicles, analyzed ${results.leadsAnalyzed} leads, sent ${results.followUpsSent} follow-ups`,
          type: "AUTO",
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("[Cron] Nightly scoring error:", error);
    return NextResponse.json({ error: "Cron job failed", ...results }, { status: 500 });
  }
}

/** Take a weekly metric snapshot for one dealer */
async function takeMetricSnapshot(dealerProfileId: string, weekStart: Date): Promise<void> {
  // Check if snapshot already exists for this week
  const existing = await db.dealerMetricSnapshot.findUnique({
    where: { dealerProfileId_weekStart: { dealerProfileId, weekStart } },
  });
  if (existing) return;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [vehicles, totalLeads, closedWon, avgAiScore, leadsWithMessages, activeListings] =
    await Promise.all([
      db.vehicle.findMany({
        where: { dealerProfileId, status: { not: "ARCHIVED" } },
        select: { description: true, images: true, aiScore: true },
      }),
      db.lead.count({ where: { dealerProfileId, createdAt: { gte: thirtyDaysAgo } } }),
      db.lead.count({ where: { dealerProfileId, status: "CLOSED_WON", updatedAt: { gte: thirtyDaysAgo } } }),
      db.vehicle.aggregate({ where: { dealerProfileId, aiScore: { not: null } }, _avg: { aiScore: true } }),
      db.lead.findMany({
        where: { dealerProfileId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true, messages: { select: { createdAt: true }, take: 1, orderBy: { createdAt: "asc" } } },
      }),
      db.vehicle.count({ where: { dealerProfileId, status: "AVAILABLE" } }),
    ]);

  // Response score
  let respondedIn24h = 0;
  const responseTimes: number[] = [];
  for (const lead of leadsWithMessages) {
    if (lead.messages.length > 0) {
      const diff = lead.messages[0].createdAt.getTime() - lead.createdAt.getTime();
      responseTimes.push(diff / (1000 * 60 * 60));
      if (diff < 24 * 60 * 60 * 1000) respondedIn24h++;
    }
  }
  const responseScore = totalLeads > 0 ? Math.round((respondedIn24h / totalLeads) * 100) : 50;
  const avgResponseHrs = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((s, t) => s + t, 0) / responseTimes.length * 10) / 10
    : 0;

  // Conversion score
  const conversionRate = totalLeads > 0 ? closedWon / totalLeads : 0;
  const conversionScore = Math.min(100, Math.round(conversionRate * 200));

  // Listing quality score
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
    responseScore * 0.30 +
    conversionScore * 0.25 +
    listingScore * 0.25 +
    aiScoreAvg * 0.20
  );

  await db.dealerMetricSnapshot.create({
    data: {
      dealerProfileId,
      weekStart,
      healthScore,
      responseScore,
      conversionScore,
      listingScore,
      aiScoreAvg,
      totalLeads,
      closedWon,
      activeListings,
      avgResponseHrs,
    },
  });
}
