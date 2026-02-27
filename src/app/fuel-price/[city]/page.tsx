"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatCity(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const TODAY = {
  petrol: 106.31,
  diesel: 92.72,
  cng: 76.59,
};

const TREND = [
  { date: "27 Feb", petrol: 106.31, diesel: 92.72, cng: 76.59 },
  { date: "26 Feb", petrol: 105.96, diesel: 92.50, cng: 76.59 },
  { date: "25 Feb", petrol: 105.96, diesel: 92.50, cng: 76.45 },
  { date: "24 Feb", petrol: 106.10, diesel: 92.60, cng: 76.45 },
  { date: "23 Feb", petrol: 106.10, diesel: 92.60, cng: 76.30 },
  { date: "22 Feb", petrol: 105.80, diesel: 92.40, cng: 76.30 },
  { date: "21 Feb", petrol: 105.80, diesel: 92.40, cng: 76.15 },
];

const FUELS: { key: keyof typeof TODAY; label: string; icon: string; color: string }[] = [
  { key: "petrol", label: "Petrol", icon: "local_gas_station", color: "#ef4444" },
  { key: "diesel", label: "Diesel", icon: "local_gas_station", color: "#f59e0b" },
  { key: "cng", label: "CNG", icon: "propane_tank", color: "#10b981" },
];

export default function FuelPriceCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const cityName = formatCity(city);
  const change = (TODAY.petrol - TREND[1].petrol).toFixed(2);
  const changePositive = parseFloat(change) >= 0;

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/fuel-price"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Fuel Prices in {cityName}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Today's Prices */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Today&apos;s Prices
          </p>
          <div className="grid grid-cols-3 gap-3">
            {FUELS.map((fuel) => (
              <div
                key={fuel.key}
                className="rounded-2xl p-4 border border-white/5 text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${fuel.color}20` }}
                >
                  <MaterialIcon name={fuel.icon} className="text-[20px]" style={{ color: fuel.color }} />
                </div>
                <p className="text-white text-lg font-bold">Rs {TODAY[fuel.key].toFixed(2)}</p>
                <p className="text-slate-500 text-xs mt-0.5">{fuel.label}/L</p>
              </div>
            ))}
          </div>
        </div>

        {/* Change Indicator */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{
            background: changePositive ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.06)",
            border: changePositive ? "1px solid rgba(239,68,68,0.15)" : "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <MaterialIcon
              name={changePositive ? "trending_up" : "trending_down"}
              className="text-[20px]"
              style={{ color: changePositive ? "#ef4444" : "#10b981" }}
            />
            <span className="text-sm text-white font-semibold">Change from yesterday</span>
          </div>
          <span
            className="text-sm font-bold"
            style={{ color: changePositive ? "#ef4444" : "#10b981" }}
          >
            {changePositive ? "+" : ""}Rs {change}
          </span>
        </div>

        {/* 7-Day Trend */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            7-Day Price Trend
          </p>
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            {/* Table header */}
            <div className="grid grid-cols-4 gap-2 px-4 py-3 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Date</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-right">Petrol</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-right">Diesel</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-right">CNG</span>
            </div>
            {/* Table rows */}
            {TREND.map((row, idx) => (
              <div
                key={row.date}
                className="grid grid-cols-4 gap-2 px-4 py-2.5"
                style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xs text-slate-400">{row.date}</span>
                <span className="text-xs text-white font-medium text-right">Rs {row.petrol.toFixed(2)}</span>
                <span className="text-xs text-white font-medium text-right">Rs {row.diesel.toFixed(2)}</span>
                <span className="text-xs text-white font-medium text-right">Rs {row.cng.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4" style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}>
          <div className="flex items-start gap-2">
            <MaterialIcon name="info" className="text-[16px] text-amber-400 mt-0.5" />
            <p className="text-amber-200/70 text-xs leading-relaxed">
              Prices are indicative and updated daily. Actual prices may vary by petrol pump. Last updated: 27 Feb 2026, 6:00 AM.
            </p>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
