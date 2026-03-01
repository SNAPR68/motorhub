/* Autovinci — Admin Users API
 * Buyers, leads (for reassignment), activity log
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") || "buyers";
  const search = searchParams.get("search") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    if (tab === "buyers") {
      const where = {
        role: "BUYER" as const,
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        } : {}),
      };
      const [buyers, total] = await Promise.all([
        db.user.findMany({
          where,
          select: {
            id: true, name: true, email: true, phone: true, createdAt: true,
            _count: { select: { wishlists: true, serviceBookings: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        db.user.count({ where }),
      ]);
      return NextResponse.json({
        buyers: buyers.map((b) => ({
          id: b.id,
          name: b.name,
          email: b.email,
          phone: b.phone,
          createdAt: b.createdAt,
          wishlistCount: b._count.wishlists,
          serviceBookingCount: b._count.serviceBookings,
        })),
        total,
        tab,
      });
    }

    if (tab === "leads") {
      const where = search ? {
        OR: [
          { buyerName: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      } : {};
      const [leads, total, dealers] = await Promise.all([
        db.lead.findMany({
          where,
          select: {
            id: true, buyerName: true, phone: true, email: true,
            status: true, sentimentLabel: true, source: true, createdAt: true,
            dealerProfile: { select: { id: true, dealershipName: true } },
            vehicle: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        db.lead.count({ where }),
        db.dealerProfile.findMany({ select: { id: true, dealershipName: true } }),
      ]);
      return NextResponse.json({ leads, total, dealers, tab });
    }

    if (tab === "activity") {
      const [activities, total] = await Promise.all([
        db.activity.findMany({
          select: {
            id: true, title: true, description: true, type: true, createdAt: true,
            dealerProfile: { select: { dealershipName: true } },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        db.activity.count(),
      ]);
      return NextResponse.json({ activities, total, tab });
    }

    return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Failed to fetch users data" }, { status: 500 });
  }
}
