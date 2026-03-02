/* GET /api/dealer/team — List team members (auth required)
 * POST /api/dealer/team — Add a team member (auth required)
 * DELETE /api/dealer/team — Remove a team member (auth required, requires ?id= param)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

const TeamMemberSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable().optional(),
}).strict();

export async function GET() {
  try {
    const dealer = await requireDealerAuth();
    if (!dealer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await db.teamMember.findMany({
      where: { dealerProfileId: dealer.dealerProfileId },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({ team, total: team.length });
  } catch (error) {
    console.error("GET /api/dealer/team error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dealer = await requireDealerAuth();
    if (!dealer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = TeamMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
        { status: 400 }
      );
    }

    const member = await db.teamMember.create({
      data: {
        dealerProfileId: dealer.dealerProfileId,
        name: parsed.data.name,
        role: parsed.data.role,
        email: parsed.data.email,
        avatarUrl: parsed.data.avatarUrl || null,
        status: "INVITED",
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/dealer/team error:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const dealer = await requireDealerAuth();
    if (!dealer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Team member ID required" },
        { status: 400 }
      );
    }

    await db.teamMember.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/dealer/team error:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
