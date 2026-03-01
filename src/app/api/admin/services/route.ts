/* GET /api/admin/services — Service bookings overview */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET() {
  const admin = await requireAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      bookings,
      typeCounts,
      statusCounts,
      revenueAgg,
    ] = await Promise.all([
      db.serviceBooking.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          status: true,
          plan: true,
          amount: true,
          city: true,
          phone: true,
          createdAt: true,
        },
      }),
      db.serviceBooking.groupBy({
        by: ["type"],
        _count: true,
      }),
      db.serviceBooking.groupBy({
        by: ["status"],
        _count: true,
      }),
      db.serviceBooking.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      bookings,
      total: bookings.length,
      byType: Object.fromEntries(typeCounts.map((t) => [t.type, t._count])),
      byStatus: Object.fromEntries(statusCounts.map((s) => [s.status, s._count])),
      revenue: {
        total: revenueAgg._sum.amount ?? 0,
        completedCount: revenueAgg._count,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
