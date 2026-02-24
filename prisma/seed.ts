/* Autovinci — Database Seed Script
 *
 * Migrates all existing mock data into the database.
 * Run: npx prisma db seed
 *
 * Prerequisites:
 * 1. Supabase project created
 * 2. DATABASE_URL and DIRECT_URL set in .env.local
 * 3. npx prisma migrate dev --name init (run first)
 *
 * Note: This does NOT create Supabase Auth users — those must be
 * created via the Supabase dashboard or Auth API. The seed creates
 * placeholder User records with dummy auth_ids that should be
 * updated after creating real Supabase Auth accounts.
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚗 Seeding Autovinci database...\n");

  // ── 1. Users ──
  console.log("👤 Creating users...");
  const dealerUser = await prisma.user.upsert({
    where: { email: "rajesh@autovinci.in" },
    update: {},
    create: {
      authId: "00000000-0000-0000-0000-000000000001", // Replace with real Supabase Auth UUID
      email: "rajesh@autovinci.in",
      name: "Rajesh Malhotra",
      role: "DEALER",
      phone: "+91 98765 43210",
      avatarUrl: "https://lh3.googleusercontent.com/a/default-user",
    },
  });

  const buyerUser = await prisma.user.upsert({
    where: { email: "amit.verma@gmail.com" },
    update: {},
    create: {
      authId: "00000000-0000-0000-0000-000000000002", // Replace with real Supabase Auth UUID
      email: "amit.verma@gmail.com",
      name: "Amit Verma",
      role: "BUYER",
      phone: "+91 98765 43211",
      avatarUrl: "https://lh3.googleusercontent.com/a/default-user",
    },
  });

  console.log(`  ✓ Dealer: ${dealerUser.name} (${dealerUser.id})`);
  console.log(`  ✓ Buyer: ${buyerUser.name} (${buyerUser.id})`);

  // ── 2. Dealer Profile ──
  console.log("\n🏢 Creating dealer profile...");
  const dealerProfile = await prisma.dealerProfile.upsert({
    where: { dealershipId: "mag-delhi-01" },
    update: {},
    create: {
      userId: dealerUser.id,
      dealershipName: "Malhotra Auto Gallery",
      dealershipId: "mag-delhi-01",
      gstin: "07AAACM1234A1Z5",
      phone: "+91 11 4567 8900",
      address: "Plot 24, Sector 18, Dwarka",
      city: "New Delhi",
      state: "Delhi",
      logoUrl: "https://lh3.googleusercontent.com/a/default-user",
      plan: "GROWTH",
    },
  });
  console.log(`  ✓ ${dealerProfile.dealershipName}`);

  // ── 3. Store Locations ──
  console.log("\n📍 Creating store locations...");
  const storesData = [
    {
      name: "Dwarka Flagship",
      address: "Plot 24, Sector 18, Dwarka, New Delhi 110075",
      city: "New Delhi",
      phone: "+91 11 4567 8900",
      manager: "Rajesh Malhotra",
    },
    {
      name: "Gurgaon Hub",
      address: "Tower B, Ground Floor, DLF Cyber City, Gurgaon 122002",
      city: "Gurgaon",
      phone: "+91 124 456 7890",
      manager: "Priya Kapoor",
    },
    {
      name: "Noida Express",
      address: "A-12, Sector 62, Noida 201301",
      city: "Noida",
      phone: "+91 120 345 6789",
      manager: "Vikram Singh",
    },
  ];

  const stores = [];
  for (const s of storesData) {
    const store = await prisma.storeLocation.create({
      data: { dealerProfileId: dealerProfile.id, ...s },
    });
    stores.push(store);
    console.log(`  ✓ ${store.name} (${store.city})`);
  }

  // ── 4. Team Members ──
  console.log("\n👥 Creating team members...");
  const teamData = [
    { name: "Rajesh Malhotra", role: "Owner", email: "rajesh@autovinci.in", status: "ACTIVE" as const, joinedAt: new Date("2024-01-15") },
    { name: "Priya Kapoor", role: "Sales Manager", email: "priya.k@autovinci.in", status: "ACTIVE" as const, joinedAt: new Date("2024-03-01") },
    { name: "Vikram Singh", role: "Inventory Lead", email: "vikram.s@autovinci.in", status: "ACTIVE" as const, joinedAt: new Date("2024-06-15") },
    { name: "Aisha Patel", role: "Marketing", email: "aisha.p@autovinci.in", status: "INVITED" as const, joinedAt: new Date("2025-01-10") },
  ];

  for (const t of teamData) {
    const member = await prisma.teamMember.create({
      data: {
        dealerProfileId: dealerProfile.id,
        userId: t.email === "rajesh@autovinci.in" ? dealerUser.id : null,
        avatarUrl: "https://lh3.googleusercontent.com/a/default-user",
        ...t,
      },
    });
    console.log(`  ✓ ${member.name} — ${member.role}`);
  }

  // ── 5. Vehicles ──
  console.log("\n🚙 Creating vehicles...");

  // Image URLs from car-images.ts
  const CRETA = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/2024_Hyundai_Creta_%28SU2i%29_Prime_1.5_IVT_%2820240804%29.jpg/1200px-2024_Hyundai_Creta_%28SU2i%29_Prime_1.5_IVT_%2820240804%29.jpg";
  const SWIFT = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Maruti_Suzuki_Swift_ZXi_Plus_%28facelift%2C_front%29%2C_Kharagpur%2C_2023-01-15.jpg/1200px-Maruti_Suzuki_Swift_ZXi_Plus_%28facelift%2C_front%29%2C_Kharagpur%2C_2023-01-15.jpg";
  const NEXON = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Tata_Nexon_%28facelift%29_front_view.jpg/1200px-Tata_Nexon_%28facelift%29_front_view.jpg";
  const NEXON_EV = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Tata_Nexon_EV_Max_LR_%28front%29%2C_2023%2C_Candi_Prambanan.jpg/1200px-Tata_Nexon_EV_Max_LR_%28front%29%2C_2023%2C_Candi_Prambanan.jpg";
  const XUV700 = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mahindra_XUV700_front_view.jpg/1200px-Mahindra_XUV700_front_view.jpg";
  const FORTUNER = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/2020_Toyota_Fortuner_2.8_VRZ_TRD_%2820211016%29.jpg/1200px-2020_Toyota_Fortuner_2.8_VRZ_TRD_%2820211016%29.jpg";
  const SEDAN = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2020_Honda_City_1.5_V_%28front%29.jpg/1200px-2020_Honda_City_1.5_V_%28front%29.jpg";
  const KIA = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/2023_Kia_Seltos_1.5_EX_%28Indonesia%29_front_view.jpg/1200px-2023_Kia_Seltos_1.5_EX_%28Indonesia%29_front_view.jpg";
  const BREZZA = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Maruti_Suzuki_Brezza_ZXi_Plus_%28facelift%29.jpg/1200px-Maruti_Suzuki_Brezza_ZXi_Plus_%28facelift%29.jpg";

  const vehiclesData = [
    {
      name: "Hyundai Creta SX(O)", year: 2023, price: 1250000, priceDisplay: "₹ 12.50 Lakh",
      status: "AVAILABLE" as const, category: "SUV" as const, fuel: "DIESEL" as const,
      transmission: "AUTOMATIC" as const, engine: "1.5L CRDi", power: "115 bhp",
      mileage: "21.4 km/l", km: "18,300", location: "Delhi NCR", owner: "1st Owner",
      badge: "Premium", aiScore: 96, images: [CRETA],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "adas", label: "ADAS Safety", available: true },
        { key: "ventilatedSeats", label: "Ventilated Seats", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
        { key: "airPurifier", label: "Air Purifier", available: false },
      ],
    },
    {
      name: "Maruti Swift ZXi+", year: 2023, price: 680000, priceDisplay: "₹ 6.80 Lakh",
      status: "AVAILABLE" as const, category: "HATCHBACK" as const, fuel: "PETROL" as const,
      transmission: "MANUAL" as const, engine: "1.2L Dualjet", power: "90 bhp",
      mileage: "24.8 km/l", km: "12,500", location: "Mumbai", owner: "1st Owner",
      badge: "Trending", aiScore: 92, images: [SWIFT],
      features: [
        { key: "sunroof", label: "Sunroof", available: false },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
      ],
    },
    {
      name: "Tata Nexon XZA+", year: 2022, price: 1020000, priceDisplay: "₹ 10.20 Lakh",
      status: "IN_REVIEW" as const, category: "SUV" as const, fuel: "PETROL" as const,
      transmission: "AUTOMATIC" as const, engine: "1.2L Turbo", power: "120 bhp",
      mileage: "17.4 km/l", km: "22,000", location: "Pune", owner: "1st Owner",
      badge: null, aiScore: 89, images: [NEXON],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
      ],
    },
    {
      name: "Mahindra XUV700 AX7L", year: 2023, price: 1890000, priceDisplay: "₹ 18.90 Lakh",
      status: "AVAILABLE" as const, category: "SUV" as const, fuel: "DIESEL" as const,
      transmission: "AUTOMATIC" as const, engine: "2.2L mHawk", power: "185 bhp",
      mileage: "16.3 km/l", km: "15,200", location: "Bangalore", owner: "1st Owner",
      badge: "Premium", aiScore: 94, images: [XUV700],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "adas", label: "ADAS Safety", available: true },
        { key: "ventilatedSeats", label: "Ventilated Seats", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
        { key: "airPurifier", label: "Air Purifier", available: true },
      ],
    },
    {
      name: "Toyota Fortuner Legender", year: 2021, price: 3250000, priceDisplay: "₹ 32.50 Lakh",
      status: "AVAILABLE" as const, category: "SUV" as const, fuel: "DIESEL" as const,
      transmission: "AUTOMATIC" as const, engine: "2.8L GD", power: "204 bhp",
      mileage: "14.2 km/l", km: "28,400", location: "Delhi NCR", owner: "1st Owner",
      badge: "Premium", aiScore: 97, images: [FORTUNER],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "ventilatedSeats", label: "Ventilated Seats", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
      ],
    },
    {
      name: "Honda City ZX CVT", year: 2023, price: 1420000, priceDisplay: "₹ 14.20 Lakh",
      status: "AVAILABLE" as const, category: "SEDAN" as const, fuel: "PETROL" as const,
      transmission: "CVT" as const, engine: "1.5L i-VTEC", power: "121 bhp",
      mileage: "18.4 km/l", km: "9,800", location: "Hyderabad", owner: "1st Owner",
      badge: "Low KM", aiScore: 93, images: [SEDAN],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "adas", label: "ADAS Safety", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
      ],
    },
    {
      name: "Kia Seltos HTX+", year: 2024, price: 1560000, priceDisplay: "₹ 15.60 Lakh",
      status: "AVAILABLE" as const, category: "SUV" as const, fuel: "DIESEL" as const,
      transmission: "AUTOMATIC" as const, engine: "1.5L CRDi", power: "115 bhp",
      mileage: "20.7 km/l", km: "5,200", location: "Chennai", owner: "1st Owner",
      badge: "New Arrival", aiScore: 95, images: [KIA],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "adas", label: "ADAS Safety", available: true },
        { key: "ventilatedSeats", label: "Ventilated Seats", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
        { key: "airPurifier", label: "Air Purifier", available: true },
      ],
    },
    {
      name: "Tata Nexon EV Max LR", year: 2023, price: 1750000, priceDisplay: "₹ 17.50 Lakh",
      status: "AVAILABLE" as const, category: "EV" as const, fuel: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const, engine: "40.5 kWh", power: "143 bhp",
      mileage: "437 km range", km: "11,300", location: "Delhi NCR", owner: "1st Owner",
      badge: "EV", aiScore: 91, images: [NEXON_EV],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "ventilatedSeats", label: "Ventilated Seats", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
        { key: "airPurifier", label: "Air Purifier", available: true },
      ],
    },
    {
      name: "Maruti Brezza ZXi+", year: 2022, price: 1120000, priceDisplay: "₹ 11.20 Lakh",
      status: "AVAILABLE" as const, category: "SUV" as const, fuel: "PETROL" as const,
      transmission: "AUTOMATIC" as const, engine: "1.5L K-Series", power: "103 bhp",
      mileage: "19.8 km/l", km: "19,700", location: "Jaipur", owner: "1st Owner",
      badge: null, aiScore: 90, images: [BREZZA],
      features: [
        { key: "sunroof", label: "Sunroof", available: true },
        { key: "wirelessCharging", label: "Wireless Charging", available: true },
        { key: "cruiseControl", label: "Cruise Control", available: true },
      ],
    },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const vehicle = await prisma.vehicle.create({
      data: {
        dealerProfileId: dealerProfile.id,
        storeId: stores[0].id, // Assign all to Dwarka flagship
        ...v,
      },
    });
    vehicles.push(vehicle);
    console.log(`  ✓ ${vehicle.name} — ${vehicle.priceDisplay}`);
  }

  // ── 6. Leads ──
  console.log("\n📞 Creating leads...");
  const leadsData = [
    {
      buyerName: "Amit Verma", source: "WEBSITE" as const, sentiment: 94,
      sentimentLabel: "HOT" as const, message: "Interested in booking a test drive at my home. Budget is ₹13L max.",
      phone: "+91 98765 43210", location: "Delhi", budget: "₹13L max",
      status: "TEST_DRIVE" as const, vehicleIdx: 0,
    },
    {
      buyerName: "Neha Gupta", source: "FACEBOOK" as const, sentiment: 62,
      sentimentLabel: "WARM" as const, message: "Asking about insurance transfer and RC status for the Swift.",
      phone: "+91 91234 56789", location: "Mumbai", budget: "₹8L max",
      status: "FOLLOW_UP" as const, vehicleIdx: 1,
    },
    {
      buyerName: "Ravi Malhotra", source: "WEBSITE" as const, sentiment: 88,
      sentimentLabel: "HOT" as const, message: "Wants home delivery to Noida. Ready to finalize within the week.",
      phone: "+91 99876 54321", location: "Noida", budget: "₹12L max",
      status: "NEGOTIATION" as const, vehicleIdx: 2,
    },
    {
      buyerName: "Priya Sharma", source: "INSTAGRAM" as const, sentiment: 45,
      sentimentLabel: "COOL" as const, message: "Just browsing options for now. Will visit next month.",
      phone: "+91 88765 43210", location: "Bangalore", budget: "₹15L max",
      status: "NEW" as const, vehicleIdx: 5,
    },
  ];

  const leads = [];
  for (const l of leadsData) {
    const { vehicleIdx, ...leadData } = l;
    const lead = await prisma.lead.create({
      data: {
        dealerProfileId: dealerProfile.id,
        vehicleId: vehicles[vehicleIdx].id,
        ...leadData,
      },
    });
    leads.push(lead);
    console.log(`  ✓ ${lead.buyerName} — ${lead.sentimentLabel}`);
  }

  // ── 7. Lead Messages (timeline for first lead) ──
  console.log("\n💬 Creating lead messages...");
  const messagesData = [
    { role: "AI" as const, text: "AI auto-replied with test drive options for this Saturday.", type: "AUTO" as const },
    { role: "USER" as const, text: "Thanks! I'll take the 11 AM slot. Can you send the address?", type: "MANUAL" as const },
    { role: "AI" as const, text: "Sure! Sending location. Your test drive is confirmed for 11 AM at Malhotra Auto, Dwarka.", type: "MANUAL" as const },
    { role: "USER" as const, text: "Perfect. One more thing — what's the final on-road price with insurance?", type: "MANUAL" as const },
  ];

  for (const m of messagesData) {
    await prisma.leadMessage.create({
      data: { leadId: leads[0].id, ...m },
    });
  }
  console.log(`  ✓ ${messagesData.length} messages for ${leads[0].buyerName}`);

  // ── 8. Appointments ──
  console.log("\n📅 Creating appointments...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      dealerProfileId: dealerProfile.id,
      leadId: leads[0].id,
      vehicleId: vehicles[0].id,
      buyerName: "Amit Verma",
      buyerPhone: "+91 98765 43210",
      scheduledAt: tomorrow,
      status: "CONFIRMED",
      location: "Malhotra Auto, Dwarka",
      notes: "Home test drive requested",
    },
  });
  console.log("  ✓ Test drive: Amit Verma — tomorrow 11 AM");

  // ── 9. Activities ──
  console.log("\n📋 Creating activity feed...");
  const activitiesData = [
    { title: "Social Post Generated", description: "Auto-captions for Maruti Swift ready for Instagram & FB.", type: "AUTO" as const },
    { title: "360° View Processed", description: "Hyundai Creta interior panorama successfully stitched.", type: "INFO" as const },
    { title: "New Lead: Amit Verma", description: "Interested in Creta SX(O). Budget ₹13L. AI auto-replied.", type: "SUCCESS" as const },
  ];

  for (const a of activitiesData) {
    await prisma.activity.create({
      data: { dealerProfileId: dealerProfile.id, ...a },
    });
  }
  console.log(`  ✓ ${activitiesData.length} activities`);

  // ── 10. Subscription ──
  console.log("\n💳 Creating subscription...");
  await prisma.subscription.create({
    data: {
      dealerProfileId: dealerProfile.id,
      plan: "GROWTH",
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2026-01-01"),
    },
  });
  console.log("  ✓ Growth plan — Active");

  // ── 11. Notifications ──
  console.log("\n🔔 Creating notifications...");
  const notificationsData = [
    { title: "New Lead", message: "Amit Verma is interested in Hyundai Creta SX(O)", type: "LEAD" as const },
    { title: "Appointment Confirmed", message: "Test drive with Amit Verma tomorrow at 11 AM", type: "APPOINTMENT" as const },
    { title: "Vehicle Sold", message: "Tata Nexon XZA+ has been marked as sold", type: "VEHICLE" as const },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({
      data: { userId: dealerUser.id, ...n },
    });
  }
  console.log(`  ✓ ${notificationsData.length} notifications`);

  // ── 12. Buyer Wishlist ──
  console.log("\n❤️ Creating buyer wishlist...");
  await prisma.wishlist.create({
    data: { userId: buyerUser.id, vehicleId: vehicles[0].id },
  });
  await prisma.wishlist.create({
    data: { userId: buyerUser.id, vehicleId: vehicles[3].id },
  });
  console.log("  ✓ 2 wishlist items for Amit Verma");

  console.log("\n✅ Seed complete! Database is ready.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
