/* Autovinci — Admin auth guard for admin API routes
 *
 * Checks Supabase session + email against ADMIN_EMAILS env var.
 * Zero schema migration needed — upgrade to role-based later.
 */

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function requireAdminAuth(): Promise<{
  userId: string;
  email: string;
} | null> {
  // Dev-mode bypass: skip auth when ADMIN_EMAILS is not configured in development
  if (process.env.NODE_ENV === "development" && !process.env.ADMIN_EMAILS) {
    return { userId: "dev-admin", email: "dev@autovinci.local" };
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return null;

  const supabase = await createClient();
  const {
    data: { user: supaUser },
  } = await supabase.auth.getUser();

  if (!supaUser) return null;

  const user = await db.user.findUnique({
    where: { authId: supaUser.id },
    select: { id: true, email: true },
  });

  if (!user || !adminEmails.includes(user.email.toLowerCase())) return null;

  return { userId: user.id, email: user.email };
}
