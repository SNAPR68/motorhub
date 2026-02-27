"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── City-wise Price Page ─── */

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

// Registration charges vary by city
const CITY_REG: Record<string, number> = {
  Delhi: 52000,
  Mumbai: 68000,
  Bangalore: 61000,
  Chennai: 58000,
  Hyderabad: 55000,
  Kolkata: 48000,
  Pune: 63000,
  Ahmedabad: 50000,
  Jaipur: 47000,
  Lucknow: 45000,
};

const EX_SHOWROOM = 1050000;
const INSURANCE = 42000;
const TCS = 10500; // 1% of ex-showroom
const OTHERS = 8500; // logistics, handling

const VARIANTS = [
  { name: "LXi", fuel: "Petrol", transmission: "MT", price: 1050000 },
  { name: "VXi", fuel: "Petrol", transmission: "MT", price: 1185000 },
  { name: "ZXi+", fuel: "Petrol", transmission: "CVT", price: 1365000 },
];

function formatINR(n: number): string {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function PriceInCityPage({
  params,
}: {
  params: Promise<{ brand: string; model: string; city: string }>;
}) {
  const { brand, model, city: citySlug } = use(params);
  const displayModel = capitalize(model);
  const initialCity = capitalize(citySlug.replace(/-/g, " "));

  const [selectedCity, setSelectedCity] = useState(
    CITIES.includes(initialCity) ? initialCity : "Delhi"
  );

  const registration = CITY_REG[selectedCity] ?? 52000;
  const totalOnRoad = EX_SHOWROOM + registration + INSURANCE + TCS + OTHERS;

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
          <h1 className="text-base font-bold text-white">
            {displayModel} Price in {selectedCity}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── City Selector ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Select City
          </p>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-12 rounded-xl px-4 pr-10 text-sm font-semibold text-white border border-white/10 appearance-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {CITIES.map((city) => (
                <option key={city} value={city} style={{ background: "#0c0e14", color: "#e2e8f0" }}>
                  {city}
                </option>
              ))}
            </select>
            <MaterialIcon
              name="expand_more"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* ─── On-Road Price Breakdown ─── */}
        <div
          className="rounded-2xl border border-blue-500/20 overflow-hidden"
          style={{ background: "rgba(17,82,212,0.04)" }}
        >
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
              On-Road Price in {selectedCity}
            </p>
            <p className="text-3xl font-black text-white">{formatINR(totalOnRoad)}</p>
            <p className="text-xs text-slate-500 mt-0.5">Base variant (LXi)</p>
          </div>

          <div className="border-t border-white/5">
            {[
              { label: "Ex-Showroom Price", val: EX_SHOWROOM, icon: "storefront" },
              { label: "Registration (RTO)", val: registration, icon: "assignment" },
              { label: "Insurance (1yr Comprehensive)", val: INSURANCE, icon: "shield" },
              { label: "TCS (1%)", val: TCS, icon: "receipt" },
              { label: "Others (Logistics, Handling)", val: OTHERS, icon: "local_shipping" },
            ].map(({ label, val, icon }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i > 0 ? "border-t border-white/5" : ""
                }`}
              >
                <MaterialIcon name={icon} className="text-[16px] text-slate-600 shrink-0" />
                <span className="text-xs text-slate-400 flex-1">{label}</span>
                <span className="text-xs font-semibold text-slate-200">{formatINR(val)}</span>
              </div>
            ))}

            {/* Total row */}
            <div className="flex items-center gap-3 px-4 py-3 border-t-2 border-blue-500/30" style={{ background: "rgba(17,82,212,0.06)" }}>
              <MaterialIcon name="summarize" className="text-[16px] text-blue-400 shrink-0" />
              <span className="text-xs font-bold text-white flex-1">Total On-Road Price</span>
              <span className="text-sm font-black text-white">{formatINR(totalOnRoad)}</span>
            </div>
          </div>
        </div>

        {/* ─── Variant-wise Pricing ─── */}
        <div
          className="rounded-2xl border border-white/5 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Variant-wise Prices in {selectedCity}
            </p>
          </div>

          {VARIANTS.map((v, i) => {
            const variantOnRoad = v.price + registration + INSURANCE + Math.round(v.price * 0.01) + OTHERS;
            return (
              <div
                key={v.name}
                className={`px-4 py-3.5 flex items-center justify-between ${
                  i > 0 ? "border-t border-white/5" : "border-t border-white/5"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-white">{v.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500">{v.fuel}</span>
                    <span className="text-[10px] text-slate-700">|</span>
                    <span className="text-[10px] text-slate-500">{v.transmission}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">{formatINR(variantOnRoad)}</p>
                  <p className="text-[10px] text-slate-500">On-Road</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CTA ─── */}
        <button
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="calendar_today" className="text-[18px]" />
          Book Now
        </button>

        <p className="text-[10px] text-slate-600 text-center px-4 leading-relaxed">
          Prices are indicative and may vary based on accessories, colour, and dealer location.
          Contact your nearest dealer for exact on-road price.
        </p>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
