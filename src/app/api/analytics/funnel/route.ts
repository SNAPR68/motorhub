/* GET /api/analytics/funnel — Sales funnel + sentiment breakdown from real lead data */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const where = { dealerProfileId: dealer.dealerProfileId };

    // Count leads by status
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      followUpLeads,
      testDriveLeads,
      negotiationLeads,
      closedWon,
      closedLost,
    ] = await Promise.all([
      db.lead.count({ where }),
      db.lead.count({ where: { ...where, status: "NEW" } }),
      db.lead.count({ where: { ...where, status: "CONTACTED" } }),
      db.lead.count({ where: { ...where, status: "FOLLOW_UP" } }),
      db.lead.count({ where: { ...where, status: "TEST_DRIVE" } }),
      db.lead.count({ where: { ...where, status: "NEGOTIATION" } }),
      db.lead.count({ where: { ...where, status: "CLOSED_WON" } }),
      db.lead.count({ where: { ...where, status: "CLOSED_LOST" } }),
    ]);

    // Sentiment distribution
    const [hotLeads, warmLeads, coolLeads] = await Promise.all([
      db.lead.count({ where: { ...where, sentimentLabel: "HOT" } }),
      db.lead.count({ where: { ...where, sentimentLabel: "WARM" } }),
      db.lead.count({ where: { ...where, sentimentLabel: "COOL" } }),
    ]);

    // Build funnel stages
    const inquiry = totalLeads;
    const engaged = contactedLeads + followUpLeads + testDriveLeads + negotiationLeads + closedWon + closedLost;
    const testDrive = testDriveLeads + negotiationLeads + closedWon + closedLost;
    const closed = closedWon;

    const funnel = [
      {
        stage: "Inquiry",
        count: inquiry,
        conversion: 100,
      },
      {
        stage: "AI Interaction",
        count: engaged,
        conversion: inquiry > 0 ? Math.round((engaged / inquiry) * 100) : 0,
      },
      {
        stage: "Test Drive",
        count: testDrive,
        conversion: inquiry > 0 ? Math.round((testDrive / inquiry) * 100) : 0,
      },
      {
        stage: "Closed Deals",
        count: closed,
        conversion: inquiry > 0 ? Math.round((closed / inquiry) * 100) : 0,
      },
    ];

    const sentiment = {
      hot: hotLeads,
      warm: warmLeads,
      cool: coolLeads,
      total: totalLeads,
    };

    const statusBreakdown = {
      NEW: newLeads,
      CONTACTED: contactedLeads,
      FOLLOW_UP: followUpLeads,
      TEST_DRIVE: testDriveLeads,
      NEGOTIATION: negotiationLeads,
      CLOSED_WON: closedWon,
      CLOSED_LOST: closedLost,
    };

    return NextResponse.json({ funnel, sentiment, statusBreakdown, totalLeads });
  } catch (error) {
    console.error("GET /api/analytics/funnel error:", error);
    return NextResponse.json(
      { error: "Failed to fetch funnel data" },
      { status: 500 }
    );
  }
}
