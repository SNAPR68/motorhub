/* GET /api/leads/[id]/score — Predictive lead score
 * Returns AI-computed conversion probability + actionable signals.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireDealerAuth } from "@/lib/auth-guard";
import { scoreLead } from "@/lib/agents/predictive-scoring";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const score = await scoreLead(id);
    return NextResponse.json(score);
  } catch (error) {
    console.error("Lead scoring error:", error);
    return NextResponse.json({ error: "Failed to score lead" }, { status: 500 });
  }
}
