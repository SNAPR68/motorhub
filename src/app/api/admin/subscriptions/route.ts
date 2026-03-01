/* GET /api/admin/subscriptions — All subscriptions + MRR breakdown */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [subscriptions, planCounts] = await Promise.all([
      db.subscription.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          plan: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          razorpaySubscriptionId: true,
          createdAt: true,
          dealerProfile: {
            select: { dealershipName: true, city: true },
          },
        },
      }),
      db.dealerProfile.groupBy({
        by: ["plan"],
        _count: true,
      }),
    ]);

    const planDistribution = Object.fromEntries(
      planCounts.map((p) => [p.plan, p._count])
    );

    const statusCounts = {
      active: subscriptions.filter((s) => s.status === "ACTIVE").length,
      trialing: subscriptions.filter((s) => s.status === "TRIALING").length,
      pastDue: subscriptions.filter((s) => s.status === "PAST_DUE").length,
      cancelled: subscriptions.filter((s) => s.status === "CANCELLED").length,
    };

    return NextResponse.json({
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        dealerName: s.dealerProfile.dealershipName,
        city: s.dealerProfile.city,
        plan: s.plan,
        status: s.status,
        periodStart: s.currentPeriodStart,
        periodEnd: s.currentPeriodEnd,
        razorpayId: s.razorpaySubscriptionId,
        createdAt: s.createdAt,
      })),
      total: subscriptions.length,
      planDistribution,
      statusCounts,
    });
  } catch (error) {
    console.error("GET /api/admin/subscriptions error:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}
