"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, fetchDashboard } from "@/lib/api";
import type { DbVehicle } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

/* ── design tokens: predictive_profit_analysis ── */
// primary: #dab80b (gold), font: Space Grotesk, bg: #121108, surface: #1c1a0e, border: #36321b

const PERIODS = ["7 Days", "30 Days", "90 Days"];

function getBadge(v: DbVehicle): { text: string; bg: string; textColor: string } {
  const aiScore = v.aiScore ?? 0;
  if (aiScore >= 90) return { text: "Hold for Max Gain", bg: "#dab80b", textColor: "#121108" };
  if (v.km && parseInt(v.km.replace(/,/g, "")) < 20000) return { text: "Sell Now – Peak", bg: "#e2e8f0", textColor: "#121108" };
  return { text: "Watch List", bg: "#334155", textColor: "#cbd5e1" };
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function ProfitPage() {
  const [period, setPeriod] = useState(1);

  const { data: vehiclesData, isLoading: vehiclesLoading } = useApi(() => fetchVehicles({ status: "AVAILABLE", limit: 5 }), []);
  const { data: dashData, isLoading: dashLoading } = useApi(() => fetchDashboard(), []);

  const isLoading = vehiclesLoading || dashLoading;
  const vehicles = vehiclesData?.vehicles ?? [];
  const stats = dashData?.stats as Record<string, unknown> | undefined;
  const revenue = (stats?.revenue as string) ?? "₹0";
  const monthlySales = (stats?.monthlySales as number) ?? 0;

  const totalOpportunity = vehicles.reduce((sum, v) => sum + v.price, 0);
  const projectedGain = Math.round(totalOpportunity * 0.12);

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#121108", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 border-b" style={{ background: "rgba(18,17,8,0.8)", backdropFilter: "blur(12px)", borderColor: "#36321b" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/analytics">
              <MaterialIcon name="arrow_back_ios_new" className="text-slate-100" />
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Predictive Analysis</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#dab80b" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#dab80b" }} />
                </span>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">Live Market Hub</p>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-lg" style={{ background: "rgba(218,184,11,0.1)" }}>
            <MaterialIcon name="query_stats" className="text-[#dab80b]" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4">
        {/* Period Selector */}
        <div className="px-4 py-4">
          <div className="flex p-1 rounded-xl border" style={{ background: "#1c1a0e", borderColor: "#36321b" }}>
            {PERIODS.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)} className="flex-1 py-2 text-xs font-bold rounded-lg"
                style={i === period ? { background: "#dab80b", color: "#121108" } : { color: "#94a3b8" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <section className="px-4 mb-6">
          <div className="rounded-xl p-5 border" style={{ background: "#1c1a0e", borderColor: "#36321b" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">{revenue}</p>
                <p className="text-xs text-slate-400 mt-1">{monthlySales} vehicles sold</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Est. Opportunity</p>
                <p className="text-xl font-bold" style={{ color: "#dab80b" }}>{formatPrice(projectedGain)}</p>
                <p className="text-xs text-slate-400 mt-1">+12% projected</p>
              </div>
            </div>
          </div>
        </section>

        {/* Regional Demand Heat Map */}
        <section className="px-4 space-y-3 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Regional Demand Index</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{ color: "#dab80b", background: "rgba(218,184,11,0.1)", borderColor: "rgba(218,184,11,0.2)" }}>
              High Volatility
            </span>
          </div>
          <div className="relative h-48 w-full rounded-xl overflow-hidden border" style={{ borderColor: "#36321b" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 40%, rgba(218,184,11,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(218,184,11,0.2) 0%, transparent 30%), #1c1a0e" }} />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <div className="p-2 rounded-lg border text-[10px]" style={{ background: "rgba(18,17,8,0.6)", backdropFilter: "blur(8px)", borderColor: "rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#dab80b" }} />
                    <span>Peak: North / West India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span>Stable: South / East India</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">Top in Inventory</p>
                  <p className="text-base font-bold truncate max-w-[180px]" style={{ color: "#dab80b" }}>
                    {vehicles[0]?.name ?? "No vehicles yet"}
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {["DL", "MH", "KA"].map((code) => (
                    <div key={code} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{ background: "#334155", borderColor: "#121108" }}>
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inventory Opportunities */}
        <section className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Inventory Opportunities</h2>
            {projectedGain > 0 && (
              <span className="text-xs font-bold" style={{ color: "#dab80b" }}>Est. Gain: {formatPrice(projectedGain)}</span>
            )}
          </div>

          {isLoading && (
            <div className="space-y-3">
              <SkeletonCard variant="dark" />
              <SkeletonCard variant="dark" />
            </div>
          )}

          {!isLoading && vehicles.length === 0 && (
            <div className="py-12 text-center rounded-xl border" style={{ background: "#1c1a0e", borderColor: "#36321b" }}>
              <MaterialIcon name="inventory" className="text-3xl text-slate-600 mb-2" />
              <p className="text-slate-400 text-sm">No available inventory</p>
              <Link href="/inventory" className="text-xs mt-2 inline-block font-bold" style={{ color: "#dab80b" }}>Add vehicles →</Link>
            </div>
          )}

          {!isLoading && vehicles.map((v) => {
            const badge = getBadge(v);
            const projectedValue = Math.round(v.price * 1.12);
            return (
              <div key={v.id} className="rounded-xl p-4 space-y-4 border" style={{ background: "#1c1a0e", borderColor: "#36321b" }}>
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{v.year} • {v.fuel}</p>
                    <h3 className="text-base font-bold leading-tight text-white truncate">{v.name}</h3>
                    <p className="text-xs text-slate-400">{v.km} km • {v.location}</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg shrink-0" style={{ background: badge.bg }}>
                    <span className="text-[10px] font-black uppercase whitespace-nowrap" style={{ color: badge.textColor }}>{badge.text}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between border-t pt-4" style={{ borderColor: "#36321b" }}>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase">Current Value</p>
                    <p className="text-xl font-bold tracking-tight text-white">
                      {formatPrice(v.price)} <span className="text-sm" style={{ color: "#dab80b" }}>↑</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Projected (+12%)</p>
                    <p className="text-sm font-bold" style={{ color: "#dab80b" }}>{formatPrice(projectedValue)}</p>
                  </div>
                </div>
                {v.aiScore && v.aiScore >= 85 && (
                  <div className="rounded-lg p-3 border" style={{ background: "rgba(218,184,11,0.05)", borderColor: "rgba(218,184,11,0.2)" }}>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &ldquo;AI Score {v.aiScore}% — High demand segment. Optimal pricing window open.&rdquo;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t" style={{ background: "rgba(18,17,8,0.9)", backdropFilter: "blur(16px)", borderColor: "#36321b" }}>
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "public", label: "Market", href: "/analytics" },
          { icon: "monitoring", label: "Intelligence", href: "/profit", active: true },
          { icon: "sell", label: "Deals", href: "/leads" },
          { icon: "account_circle", label: "Profile", href: "/settings" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1" style={{ color: item.active ? "#dab80b" : "#64748b" }}>
            <MaterialIcon name={item.icon} fill={item.active} className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
