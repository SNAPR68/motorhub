/**
 * Autovinci — VehiclePassport Generator
 * Deterministic report from vehicle fields. No external API yet.
 * When Vahan API registration completes, replace generateFromVehicle()
 * with a real fetch — the PassportReport interface stays identical.
 */

export type FlagLevel = "green" | "amber" | "red";

export interface PassportFlag {
  level: FlagLevel;
  message: string;
}

export interface ChallanRecord {
  date: string;
  offence: string;
  amount: number;
  status: "PAID" | "PENDING";
}

export interface PassportReport {
  reportId: string;
  generatedAt: string;
  verificationLevel: "AUTOVINCI_COMPUTED" | "VAHAN_VERIFIED";

  ownership: {
    totalOwners: number;
    registrationState: string;
    registrationYear: number;
    rtoCode: string;
    hypothecation: boolean;
  };

  accidents: {
    totalClaims: number;
    majorAccident: boolean;
    claimYears: number[];
  };

  challans: {
    pending: number;
    totalAmount: number;
    records: ChallanRecord[];
  };

  odometer: {
    readingAtSale: number;
    verified: boolean;
    suspiciousFlag: boolean;
    avgKmPerYear: number;
    verdict: "NORMAL" | "LOW" | "HIGH" | "SUSPICIOUS";
  };

  rcStatus: {
    valid: boolean;
    insuranceActive: boolean;
    insuranceExpiry: string;
    fitnessValid: boolean;
    blacklisted: boolean;
  };

  floodFire: {
    floodDamage: boolean;
    fireDamage: boolean;
  };

  overallScore: number; // 0–100
  grade: "A" | "B" | "C" | "D";
  flags: PassportFlag[];
}

// ─── Seeded pseudo-random (deterministic per vehicleId) ──────────────────────

function seededRand(seed: string, index: number): number {
  let h = index;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) ^ seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 100) / 100;
}

const CHALLAN_OFFENCES = [
  "Signal jumping",
  "Over-speeding",
  "No helmet",
  "Mobile phone use while driving",
  "Wrong side driving",
  "No seatbelt",
];

const STATES = ["KA", "MH", "DL", "TN", "UP", "GJ", "RJ", "WB", "TS", "MP"];
const RTO_CODES = ["01", "02", "03", "04", "05", "07", "08", "11", "14", "18"];

// ─── Main generator ──────────────────────────────────────────────────────────

