/* GET /api/dealer/team — List team members (auth required)
 * POST /api/dealer/team — Add a team member (auth required)
 * DELETE /api/dealer/team — Remove a team member (auth required, requires ?id= param)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

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

    const member = await db.teamMember.create({
      data: {
        dealerProfileId: dealer.dealerProfileId,
        name: body.name,
        role: body.role,
        email: body.email,
        avatarUrl: body.avatarUrl || null,
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
