/* POST /api/auth/signup — Register new user with Supabase Auth + create DB profile */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { parseBody, signupSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const result = await parseBody(request, signupSchema);
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const input = result.data!;
    const supabase = await createClient();

    // Create Supabase Auth user
    const { data: authData, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name,
          role: input.role.toLowerCase(),
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create account." },
        { status: 500 }
      );
    }

    // Create user record in our database
    try {
      await db.user.create({
        data: {
          authId: authData.user.id,
          email: authData.user.email!,
          name: input.name,
          role: input.role,
        },
      });
    } catch {
      // User might already exist in DB — that's OK
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: input.name,
        role: input.role.toLowerCase(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
