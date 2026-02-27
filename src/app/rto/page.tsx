"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── States & tax rates ─────────────────────────── */
interface StateInfo {
  name: string;
  code: string;
  taxRate: number; // % of ex-showroom
}

const STATES: StateInfo[] = [
  { name: "Karnataka", code: "KA", taxRate: 13 },
  { name: "Maharashtra", code: "MH", taxRate: 11 },
  { name: "Delhi", code: "DL", taxRate: 8 },
  { name: "Tamil Nadu", code: "TN", taxRate: 10 },
  { name: "Uttar Pradesh", code: "UP", taxRate: 10 },
  { name: "Gujarat", code: "GJ", taxRate: 12 },
  { name: "Rajasthan", code: "RJ", taxRate: 10 },
  { name: "West Bengal", code: "WB", taxRate: 10 },
  { name: "Telangana", code: "TS", taxRate: 14 },
  { name: "Kerala", code: "KL", taxRate: 21 },
];

const VEHICLE_TYPES = ["Car", "Two Wheeler", "Commercial"] as const;
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG"] as const;

const DOCS_NEEDED = [
  { icon: "badge", text: "ID Proof (Aadhaar / Passport / Voter ID)" },
  { icon: "home", text: "Address Proof (Utility Bill / Bank Statement)" },
  { icon: "receipt", text: "Invoice / Sale Deed of the vehicle" },
  { icon: "shield", text: "Insurance Certificate (valid policy)" },
  { icon: "local_shipping", text: "PUC Certificate (Pollution Under Control)" },
];

const TIPS = [
  "Book an appointment online to avoid long queues",
  "Keep 2 photocopies of all documents",
  "Carry original documents for verification",
  "Pay fees online via Parivahan portal for faster processing",
];

