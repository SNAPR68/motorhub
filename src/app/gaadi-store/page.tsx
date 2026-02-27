"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

const STORES = [
  {
    id: 1,
    name: "Autovinci Experience Center — Andheri",
    address: "Ground Floor, Link Road, Andheri West, Mumbai 400053",
    features: ["Test Drive", "Inspection", "Finance"],
    rating: 4.8,
    reviews: 324,
    city: "Mumbai",
  },
  {
    id: 2,
    name: "Autovinci Hub — Koramangala",
    address: "80 Feet Road, Koramangala 4th Block, Bangalore 560034",
    features: ["Test Drive", "Inspection", "Finance"],
    rating: 4.7,
    reviews: 256,
    city: "Bangalore",
  },
  {
    id: 3,
    name: "Autovinci Studio — Connaught Place",
    address: "Block B, Connaught Place, New Delhi 110001",
    features: ["Test Drive", "Finance"],
    rating: 4.6,
    reviews: 189,
    city: "Delhi",
  },
  {
    id: 4,
    name: "Autovinci Flagship — Banjara Hills",
    address: "Road No. 12, Banjara Hills, Hyderabad 500034",
    features: ["Test Drive", "Inspection", "Finance"],
    rating: 4.9,
    reviews: 412,
    city: "Hyderabad",
  },
];

const FEATURE_ICONS: Record<string, string> = {
  "Test Drive": "directions_car",
  Inspection: "search",
  Finance: "account_balance",
};

const FEATURE_COLORS: Record<string, string> = {
  "Test Drive": "#1152d4",
  Inspection: "#10b981",
  Finance: "#f59e0b",
};

export default function GaadiStorePage() {
  const [selectedCity, setSelectedCity] = useState("All");

  const filtered = selectedCity === "All" ? STORES : STORES.filter((s) => s.city === selectedCity);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Autovinci Stores</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Description */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="storefront" className="text-[24px]" />
            <h2 className="text-lg font-bold">Visit Our Offline Experience Centers</h2>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            Walk in, test drive, get your car inspected, and complete financing — all under one roof. No appointment needed.
          </p>
        </div>

        {/* City selector */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Select City
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCity("All")}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
              style={{
                background: selectedCity === "All" ? "#1152d4" : "rgba(255,255,255,0.05)",
                color: selectedCity === "All" ? "#fff" : "#94a3b8",
                border: selectedCity === "All" ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              All Cities
            </button>
            {CITIES.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                  style={{
                    background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                    color: active ? "#fff" : "#94a3b8",
                    border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Store cards */}
        <div className="space-y-3">
          {filtered.map((store) => (
            <Link
              key={store.id}
              href={`/gaadi-store/${store.city.toLowerCase()}`}
              className="block rounded-2xl p-4 border border-white/5 transition-all active:scale-[0.99]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-bold text-white leading-snug flex-1 pr-2">{store.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <MaterialIcon name="star" className="text-[14px] text-amber-400" fill />
                  <span className="text-xs font-bold text-white">{store.rating}</span>
                  <span className="text-[10px] text-slate-500">({store.reviews})</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 mb-3">
                <MaterialIcon name="location_on" className="text-[14px] text-slate-500 mt-0.5" />
                <span className="text-xs text-slate-400 leading-relaxed">{store.address}</span>
              </div>

              <div className="flex gap-2">
                {store.features.map((feat) => (
                  <span
                    key={feat}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: `${FEATURE_COLORS[feat]}15`,
                      color: FEATURE_COLORS[feat],
                    }}
                  >
                    <MaterialIcon name={FEATURE_ICONS[feat]} className="text-[12px]" />
                    {feat}
                  </span>
                ))}
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-2xl p-8 text-center border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <MaterialIcon name="storefront" className="text-[40px] text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">No stores in {selectedCity} yet</p>
              <p className="text-xs text-slate-600 mt-1">We are expanding soon. Stay tuned!</p>
            </div>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
