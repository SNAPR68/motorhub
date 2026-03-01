/* Autovinci — Admin Broadcast Notification API */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, message, targetPlan } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: "title and message required" }, { status: 400 });
    }

    // Find target dealer users
    const where = targetPlan && targetPlan !== "ALL"
      ? { plan: targetPlan as "STARTER" | "GROWTH" | "ENTERPRISE" }
      : {};

    const dealers = await db.dealerProfile.findMany({
      where,
      select: { userId: true },
    });

    if (dealers.length === 0) {
      return NextResponse.json({ error: "No dealers match the target" }, { status: 404 });
    }

    // Create notifications for all matching dealers
    await db.notification.createMany({
      data: dealers.map((d) => ({
        userId: d.userId,
        title,
        message,
        type: "SYSTEM" as const,
      })),
    });

    return NextResponse.json({
      success: true,
      sent: dealers.length,
      targetPlan: targetPlan || "ALL",
    });
  } catch (err) {
    console.error("Admin broadcast error:", err);
    return NextResponse.json({ error: "Failed to send broadcast" }, { status: 500 });
  }
}
