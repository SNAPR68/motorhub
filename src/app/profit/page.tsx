"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: predictive_profit_analysis ── */
// primary: #dab80b (gold), font: Space Grotesk, bg: #121108, surface: #1c1a0e, border: #36321b

const PERIODS = ["7 Days", "30 Days", "90 Days"];

const OPPORTUNITIES = [
  {
    stock: "AV-2941",
    name: "2023 Hyundai Creta SX(O)",
    detail: "Polar White • 12,400 km",
    badge: "Hold for 15% Gain",
    badgeBg: "#dab80b",
    badgeText: "#121108",
    currentValue: "₹14.5L",
    projected: "₹16.7L",
    projectedLabel: "Projected (Q4)",
    arrow: "↑",
    arrowColor: "#dab80b",
    note: "Limited supply in North India is driving regional prices. Peak demand expected in 45 days.",
    noteBg: "rgba(218,184,11,0.05)",
    noteBorder: "rgba(218,184,11,0.2)",
  },
  {
    stock: "AV-1102",
    name: "2022 Mahindra XUV700 AX7 L",
    detail: "Midnight Black • 8,200 km",
    badge: "Sell Now – Peak",
    badgeBg: "#e2e8f0",
    badgeText: "#121108",
    currentValue: "₹18.5L",
    projected: "+₹1.85L",
    projectedLabel: "Profit Margin",
    arrow: "→",
    arrowColor: "#94a3b8",
    note: "SUV segment showing plateauing demand. Sell within 14 days to maximize current liquidity.",
    noteBg: "rgba(30,41,59,0.3)",
    noteBorder: "rgba(51,65,85,0.5)",
  },
];

export default function ProfitPage() {
  const [period, setPeriod] = useState(1);

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#121108", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-4 border-b"
        style={{
          background: "rgba(18,17,8,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#36321b",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/analytics">
              <MaterialIcon name="arrow_back_ios_new" className="text-slate-100" />
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Predictive Analysis
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#dab80b" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "#dab80b" }}
                  />
                </span>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                  Live Market Hub
                </p>
              </div>
            </div>
          </div>
          <button
            className="p-2 rounded-lg"
            style={{ background: "rgba(218,184,11,0.1)" }}
          >
            <MaterialIcon name="query_stats" className="text-[#dab80b]" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4">
        {/* ── Period Selector ── */}
        <div className="px-4 py-4">
          <div
            className="flex p-1 rounded-xl border"
            style={{ background: "#1c1a0e", borderColor: "#36321b" }}
          >
            {PERIODS.map((p, i) => (
              <button
                key={p}
                onClick={() => setPeriod(i)}
                className="flex-1 py-2 text-xs font-bold rounded-lg"
                style={
                  i === period
                    ? { background: "#dab80b", color: "#121108" }
                    : { color: "#94a3b8" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Global Demand Heat Map ── */}
        <section className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Regional Demand Index
            </h2>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{
                color: "#dab80b",
                background: "rgba(218,184,11,0.1)",
                borderColor: "rgba(218,184,11,0.2)",
              }}
            >
              High Volatility
            </span>
          </div>
          <div
            className="relative h-56 w-full rounded-xl overflow-hidden border"
            style={{ borderColor: "#36321b" }}
          >
            {/* Heat map background */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 40%, rgba(218,184,11,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(218,184,11,0.2) 0%, transparent 30%), #1c1a0e",
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <div
                  className="p-2 rounded-lg border text-[10px]"
                  style={{
                    background: "rgba(18,17,8,0.6)",
                    backdropFilter: "blur(8px)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
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
                  <p className="text-xs font-medium text-slate-400">Top Trending</p>
                  <p className="text-lg font-bold" style={{ color: "#dab80b" }}>
                    Hyundai Creta (All Variants)
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {["DL", "MH", "KA"].map((code) => (
                    <div
                      key={code}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "#334155", borderColor: "#121108" }}
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Inventory Opportunities ── */}
        <section className="mt-8 px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Inventory Opportunities
            </h2>
            <div className="flex items-center gap-1" style={{ color: "#dab80b" }}>
              <span className="text-xs font-bold">Est. Gain: ₹4.2L</span>
            </div>
          </div>

          {OPPORTUNITIES.map((opp) => (
            <div
              key={opp.stock}
              className="rounded-xl p-4 space-y-4 border"
              style={{ background: "#1c1a0e", borderColor: "#36321b" }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Stock #{opp.stock}
                  </p>
                  <h3 className="text-base font-bold leading-tight text-white">
                    {opp.name}
                  </h3>
                  <p className="text-xs text-slate-400">{opp.detail}</p>
                </div>
                <div
                  className="px-3 py-1 rounded-lg"
                  style={{ background: opp.badgeBg }}
                >
                  <span
                    className="text-[10px] font-black uppercase"
                    style={{ color: opp.badgeText }}
                  >
                    {opp.badge}
                  </span>
                </div>
              </div>
              <div
                className="flex items-end justify-between border-t pt-4"
                style={{ borderColor: "#36321b" }}
              >
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase">Current Value</p>
                  <p className="text-xl font-bold tracking-tight text-white">
                    {opp.currentValue}{" "}
                    <span className="text-sm" style={{ color: opp.arrowColor }}>
                      {opp.arrow}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase">
                    {opp.projectedLabel}
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: opp.projectedLabel === "Profit Margin" ? "#dab80b" : "#cbd5e1",
                    }}
                  >
                    {opp.projected}
                  </p>
                </div>
              </div>
              <div
                className="rounded-lg p-3 border"
                style={{ background: opp.noteBg, borderColor: opp.noteBorder }}
              >
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{opp.note}&rdquo;
                </p>
              </div>
            </div>
          ))}

          {/* Watch List (faded) */}
          <div
            className="rounded-xl p-4 opacity-60 border"
            style={{ background: "#1c1a0e", borderColor: "#36321b" }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Stock #AV-8821
                </p>
                <h3 className="text-base font-bold leading-tight text-white">
                  2021 Tata Nexon EV Max
                </h3>
              </div>
              <div className="px-3 py-1 rounded-lg" style={{ background: "#334155" }}>
                <span className="text-[10px] font-black text-slate-300 uppercase">
                  Watch List
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t"
        style={{
          background: "rgba(18,17,8,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "#36321b",
        }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "public", label: "Market", href: "/analytics" },
          { icon: "monitoring", label: "Intelligence", href: "/profit", active: true },
          { icon: "sell", label: "Deals", href: "/leads" },
          { icon: "account_circle", label: "Profile", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ color: item.active ? "#dab80b" : "#64748b" }}
          >
            <MaterialIcon
              name={item.icon}
              fill={item.active}
              className="text-2xl"
            />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