export function generatePassport({
  vehicleId,
  year,
  km,
  owner,
  name,
  fuel,
}: {
  vehicleId: string;
  year: number;
  km: number;
  owner: string; // "1st Owner", "2nd Owner", etc.
  name: string;
  fuel: string;
}): PassportReport {
  const r = (i: number) => seededRand(vehicleId, i);
  const currentYear = 2025;
  const ageYears = currentYear - year;

  // ── Ownership ──
  const ownerCount = owner.includes("1st") ? 1 : owner.includes("2nd") ? 2 : 3;
  const stateIdx = Math.floor(r(1) * STATES.length);
  const rtoIdx = Math.floor(r(2) * RTO_CODES.length);
  const hypothecation = r(3) > 0.6; // 40% chance car has active loan

  // ── Odometer ──
  const expectedKmPerYear = 15000;
  const avgKmPerYear = ageYears > 0 ? Math.round(km / ageYears) : km;
  const suspiciousFlag = avgKmPerYear < 3000 && km > 0;
  const odometerVerdict =
    suspiciousFlag
      ? "SUSPICIOUS"
      : avgKmPerYear < 8000
      ? "LOW"
      : avgKmPerYear > 25000
      ? "HIGH"
      : "NORMAL";

  // ── Accidents ──
  // Higher chance of accident for older, high-km cars
  const accidentChance = Math.min(0.8, ageYears * 0.08 + (km > 80000 ? 0.2 : 0));
  const majorAccident = r(4) < accidentChance * 0.3;
  const totalClaims = majorAccident ? Math.floor(r(5) * 2) + 1 : r(6) < accidentChance ? 1 : 0;
  const claimYears: number[] = [];
  for (let i = 0; i < totalClaims; i++) {
    claimYears.push(year + Math.floor(r(20 + i) * ageYears));
  }

  // ── Challans ──
  const challanCount = Math.floor(r(7) * 4); // 0–3 challans
  const challanRecords: ChallanRecord[] = [];
  let pendingChallans = 0;
  let totalChallanAmt = 0;
  for (let i = 0; i < challanCount; i++) {
    const paid = r(10 + i) > 0.3;
    const offenceIdx = Math.floor(r(14 + i) * CHALLAN_OFFENCES.length);
    const amount = [500, 1000, 1500, 2000, 5000][Math.floor(r(18 + i) * 5)];
    const challanYear = year + Math.floor(r(22 + i) * ageYears);
    challanRecords.push({
      date: `${challanYear}-${String(Math.floor(r(26 + i) * 12) + 1).padStart(2, "0")}-${String(Math.floor(r(30 + i) * 28) + 1).padStart(2, "0")}`,
      offence: CHALLAN_OFFENCES[offenceIdx],
      amount,
      status: paid ? "PAID" : "PENDING",
    });
    if (!paid) { pendingChallans++; totalChallanAmt += amount; }
  }

  // ── RC / Insurance ──
  const rcValid = ageYears < 15;
  const insuranceExpiredChance = r(8) < 0.15; // 15% chance expired
  const insExpMonth = String(Math.floor(r(9) * 12) + 1).padStart(2, "0");
  const insExpYear = insuranceExpiredChance ? currentYear - 1 : currentYear + Math.floor(r(11) * 2);
  const insuranceExpiry = `${insExpYear}-${insExpMonth}-${String(Math.floor(r(12) * 28) + 1).padStart(2, "0")}`;
  const insuranceActive = new Date(insuranceExpiry) > new Date();
  const blacklisted = r(13) < 0.02; // 2% chance

  // ── Flood/Fire ──
  const floodDamage = r(15) < 0.03;
  const fireDamage = r(16) < 0.01;

  // ── Score & flags ──
  const flags: PassportFlag[] = [];
  let score = 100;

  if (ownerCount === 1) flags.push({ level: "green", message: "Single owner — no ownership transfers" });
  if (ownerCount === 2) { flags.push({ level: "amber", message: "2 previous owners" }); score -= 5; }
  if (ownerCount >= 3) { flags.push({ level: "red", message: "3+ owners — verify transfer history" }); score -= 15; }

  if (!hypothecation) flags.push({ level: "green", message: "No active loan / hypothecation" });
  else { flags.push({ level: "amber", message: "Hypothecation active — loan not cleared" }); score -= 8; }

  if (odometerVerdict === "SUSPICIOUS") { flags.push({ level: "red", message: "Odometer reading suspicious — verify with OBD scan" }); score -= 25; }
  else if (odometerVerdict === "LOW") { flags.push({ level: "amber", message: `Low average km/year (${avgKmPerYear.toLocaleString("en-IN")} km/yr) — confirm with service records` }); score -= 5; }
  else flags.push({ level: "green", message: `Normal odometer reading (${avgKmPerYear.toLocaleString("en-IN")} km/yr avg)` });

  if (majorAccident) { flags.push({ level: "red", message: "Major insurance claim on record" }); score -= 20; }
  else if (totalClaims > 0) { flags.push({ level: "amber", message: `${totalClaims} minor insurance claim(s)` }); score -= 8; }
  else flags.push({ level: "green", message: "No insurance claims found" });

  if (pendingChallans > 0) { flags.push({ level: "red", message: `${pendingChallans} pending challan(s) — ₹${totalChallanAmt.toLocaleString("en-IN")} unpaid` }); score -= 10; }
  else if (challanCount > 0) flags.push({ level: "amber", message: `${challanCount} paid challan(s) on record` });
  else flags.push({ level: "green", message: "No traffic challans" });

  if (!insuranceActive) { flags.push({ level: "red", message: "Insurance expired — must be renewed before transfer" }); score -= 12; }
  else flags.push({ level: "green", message: `Insurance valid till ${insuranceExpiry}` });

  if (!rcValid) { flags.push({ level: "red", message: "RC validity expired — re-registration required" }); score -= 15; }
  else flags.push({ level: "green", message: "RC valid" });

  if (floodDamage) { flags.push({ level: "red", message: "Flood damage history detected" }); score -= 30; }
  if (fireDamage) { flags.push({ level: "red", message: "Fire damage history detected" }); score -= 30; }
  if (!floodDamage && !fireDamage) flags.push({ level: "green", message: "No flood or fire damage" });

  if (blacklisted) { flags.push({ level: "red", message: "Vehicle flagged in blacklist database" }); score -= 50; }

  score = Math.max(0, Math.min(100, score));
  const grade: PassportReport["grade"] = score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D";

  // ── Report ID (deterministic) ──
  const reportId = `AV-${vehicleId.slice(0, 6).toUpperCase()}-${year}`;

  return {
    reportId,
    generatedAt: new Date().toISOString(),
    verificationLevel: "AUTOVINCI_COMPUTED",
    ownership: {
      totalOwners: ownerCount,
      registrationState: STATES[stateIdx],
      registrationYear: year,
      rtoCode: `${STATES[stateIdx]}-${RTO_CODES[rtoIdx]}`,
      hypothecation,
    },
    accidents: { totalClaims, majorAccident, claimYears },
    challans: { pending: pendingChallans, totalAmount: totalChallanAmt, records: challanRecords },
    odometer: { readingAtSale: km, verified: !suspiciousFlag, suspiciousFlag, avgKmPerYear, verdict: odometerVerdict },
    rcStatus: { valid: rcValid, insuranceActive, insuranceExpiry, fitnessValid: rcValid, blacklisted },
    floodFire: { floodDamage, fireDamage },
    overallScore: score,
    grade,
    flags,
  };
}

export function passportGradeColor(grade: PassportReport["grade"]): string {
  return { A: "#10b981", B: "#3b82f6", C: "#f59e0b", D: "#ef4444" }[grade];
}

export function passportGradeLabel(grade: PassportReport["grade"]): string {
  return { A: "Excellent", B: "Good", C: "Fair", D: "Poor" }[grade];
}
