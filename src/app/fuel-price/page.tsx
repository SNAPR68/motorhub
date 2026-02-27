"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── Data ───────────────────────────────────────── */
interface CityPrices {
  city: string;
  petrol: number;
  diesel: number;
}

const CITIES: CityPrices[] = [
  { city: "Bengaluru", petrol: 102.86, diesel: 88.04 },
  { city: "Delhi", petrol: 94.72, diesel: 87.62 },
  { city: "Mumbai", petrol: 103.44, diesel: 89.97 },
  { city: "Chennai", petrol: 100.75, diesel: 92.34 },
  { city: "Kolkata", petrol: 104.95, diesel: 91.76 },
  { city: "Hyderabad", petrol: 109.66, diesel: 97.82 },
];

const CNG_PRICE = 78.5;

/* 7-day trend (petrol in Bengaluru) */
const TREND = [102.15, 102.30, 102.50, 102.45, 102.60, 102.65, 102.86];
const TREND_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function FuelPricePage() {
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [distance, setDistance] = useState("");
  const [mileage, setMileage] = useState("");
  const [fuelType, setFuelType] = useState<"Petrol" | "Diesel">("Petrol");

  const city = CITIES.find((c) => c.city === selectedCity) ?? CITIES[0];

  /* ── Fuel cost calc ── */
  const estimatedCost = useMemo(() => {
    const d = parseFloat(distance);
    const m = parseFloat(mileage);
    if (!d || !m || m <= 0) return null;
    const price = fuelType === "Petrol" ? city.petrol : city.diesel;
    return Math.round((d / m) * price);
  }, [distance, mileage, fuelType, city]);

  /* ── Trend bar heights ── */
  const trendMin = Math.min(...TREND);
  const trendMax = Math.max(...TREND);
  const trendRange = trendMax - trendMin || 1;

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
        <h1 className="text-lg font-bold text-white">Fuel Prices</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* City selector */}
        <div className="flex items-center gap-2">
          <MaterialIcon name="location_on" className="text-[18px]" style={{ color: "#1152d4" }} />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="rounded-full px-4 py-2 text-sm text-white font-semibold outline-none appearance-none"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {CITIES.map((c) => (
              <option key={c.city} value={c.city} className="bg-gray-900 text-white">
                {c.city}
              </option>
            ))}
          </select>
          <span className="text-slate-400 text-xs ml-auto">Updated today</span>
        </div>

        {/* Today's prices hero */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)",
          }}
        >
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-4">
            Today&apos;s Prices — {city.city}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {/* Petrol */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <MaterialIcon name="local_gas_station" className="text-[16px] text-amber-300" />
                <span className="text-blue-200 text-xs">Petrol</span>
              </div>
              <p className="text-white text-2xl font-bold">₹{city.petrol.toFixed(2)}</p>
              <p className="text-blue-200/70 text-[10px]">per litre</p>
              {/* Change */}
              <div className="flex items-center gap-0.5 mt-1.5">
                <MaterialIcon name="arrow_upward" className="text-[12px] text-red-400" />
                <span className="text-red-400 text-[10px] font-semibold">₹0.21</span>
              </div>
            </div>
            {/* Diesel */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <MaterialIcon name="oil_barrel" className="text-[16px] text-emerald-300" />
                <span className="text-blue-200 text-xs">Diesel</span>
              </div>
              <p className="text-white text-2xl font-bold">₹{city.diesel.toFixed(2)}</p>
              <p className="text-blue-200/70 text-[10px]">per litre</p>
              <div className="flex items-center gap-0.5 mt-1.5">
                <MaterialIcon name="arrow_downward" className="text-[12px] text-emerald-400" />
                <span className="text-emerald-400 text-[10px] font-semibold">₹0.15</span>
              </div>
            </div>
            {/* CNG */}
            <div>
              <div className="flex items-center gap-1 mb-1">
                <MaterialIcon name="propane" className="text-[16px] text-cyan-300" />
                <span className="text-blue-200 text-xs">CNG</span>
              </div>
              <p className="text-white text-2xl font-bold">₹{CNG_PRICE.toFixed(2)}</p>
              <p className="text-blue-200/70 text-[10px]">per kg</p>
              <div className="flex items-center gap-0.5 mt-1.5">
                <MaterialIcon name="remove" className="text-[12px] text-slate-400" />
                <span className="text-slate-400 text-[10px] font-semibold">No change</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-day trend */}
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "#111827" }}>
          <h3 className="text-white font-semibold text-sm mb-1">7-Day Petrol Trend</h3>
          <p className="text-slate-400 text-xs mb-4">{city.city} — Petrol (₹/L)</p>
          <div className="flex items-end justify-between gap-2 h-28 px-1">
            {TREND.map((val, i) => {
              const pct = ((val - trendMin) / trendRange) * 100;
              const height = Math.max(pct, 10);
              const isLast = i === TREND.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400">{val.toFixed(1)}</span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${height}%`,
                      background: isLast
                        ? "linear-gradient(to top, #1152d4, #60a5fa)"
                        : "rgba(255,255,255,0.08)",
                      minHeight: "8px",
                    }}
                  />
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: isLast ? "#60a5fa" : "#64748b" }}
                  >
                    {TREND_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other cities */}
        <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "#111827" }}>
          <div className="px-5 py-3 border-b border-white/10">
            <h3 className="text-white font-semibold text-sm">Prices in Other Cities</h3>
          </div>
          {/* Table header */}
          <div className="grid grid-cols-3 px-5 py-2 border-b border-white/5">
            <span className="text-slate-500 text-[10px] font-semibold uppercase">City</span>
            <span className="text-slate-500 text-[10px] font-semibold uppercase text-center">Petrol</span>
            <span className="text-slate-500 text-[10px] font-semibold uppercase text-right">Diesel</span>
          </div>
          {CITIES.filter((c) => c.city !== selectedCity).map((c, i, arr) => (
            <div
              key={c.city}
              className="grid grid-cols-3 px-5 py-3"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
              }}
            >
              <span className="text-white text-sm font-medium">{c.city}</span>
              <span className="text-amber-300 text-sm font-semibold text-center">₹{c.petrol.toFixed(2)}</span>
              <span className="text-emerald-400 text-sm font-semibold text-right">₹{c.diesel.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Fuel cost calculator */}
        <div className="rounded-2xl p-5 border border-white/10" style={{ background: "#111827" }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(17,82,212,0.15)" }}
            >
              <MaterialIcon name="calculate" className="text-[20px]" style={{ color: "#1152d4" }} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Fuel Cost Calculator</h3>
              <p className="text-slate-400 text-[10px]">Estimate your trip fuel cost</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Distance */}
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold">Distance (km)</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 200"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            {/* Mileage */}
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold">Mileage (km/l)</label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            {/* Fuel type pills */}
            <div className="space-y-1">
              <label className="text-slate-400 text-xs font-semibold">Fuel Type</label>
              <div className="flex gap-2">
                {(["Petrol", "Diesel"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFuelType(f)}
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
            </div>

            {/* Result */}
            {estimatedCost !== null && (
              <div
                className="rounded-xl p-4 mt-2 flex items-center justify-between"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold">Estimated Cost</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {distance}km at {mileage}km/l ({fuelType})
                  </p>
                </div>
                <p className="text-emerald-400 text-2xl font-bold">
                  ₹{estimatedCost.toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
