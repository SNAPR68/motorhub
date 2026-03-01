/* Autovinci — Admin Alerts API
 * Today's activity, threshold warnings, weekly digest preview
 */

import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";
import { getAllCircuitStatuses } from "@/lib/ai-circuit-breaker";

export async function GET() {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      signupsToday,
      dealsClosedToday,
      servicesBookedToday,
      staleInventory,
      cancelledThisMonth,
      cancelledLastMonth,
      // Unresponsive leads: leads created >24h ago with no messages
      recentLeads,
      // Weekly digest data
      weeklyDealers,
      weeklyLeads,
      weeklyServices,
      weeklyClosedWon,
    ] = await Promise.all([
      db.dealerProfile.count({ where: { createdAt: { gte: todayStart } } }),
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: todayStart } } }),
      db.serviceBooking.count({ where: { createdAt: { gte: todayStart } } }),
      db.vehicle.count({ where: { status: "AVAILABLE", createdAt: { lt: sixtyDaysAgo } } }),
      db.subscription.count({ where: { status: "CANCELLED", updatedAt: { gte: thisMonthStart } } }),
      db.subscription.count({ where: { status: "CANCELLED", updatedAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
      // Leads older than 24h
      db.lead.findMany({
        where: { createdAt: { lt: yesterday }, status: "NEW" },
        select: { id: true },
      }),
      // Weekly digest
      db.dealerProfile.count({ where: { createdAt: { gte: weekStart } } }),
      db.lead.count({ where: { createdAt: { gte: weekStart } } }),
      db.serviceBooking.count({ where: { createdAt: { gte: weekStart } } }),
      db.lead.count({ where: { status: "CLOSED_WON", updatedAt: { gte: weekStart } } }),
    ]);

    // Check which of those leads have zero messages
    let unresponsiveLeads = 0;
    if (recentLeads.length > 0) {
      const leadIds = recentLeads.map((l) => l.id);
      const leadsWithMessages = await db.leadMessage.groupBy({
        by: ["leadId"],
        where: { leadId: { in: leadIds } },
      });
      const respondedIds = new Set(leadsWithMessages.map((g) => g.leadId));
      unresponsiveLeads = leadIds.filter((id) => !respondedIds.has(id)).length;
    }

    const churnSpike = cancelledLastMonth > 0
      ? Math.round(((cancelledThisMonth - cancelledLastMonth) / cancelledLastMonth) * 100)
      : cancelledThisMonth > 0 ? 100 : 0;

    // System health: circuit breakers + recent event error rate
    const [totalEventsLastHour, agentEventsToday] = await Promise.all([
      db.platformEvent.count({ where: { createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } } }),
      db.platformEvent.findMany({
        where: { createdAt: { gte: todayStart } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, type: true, entityType: true, entityId: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      today: {
        signups: signupsToday,
        dealsClosed: dealsClosedToday,
        servicesBooked: servicesBookedToday,
      },
      thresholds: {
        staleInventory,
        unresponsiveLeads,
        cancelledThisMonth,
        cancelledLastMonth,
        churnSpike,
      },
      digest: {
        period: `${weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${now.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
        newDealers: weeklyDealers,
        newLeads: weeklyLeads,
        dealsWon: weeklyClosedWon,
        servicesBooked: weeklyServices,
      },
      systemHealth: {
        circuitBreakers: getAllCircuitStatuses(),
        eventsLastHour: totalEventsLastHour,
        recentEvents: agentEventsToday,
      },
    });
  } catch (err) {
    console.error("Admin alerts error:", err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
