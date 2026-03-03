/* GET /api/user/preferences — Buyer alert preferences
 * PUT /api/user/preferences — Update buyer alert preferences
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const PreferencesSchema = z.object({
  emailPrefs: z.record(z.string(), z.boolean()).optional(),
  waPrefs: z.record(z.string(), z.boolean()).optional(),
  frequency: z.enum(["instant", "daily", "weekly"]).optional(),
  quietHours: z.string().optional(),
  timezone: z.string().optional(),
}).strict();

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (!supaUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { authId: supaUser.id },
      select: { id: true, preferences: true },
    });

    if (!dbUser) {
      return NextResponse.json({ emailPrefs: {}, waPrefs: {}, frequency: "daily" });
    }

    const prefs = (dbUser.preferences ?? {}) as Record<string, unknown>;
    return NextResponse.json({
      emailPrefs: (prefs.emailPrefs as Record<string, boolean>) ?? {},
      waPrefs: (prefs.waPrefs as Record<string, boolean>) ?? {},
      frequency: (prefs.frequency as string) ?? "daily",
      quietHours: (prefs.quietHours as string) ?? undefined,
      timezone: (prefs.timezone as string) ?? undefined,
    });
  } catch (error) {
    console.error("GET /api/user/preferences error:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (!supaUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = PreferencesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
        { status: 400 }
      );
    }

    const dbUser = await db.user.findUnique({
      where: { authId: supaUser.id },
      select: { id: true, preferences: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = (dbUser.preferences ?? {}) as Record<string, unknown>;
    const updated: Record<string, unknown> = {
      ...existing,
      ...(parsed.data.emailPrefs !== undefined && { emailPrefs: parsed.data.emailPrefs }),
      ...(parsed.data.waPrefs !== undefined && { waPrefs: parsed.data.waPrefs }),
      ...(parsed.data.frequency !== undefined && { frequency: parsed.data.frequency }),
      ...(parsed.data.quietHours !== undefined && { quietHours: parsed.data.quietHours }),
      ...(parsed.data.timezone !== undefined && { timezone: parsed.data.timezone }),
    };

    await db.user.update({
      where: { id: dbUser.id },
      data: { preferences: updated as Prisma.InputJsonValue },
    });

    return NextResponse.json({
      emailPrefs: updated.emailPrefs ?? {},
      waPrefs: updated.waPrefs ?? {},
      frequency: updated.frequency ?? "daily",
    });
  } catch (error) {
    console.error("PUT /api/user/preferences error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
