#!/usr/bin/env node
/* Create DB records (User + DealerProfile) for demo accounts via raw SQL.
 *
 * Prerequisites: Demo auth users already exist in Supabase Auth
 *   (created via create-demo-dealer.mjs)
 *
 * Usage: node scripts/seed-demo-profiles.mjs
 */

import pg from "pg";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!connectionString || !SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env vars in .env.local");
  process.exit(1);
}

async function getAuthUser(email) {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`,
    {
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
      },
    },
  );
  const data = await res.json();
  return data.users?.find((u) => u.email === email);
}

function cuid() {
  return "c" + crypto.randomBytes(12).toString("hex");
}

async function main() {
  const pool = new pg.Pool({ connectionString });

  console.log("Seeding demo profiles...\n");

  // 1. Demo Dealer
  const dealerAuth = await getAuthUser("demo@carobest.com");
  if (!dealerAuth) {
    console.error("  Dealer auth user not found. Run create-demo-dealer.mjs first.");
    await pool.end();
    process.exit(1);
  }
  console.log(`  Dealer auth ID: ${dealerAuth.id}`);

  // Upsert dealer user (table: users, columns: snake_case)
  const dealerUserId = cuid();
  const dealerUserResult = await pool.query(
    `INSERT INTO users (id, auth_id, email, name, role, phone, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     ON CONFLICT (auth_id) DO UPDATE SET name = $4, role = $5
     RETURNING id`,
    [dealerUserId, dealerAuth.id, "demo@carobest.com", "Demo Dealer", "DEALER", "+91 98765 00000"],
  );
  const finalDealerUserId = dealerUserResult.rows[0].id;
  console.log(`  Dealer User ID: ${finalDealerUserId}`);

  // Check existing DealerProfile
  const existingProfile = await pool.query(
    `SELECT id, dealership_name FROM dealer_profiles WHERE user_id = $1`,
    [finalDealerUserId],
  );

  let dealerProfileId;
  if (existingProfile.rows.length > 0) {
    dealerProfileId = existingProfile.rows[0].id;
    console.log(`  DealerProfile exists: ${existingProfile.rows[0].dealership_name}`);
  } else {
    dealerProfileId = cuid();
    const dealershipId = `demo-motors-${Date.now().toString(36)}`;
    await pool.query(
      `INSERT INTO dealer_profiles (id, user_id, dealership_name, dealership_id, phone, city, state, plan, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [dealerProfileId, finalDealerUserId, "CaroBest Demo Motors", dealershipId, "+91 98765 00000", "Mumbai", "Maharashtra", "GROWTH"],
    );
    console.log(`  Created DealerProfile: CaroBest Demo Motors`);

    // Create subscription
    const subId = cuid();
    await pool.query(
      `INSERT INTO subscriptions (id, dealer_profile_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [subId, dealerProfileId, "GROWTH", "ACTIVE", "2026-01-01", "2027-01-01"],
    );
    console.log("  Created GROWTH subscription");
  }

  // 2. Demo Buyer
  const buyerAuth = await getAuthUser("buyer@carobest.com");
  if (!buyerAuth) {
    console.error("  Buyer auth user not found.");
    await pool.end();
    process.exit(1);
  }
  console.log(`\n  Buyer auth ID: ${buyerAuth.id}`);

  const buyerUserId = cuid();
  const buyerUserResult = await pool.query(
    `INSERT INTO users (id, auth_id, email, name, role, phone, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     ON CONFLICT (auth_id) DO UPDATE SET name = $4, role = $5
     RETURNING id`,
    [buyerUserId, buyerAuth.id, "buyer@carobest.com", "Demo Buyer", "BUYER", "+91 98765 11111"],
  );
  console.log(`  Buyer User ID: ${buyerUserResult.rows[0].id}`);

  console.log("\n  Done! Both demo profiles are ready.\n");
  console.log("  Dealer: demo@carobest.com / CaroBest2026!");
  console.log("  Buyer:  buyer@carobest.com / CaroBest2026!\n");

  await pool.end();
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
