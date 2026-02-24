/* Autovinci — Server-side auth guard helpers for API routes
 *
 * Reusable functions to check authentication and get dealer profile.
 * Avoids repeating Supabase + Prisma lookup in every route handler.
 */

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export interface AuthResult {
  userId: string;
  authId: string;
  dealerProfileId: string | null;
}

/**
 * Get authenticated user + their dealer profile ID.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<AuthResult | null> {
  const supabase = await createClient();
  const {
    data: { user: supaUser },
  } = await supabase.auth.getUser();

  if (!supaUser) return null;

  const user = await db.user.findUnique({
    where: { authId: supaUser.id },
    select: {
      id: true,
      dealerProfile: { select: { id: true } },
    },
  });

  if (!user) return null;

  return {
    userId: user.id,
    authId: supaUser.id,
    dealerProfileId: user.dealerProfile?.id ?? null,
  };
}

/**
 * Require authenticated dealer. Returns dealer profile ID or null.
 * Use this for routes that must be dealer-only.
 */
export async function requireDealerAuth(): Promise<{
  dealerProfileId: string;
  userId: string;
} | null> {
  const auth = await getAuthUser();
  if (!auth || !auth.dealerProfileId) return null;
  return { dealerProfileId: auth.dealerProfileId, userId: auth.userId };
}
