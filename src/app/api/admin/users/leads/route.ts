/* Autovinci — Admin Lead Reassignment API */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { leadId, newDealerProfileId } = await req.json();
    if (!leadId || !newDealerProfileId) {
      return NextResponse.json({ error: "leadId and newDealerProfileId required" }, { status: 400 });
    }

    // Verify dealer exists
    const dealer = await db.dealerProfile.findUnique({
      where: { id: newDealerProfileId },
      select: { id: true, dealershipName: true },
    });
    if (!dealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 });
    }

    const lead = await db.lead.update({
      where: { id: leadId },
      data: { dealerProfileId: newDealerProfileId },
      select: {
        id: true, buyerName: true,
        dealerProfile: { select: { dealershipName: true } },
      },
    });

    return NextResponse.json({ lead, reassignedTo: dealer.dealershipName });
  } catch (err) {
    console.error("Admin lead reassign error:", err);
    return NextResponse.json({ error: "Failed to reassign lead" }, { status: 500 });
  }
}
