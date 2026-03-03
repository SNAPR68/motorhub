#!/usr/bin/env node
/* Create a demo dealer account via Supabase Admin API.
 * This creates both the Supabase Auth user AND the DB records.
 *
 * Usage: node scripts/create-demo-dealer.mjs
 *
 * Demo credentials:
 *   Email:    demo@carobest.com
 *   Password: CaroBest2026!
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const DEMO_EMAIL = "demo@carobest.com";
const DEMO_PASSWORD = "CaroBest2026!";
const DEMO_NAME = "Demo Dealer";
const DEALERSHIP_NAME = "CaroBest Demo Motors";

async function supaAdmin(path, method = "GET", body = null) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${method} ${path} failed: ${JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log("Creating demo dealer account...\n");

  // 1. Check if user already exists
  let authUser;
  try {
    const existing = await supaAdmin(
      `/auth/v1/admin/users?page=1&per_page=50`,
    );
    const found = existing.users?.find((u) => u.email === DEMO_EMAIL);
    if (found) {
      console.log(`  Auth user already exists: ${found.id}`);
      authUser = found;
    }
  } catch (e) {
    console.log("  Could not check existing users:", e.message);
  }

  // 2. Create Supabase Auth user (admin API bypasses email confirmation)
  if (!authUser) {
    try {
      authUser = await supaAdmin("/auth/v1/admin/users", "POST", {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: {
          name: DEMO_NAME,
          role: "dealer",
        },
      });
      console.log(`  Created auth user: ${authUser.id}`);
    } catch (e) {
      console.error("  Failed to create auth user:", e.message);
      process.exit(1);
    }
  }

  // 3. Create DB records via dealer-signup API (or directly via Prisma)
  //    We'll call our own API endpoint
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  console.log(`\n  Demo Dealer Account Created!`);
  console.log(`  ──────────────────────────────`);
  console.log(`  Email:    ${DEMO_EMAIL}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log(`  Auth ID:  ${authUser.id}`);
  console.log(`\n  Login at: ${APP_URL}/login/dealer`);
  console.log(
    `\n  Note: On first login, the /api/auth/callback route will auto-create`,
  );
  console.log(`  the User record in the DB. To also create a DealerProfile,`);
  console.log(`  sign up via /dealer/signup with these same credentials,`);
  console.log(`  or use Prisma Studio to create the profile manually.\n`);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
