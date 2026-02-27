"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Mileage / Fuel Efficiency Page ─── */

const REAL_WORLD_MILEAGE = [
  { label: "City", value: 15.2, icon: "location_city" },
  { label: "Highway", value: 19.8, icon: "road" },
  { label: "Combined", value: 17.1, icon: "swap_driving_apps_wheel" },
];

const COMPETITORS = [
  { name: "This Model", mileage: 20.15, highlight: true },
  { name: "Hyundai Creta", mileage: 17.4, highlight: false },
  { name: "Kia Seltos", mileage: 18.3, highlight: false },
  { name: "Tata Nexon", mileage: 17.8, highlight: false },
  { name: "Maruti Brezza", mileage: 20.15, highlight: false },
];

const PETROL_PRICE = 106; // per litre

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function MileagePage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

  const [monthlyKm, setMonthlyKm] = useState(1500);

  const monthlyCost = useMemo(() => {
    const litresNeeded = monthlyKm / 17.1; // combined mileage
    return Math.round(litresNeeded * PETROL_PRICE);
  }, [monthlyKm]);

  const maxMileage = Math.max(...COMPETITORS.map((c) => c.mileage));

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/${brand}/${model}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">{displayModel} Mileage</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── ARAI Mileage Card ─── */}
        <div
          className="rounded-2xl p-5 border border-emerald-500/20 text-center"
          style={{ background: "rgba(16,185,129,0.06)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
            ARAI Certified Mileage
          </p>
          <div className="flex items-end justify-center gap-1">
            <span className="text-5xl font-black text-white">20.15</span>
            <span className="text-lg font-semibold text-slate-400 mb-1">km/l</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Tested under standard ARAI conditions
          </p>
        </div>

        {/* ─── Real World Mileage ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Real-World Mileage
          </p>
          <div className="grid grid-cols-3 gap-3">
            {REAL_WORLD_MILEAGE.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 text-center border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <MaterialIcon name={item.icon} className="text-[20px] text-slate-500 mb-2" />
                <p className="text-lg font-black text-white">{item.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                  {item.label}
                </p>
                <p className="text-[9px] text-slate-600">km/l</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Comparison Chart ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Mileage Comparison
          </p>
          <div className="space-y-3">
            {COMPETITORS.map((car) => {
              const pct = (car.mileage / (maxMileage + 2)) * 100;
              return (
                <div key={car.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span
                      className={`text-xs font-semibold ${
                        car.highlight ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {car.highlight ? displayModel : car.name}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        car.highlight ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {car.mileage} km/l
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: car.highlight ? "#10b981" : "rgba(100,116,139,0.5)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Fuel Cost Calculator ─── */}
        <div
          className="rounded-2xl p-4 border border-amber-500/20"
          style={{ background: "rgba(245,158,11,0.05)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="calculate" className="text-[20px] text-amber-400" />
            <p className="text-sm font-bold text-white">Fuel Cost Calculator</p>
          </div>

          {/* Monthly km slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Monthly Distance</p>
              <span className="text-sm font-bold text-white">
                {monthlyKm.toLocaleString("en-IN")} km
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={5000}
              step={100}
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value))}
              className="w-full accent-amber-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">500 km</span>
              <span className="text-[10px] text-slate-600">5,000 km</span>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-xl p-4 border border-white/5" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  Monthly Fuel Cost
                </p>
                <p className="text-xl font-black text-amber-400">
                  {monthlyCost.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  Cost per km
                </p>
                <p className="text-xl font-black text-white">
                  {(PETROL_PRICE / 17.1).toFixed(1)}/km
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-3">
              Based on petrol price of {PETROL_PRICE}/L and combined mileage of 17.1 km/l
            </p>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