export default function RtoPage() {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [exShowroom, setExShowroom] = useState("");
  const [vehicleType, setVehicleType] = useState<(typeof VEHICLE_TYPES)[number]>("Car");
  const [fuelType, setFuelType] = useState<(typeof FUEL_TYPES)[number]>("Petrol");
  const [hasLoan, setHasLoan] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const state = STATES.find((s) => s.name === selectedState) ?? STATES[0];

  /* ── Calculation ── */
  const breakdown = useMemo(() => {
    const price = parseFloat(exShowroom);
    if (!price || price <= 0) return null;

    // Road tax
    let taxRate = state.taxRate;
    // Electric vehicles get 50% discount in most states
    if (fuelType === "Electric") taxRate = Math.round(taxRate * 0.5);
    const roadTax = Math.round((price * taxRate) / 100);

    // Registration fee
    let regFee = 600; // car
    if (vehicleType === "Two Wheeler") regFee = 300;
    if (vehicleType === "Commercial") regFee = 1500;

    // Hypothecation
    const hypothecation = hasLoan ? 1500 : 0;

    const total = roadTax + regFee + hypothecation;

    return { roadTax, taxRate, regFee, hypothecation, total };
  }, [exShowroom, state, vehicleType, fuelType, hasLoan]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <div className="min-h-dvh pb-36" style={{ background: "#080a0f", color: "#f1f5f9" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">RTO &amp; Registration</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* State selector */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setCalculated(false);
            }}
            className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none focus:ring-2 focus:ring-blue-500/40"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {STATES.map((s) => (
              <option key={s.code} value={s.name} className="bg-gray-900 text-white">
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>

        {/* Calculator form */}
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "#111827" }}>
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(17,82,212,0.15)" }}
            >
              <MaterialIcon name="calculate" className="text-[20px]" style={{ color: "#1152d4" }} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">RTO Cost Calculator</h3>
              <p className="text-slate-400 text-[10px]">
                Road tax rate in {state.name}: {state.taxRate}%
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Ex-showroom price */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold">Ex-Showroom Price (₹)</label>
              <input
                type="number"
                value={exShowroom}
                onChange={(e) => {
                  setExShowroom(e.target.value);
                  setCalculated(false);
                }}
                placeholder="e.g. 1200000"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Vehicle type pills */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold">Vehicle Type</label>
              <div className="flex flex-wrap gap-2">
                {VEHICLE_TYPES.map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      setVehicleType(v);
                      setCalculated(false);
                    }}
                    className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                    style={{
                      background: vehicleType === v ? "#1152d4" : "rgba(255,255,255,0.06)",
                      color: vehicleType === v ? "#fff" : "#94a3b8",
                      border: vehicleType === v ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel type pills */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold">Fuel Type</label>
              <div className="flex flex-wrap gap-2">
                {FUEL_TYPES.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFuelType(f);
                      setCalculated(false);
                    }}
                    className="rounded-full px-4 py-2 text-xs font-semibold transition-colors"
                    style={{
                      background: fuelType === f ? "#1152d4" : "rgba(255,255,255,0.06)",
                      color: fuelType === f ? "#fff" : "#94a3b8",
                      border: fuelType === f ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {fuelType === "Electric" && (
                <p className="text-emerald-400 text-[10px] flex items-center gap-1 mt-1">
                  <MaterialIcon name="eco" className="text-[12px]" />
                  50% road tax discount for EVs
                </p>
              )}
            </div>

            {/* Loan toggle */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">Vehicle on loan?</span>
              <button
                onClick={() => {
                  setHasLoan(!hasLoan);
                  setCalculated(false);
                }}
                className="relative w-12 h-7 rounded-full transition-colors"
                style={{ background: hasLoan ? "#1152d4" : "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute top-1 w-5 h-5 rounded-full bg-white transition-transform"
                  style={{ left: hasLoan ? "calc(100% - 24px)" : "4px" }}
                />
              </button>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalculate}
              className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="calculate" className="text-[18px]" />
              Calculate
            </button>
          </div>

          {/* Breakdown result */}
          {calculated && breakdown && (
            <div className="mt-5 space-y-3">
              <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <h4 className="text-white font-semibold text-sm">Cost Breakdown</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 text-sm">Road Tax ({breakdown.taxRate}%)</span>
                  <span className="text-white text-sm font-semibold">
                    ₹{breakdown.roadTax.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-white/5">
                  <span className="text-slate-400 text-sm">Registration Fee</span>
                  <span className="text-white text-sm font-semibold">
                    ₹{breakdown.regFee.toLocaleString("en-IN")}
                  </span>
                </div>
                {hasLoan && (
                  <div className="flex items-center justify-between py-2 border-t border-white/5">
                    <span className="text-slate-400 text-sm">Hypothecation Charge</span>
                    <span className="text-white text-sm font-semibold">
                      ₹{breakdown.hypothecation.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div
                  className="flex items-center justify-between py-3 px-4 rounded-xl mt-2"
                  style={{ background: "rgba(17,82,212,0.1)", border: "1px solid rgba(17,82,212,0.2)" }}
                >
                  <span className="text-white text-sm font-bold">Total RTO Cost</span>
                  <span className="text-xl font-bold" style={{ color: "#1152d4" }}>
                    ₹{breakdown.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {calculated && !breakdown && (
            <div className="mt-4 text-center">
              <p className="text-red-400 text-xs">Please enter a valid ex-showroom price</p>
            </div>
          )}
        </div>

        {/* Documents needed */}
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "#111827" }}>
          <h3 className="text-white font-semibold text-sm mb-4">Documents Required</h3>
          <div className="space-y-3">
            {DOCS_NEEDED.map((doc, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(17,82,212,0.1)" }}
                >
                  <MaterialIcon name={doc.icon} className="text-[16px]" style={{ color: "#1152d4" }} />
                </div>
                <p className="text-slate-300 text-sm pt-1">{doc.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Processing time */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(234,179,8,0.12)" }}
          >
            <MaterialIcon name="schedule" className="text-[24px] text-amber-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Processing Time</p>
            <p className="text-amber-200/70 text-xs mt-0.5">7 — 15 working days for new registration</p>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "#111827" }}>
          <h3 className="text-white font-semibold text-sm mb-3">Tips for Faster Processing</h3>
          <div className="space-y-2.5">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <MaterialIcon name="lightbulb" className="text-[14px] text-amber-400 mt-0.5" />
                <p className="text-slate-300 text-xs leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Related Services</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/rc-transfer"
              className="rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10 hover:border-white/20 transition-colors text-center"
              style={{ background: "#111827" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.12)" }}
              >
                <MaterialIcon name="swap_horiz" className="text-[22px] text-purple-400" />
              </div>
              <p className="text-white font-semibold text-sm">RC Transfer</p>
              <p className="text-slate-400 text-[10px]">Transfer ownership</p>
            </Link>
            <Link
              href="/car-insurance"
              className="rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10 hover:border-white/20 transition-colors text-center"
              style={{ background: "#111827" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.12)" }}
              >
                <MaterialIcon name="shield" className="text-[22px] text-emerald-400" />
              </div>
              <p className="text-white font-semibold text-sm">Insurance</p>
              <p className="text-slate-400 text-[10px]">Get car insured</p>
            </Link>
          </div>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
