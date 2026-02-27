/**
 * Autovinci — TrueCost Engine
 * 3-year total ownership cost estimates per model/category
 * Static data now; replace with AI/API later.
 */

export interface MaintenanceItem {
  label: string;
  cost: number; // per year estimate
  urgency: "routine" | "watch" | "critical";
}

export interface TrueCostData {
  insurance: number; // annual
  fuel: number; // annual @ 15,000 km/yr
  maintenance: number; // annual average
  depreciation: number; // annual (value lost)
  total3Year: number;
  perMonth: number;
  upcomingItems: MaintenanceItem[];
  knownIssues: string[];
  reliabilityScore: number; // 1–10
}

// ─── Per-km fuel cost (₹ per km) ────────────────────────────────────────────

const FUEL_COST_PER_KM: Record<string, number> = {
  petrol: 6.5,   // ~₹105/L, 16 km/L avg
  diesel: 5.2,   // ~₹91/L, 17.5 km/L avg
  cng: 2.8,      // ~₹90/kg, 32 km/kg avg
  electric: 0.9, // ~₹8/kWh, 9 km/kWh avg
  hybrid: 3.8,
};

// ─── Base insurance by price band ───────────────────────────────────────────

function estimateInsurance(price: number): number {
  if (price < 500000) return 18000;
  if (price < 800000) return 24000;
  if (price < 1200000) return 32000;
  if (price < 2000000) return 46000;
  return 68000;
}

// ─── Maintenance by category + age ─────────────────────────────────────────

function estimateMaintenance(category: string, ageYears: number): number {
  const base: Record<string, number> = {
    hatchback: 12000,
    sedan: 15000,
    suv: 22000,
    mpv: 18000,
    ev: 8000,
    luxury: 55000,
  };
  const b = base[category.toLowerCase()] ?? 16000;
  // Older cars cost more to maintain
  const ageFactor = ageYears > 5 ? 1.6 : ageYears > 3 ? 1.25 : 1.0;
  return Math.round(b * ageFactor);
}

// ─── Depreciation (value loss per year) ─────────────────────────────────────

function estimateDepreciation(price: number, ageYears: number): number {
  // Year 1–3: 12–15% per year; 4+: 8–10% per year
  const rate = ageYears < 3 ? 0.13 : 0.09;
  return Math.round(price * rate);
}

// ─── Model-specific upcoming items + known issues ───────────────────────────

interface ModelKnowledge {
  upcomingItems: MaintenanceItem[];
  knownIssues: string[];
  reliabilityScore: number;
}

const MODEL_KNOWLEDGE: Record<string, ModelKnowledge> = {
  brezza: {
    upcomingItems: [
      { label: "60K km service (spark plugs, air filter)", cost: 7500, urgency: "routine" },
      { label: "Brake fluid replacement", cost: 1800, urgency: "routine" },
    ],
    knownIssues: ["Mild NVH at highway speeds", "Infotainment lag in early 2022 units"],
    reliabilityScore: 8.5,
  },
  swift: {
    upcomingItems: [
      { label: "Timing chain inspection (60K+)", cost: 3500, urgency: "watch" },
      { label: "AMT clutch check (if automatic)", cost: 4200, urgency: "watch" },
    ],
    knownIssues: ["AMT variants: slight jerk at low speeds", "Rear seat comfort limited on long trips"],
    reliabilityScore: 8.8,
  },
  creta: {
    upcomingItems: [
      { label: "DCT gearbox service (40K km)", cost: 8500, urgency: "critical" },
      { label: "AC cabin filter replacement", cost: 1200, urgency: "routine" },
      { label: "Brake pad check", cost: 3500, urgency: "watch" },
    ],
    knownIssues: ["2019–21 DCT: known jerky behavior, avg repair ₹45,000", "Sunroof rattle on rough roads"],
    reliabilityScore: 7.2,
  },
  nexon: {
    upcomingItems: [
      { label: "Turbo intercooler check (diesel)", cost: 5000, urgency: "watch" },
      { label: "60K km full service", cost: 9000, urgency: "routine" },
    ],
    knownIssues: ["2018–20 diesel: DPF clogging issues", "Touchscreen occasional freeze"],
    reliabilityScore: 7.8,
  },
  "nexon-ev": {
    upcomingItems: [
      { label: "Battery health check", cost: 2000, urgency: "routine" },
      { label: "Brake fluid replacement", cost: 1500, urgency: "routine" },
    ],
    knownIssues: ["Range drops ~15% in AC-heavy use", "OTA updates required for full feature set"],
    reliabilityScore: 8.0,
  },
  xuv700: {
    upcomingItems: [
      { label: "6-cylinder diesel: 40K service", cost: 14000, urgency: "routine" },
      { label: "ADAS calibration check", cost: 3500, urgency: "watch" },
    ],
    knownIssues: ["Long waiting period affects after-sales parts availability", "ADAS sensor sensitivity in rain"],
    reliabilityScore: 8.2,
  },
  seltos: {
    upcomingItems: [
      { label: "DCT/IVT gearbox service", cost: 7500, urgency: "watch" },
      { label: "Panoramic sunroof seal check", cost: 2000, urgency: "routine" },
    ],
    knownIssues: ["Some units: steering vibration at 80–100 km/h", "Connected car app connectivity issues"],
    reliabilityScore: 8.0,
  },
  fortuner: {
    upcomingItems: [
      { label: "4WD transfer case oil change", cost: 4500, urgency: "routine" },
      { label: "80K km timing belt service", cost: 18000, urgency: "critical" },
      { label: "Diff oil change", cost: 3500, urgency: "routine" },
    ],
    knownIssues: ["High maintenance cost vs peers", "Fuel consumption 10–12 km/L city"],
    reliabilityScore: 8.6,
  },
};

// ─── Default fallback ────────────────────────────────────────────────────────

const DEFAULT_KNOWLEDGE: ModelKnowledge = {
  upcomingItems: [
    { label: "Regular service (every 10K km)", cost: 5000, urgency: "routine" },
    { label: "Tyre rotation & balancing", cost: 1500, urgency: "routine" },
  ],
  knownIssues: [],
  reliabilityScore: 7.5,
};

// ─── Main export ─────────────────────────────────────────────────────────────

export function computeTrueCost({
  price,
  fuel,
  category,
  modelSlug,
  year,
}: {
  price: number;
  fuel: string;
  category: string;
  modelSlug?: string;
  year: number;
}): TrueCostData {
  const currentYear = 2025;
  const ageYears = currentYear - year;

  const insurance = estimateInsurance(price);
  const fuelCostPerKm = FUEL_COST_PER_KM[fuel.toLowerCase()] ?? 6.0;
  const annualFuel = Math.round(fuelCostPerKm * 15000); // 15K km/yr
  const maintenance = estimateMaintenance(category, ageYears);
  const depreciation = estimateDepreciation(price, ageYears);

  const annual = insurance + annualFuel + maintenance + depreciation;
  const total3Year = annual * 3;
  const perMonth = Math.round(total3Year / 36);

  const knowledge: ModelKnowledge = (modelSlug && MODEL_KNOWLEDGE[modelSlug]) || DEFAULT_KNOWLEDGE;

  return {
    insurance,
    fuel: annualFuel,
    maintenance,
    depreciation,
    total3Year,
    perMonth,
    upcomingItems: knowledge.upcomingItems,
    knownIssues: knowledge.knownIssues,
    reliabilityScore: knowledge.reliabilityScore,
  };
}

export function formatCost(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Math.round(n / 1000)}K`;
}
