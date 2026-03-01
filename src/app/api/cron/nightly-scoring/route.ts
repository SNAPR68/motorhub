/* Autovinci — Nightly Scoring Cron
 * Runs daily at 2 AM IST via Vercel Cron.
 * - Re-scores vehicles with stale AI scores (>7 days)
 * - Re-analyzes NEW leads with no sentiment update in 48h
 * - Creates Activity records for significant changes
 *
 * Protected by CRON_SECRET header (set in Vercel env vars).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";
import { autoAnalyzeSentiment } from "@/lib/agents/actions";

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets this automatically for cron jobs)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = { vehiclesScored: 0, leadsAnalyzed: 0, errors: 0 };

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
      take: 50, // batch limit
    });

    for (const vehicle of staleVehicles) {
      try {
        // Deterministic scoring based on vehicle attributes
        let score = 70; // base
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
      take: 30, // batch limit
    });

    for (const lead of staleLeads) {
      try {
        await autoAnalyzeSentiment(lead.id, lead.dealerProfileId);
        results.leadsAnalyzed++;
      } catch {
        results.errors++;
      }
    }

    // Log summary as Activity
    if (results.vehiclesScored > 0 || results.leadsAnalyzed > 0) {
      const dealerIds = [...new Set([...staleVehicles.map((v) => v.dealerProfileId), ...staleLeads.map((l) => l.dealerProfileId)])];
      for (const dpId of dealerIds) {
        await db.activity.create({
          data: {
            dealerProfileId: dpId,
            title: "Nightly AI Scoring",
            description: `Scored ${results.vehiclesScored} vehicles, analyzed ${results.leadsAnalyzed} leads`,
            type: "AUTO",
          },
        }).catch(() => {}); // ignore individual failures
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("[Cron] Nightly scoring error:", error);
    return NextResponse.json({ error: "Cron job failed", ...results }, { status: 500 });
  }
}
