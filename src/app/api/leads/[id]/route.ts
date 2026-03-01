/* GET /api/leads/[id] — Get single lead with messages timeline (auth required)
 * PUT /api/leads/[id] — Update lead status or details (auth required)
 * DELETE /api/leads/[id] — Delete lead (auth required)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, updateLeadSchema } from "@/lib/validation";
import { emitEvent } from "@/lib/events";
import { handleApiError } from "@/lib/api-error";
import { extractIntentSignals } from "@/lib/agents/intent-signals";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            priceDisplay: true,
            images: true,
            year: true,
            category: true,
            fuel: true,
            transmission: true,
          },
        },
        messages: {
          orderBy: { createdAt: "asc" },
        },
        appointments: {
          orderBy: { scheduledAt: "desc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    // Build timeline from messages
    const timeline = lead.messages.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.text,
      type: m.type,
      createdAt: m.createdAt,
    }));

    // Extract intent signals from conversation
    const intentSignals = extractIntentSignals(
      lead.messages.map((m) => ({ text: m.text, role: m.role }))
    );

    return NextResponse.json({ lead, timeline, intentSignals });
  } catch (error) {
    return handleApiError(error, "GET /api/leads/[id]");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await parseBody(request, updateLeadSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Capture previous status before update for event emission
    const previousLead = result.data!.status
      ? await db.lead.findUnique({ where: { id }, select: { status: true } })
      : null;

    const lead = await db.lead.update({
      where: { id },
      data: result.data!,
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true } },
      },
    });

    // Emit event on status change
    if (result.data!.status && previousLead && previousLead.status !== result.data!.status) {
      emitEvent({
        type: "LEAD_STATUS_CHANGED",
        entityType: "Lead",
        entityId: id,
        dealerProfileId: dealer.dealerProfileId,
        metadata: { previous: previousLead.status, current: result.data!.status },
      });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    return handleApiError(error, "PUT /api/leads/[id]");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.lead.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return handleApiError(error, "DELETE /api/leads/[id]");
  }
}
