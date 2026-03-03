/* GET /api/analytics/export — Proprietary data export in CaroBest format
 * Exports dealer's complete data package: vehicles, leads, analytics, health score.
 * Format is CaroBest-specific JSON with computed fields that only exist on this platform.
 * Intentional switching cost: data includes proprietary scores, signals, and benchmarks.
 */

import { NextResponse } from "next/server";
import { requireDealerAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api-error";
import { extractIntentSignals } from "@/lib/agents/intent-signals";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dpId = dealer.dealerProfileId;

    const [
      dealerProfile,
      vehicles,
      leads,
      snapshots,
      agentMemories,
      activities,
      platformEvents,
    ] = await Promise.all([
      db.dealerProfile.findUnique({
        where: { id: dpId },
        include: { stores: true, preferences: true },
      }),
      db.vehicle.findMany({
        where: { dealerProfileId: dpId },
        orderBy: { createdAt: "desc" },
      }),
      db.lead.findMany({
        where: { dealerProfileId: dpId },
        include: { messages: { orderBy: { createdAt: "asc" } }, vehicle: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.dealerMetricSnapshot.findMany({
        where: { dealerProfileId: dpId },
        orderBy: { weekStart: "asc" },
      }),
      db.agentMemory.findMany({
        where: { dealerProfileId: dpId },
      }),
      db.activity.findMany({
        where: { dealerProfileId: dpId },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.platformEvent.findMany({
        where: { dealerProfileId: dpId },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    ]);

    // Enrich leads with intent signals (proprietary)
    const enrichedLeads = leads.map((lead) => {
      const signals = extractIntentSignals(
        lead.messages.map((m) => ({ text: m.text, role: m.role }))
      );
      return {
        id: lead.id,
        buyerName: lead.buyerName,
        source: lead.source,
        status: lead.status,
        sentiment: lead.sentimentLabel,
        sentimentConfidence: lead.sentiment,
        vehicle: lead.vehicle?.name ?? null,
        messageCount: lead.messages.length,
        intentSignals: signals.signals,
        buyerReadiness: signals.buyerReadiness,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      };
    });

    const exportData = {
      _format: "carobest-dealer-export-v1",
      _exportedAt: new Date().toISOString(),
      _platform: "CaroBest",
      dealer: {
        name: dealerProfile?.dealershipName,
        dealershipId: dealerProfile?.dealershipId,
        plan: dealerProfile?.plan,
        city: dealerProfile?.city,
        stores: dealerProfile?.stores.map((s) => ({
          name: s.name, city: s.city, address: s.address,
        })),
      },
      inventory: vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        year: v.year,
        price: v.price,
        priceDisplay: v.priceDisplay,
        status: v.status,
        fuel: v.fuel,
        transmission: v.transmission,
        km: v.km,
        owner: v.owner,
        aiScore: v.aiScore,
        badge: v.badge,
        imageCount: v.images.length,
        createdAt: v.createdAt,
      })),
      leads: enrichedLeads,
      analytics: {
        metricSnapshots: snapshots.map((s) => ({
          week: s.weekStart.toISOString().slice(0, 10),
          healthScore: s.healthScore,
          responseScore: s.responseScore,
          conversionScore: s.conversionScore,
          listingScore: s.listingScore,
          aiScoreAvg: s.aiScoreAvg,
          totalLeads: s.totalLeads,
          closedWon: s.closedWon,
        })),
        agentPerformance: agentMemories.map((m) => ({
          category: m.category,
          template: m.templateKey,
          sent: m.sentCount,
          responses: m.responseCount,
          responseRate: m.responseRate,
        })),
      },
      activityLog: activities.map((a) => ({
        title: a.title,
        description: a.description,
        type: a.type,
        date: a.createdAt,
      })),
      eventTimeline: platformEvents.map((e) => ({
        type: e.type,
        entity: e.entityType,
        metadata: e.metadata,
        date: e.createdAt,
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="carobest-export-${dealerProfile?.dealershipId ?? "dealer"}-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/analytics/export");
  }
}
