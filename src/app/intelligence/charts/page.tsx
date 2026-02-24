"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_market_intelligence_hub_2 — #0dccf2, Manrope, #0a0a0a */

const TIMEFRAMES = ["1W", "2W", "1M", "3M", "6M", "1Y"];

const MODELS = [
  { name: "Hyundai Creta SX(O)", price: "₹14.5L", trend: "+2.8%", signal: "BULLISH", signalColor: "#10b981" },
  { name: "Maruti Swift ZXi+", price: "₹7.8L", trend: "-1.2%", signal: "BEARISH", signalColor: "#ef4444" },
  { name: "Tata Nexon EV Max", price: "₹16.2L", trend: "+5.4%", signal: "BULLISH", signalColor: "#10b981" },
];

export default function IntelligenceChartsPage() {
  const [selectedTF, setSelectedTF] = useState("1M");

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <Link href="/intelligence" className="p-1">
            <MaterialIcon name="arrow_back" className="text-slate-400" />
          </Link>
          <h1 className="text-lg font-extrabold tracking-tight">
            Price <span style={{ color: "#0dccf2" }}>Charts</span>
          </h1>
        </div>
        <div className="size-10 rounded-full p-0.5 flex items-center justify-center" style={{ border: "2px solid rgba(13,204,242,0.3)" }}>
          <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">AV</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Timeframe Buttons */}
        <div className="flex gap-2 py-4">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTF(tf)}
              className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: selectedTF === tf ? "#0dccf2" : "rgba(255,255,255,0.05)",
                color: selectedTF === tf ? "#0a0a0a" : "#94a3b8",
                border: selectedTF === tf ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Main Price Chart */}
        <section className="rounded-2xl p-5 mb-6"
          style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#94a3b8] mb-1">Creta SX(O) Price</h2>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold">₹14.5L</span>
                <span className="text-sm font-bold flex items-center text-[#10b981]">
                  <MaterialIcon name="trending_up" className="text-xs" /> +2.8%
                </span>
              </div>
            </div>
          </div>
          <div className="relative h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0dccf2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0dccf2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 Q50,110 80,80 T160,90 T240,40 T320,60 T400,20" fill="transparent" stroke="#0dccf2" strokeWidth="3" style={{ filter: "drop-shadow(0 0 4px #0dccf2)" }} />
              <path d="M0,120 Q50,110 80,80 T160,90 T240,40 T320,60 T400,20 L400,150 L0,150 Z" fill="url(#chartGrad2)" />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end pb-1 px-1">
              {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
                <span key={m} className="text-[10px] font-bold text-[#94a3b8]">{m}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Bullish/Bearish Signals */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-3 flex items-center gap-2">
            <MaterialIcon name="show_chart" className="text-sm text-[#0dccf2]" /> Market Signals
          </h2>
          <div className="space-y-3">
            {MODELS.map((m) => (
              <div key={m.name} className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
                <div>
                  <h3 className="text-sm font-bold text-white">{m.name}</h3>
                  <p className="text-lg font-extrabold mt-1" style={{ color: "#0dccf2" }}>{m.price}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold" style={{ color: m.signalColor }}>{m.trend}</span>
                  <div className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: `${m.signalColor}15`, color: m.signalColor }}>
                    {m.signal}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Volume Chart */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-3">Trading Volume</h2>
          <div className="rounded-2xl p-5" style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
            <div className="flex items-end justify-between h-24 gap-1">
              {[40, 65, 55, 80, 70, 90, 60, 75, 85, 45, 70, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 11 ? "#0dccf2" : "rgba(13,204,242,0.2)" }} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Inventory</span>
        </Link>
        <Link href="/intelligence" className="flex flex-col items-center gap-1 relative">
          <div className="absolute -top-12 w-14 h-14 rounded-2xl flex items-center justify-center rotate-45"
            style={{ background: "#0dccf2", boxShadow: "0 8px 20px rgba(13,204,242,0.4)", border: "4px solid #0a0a0a" }}>
            <MaterialIcon name="query_stats" className="text-[#0a0a0a] font-bold -rotate-45" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase mt-4 text-[#0dccf2]">Insights</span>
        </Link>
        <Link href="/reports/monthly" className="flex flex-col items-center gap-1">
          <MaterialIcon name="description" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Reports</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1">
          <MaterialIcon name="account_circle" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
