/* GET  /api/finance — List user's finance applications
 * POST /api/finance — Create a loan or insurance application
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  vehicleId: z.string().min(1).optional(),
  type: z.enum(["LOAN", "INSURANCE"]),
  amount: z.number().int().min(10000).optional(),
  tenure: z.number().int().min(6).max(84).optional(),
  downPayment: z.number().int().min(0).optional(),
  applicantDetails: z.object({
    fullName: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().email().optional(),
    income: z.number().int().optional(),
    employment: z.enum(["SALARIED", "SELF_EMPLOYED", "BUSINESS"]).optional(),
    panCard: z.string().max(10).optional(),
    city: z.string().optional(),
  }),
}).strict();

// Simple interest rate calculation based on profile
function estimateRate(income?: number, tenure?: number): number {
  let base = 10.5;
  if (income && income > 1000000) base -= 1.0; // >10L annual income
  if (income && income > 500000) base -= 0.5;
  if (tenure && tenure <= 36) base -= 0.25; // Shorter tenure = lower rate
  return Math.max(base, 8.5);
}

function calculateEmi(principal: number, annualRate: number, tenureMonths: number): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return Math.round(principal / tenureMonths);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({ where: { authId: user.id }, select: { id: true } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { userId: dbUser.id };
    if (type) where.type = type;

    const applications = await db.financeApplication.findMany({
      where,
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ applications, total: applications.length });
  } catch (error) {
    console.error("GET /api/finance error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({ where: { authId: user.id }, select: { id: true } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const { type, vehicleId, amount, tenure, downPayment, applicantDetails } = parsed.data;

    // For loans: compute EMI and rate
    let interestRate: number | null = null;
    let emi: number | null = null;
    let provider: string | null = null;

    if (type === "LOAN") {
      const loanAmount = amount ?? 500000;
      const loanTenure = tenure ?? 60;
      interestRate = estimateRate(applicantDetails.income, loanTenure);
      emi = calculateEmi(loanAmount - (downPayment ?? 0), interestRate, loanTenure);
      provider = "CaroBest Finance Partner"; // Placeholder until NBFC API integration
    } else {
      provider = "CaroBest Insurance Partner";
    }

    const application = await db.financeApplication.create({
      data: {
        userId: dbUser.id,
        vehicleId: vehicleId ?? null,
        type,
        status: "SUBMITTED",
        provider,
        amount: amount ?? null,
        tenure: tenure ?? null,
        interestRate,
        emi,
        downPayment: downPayment ?? null,
        applicantDetails,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    await db.platformEvent.create({
      data: {
        type: type === "LOAN" ? "LOAN_APPLICATION_SUBMITTED" : "INSURANCE_APPLICATION_SUBMITTED",
        entityType: "FinanceApplication",
        entityId: application.id,
        userId: dbUser.id,
        metadata: { type, amount, tenure, provider },
      },
    });

    return NextResponse.json({
      application: {
        id: application.id,
        type: application.type,
        status: application.status,
        provider: application.provider,
        amount: application.amount,
        tenure: application.tenure,
        interestRate: application.interestRate,
        emi: application.emi,
        downPayment: application.downPayment,
        createdAt: application.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/finance error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
