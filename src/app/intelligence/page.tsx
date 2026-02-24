"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, SWIFT, NEXON, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_market_intelligence_hub_1 ── */
// primary: #0dccf2 (cyan), font: Manrope, bg: #0a0a0a, card: #161b1d, silver: #94a3b8

const AUCTIONS = [
  {
    name: "2023 Hyundai Creta SX(O)",
    source: "OLX AUTOS",
    time: "2 DAYS AGO",
    price: "\u20b914.5L",
    oldPrice: "\u20b913.2L",
    image: CRETA,
    opacity: 1,
  },
  {
    name: "2022 Maruti Swift ZXi+",
    source: "CARS24",
    time: "5 DAYS AGO",
    price: "\u20b97.8L",
    tag: "RESERVE MET",
    image: SWIFT,
    opacity: 0.9,
  },
  {
    name: "2023 Tata Nexon EV Max",
    source: "SPINNY",
    time: "1 WEEK AGO",
    price: "\u20b916.2L",
    tag: "TOP SPEC",
    tagColor: "#10b981",
    image: NEXON,
    opacity: 0.8,
  },
];

export default function IntelligencePage() {
  const [search, setSearch] = useState("Hyundai Creta SX(O)");

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a", color: "#f1f5f9" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#0dccf2" }}
          >
            <MaterialIcon name="auto_awesome" className="text-[#0a0a0a] font-bold text-sm" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">
            Market{" "}
            <span style={{ color: "#0dccf2" }}>Intelligence</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <MaterialIcon name="notifications" className="text-[#94a3b8]" />
          </button>
          <div
            className="w-10 h-10 rounded-full p-0.5 flex items-center justify-center"
            style={{ border: "2px solid rgba(13,204,242,0.3)" }}
          >
            <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
              AV
            </div>
          </div>
        </div>
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
              placeholder="Search model (e.g., Hyundai Creta)"
              className="block w-full rounded-xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-[#94a3b8]/50 focus:outline-none transition-all"
              style={{
                background: "#161b1d",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        {/* Market Value Trend */}
        <section
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2
                className="text-sm font-semibold uppercase tracking-widest mb-1"
                style={{ color: "#94a3b8" }}
              >
                Market Value Trend
              </h2>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold">{"\u20b9"}14.5L</span>
                <span className="text-sm font-bold flex items-center" style={{ color: "#10b981" }}>
                  <MaterialIcon name="trending_up" className="text-xs" /> 12.4%
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <div
                className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
                style={{
                  color: "#0dccf2",
                  background: "rgba(13,204,242,0.1)",
                  border: "1px solid rgba(13,204,242,0.2)",
                }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#0dccf2" }} />
                AVG
              </div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
                style={{
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ border: "1px dashed #94a3b8" }}
                />
                AI PREDICTED
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative h-48 w-full">
            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0dccf2" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0dccf2" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,120 Q50,110 80,80 T160,90 T240,40 T320,60 T400,20"
                fill="transparent"
                stroke="#0dccf2"
                strokeWidth="3"
                style={{ filter: "drop-shadow(0 0 4px #0dccf2)" }}
              />
              <path
                d="M0,120 Q50,110 80,80 T160,90 T240,40 T320,60 T400,20 L400,150 L0,150 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M0,130 Q60,120 100,100 T180,110 T260,70 T340,90 T400,50"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.5"
              />
            </svg>
            <div className="absolute inset-0 flex justify-between items-end pb-1 px-1">
              {["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"].map((m) => (
                <span key={m} className="text-[10px] font-bold" style={{ color: "#94a3b8" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Volatility & Demand Dials */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          {/* Volatility Index */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ background: "linear-gradient(to right, transparent, rgba(13,204,242,0.5), transparent)" }}
            />
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: "#94a3b8" }}
            >
              Volatility Index
            </h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "4px solid rgba(255,255,255,0.05)" }}
              />
              <div
                className="absolute inset-0 rounded-full -rotate-45"
                style={{
                  border: "4px solid transparent",
                  borderTop: "4px solid #0dccf2",
                  borderLeft: "4px solid #0dccf2",
                }}
              />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: "#0dccf2" }}>L-2</span>
                <span className="text-[8px] font-bold" style={{ color: "#94a3b8" }}>STABLE</span>
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          {/* Demand Score */}
          <div
            className="rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ background: "linear-gradient(to right, transparent, rgba(13,204,242,0.5), transparent)" }}
            />
            <h3
              className="text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ color: "#94a3b8" }}
            >
              Demand Score
            </h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "4px solid rgba(255,255,255,0.05)" }}
              />
              <div
                className="absolute inset-0 rounded-full -rotate-12"
                style={{
                  border: "4px solid #0dccf2",
                  borderLeft: "4px solid transparent",
                }}
              />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black" style={{ color: "#0dccf2" }}>94</span>
                <span className="text-[8px] font-bold" style={{ color: "#94a3b8" }}>HOT</span>
              </div>
            </div>
            <div className="mt-4 flex gap-1">
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "#0dccf2" }} />
              <span className="w-1 h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>
          </div>
        </section>

        {/* Recent Auctions */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Listings</h2>
            <button
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-1"
              style={{ color: "#0dccf2" }}
            >
              View All <MaterialIcon name="chevron_right" className="text-sm" />
            </button>
          </div>
          <div className="space-y-3">
            {AUCTIONS.map((a) => (
              <div
                key={a.name}
                className="rounded-xl p-3 flex gap-4 items-center"
                style={{
                  background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                  border: "1px solid rgba(148,163,184,0.1)",
                  opacity: a.opacity,
                }}
              >
                <div
                  className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Image src={a.image} alt="" width={80} height={80} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{a.name}</h4>
                      <p className="text-[10px] font-medium tracking-tight" style={{ color: "#94a3b8" }}>
                        {a.source} &bull; {a.time}
                      </p>
                    </div>
                    <MaterialIcon name="verified" className="text-sm text-[#94a3b8]" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-extrabold" style={{ color: "#0dccf2" }}>
                      {a.price}
                    </span>
                    {a.oldPrice && (
                      <span className="text-[10px] line-through" style={{ color: "#94a3b8" }}>
                        {a.oldPrice}
                      </span>
                    )}
                    {a.tag && (
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: a.tagColor || "#94a3b8" }}
                      >
                        {a.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>
            Inventory
          </span>
        </Link>

        {/* Diamond Raised Button */}
        <Link href="/intelligence" className="flex flex-col items-center gap-1 relative">
          <div
            className="absolute -top-12 w-14 h-14 rounded-2xl flex items-center justify-center rotate-45"
            style={{
              background: "#0dccf2",
              boxShadow: "0 8px 20px rgba(13,204,242,0.4)",
              border: "4px solid #0a0a0a",
            }}
          >
            <MaterialIcon name="query_stats" className="text-[#0a0a0a] font-bold -rotate-45" />
          </div>
          <span
            className="text-[10px] font-black tracking-widest uppercase mt-4"
            style={{ color: "#0dccf2" }}
          >
            Insights
          </span>
        </Link>

        <Link href="/reports/monthly" className="flex flex-col items-center gap-1">
          <MaterialIcon name="description" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>
            Reports
          </span>
        </Link>

        <Link href="/settings" className="flex flex-col items-center gap-1">
          <MaterialIcon name="account_circle" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#94a3b8" }}>
            Settings
          </span>
        </Link>
      </nav>
    </div>
  );
}
