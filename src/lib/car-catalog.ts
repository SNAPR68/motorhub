/**
 * Autovinci — Static Car Catalog
 * Brands, models, variants, specs — mock data (real data replaces this later)
 */

export interface Brand {
  slug: string;
  name: string;
  logo: string; // initials fallback
  color: string;
  popular: boolean;
}

export interface CarModel {
  slug: string;
  brand: string; // brand slug
  name: string; // e.g. "Brezza"
  fullName: string; // e.g. "Maruti Suzuki Brezza"
  category: "suv" | "sedan" | "hatchback" | "ev" | "luxury" | "mpv";
  image: string;
  gallery: string[];
  startingPrice: number; // ex-showroom, lowest variant
  startingPriceDisplay: string;
  emiFrom: number; // approx monthly EMI
  rating: number; // out of 5
  reviewCount: number;
  year: number; // current model year
  fuelTypes: string[];
  transmissions: string[];
  mileage: string; // ARAI best
  engine: string;
  power: string;
  seating: number;
  bodyType: string;
  popular: boolean;
  tag?: string; // "Best Seller", "New Launch", "Award Winner"
  pros: string[];
  cons: string[];
}

export interface CarVariant {
  modelSlug: string;
  name: string; // e.g. "LXi", "VXi", "ZXi+"
  fuel: string;
  transmission: string;
  exShowroom: number;
  exShowroomDisplay: string;
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────

export const BRANDS: Brand[] = [
  { slug: "maruti", name: "Maruti Suzuki", logo: "MS", color: "#1152d4", popular: true },
  { slug: "hyundai", name: "Hyundai", logo: "H", color: "#0f4fc4", popular: true },
  { slug: "tata", name: "Tata Motors", logo: "T", color: "#1565c0", popular: true },
  { slug: "mahindra", name: "Mahindra", logo: "M", color: "#137fec", popular: true },
  { slug: "honda", name: "Honda", logo: "H", color: "#c00", popular: true },
  { slug: "toyota", name: "Toyota", logo: "T", color: "#eb0a1e", popular: true },
  { slug: "kia", name: "Kia", logo: "K", color: "#05141f", popular: true },
  { slug: "mg", name: "MG Motor", logo: "MG", color: "#d4001e", popular: true },
  { slug: "renault", name: "Renault", logo: "R", color: "#f9d000", popular: false },
  { slug: "volkswagen", name: "Volkswagen", logo: "VW", color: "#001e50", popular: false },
  { slug: "skoda", name: "Skoda", logo: "S", color: "#1d6127", popular: false },
  { slug: "jeep", name: "Jeep", logo: "J", color: "#1c1c1c", popular: false },
];

// ─── MODELS ───────────────────────────────────────────────────────────────────

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const WM = (file: string, w = 960) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${file}/${w}px-${file.split("/").pop()}`;

export const CAR_MODELS: CarModel[] = [
  // ── MARUTI ──
  {
    slug: "brezza",
    brand: "maruti",
    name: "Brezza",
    fullName: "Maruti Suzuki Brezza",
    category: "suv",
    image: WM("a/ad/2022_Maruti_Suzuki_Vitara_Brezza_1.5_ZXi%2B_%28India%29_front_view.png"),
    gallery: [
      WM("a/ad/2022_Maruti_Suzuki_Vitara_Brezza_1.5_ZXi%2B_%28India%29_front_view.png"),
      U("1494976388531-d1058494cdd8"),
      U("1503376780353-7e6692767b70"),
    ],
    startingPrice: 799000,
    startingPriceDisplay: "₹7.99 L",
    emiFrom: 11200,
    rating: 4.2,
    reviewCount: 3840,
    year: 2024,
    fuelTypes: ["Petrol"],
    transmissions: ["Manual", "Automatic"],
    mileage: "19.8 km/l",
    engine: "1.5L K15C",
    power: "103 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: true,
    tag: "Best Seller",
    pros: ["Best-in-class mileage", "Spacious cabin", "Advanced safety features", "Strong resale value"],
    cons: ["No diesel option", "No six-speed manual", "Rear AC vents missing in base"],
  },
  {
    slug: "swift",
    brand: "maruti",
    name: "Swift",
    fullName: "Maruti Suzuki Swift",
    category: "hatchback",
    image: WM("e/ef/2018_Maruti_Suzuki_Swift_%28India%29_front_8.6.18.jpg"),
    gallery: [
      WM("e/ef/2018_Maruti_Suzuki_Swift_%28India%29_front_8.6.18.jpg"),
      U("1494976388531-d1058494cdd8"),
    ],
    startingPrice: 659000,
    startingPriceDisplay: "₹6.59 L",
    emiFrom: 9200,
    rating: 4.3,
    reviewCount: 6120,
    year: 2024,
    fuelTypes: ["Petrol", "CNG"],
    transmissions: ["Manual", "AMT"],
    mileage: "24.8 km/l",
    engine: "1.2L Z12E",
    power: "81 bhp",
    seating: 5,
    bodyType: "Hatchback",
    popular: true,
    tag: "Award Winner",
    pros: ["Excellent fuel economy", "Fun to drive", "Affordable service cost", "Peppy engine"],
    cons: ["Small boot space", "Rear seat is cramped", "No automatic gearbox option in CNG"],
  },
  {
    slug: "ertiga",
    brand: "maruti",
    name: "Ertiga",
    fullName: "Maruti Suzuki Ertiga",
    category: "mpv",
    image: U("1558618666-fcd25c85cd64"),
    gallery: [U("1558618666-fcd25c85cd64")],
    startingPrice: 886000,
    startingPriceDisplay: "₹8.86 L",
    emiFrom: 12400,
    rating: 4.1,
    reviewCount: 2780,
    year: 2024,
    fuelTypes: ["Petrol", "CNG"],
    transmissions: ["Manual", "Automatic"],
    mileage: "20.3 km/l",
    engine: "1.5L K15C",
    power: "103 bhp",
    seating: 7,
    bodyType: "MPV",
    popular: false,
    pros: ["7-seater at great price", "Comfortable ride", "Good mileage", "Easy to drive"],
    cons: ["Third-row legroom is limited", "No diesel option", "Basic infotainment in base"],
  },

  // ── HYUNDAI ──
  {
    slug: "creta",
    brand: "hyundai",
    name: "Creta",
    fullName: "Hyundai Creta",
    category: "suv",
    image: WM("3/34/Hyundai_Creta_India.jpg"),
    gallery: [
      WM("3/34/Hyundai_Creta_India.jpg"),
      U("1494976388531-d1058494cdd8"),
      U("1503376780353-7e6692767b70"),
    ],
    startingPrice: 1099900,
    startingPriceDisplay: "₹11.0 L",
    emiFrom: 15400,
    rating: 4.4,
    reviewCount: 9210,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel", "Electric"],
    transmissions: ["Manual", "Automatic", "DCT"],
    mileage: "17.4 km/l",
    engine: "1.5L Petrol / 1.5L Diesel",
    power: "115 bhp (petrol)",
    seating: 5,
    bodyType: "SUV",
    popular: true,
    tag: "Top Rated",
    pros: ["Premium interiors", "Large panoramic sunroof", "ADAS safety suite", "Powerful diesel option"],
    cons: ["Expensive top variants", "Stiff suspension", "Boot space reduced with sunroof"],
  },
  {
    slug: "i20",
    brand: "hyundai",
    name: "i20",
    fullName: "Hyundai i20",
    category: "hatchback",
    image: U("1503376780353-7e6692767b70"),
    gallery: [U("1503376780353-7e6692767b70")],
    startingPrice: 722000,
    startingPriceDisplay: "₹7.22 L",
    emiFrom: 10100,
    rating: 4.2,
    reviewCount: 4380,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel", "CNG"],
    transmissions: ["Manual", "IVT", "DCT"],
    mileage: "20.35 km/l",
    engine: "1.2L / 1.0L Turbo",
    power: "88 bhp / 120 bhp",
    seating: 5,
    bodyType: "Hatchback",
    popular: true,
    pros: ["Premium segment features", "Turbo petrol is punchy", "BOSE sound system available", "Large touchscreen"],
    cons: ["Pricy top variants", "Turbo engine has higher running cost", "No 6 airbags in base"],
  },

  // ── TATA ──
  {
    slug: "nexon",
    brand: "tata",
    name: "Nexon",
    fullName: "Tata Nexon",
    category: "suv",
    image: WM("8/8d/Tata_Nexon_2023_Rear_View_2.jpg"),
    gallery: [WM("8/8d/Tata_Nexon_2023_Rear_View_2.jpg"), U("1494976388531-d1058494cdd8")],
    startingPrice: 799000,
    startingPriceDisplay: "₹7.99 L",
    emiFrom: 11200,
    rating: 4.3,
    reviewCount: 7540,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel"],
    transmissions: ["Manual", "Automatic", "AMT"],
    mileage: "17.44 km/l",
    engine: "1.2L Turbo / 1.5L Diesel",
    power: "120 bhp / 115 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: true,
    tag: "5-Star Safety",
    pros: ["5-star Global NCAP safety", "Punchy turbo engine", "Good ground clearance", "Feature-packed"],
    cons: ["Ride quality on bad roads", "Touchscreen can lag", "Average after-sales"],
  },
  {
    slug: "nexon-ev",
    brand: "tata",
    name: "Nexon EV",
    fullName: "Tata Nexon EV",
    category: "ev",
    image: WM("e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png"),
    gallery: [WM("e/ea/2020_Tata_Nexon_EV_%28India%29_front_view.png")],
    startingPrice: 1399000,
    startingPriceDisplay: "₹13.99 L",
    emiFrom: 19600,
    rating: 4.2,
    reviewCount: 3120,
    year: 2024,
    fuelTypes: ["Electric"],
    transmissions: ["Automatic"],
    mileage: "489 km range",
    engine: "40.5 kWh battery",
    power: "143 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: true,
    tag: "India's #1 EV",
    pros: ["Best-selling EV in India", "Fast charging support", "Strong performance", "Low running cost"],
    cons: ["Real-world range is lower", "Charging infra still growing", "Premium pricing"],
  },
  {
    slug: "punch",
    brand: "tata",
    name: "Punch",
    fullName: "Tata Punch",
    category: "suv",
    image: U("1558618666-fcd25c85cd64"),
    gallery: [U("1558618666-fcd25c85cd64")],
    startingPrice: 599000,
    startingPriceDisplay: "₹5.99 L",
    emiFrom: 8400,
    rating: 4.1,
    reviewCount: 5490,
    year: 2024,
    fuelTypes: ["Petrol", "CNG"],
    transmissions: ["Manual", "AMT"],
    mileage: "18.82 km/l",
    engine: "1.2L Revotron",
    power: "86 bhp",
    seating: 5,
    bodyType: "Micro SUV",
    popular: true,
    pros: ["5-star safety rating", "SUV stance at hatchback price", "Spacious for size", "Good ground clearance"],
    cons: ["No turbo option", "Small engine", "Rear legroom average"],
  },

  // ── MAHINDRA ──
  {
    slug: "xuv700",
    brand: "mahindra",
    name: "XUV700",
    fullName: "Mahindra XUV700",
    category: "suv",
    image: WM("b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png"),
    gallery: [WM("b/ba/2021_Mahindra_XUV700_2.2_AX7_%28India%29_front_view.png")],
    startingPrice: 1399900,
    startingPriceDisplay: "₹13.99 L",
    emiFrom: 19600,
    rating: 4.5,
    reviewCount: 4820,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel"],
    transmissions: ["Manual", "Automatic"],
    mileage: "15.14 km/l",
    engine: "2.0L Turbo / 2.2L mHawk Diesel",
    power: "200 bhp / 185 bhp",
    seating: 7,
    bodyType: "SUV",
    popular: true,
    tag: "Best Value",
    pros: ["Segment-best features", "Powerful diesel engine", "ADAS + ADRENOX tech", "7-seater option"],
    cons: ["Long waiting period", "Ride comfort in 3rd row", "Infotainment bugs reported"],
  },
  {
    slug: "thar",
    brand: "mahindra",
    name: "Thar",
    fullName: "Mahindra Thar",
    category: "suv",
    image: U("1533473359307-62f2c0f2e8c4"),
    gallery: [U("1533473359307-62f2c0f2e8c4")],
    startingPrice: 1149000,
    startingPriceDisplay: "₹11.49 L",
    emiFrom: 16100,
    rating: 4.4,
    reviewCount: 6210,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel"],
    transmissions: ["Manual", "Automatic"],
    mileage: "15.2 km/l",
    engine: "2.0L / 2.2L",
    power: "150 bhp / 130 bhp",
    seating: 4,
    bodyType: "Off-road SUV",
    popular: true,
    tag: "Icon",
    pros: ["Iconic design", "Brilliant off-road capability", "Strong community", "Excellent resale"],
    cons: ["Only 4 seats (base)", "Not practical for daily city commute", "Cramped interiors"],
  },

  // ── HONDA ──
  {
    slug: "city",
    brand: "honda",
    name: "City",
    fullName: "Honda City",
    category: "sedan",
    image: WM("d/db/0_Honda_City_%286th_generation%29.jpg"),
    gallery: [WM("d/db/0_Honda_City_%286th_generation%29.jpg")],
    startingPrice: 1149900,
    startingPriceDisplay: "₹11.49 L",
    emiFrom: 16100,
    rating: 4.3,
    reviewCount: 5640,
    year: 2024,
    fuelTypes: ["Petrol", "Hybrid"],
    transmissions: ["Manual", "CVT"],
    mileage: "24.1 km/l",
    engine: "1.5L i-VTEC",
    power: "121 bhp",
    seating: 5,
    bodyType: "Sedan",
    popular: true,
    pros: ["Premium interior", "Powerful 1.5L engine", "Hybrid variant very efficient", "Comfortable ride"],
    cons: ["Expensive maintenance", "No ADAS in base", "Sunroof missing in some variants"],
  },

  // ── TOYOTA ──
  {
    slug: "fortuner",
    brand: "toyota",
    name: "Fortuner",
    fullName: "Toyota Fortuner",
    category: "suv",
    image: WM("d/db/Toyota_Fortuners.jpg"),
    gallery: [WM("d/db/Toyota_Fortuners.jpg")],
    startingPrice: 3399000,
    startingPriceDisplay: "₹33.99 L",
    emiFrom: 47600,
    rating: 4.5,
    reviewCount: 3940,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel"],
    transmissions: ["Manual", "Automatic"],
    mileage: "14.24 km/l",
    engine: "2.7L Petrol / 2.8L Diesel",
    power: "166 bhp / 204 bhp",
    seating: 7,
    bodyType: "SUV",
    popular: true,
    tag: "Premium",
    pros: ["Bulletproof reliability", "Strong diesel engine", "Legendary off-road ability", "High resale value"],
    cons: ["Very expensive", "Fuel thirsty in city", "Basic infotainment vs rivals"],
  },
  {
    slug: "hyryder",
    brand: "toyota",
    name: "Urban Cruiser Hyryder",
    fullName: "Toyota Urban Cruiser Hyryder",
    category: "suv",
    image: U("1502877338-d1b7a9e2b7c4"),
    gallery: [U("1502877338-d1b7a9e2b7c4")],
    startingPrice: 1099000,
    startingPriceDisplay: "₹10.99 L",
    emiFrom: 15400,
    rating: 4.3,
    reviewCount: 1820,
    year: 2024,
    fuelTypes: ["Petrol", "Hybrid"],
    transmissions: ["Manual", "Automatic"],
    mileage: "27.97 km/l",
    engine: "1.5L TNGA / 1.5L Hybrid",
    power: "103 bhp / 116 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: false,
    pros: ["Best mileage in segment (hybrid)", "Robust Toyota quality", "All-wheel drive option", "Comfortable ride"],
    cons: ["Expensive hybrid variant", "Plain design", "No diesel"],
  },

  // ── KIA ──
  {
    slug: "seltos",
    brand: "kia",
    name: "Seltos",
    fullName: "Kia Seltos",
    category: "suv",
    image: WM("0/0e/Kia_Seltos_2024_2.jpg"),
    gallery: [WM("0/0e/Kia_Seltos_2024_2.jpg")],
    startingPrice: 1079900,
    startingPriceDisplay: "₹10.79 L",
    emiFrom: 15100,
    rating: 4.4,
    reviewCount: 6720,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel"],
    transmissions: ["Manual", "Automatic", "DCT"],
    mileage: "16.5 km/l",
    engine: "1.5L / 1.5L Turbo / 1.5L Diesel",
    power: "115 bhp / 160 bhp / 116 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: true,
    tag: "Top Rated",
    pros: ["Best-in-class tech", "Powerful turbo engine", "Panoramic sunroof", "Level 2 ADAS"],
    cons: ["Some variant gaps removed", "Fuel average could be better", "Expensive top variant"],
  },
  {
    slug: "sonet",
    brand: "kia",
    name: "Sonet",
    fullName: "Kia Sonet",
    category: "suv",
    image: U("1494976388531-d1058494cdd8"),
    gallery: [U("1494976388531-d1058494cdd8")],
    startingPrice: 799900,
    startingPriceDisplay: "₹7.99 L",
    emiFrom: 11200,
    rating: 4.2,
    reviewCount: 4110,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel", "CNG"],
    transmissions: ["Manual", "AMT", "DCT", "Torque Converter"],
    mileage: "18.2 km/l",
    engine: "1.2L / 1.0L Turbo / 1.5L Diesel",
    power: "83 bhp / 120 bhp / 100 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: false,
    pros: ["Feature-rich interiors", "Multiple powertrain options", "Premium Bose audio", "Ventilated seats"],
    cons: ["Cramped rear", "No 6 airbags in base", "Less boot space"],
  },

  // ── MG ──
  {
    slug: "hector",
    brand: "mg",
    name: "Hector",
    fullName: "MG Hector",
    category: "suv",
    image: U("1533473359307-62f2c0f2e8c4"),
    gallery: [U("1533473359307-62f2c0f2e8c4")],
    startingPrice: 1399000,
    startingPriceDisplay: "₹13.99 L",
    emiFrom: 19600,
    rating: 4.1,
    reviewCount: 3280,
    year: 2024,
    fuelTypes: ["Petrol", "Diesel", "Hybrid"],
    transmissions: ["Manual", "Automatic"],
    mileage: "14.19 km/l",
    engine: "1.5L Turbo / 2.0L Diesel",
    power: "143 bhp / 170 bhp",
    seating: 5,
    bodyType: "SUV",
    popular: false,
    pros: ["Giant 14-inch touchscreen", "Internet-connected car", "Spacious cabin", "Panoramic sunroof"],
    cons: ["After-sales concerns", "Fuel efficiency average", "Software glitches reported"],
  },
];

// ─── VARIANTS (key models) ────────────────────────────────────────────────────

export const CAR_VARIANTS: CarVariant[] = [
  // Brezza
  { modelSlug: "brezza", name: "LXi", fuel: "Petrol", transmission: "Manual", exShowroom: 799000, exShowroomDisplay: "₹7.99 L" },
  { modelSlug: "brezza", name: "VXi", fuel: "Petrol", transmission: "Manual", exShowroom: 919000, exShowroomDisplay: "₹9.19 L" },
  { modelSlug: "brezza", name: "ZXi", fuel: "Petrol", transmission: "Manual", exShowroom: 1069000, exShowroomDisplay: "₹10.69 L" },
  { modelSlug: "brezza", name: "ZXi+", fuel: "Petrol", transmission: "Manual", exShowroom: 1219000, exShowroomDisplay: "₹12.19 L" },
  { modelSlug: "brezza", name: "ZXi+ AT", fuel: "Petrol", transmission: "Automatic", exShowroom: 1349000, exShowroomDisplay: "₹13.49 L" },
  // Creta
  { modelSlug: "creta", name: "E", fuel: "Petrol", transmission: "Manual", exShowroom: 1099900, exShowroomDisplay: "₹10.99 L" },
  { modelSlug: "creta", name: "EX", fuel: "Petrol", transmission: "Manual", exShowroom: 1249900, exShowroomDisplay: "₹12.49 L" },
  { modelSlug: "creta", name: "S", fuel: "Petrol", transmission: "Manual", exShowroom: 1399900, exShowroomDisplay: "₹13.99 L" },
  { modelSlug: "creta", name: "SX", fuel: "Diesel", transmission: "Manual", exShowroom: 1699900, exShowroomDisplay: "₹16.99 L" },
  { modelSlug: "creta", name: "SX(O) DCT", fuel: "Petrol", transmission: "DCT", exShowroom: 1949900, exShowroomDisplay: "₹19.49 L" },
  // Nexon
  { modelSlug: "nexon", name: "Smart", fuel: "Petrol", transmission: "Manual", exShowroom: 799000, exShowroomDisplay: "₹7.99 L" },
  { modelSlug: "nexon", name: "Smart+", fuel: "Petrol", transmission: "Manual", exShowroom: 949000, exShowroomDisplay: "₹9.49 L" },
  { modelSlug: "nexon", name: "Pure", fuel: "Diesel", transmission: "Manual", exShowroom: 1099000, exShowroomDisplay: "₹10.99 L" },
  { modelSlug: "nexon", name: "Creative", fuel: "Diesel", transmission: "AMT", exShowroom: 1299000, exShowroomDisplay: "₹12.99 L" },
  { modelSlug: "nexon", name: "Fearless", fuel: "Petrol", transmission: "Automatic", exShowroom: 1399000, exShowroomDisplay: "₹13.99 L" },
  // Seltos
  { modelSlug: "seltos", name: "EX", fuel: "Petrol", transmission: "Manual", exShowroom: 1079900, exShowroomDisplay: "₹10.79 L" },
  { modelSlug: "seltos", name: "HTX", fuel: "Petrol", transmission: "Manual", exShowroom: 1329900, exShowroomDisplay: "₹13.29 L" },
  { modelSlug: "seltos", name: "GTX", fuel: "Turbo Petrol", transmission: "DCT", exShowroom: 1679900, exShowroomDisplay: "₹16.79 L" },
  { modelSlug: "seltos", name: "GTX+", fuel: "Diesel", transmission: "Automatic", exShowroom: 2049900, exShowroomDisplay: "₹20.49 L" },
  // Swift
  { modelSlug: "swift", name: "Sigma", fuel: "Petrol", transmission: "Manual", exShowroom: 659000, exShowroomDisplay: "₹6.59 L" },
  { modelSlug: "swift", name: "Delta", fuel: "Petrol", transmission: "Manual", exShowroom: 729000, exShowroomDisplay: "₹7.29 L" },
  { modelSlug: "swift", name: "Zeta", fuel: "Petrol", transmission: "Manual", exShowroom: 839000, exShowroomDisplay: "₹8.39 L" },
  { modelSlug: "swift", name: "Alpha", fuel: "Petrol", transmission: "Manual", exShowroom: 919000, exShowroomDisplay: "₹9.19 L" },
  { modelSlug: "swift", name: "Alpha AMT", fuel: "Petrol", transmission: "AMT", exShowroom: 979000, exShowroomDisplay: "₹9.79 L" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getModelBySlug(brand: string, model: string): CarModel | undefined {
  return CAR_MODELS.find((m) => m.brand === brand && m.slug === model);
}

export function getVariantsByModel(modelSlug: string): CarVariant[] {
  return CAR_VARIANTS.filter((v) => v.modelSlug === modelSlug);
}

export function getModelsByBrand(brandSlug: string): CarModel[] {
  return CAR_MODELS.filter((m) => m.brand === brandSlug);
}

export function getPopularModels(limit = 8): CarModel[] {
  return CAR_MODELS.filter((m) => m.popular).slice(0, limit);
}

export function getModelsByCategory(category: CarModel["category"]): CarModel[] {
  return CAR_MODELS.filter((m) => m.category === category);
}

/** Rough EMI: 7-year, 9% p.a., 80% LTV */
export function calcEmi(price: number): number {
  const p = price * 0.8;
  const r = 0.09 / 12;
  const n = 84;
  return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export function formatEmi(price: number): string {
  const emi = calcEmi(price);
  return `₹${Math.round(emi / 1000)}k/mo`;
}

export function formatPrice(p: number): string {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  if (p >= 100000) return `₹${(p / 100000).toFixed(2)} L`;
  return `₹${p.toLocaleString("en-IN")}`;
}

export const CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
  "Chandigarh", "Surat", "Nagpur", "Kochi", "Coimbatore",
];

export const BODY_TYPES = [
  { label: "SUV", value: "suv", icon: "🚙" },
  { label: "Hatchback", value: "hatchback", icon: "🚗" },
  { label: "Sedan", value: "sedan", icon: "🚘" },
  { label: "Electric", value: "ev", icon: "⚡" },
  { label: "MPV", value: "mpv", icon: "🚐" },
  { label: "Luxury", value: "luxury", icon: "💎" },
];

export const BUDGET_SEGMENTS = [
  { label: "Under ₹5L", min: 0, max: 500000 },
  { label: "₹5L – 8L", min: 500000, max: 800000 },
  { label: "₹8L – 12L", min: 800000, max: 1200000 },
  { label: "₹12L – 20L", min: 1200000, max: 2000000 },
  { label: "₹20L – 40L", min: 2000000, max: 4000000 },
  { label: "Above ₹40L", min: 4000000, max: 999999999 },
];
