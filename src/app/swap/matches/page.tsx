"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* ─── SwapDirect — Swap Matches Results ─── */

const FILTERS = ["Best Match", "Lowest Gap", "Nearest"];

interface MatchCard {
  id: string;
  ownerName: string;
  ownerCity: string;
  theirCar: string;
  theirYear: number;
  theirKm: string;
  matchPct: number;
  yourValue: string;
  theirValue: string;
  youPay: string;
}

const OWNER_NAMES = ["Priya S.", "Rajesh K.", "Sneha M.", "Vikram D.", "Amit P.", "Neha T.", "Kiran R.", "Sanjay B."];
const CITY_AREAS = ["Andheri", "Powai", "Bandra", "Thane", "Navi Mumbai", "Juhu", "Worli", "Malad"];

function matchColor(pct: number) {
  if (pct >= 90) return "#10b981";
  if (pct >= 85) return "#1152d4";
  if (pct >= 80) return "#f59e0b";
  return "#94a3b8";
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  return `₹${(price / 100000).toFixed(1)}L`;
}

function MatchesContent() {
  const searchParams = useSearchParams();
  const yourBrand = searchParams.get("yourBrand") || "Your Car";
  const yourYear = searchParams.get("yourYear") || "";
  const wantBrand = searchParams.get("wantBrand") || "";

  const [activeFilter, setActiveFilter] = useState("Best Match");

  // Fetch vehicles from DB to compute swap matches
  const { data, isLoading: loading } = useApi(() => fetchVehicles({ status: "AVAILABLE", limit: 30 }), []);
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

  // Estimate user's car value based on brand/year
  const yourEstimatedValue = (() => {
    const yr = parseInt(yourYear) || 2022;
    const age = 2026 - yr;
    return Math.max(200000, 800000 - age * 120000);
  })();

  // Build match cards from real vehicles
  const matches: MatchCard[] = vehicles
    .filter((v) => {
      if (wantBrand && !v.name.toLowerCase().includes(wantBrand.toLowerCase())) return false;
      return true;
    })
    .slice(0, 8)
    .map((v, i) => {
      const theirPrice = v.priceNumeric || 500000;
      const gap = theirPrice - yourEstimatedValue;
      const pct = Math.max(70, Math.min(96, 95 - Math.abs(gap) / 100000));
      return {
        id: v.id,
        ownerName: OWNER_NAMES[i % OWNER_NAMES.length],
        ownerCity: `${CITY_AREAS[i % CITY_AREAS.length]}, Mumbai`,
        theirCar: v.name,
        theirYear: v.year,
        theirKm: v.km || "25,000",
        matchPct: Math.round(pct),
        yourValue: formatPrice(yourEstimatedValue),
        theirValue: v.price || formatPrice(theirPrice),
        youPay: gap > 0 ? formatPrice(gap) : "₹0",
      };
    });

  // Sort based on filter
  const sorted = [...matches].sort((a, b) => {
    if (activeFilter === "Best Match") return b.matchPct - a.matchPct;
    if (activeFilter === "Lowest Gap") {
      const gapA = parseFloat(a.youPay.replace(/[₹,LCr]/g, "")) || 0;
      const gapB = parseFloat(b.youPay.replace(/[₹,LCr]/g, "")) || 0;
      return gapA - gapB;
    }
    return 0;
  });

  return (
    <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">

      {/* Search context */}
      <div className="rounded-xl p-3 border border-white/5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.15)" }}>
          <MaterialIcon name="directions_car" className="text-[18px] text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Swapping</p>
          <p className="text-xs font-bold text-white truncate">{yourBrand} {yourYear}</p>
        </div>
        <Link href="/swap" className="text-[10px] font-bold text-blue-400 shrink-0">Edit</Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="shrink-0 h-8 px-3.5 rounded-full text-[11px] font-bold transition-all border"
            style={{
              background: activeFilter === f ? "#1152d4" : "rgba(255,255,255,0.04)",
              borderColor: activeFilter === f ? "#1152d4" : "rgba(255,255,255,0.06)",
              color: activeFilter === f ? "#fff" : "#94a3b8",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "rgba(16,185,129,0.15)" }}>
            <MaterialIcon name="swap_horiz" className="text-[28px] text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white mb-1">Finding matches...</p>
            <p className="text-[11px] text-slate-500">Scanning inventory for compatible swaps</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700" />
          <p className="text-sm font-bold text-white">No matches found</p>
          <p className="text-[11px] text-slate-500 text-center max-w-[260px]">Try adjusting your preferences or check back later as new listings are added daily.</p>
          <Link href="/swap" className="mt-2 h-10 px-6 rounded-xl text-xs font-bold text-white flex items-center" style={{ background: "#1152d4" }}>
            Edit Search
          </Link>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-[11px] text-slate-500">
            <span className="text-white font-bold">{sorted.length} matches</span> found near you
          </p>

          {/* Match Cards */}
          <div className="space-y-3">
            {sorted.map((m) => (
              <div key={m.id} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>

                {/* Card header */}
                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0" style={{ background: "rgba(139,92,246,0.2)" }}>
                    {m.ownerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{m.ownerName}</p>
                    <p className="text-[10px] text-slate-500">{m.ownerCity}</p>
                  </div>
                  <div
                    className="h-8 px-2.5 rounded-lg flex items-center gap-1 text-xs font-black"
                    style={{ background: `${matchColor(m.matchPct)}18`, color: matchColor(m.matchPct) }}
                  >
                    {m.matchPct}%
                  </div>
                </div>

                {/* Their car */}
                <div className="px-4 pb-3">
                  <div className="rounded-xl p-3 border border-white/5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <MaterialIcon name="directions_car" className="text-[24px] text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{m.theirCar}</p>
                      <p className="text-[11px] text-slate-500">{m.theirYear} &middot; {m.theirKm} km</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MaterialIcon name="verified" className="text-[12px] text-emerald-400" />
                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">VehiclePassport</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Value gap */}
                <div className="px-4 pb-3">
                  <div className="rounded-xl p-3 border border-white/5" style={{ background: "rgba(17,82,212,0.05)" }}>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-slate-400">Your car</span>
                      <span className="text-white font-bold">{m.yourValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="text-slate-400">Their car</span>
                      <span className="text-white font-bold">{m.theirValue}</span>
                    </div>
                    <div className="h-px bg-white/5 my-2" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">You pay</span>
                      <span className="text-emerald-400 font-black text-sm">{m.youPay}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="px-4 pb-4">
                  <Link
                    href="/swap/deal"
                    className="flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-bold text-white w-full transition-all"
                    style={{ background: "#1152d4" }}
                  >
                    <MaterialIcon name="visibility" className="text-[16px]" />
                    View Deal
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

    </main>
  );
}

export default function SwapMatchesPage() {
  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/swap" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">Swap Matches</h1>
        </div>
      </header>

      <Suspense fallback={
        <div className="max-w-lg mx-auto px-4 pt-16 flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: "rgba(16,185,129,0.15)" }}>
            <MaterialIcon name="swap_horiz" className="text-[28px] text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">Finding matches...</p>
        </div>
      }>
        <MatchesContent />
      </Suspense>

      <BuyerBottomNav />
    </div>
  );
}
