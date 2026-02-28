/* GET /api/leads — List leads from database, optional filters (auth required)
 * POST /api/leads — Create a new lead (auth required)
 *
 * Query params: ?status=NEW&sentiment=HOT&search=amit&limit=20&offset=0
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, createLeadSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const sentiment = searchParams.get("sentiment");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const where: Prisma.LeadWhereInput = {
      dealerProfileId: dealer.dealerProfileId,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase() as Prisma.EnumLeadStatusFilter["equals"];
    }

    if (sentiment && sentiment !== "all") {
      where.sentimentLabel = sentiment.toUpperCase() as Prisma.EnumSentimentLevelFilter["equals"];
    }

    if (search) {
      where.OR = [
        { buyerName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          vehicle: { select: { id: true, name: true, priceDisplay: true, images: true } },
          _count: { select: { messages: true } },
        },
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await parseBody(request, createLeadSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validated = result.data!;
    const lead = await db.lead.create({
      data: {
        dealerProfileId: dealer.dealerProfileId,
        vehicleId: validated.vehicleId || null,
        buyerName: validated.buyerName,
        source: validated.source,
        sentiment: validated.sentiment,
        sentimentLabel: validated.sentimentLabel,
        message: validated.message || null,
        phone: validated.phone || null,
        email: validated.email || null,
        location: validated.location || null,
        budget: validated.budget || null,
      },
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true } },
      },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
