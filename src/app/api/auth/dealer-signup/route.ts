/* POST /api/auth/dealer-signup — Register dealer: Supabase Auth + User + DealerProfile */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { z } from "zod";

const dealerSignupSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  dealershipName: z.string().min(2, "Dealership name required").max(200),
  phone: z.string().max(20).optional(),
  gstin: z.string().max(20).optional(),
  businessType: z.string().max(50).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  plan: z.enum(["STARTER", "GROWTH", "ENTERPRISE"]).default("STARTER"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = dealerSignupSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const input = result.data;
    const supabase = await createClient();

    // 1. Create Supabase Auth user
    const { data: authData, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
          role: "dealer",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create account." },
        { status: 500 }
      );
    }

    // 2. Generate a unique dealership slug
    const slug = input.dealershipName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 30);
    const dealershipId = `${slug}-${Date.now().toString(36)}`;

    // 3. Create User + DealerProfile in one transaction
    try {
      await db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            authId: authData.user!.id,
            email: authData.user!.email!,
            name: input.name,
            phone: input.phone,
            role: "DEALER",
          },
        });

        await tx.dealerProfile.create({
          data: {
            userId: user.id,
            dealershipName: input.dealershipName,
            dealershipId,
            gstin: input.gstin,
            phone: input.phone,
            city: input.city,
            state: input.state,
            plan: input.plan,
          },
        });
      });
    } catch (dbErr) {
      console.error("Dealer signup DB error:", dbErr);
      // User might already exist in DB — try to create just the DealerProfile
      try {
        const existingUser = await db.user.findUnique({
          where: { authId: authData.user.id },
        });
        if (existingUser && !existingUser.phone) {
          // Update existing user with dealer info
          await db.user.update({
            where: { id: existingUser.id },
            data: { role: "DEALER", phone: input.phone },
          });
        }
        if (existingUser) {
          const existingProfile = await db.dealerProfile.findUnique({
            where: { userId: existingUser.id },
          });
          if (!existingProfile) {
            await db.dealerProfile.create({
              data: {
                userId: existingUser.id,
                dealershipName: input.dealershipName,
                dealershipId,
                gstin: input.gstin,
                phone: input.phone,
                city: input.city,
                state: input.state,
                plan: input.plan,
              },
            });
          }
        }
      } catch {
        // Ignore secondary errors
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: input.name,
        role: "dealer",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
