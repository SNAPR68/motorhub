/* CaroBest — Database Seed Script
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
  console.log("🚗 Seeding CaroBest database...\n");

  // ── 1. Users ──
  console.log("👤 Creating users...");
  const dealerUser = await prisma.user.upsert({
    where: { email: "rajesh@carobest.com" },
    update: {},
    create: {
      authId: "00000000-0000-0000-0000-000000000001", // Replace with real Supabase Auth UUID
      email: "rajesh@carobest.com",
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
    { name: "Rajesh Malhotra", role: "Owner", email: "rajesh@carobest.com", status: "ACTIVE" as const, joinedAt: new Date("2024-01-15") },
    { name: "Priya Kapoor", role: "Sales Manager", email: "priya.k@carobest.com", status: "ACTIVE" as const, joinedAt: new Date("2024-03-01") },
    { name: "Vikram Singh", role: "Inventory Lead", email: "vikram.s@carobest.com", status: "ACTIVE" as const, joinedAt: new Date("2024-06-15") },
    { name: "Aisha Patel", role: "Marketing", email: "aisha.p@carobest.com", status: "INVITED" as const, joinedAt: new Date("2025-01-10") },
  ];

  for (const t of teamData) {
    const member = await prisma.teamMember.create({
      data: {
        dealerProfileId: dealerProfile.id,
        userId: t.email === "rajesh@carobest.com" ? dealerUser.id : null,
        avatarUrl: "https://lh3.googleusercontent.com/a/default-user",
        ...t,
      },
    });
    console.log(`  ✓ ${member.name} — ${member.role}`);
  }

  // ── 5. Vehicles ──
  console.log("\n🚙 Creating vehicles...");

  // Local image URLs (stored in /public/cars/)
  const CRETA = "/cars/creta.jpg";
  const SWIFT = "/cars/swift.jpg";
  const NEXON = "/cars/nexon.jpg";
  const NEXON_EV = "/cars/nexon-ev.jpg";
  const XUV700 = "/cars/xuv700.jpg";
  const FORTUNER = "/cars/fortuner.jpg";
  const SEDAN = "/cars/sedan.jpg";
  const KIA = "/cars/seltos.jpg";
  const BREZZA = "/cars/brezza.jpg";
  const ERTIGA = "/cars/ertiga.jpg";
  const I20 = "/cars/i20.jpg";
  const PUNCH = "/cars/punch.jpg";
  const THAR = "/cars/thar.jpg";
  const HECTOR = "/cars/hector.jpg";
  const SONET = "/cars/sonet.jpg";
  const HYRYDER = "/cars/hyryder.jpg";

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

  // ── 13. New Car Catalog (Brands → Models → Variants) ──
  console.log("\n🚘 Seeding car catalog...");

  const brandsData = [
    { slug: "maruti", name: "Maruti Suzuki", logo: "MS", color: "#1152d4", popular: true, order: 1 },
    { slug: "hyundai", name: "Hyundai", logo: "H", color: "#0f4fc4", popular: true, order: 2 },
    { slug: "tata", name: "Tata Motors", logo: "T", color: "#1565c0", popular: true, order: 3 },
    { slug: "mahindra", name: "Mahindra", logo: "M", color: "#137fec", popular: true, order: 4 },
    { slug: "honda", name: "Honda", logo: "H", color: "#c00", popular: true, order: 5 },
    { slug: "toyota", name: "Toyota", logo: "T", color: "#eb0a1e", popular: true, order: 6 },
    { slug: "kia", name: "Kia", logo: "K", color: "#05141f", popular: true, order: 7 },
    { slug: "mg", name: "MG Motor", logo: "MG", color: "#d4001e", popular: true, order: 8 },
    { slug: "renault", name: "Renault", logo: "R", color: "#f9d000", popular: false, order: 9 },
    { slug: "volkswagen", name: "Volkswagen", logo: "VW", color: "#001e50", popular: false, order: 10 },
    { slug: "skoda", name: "Skoda", logo: "S", color: "#1d6127", popular: false, order: 11 },
    { slug: "jeep", name: "Jeep", logo: "J", color: "#1c1c1c", popular: false, order: 12 },
  ];

  const brandMap: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.carBrand.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
    brandMap[b.slug] = brand.id;
    console.log(`  ✓ Brand: ${brand.name}`);
  }

  // No more Unsplash URLs -- all images are local in /public/cars/

  const modelsData: Array<{
    slug: string; brand: string; name: string; fullName: string;
    category: "SUV" | "SEDAN" | "HATCHBACK" | "EV" | "LUXURY" | "MPV";
    image: string; gallery: string[]; startingPrice: number; startingPriceDisplay: string;
    rating: number; reviewCount: number; year: number; fuelTypes: string[];
    transmissions: string[]; mileage: string; engine: string; power: string;
    seating: number; bodyType: string; popular: boolean; tag?: string;
    pros: string[]; cons: string[];
  }> = [
    {
      slug: "brezza", brand: "maruti", name: "Brezza", fullName: "Maruti Suzuki Brezza",
      category: "SUV",
      image: BREZZA,
      gallery: [BREZZA],
      startingPrice: 799000, startingPriceDisplay: "₹7.99 L", rating: 4.2, reviewCount: 3840,
      year: 2024, fuelTypes: ["Petrol"], transmissions: ["Manual", "Automatic"],
      mileage: "19.8 km/l", engine: "1.5L K15C", power: "103 bhp", seating: 5, bodyType: "SUV",
      popular: true, tag: "Best Seller",
      pros: ["Best-in-class mileage", "Spacious cabin", "Advanced safety features", "Strong resale value"],
      cons: ["No diesel option", "No six-speed manual", "Rear AC vents missing in base"],
    },
    {
      slug: "swift", brand: "maruti", name: "Swift", fullName: "Maruti Suzuki Swift",
      category: "HATCHBACK",
      image: SWIFT,
      gallery: [SWIFT],
      startingPrice: 659000, startingPriceDisplay: "₹6.59 L", rating: 4.3, reviewCount: 6120,
      year: 2024, fuelTypes: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"],
      mileage: "24.8 km/l", engine: "1.2L Z12E", power: "81 bhp", seating: 5, bodyType: "Hatchback",
      popular: true, tag: "Award Winner",
      pros: ["Excellent fuel economy", "Fun to drive", "Affordable service cost", "Peppy engine"],
      cons: ["Small boot space", "Rear seat is cramped", "No automatic gearbox option in CNG"],
    },
    {
      slug: "ertiga", brand: "maruti", name: "Ertiga", fullName: "Maruti Suzuki Ertiga",
      category: "MPV",
      image: ERTIGA,
      gallery: [ERTIGA],
      startingPrice: 886000, startingPriceDisplay: "₹8.86 L", rating: 4.1, reviewCount: 2780,
      year: 2024, fuelTypes: ["Petrol", "CNG"], transmissions: ["Manual", "Automatic"],
      mileage: "20.3 km/l", engine: "1.5L K15C", power: "103 bhp", seating: 7, bodyType: "MPV",
      popular: false,
      pros: ["7-seater at great price", "Comfortable ride", "Good mileage", "Easy to drive"],
      cons: ["Third-row legroom is limited", "No diesel option", "Basic infotainment in base"],
    },
    {
      slug: "creta", brand: "hyundai", name: "Creta", fullName: "Hyundai Creta",
      category: "SUV",
      image: CRETA,
      gallery: [CRETA],
      startingPrice: 1099900, startingPriceDisplay: "₹11.0 L", rating: 4.4, reviewCount: 9210,
      year: 2024, fuelTypes: ["Petrol", "Diesel", "Electric"], transmissions: ["Manual", "Automatic", "DCT"],
      mileage: "17.4 km/l", engine: "1.5L Petrol / 1.5L Diesel", power: "115 bhp (petrol)",
      seating: 5, bodyType: "SUV", popular: true, tag: "Top Rated",
      pros: ["Premium interiors", "Large panoramic sunroof", "ADAS safety suite", "Powerful diesel option"],
      cons: ["Expensive top variants", "Stiff suspension", "Boot space reduced with sunroof"],
    },
    {
      slug: "i20", brand: "hyundai", name: "i20", fullName: "Hyundai i20",
      category: "HATCHBACK",
      image: I20,
      gallery: [I20],
      startingPrice: 722000, startingPriceDisplay: "₹7.22 L", rating: 4.2, reviewCount: 4380,
      year: 2024, fuelTypes: ["Petrol", "Diesel", "CNG"], transmissions: ["Manual", "IVT", "DCT"],
      mileage: "20.35 km/l", engine: "1.2L / 1.0L Turbo", power: "88 bhp / 120 bhp",
      seating: 5, bodyType: "Hatchback", popular: true,
      pros: ["Premium segment features", "Turbo petrol is punchy", "BOSE sound system available", "Large touchscreen"],
      cons: ["Pricy top variants", "Turbo engine has higher running cost", "No 6 airbags in base"],
    },
    {
      slug: "nexon", brand: "tata", name: "Nexon", fullName: "Tata Nexon",
      category: "SUV",
      image: NEXON,
      gallery: [NEXON],
      startingPrice: 799000, startingPriceDisplay: "₹7.99 L", rating: 4.3, reviewCount: 7540,
      year: 2024, fuelTypes: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "AMT"],
      mileage: "17.44 km/l", engine: "1.2L Turbo / 1.5L Diesel", power: "120 bhp / 115 bhp",
      seating: 5, bodyType: "SUV", popular: true, tag: "5-Star Safety",
      pros: ["5-star Global NCAP safety", "Punchy turbo engine", "Good ground clearance", "Feature-packed"],
      cons: ["Ride quality on bad roads", "Touchscreen can lag", "Average after-sales"],
    },
    {
      slug: "nexon-ev", brand: "tata", name: "Nexon EV", fullName: "Tata Nexon EV",
      category: "EV",
      image: NEXON_EV,
      gallery: [NEXON_EV],
      startingPrice: 1399000, startingPriceDisplay: "₹13.99 L", rating: 4.2, reviewCount: 3120,
      year: 2024, fuelTypes: ["Electric"], transmissions: ["Automatic"],
      mileage: "489 km range", engine: "40.5 kWh battery", power: "143 bhp",
      seating: 5, bodyType: "SUV", popular: true, tag: "India's #1 EV",
      pros: ["Best-selling EV in India", "Fast charging support", "Strong performance", "Low running cost"],
      cons: ["Real-world range is lower", "Charging infra still growing", "Premium pricing"],
    },
    {
      slug: "punch", brand: "tata", name: "Punch", fullName: "Tata Punch",
      category: "SUV",
      image: PUNCH,
      gallery: [PUNCH],
      startingPrice: 599000, startingPriceDisplay: "₹5.99 L", rating: 4.1, reviewCount: 5490,
      year: 2024, fuelTypes: ["Petrol", "CNG"], transmissions: ["Manual", "AMT"],
      mileage: "18.82 km/l", engine: "1.2L Revotron", power: "86 bhp",
      seating: 5, bodyType: "Micro SUV", popular: true,
      pros: ["5-star safety rating", "SUV stance at hatchback price", "Spacious for size", "Good ground clearance"],
      cons: ["No turbo option", "Small engine", "Rear legroom average"],
    },
    {
      slug: "xuv700", brand: "mahindra", name: "XUV700", fullName: "Mahindra XUV700",
      category: "SUV",
      image: XUV700,
      gallery: [XUV700],
      startingPrice: 1399900, startingPriceDisplay: "₹13.99 L", rating: 4.5, reviewCount: 4820,
      year: 2024, fuelTypes: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"],
      mileage: "15.14 km/l", engine: "2.0L Turbo / 2.2L mHawk Diesel", power: "200 bhp / 185 bhp",
      seating: 7, bodyType: "SUV", popular: true, tag: "Best Value",
      pros: ["Segment-best features", "Powerful diesel engine", "ADAS + ADRENOX tech", "7-seater option"],
      cons: ["Long waiting period", "Ride comfort in 3rd row", "Infotainment bugs reported"],
    },
    {
      slug: "thar", brand: "mahindra", name: "Thar", fullName: "Mahindra Thar",
      category: "SUV",
      image: THAR,
      gallery: [THAR],
      startingPrice: 1149000, startingPriceDisplay: "₹11.49 L", rating: 4.4, reviewCount: 6210,
      year: 2024, fuelTypes: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"],
      mileage: "15.2 km/l", engine: "2.0L / 2.2L", power: "150 bhp / 130 bhp",
      seating: 4, bodyType: "Off-road SUV", popular: true, tag: "Icon",
      pros: ["Iconic design", "Brilliant off-road capability", "Strong community", "Excellent resale"],
      cons: ["Only 4 seats (base)", "Not practical for daily city commute", "Cramped interiors"],
    },
    {
      slug: "city", brand: "honda", name: "City", fullName: "Honda City",
      category: "SEDAN",
      image: SEDAN,
      gallery: [SEDAN],
      startingPrice: 1149900, startingPriceDisplay: "₹11.49 L", rating: 4.3, reviewCount: 5640,
      year: 2024, fuelTypes: ["Petrol", "Hybrid"], transmissions: ["Manual", "CVT"],
      mileage: "24.1 km/l", engine: "1.5L i-VTEC", power: "121 bhp",
      seating: 5, bodyType: "Sedan", popular: true,
      pros: ["Premium interior", "Powerful 1.5L engine", "Hybrid variant very efficient", "Comfortable ride"],
      cons: ["Expensive maintenance", "No ADAS in base", "Sunroof missing in some variants"],
    },
    {
      slug: "fortuner", brand: "toyota", name: "Fortuner", fullName: "Toyota Fortuner",
      category: "SUV",
      image: FORTUNER,
      gallery: [FORTUNER],
      startingPrice: 3399000, startingPriceDisplay: "₹33.99 L", rating: 4.5, reviewCount: 3940,
      year: 2024, fuelTypes: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic"],
      mileage: "14.24 km/l", engine: "2.7L Petrol / 2.8L Diesel", power: "166 bhp / 204 bhp",
      seating: 7, bodyType: "SUV", popular: true, tag: "Premium",
      pros: ["Bulletproof reliability", "Strong diesel engine", "Legendary off-road ability", "High resale value"],
      cons: ["Very expensive", "Fuel thirsty in city", "Basic infotainment vs rivals"],
    },
    {
      slug: "hyryder", brand: "toyota", name: "Urban Cruiser Hyryder", fullName: "Toyota Urban Cruiser Hyryder",
      category: "SUV",
      image: HYRYDER,
      gallery: [HYRYDER],
      startingPrice: 1099000, startingPriceDisplay: "₹10.99 L", rating: 4.3, reviewCount: 1820,
      year: 2024, fuelTypes: ["Petrol", "Hybrid"], transmissions: ["Manual", "Automatic"],
      mileage: "27.97 km/l", engine: "1.5L TNGA / 1.5L Hybrid", power: "103 bhp / 116 bhp",
      seating: 5, bodyType: "SUV", popular: false,
      pros: ["Best mileage in segment (hybrid)", "Robust Toyota quality", "All-wheel drive option", "Comfortable ride"],
      cons: ["Expensive hybrid variant", "Plain design", "No diesel"],
    },
    {
      slug: "seltos", brand: "kia", name: "Seltos", fullName: "Kia Seltos",
      category: "SUV",
      image: KIA,
      gallery: [KIA],
      startingPrice: 1079900, startingPriceDisplay: "₹10.79 L", rating: 4.4, reviewCount: 6720,
      year: 2024, fuelTypes: ["Petrol", "Diesel"], transmissions: ["Manual", "Automatic", "DCT"],
      mileage: "16.5 km/l", engine: "1.5L / 1.5L Turbo / 1.5L Diesel", power: "115 bhp / 160 bhp / 116 bhp",
      seating: 5, bodyType: "SUV", popular: true, tag: "Top Rated",
      pros: ["Best-in-class tech", "Powerful turbo engine", "Panoramic sunroof", "Level 2 ADAS"],
      cons: ["Some variant gaps removed", "Fuel average could be better", "Expensive top variant"],
    },
    {
      slug: "sonet", brand: "kia", name: "Sonet", fullName: "Kia Sonet",
      category: "SUV",
      image: SONET,
      gallery: [SONET],
      startingPrice: 799900, startingPriceDisplay: "₹7.99 L", rating: 4.2, reviewCount: 4110,
      year: 2024, fuelTypes: ["Petrol", "Diesel", "CNG"], transmissions: ["Manual", "AMT", "DCT", "Torque Converter"],
      mileage: "18.2 km/l", engine: "1.2L / 1.0L Turbo / 1.5L Diesel", power: "83 bhp / 120 bhp / 100 bhp",
      seating: 5, bodyType: "SUV", popular: false,
      pros: ["Feature-rich interiors", "Multiple powertrain options", "Premium Bose audio", "Ventilated seats"],
      cons: ["Cramped rear", "No 6 airbags in base", "Less boot space"],
    },
    {
      slug: "hector", brand: "mg", name: "Hector", fullName: "MG Hector",
      category: "SUV",
      image: HECTOR,
      gallery: [HECTOR],
      startingPrice: 1399000, startingPriceDisplay: "₹13.99 L", rating: 4.1, reviewCount: 3280,
      year: 2024, fuelTypes: ["Petrol", "Diesel", "Hybrid"], transmissions: ["Manual", "Automatic"],
      mileage: "14.19 km/l", engine: "1.5L Turbo / 2.0L Diesel", power: "143 bhp / 170 bhp",
      seating: 5, bodyType: "SUV", popular: false,
      pros: ["Giant 14-inch touchscreen", "Internet-connected car", "Spacious cabin", "Panoramic sunroof"],
      cons: ["After-sales concerns", "Fuel efficiency average", "Software glitches reported"],
    },
  ];

  const modelMap: Record<string, string> = {};
  for (const m of modelsData) {
    const { brand: brandSlug, ...rest } = m;
    const model = await prisma.newCarModel.upsert({
      where: { brandId_slug: { brandId: brandMap[brandSlug], slug: m.slug } },
      update: { ...rest, brandId: brandMap[brandSlug] },
      create: { ...rest, brandId: brandMap[brandSlug] },
    });
    modelMap[m.slug] = model.id;
    console.log(`  ✓ Model: ${model.fullName}`);
  }

  // Variants
  const variantsData = [
    // Brezza
    { modelSlug: "brezza", name: "LXi", fuel: "Petrol", transmission: "Manual", exShowroom: 799000, exShowroomDisplay: "₹7.99 L", order: 1 },
    { modelSlug: "brezza", name: "VXi", fuel: "Petrol", transmission: "Manual", exShowroom: 919000, exShowroomDisplay: "₹9.19 L", order: 2 },
    { modelSlug: "brezza", name: "ZXi", fuel: "Petrol", transmission: "Manual", exShowroom: 1069000, exShowroomDisplay: "₹10.69 L", order: 3 },
    { modelSlug: "brezza", name: "ZXi+", fuel: "Petrol", transmission: "Manual", exShowroom: 1219000, exShowroomDisplay: "₹12.19 L", order: 4 },
    { modelSlug: "brezza", name: "ZXi+ AT", fuel: "Petrol", transmission: "Automatic", exShowroom: 1349000, exShowroomDisplay: "₹13.49 L", order: 5 },
    // Creta
    { modelSlug: "creta", name: "E", fuel: "Petrol", transmission: "Manual", exShowroom: 1099900, exShowroomDisplay: "₹10.99 L", order: 1 },
    { modelSlug: "creta", name: "EX", fuel: "Petrol", transmission: "Manual", exShowroom: 1249900, exShowroomDisplay: "₹12.49 L", order: 2 },
    { modelSlug: "creta", name: "S", fuel: "Petrol", transmission: "Manual", exShowroom: 1399900, exShowroomDisplay: "₹13.99 L", order: 3 },
    { modelSlug: "creta", name: "SX", fuel: "Diesel", transmission: "Manual", exShowroom: 1699900, exShowroomDisplay: "₹16.99 L", order: 4 },
    { modelSlug: "creta", name: "SX(O) DCT", fuel: "Petrol", transmission: "DCT", exShowroom: 1949900, exShowroomDisplay: "₹19.49 L", order: 5 },
    // Nexon
    { modelSlug: "nexon", name: "Smart", fuel: "Petrol", transmission: "Manual", exShowroom: 799000, exShowroomDisplay: "₹7.99 L", order: 1 },
    { modelSlug: "nexon", name: "Smart+", fuel: "Petrol", transmission: "Manual", exShowroom: 949000, exShowroomDisplay: "₹9.49 L", order: 2 },
    { modelSlug: "nexon", name: "Pure", fuel: "Diesel", transmission: "Manual", exShowroom: 1099000, exShowroomDisplay: "₹10.99 L", order: 3 },
    { modelSlug: "nexon", name: "Creative", fuel: "Diesel", transmission: "AMT", exShowroom: 1299000, exShowroomDisplay: "₹12.99 L", order: 4 },
    { modelSlug: "nexon", name: "Fearless", fuel: "Petrol", transmission: "Automatic", exShowroom: 1399000, exShowroomDisplay: "₹13.99 L", order: 5 },
    // Seltos
    { modelSlug: "seltos", name: "EX", fuel: "Petrol", transmission: "Manual", exShowroom: 1079900, exShowroomDisplay: "₹10.79 L", order: 1 },
    { modelSlug: "seltos", name: "HTX", fuel: "Petrol", transmission: "Manual", exShowroom: 1329900, exShowroomDisplay: "₹13.29 L", order: 2 },
    { modelSlug: "seltos", name: "GTX", fuel: "Turbo Petrol", transmission: "DCT", exShowroom: 1679900, exShowroomDisplay: "₹16.79 L", order: 3 },
    { modelSlug: "seltos", name: "GTX+", fuel: "Diesel", transmission: "Automatic", exShowroom: 2049900, exShowroomDisplay: "₹20.49 L", order: 4 },
    // Swift
    { modelSlug: "swift", name: "Sigma", fuel: "Petrol", transmission: "Manual", exShowroom: 659000, exShowroomDisplay: "₹6.59 L", order: 1 },
    { modelSlug: "swift", name: "Delta", fuel: "Petrol", transmission: "Manual", exShowroom: 729000, exShowroomDisplay: "₹7.29 L", order: 2 },
    { modelSlug: "swift", name: "Zeta", fuel: "Petrol", transmission: "Manual", exShowroom: 839000, exShowroomDisplay: "₹8.39 L", order: 3 },
    { modelSlug: "swift", name: "Alpha", fuel: "Petrol", transmission: "Manual", exShowroom: 919000, exShowroomDisplay: "₹9.19 L", order: 4 },
    { modelSlug: "swift", name: "Alpha AMT", fuel: "Petrol", transmission: "AMT", exShowroom: 979000, exShowroomDisplay: "₹9.79 L", order: 5 },
  ];

  // Clear existing variants to avoid duplicates on re-seed
  await prisma.newCarVariant.deleteMany({});
  for (const v of variantsData) {
    const { modelSlug, ...rest } = v;
    await prisma.newCarVariant.create({
      data: { modelId: modelMap[modelSlug], ...rest },
    });
  }
  console.log(`  ✓ ${variantsData.length} variants seeded`);

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
