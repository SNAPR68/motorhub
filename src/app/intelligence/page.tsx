"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, fetchDashboard } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/car-images";

/* ── design tokens: ai_market_intelligence_hub_1 ── */
// primary: #0dccf2 (cyan), font: Manrope, bg: #0a0a0a, card: #161b1d, silver: #94a3b8

const SOURCES = ["OLX AUTOS", "CARS24", "SPINNY", "DROOM", "CARDEKHO"];

export default function IntelligencePage() {
  const [search, setSearch] = useState("");

  const { data: vehiclesData, isLoading } = useApi(() => fetchVehicles({ limit: 6 }), []);
  const { data: dashData } = useApi(() => fetchDashboard(), []);

  const vehicles = vehiclesData?.vehicles ?? [];
  const stats = dashData?.stats as Record<string, unknown> | undefined;
  const hotLeads = (stats?.hotLeads as number) ?? 0;
  const conversionRate = (stats?.conversionRate as string) ?? "0%";

  // Filter by search
  const filtered = search
    ? vehicles.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    : vehicles;

  // Demand score from hot leads ratio
  const demandScore = Math.min(99, 60 + hotLeads * 3);
  const demandLabel = demandScore >= 85 ? "HOT" : demandScore >= 70 ? "WARM" : "STABLE";

  // Top vehicle for trending
  const topVehicle = vehicles[0];

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a", color: "#f1f5f9" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b" style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0dccf2" }}>
            <MaterialIcon name="auto_awesome" className="text-[#0a0a0a] font-bold text-sm" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Market <span style={{ color: "#0dccf2" }}>Intelligence</span>
          </h1>
        </div>
        <Link href="/notifications/history" className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
          <MaterialIcon name="notifications" className="text-[#94a3b8]" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Search Bar */}
        <div className="py-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#94a3b8]">
              <MaterialIcon name="search" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your inventory (e.g., Hyundai Creta)"
              className="block w-full rounded-xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-[#94a3b8]/50 focus:outline-none transition-all"
              style={{ background: "#161b1d", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>

        {/* Market Value Card */}
        <section className="rounded-2xl p-5 mb-6" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                {topVehicle ? topVehicle.name : "Market Value Trend"}
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold">
                  {topVehicle ? topVehicle.priceDisplay : "—"}
                </span>
                <span className="text-sm font-bold flex items-center" style={{ color: "#10b981" }}>
                  <MaterialIcon name="trending_up" className="text-xs" /> {conversionRate} conv.
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: "#0dccf2", background: "rgba(13,204,242,0.1)", border: "1px solid rgba(13,204,242,0.2)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#0dccf2" }} />
                LIVE
              </div>
            </div>
          </div>

          {/* SVG trend line */}
          <div className="relative h-36 w-full">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0dccf2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0dccf2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,100 Q50,90 80,65 T160,75 T240,35 T320,50 T400,15" fill="transparent" stroke="#0dccf2" strokeWidth="3" style={{ filter: "drop-shadow(0 0 4px #0dccf2)" }} />
              <path d="M0,100 Q50,90 80,65 T160,75 T240,35 T320,50 T400,15 L400,120 L0,120 Z" fill="url(#chartGrad)" />
              <path d="M0,110 Q60,100 100,85 T180,95 T260,60 T340,78 T400,45" fill="transparent" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end pb-1 px-1">
              {["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"].map((m) => (
                <span key={m} className="text-[10px] font-bold" style={{ color: "#94a3b8" }}>{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Volatility & Demand Dials */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(to right, transparent, rgba(13,204,242,0.5), transparent)" }} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#94a3b8" }}>Volatility Index</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ border: "4px solid rgba(255,255,255,0.05)" }} />
              <div className="absolute inset-0 rounded-full -rotate-45" style={{ border: "4px solid transparent", borderTop: "4px solid #0dccf2", borderLeft: "4px solid #0dccf2" }} />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: "#0dccf2" }}>L-2</span>
                <span className="text-[8px] font-bold" style={{ color: "#94a3b8" }}>STABLE</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: "linear-gradient(to right, transparent, rgba(13,204,242,0.5), transparent)" }} />
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#94a3b8" }}>Demand Score</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full" style={{ border: "4px solid rgba(255,255,255,0.05)" }} />
              <div className="absolute inset-0 rounded-full -rotate-12" style={{ border: "4px solid #0dccf2", borderLeft: "4px solid transparent" }} />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: "#0dccf2" }}>{demandScore}</span>
                <span className="text-[8px] font-bold" style={{ color: "#94a3b8" }}>{demandLabel}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Listings from DB */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {search ? `Results for "${search}"` : "Your Inventory"}
            </h2>
            <Link href="/inventory" className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{ color: "#0dccf2" }}>
              View All <MaterialIcon name="chevron_right" className="text-sm" />
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-3 flex gap-4 items-center animate-pulse" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
                  <div className="w-20 h-20 rounded-lg bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-800 rounded w-3/4" />
                    <div className="h-2 bg-slate-800 rounded w-1/2" />
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="py-12 text-center rounded-xl" style={{ background: "rgba(22,27,29,0.5)", border: "1px solid rgba(148,163,184,0.1)" }}>
              <MaterialIcon name="search_off" className="text-3xl text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm">No vehicles found</p>
            </div>
          )}

          <div className="space-y-3">
            {filtered.map((v, i) => (
              <Link key={v.id} href={`/showcase/${v.id}`}>
                <div className="rounded-xl p-3 flex gap-4 items-center" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)", opacity: 1 - i * 0.06 }}>
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                    {v.images[0] ? (
                      <Image src={v.images[0]} alt="" width={80} height={80} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <MaterialIcon name="directions_car" className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm truncate">{v.name}</h4>
                        <p className="text-[10px] font-medium tracking-tight" style={{ color: "#94a3b8" }}>
                          {SOURCES[i % SOURCES.length]} &bull; {v.km} km
                        </p>
                      </div>
                      <MaterialIcon name="verified" className="text-sm text-[#94a3b8] shrink-0" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-lg font-extrabold" style={{ color: "#0dccf2" }}>{v.priceDisplay}</span>
                      {v.aiScore && v.aiScore >= 85 && (
                        <span className="text-[10px] font-bold" style={{ color: "#10b981" }}>AI PICK</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t md:hidden" style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>Inventory</span>
        </Link>
        <Link href="/intelligence" className="flex flex-col items-center gap-1 relative">
          <div className="absolute -top-12 w-14 h-14 rounded-2xl flex items-center justify-center rotate-45" style={{ background: "#0dccf2", boxShadow: "0 8px 20px rgba(13,204,242,0.4)", border: "4px solid #0a0a0a" }}>
            <MaterialIcon name="query_stats" className="text-[#0a0a0a] font-bold -rotate-45" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase mt-4" style={{ color: "#0dccf2" }}>Insights</span>
        </Link>
        <Link href="/reports/monthly" className="flex flex-col items-center gap-1">
          <MaterialIcon name="description" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>Reports</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1">
          <MaterialIcon name="account_circle" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
