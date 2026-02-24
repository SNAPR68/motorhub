/* GET /api/notifications — Get user's notifications
 * PUT /api/notifications — Mark notifications as read (requires ?id= or ?all=true)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user: supaUser } } = await supabase.auth.getUser();
  if (!supaUser) return null;

  const user = await db.user.findUnique({
    where: { authId: supaUser.id },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      total: notifications.length,
      unreadCount,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");
    const all = searchParams.get("all");

    if (all === "true") {
      // Mark all as read
      await db.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return NextResponse.json({ marked: "all" });
    }

    if (id) {
      await db.notification.update({
        where: { id },
        data: { read: true },
      });
      return NextResponse.json({ marked: id });
    }

    return NextResponse.json(
      { error: "Provide ?id= or ?all=true" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PUT /api/notifications error:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
