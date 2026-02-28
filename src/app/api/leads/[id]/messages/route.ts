/* GET /api/leads/[id]/messages — Get all messages for a lead
 * POST /api/leads/[id]/messages — Add a new message to a lead
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, createMessageSchema } from "@/lib/validation";

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
    const messages = await db.leadMessage.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages, total: messages.length });
  } catch (error) {
    console.error("GET /api/leads/[id]/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await parseBody(request, createMessageSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validated = result.data!;
    const message = await db.leadMessage.create({
      data: {
        leadId: id,
        role: validated.role,
        text: validated.text,
        type: validated.type,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads/[id]/messages error:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
