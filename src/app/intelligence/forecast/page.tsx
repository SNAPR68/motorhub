"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: DemandPulse — Market Forecasting */
/* Design tokens: #0dccf2 (cyan), Manrope, #0a0a0a bg, #161b1d card */

/* ── types ── */
type Segment = "Hatchbacks" | "Sedans" | "SUVs" | "Premium";

interface SegmentData {
  label: string;
  icon: string;
  score: number;
  trend: string;
  trendColor: string;
  summary: string;
  priceChange: string;
  priceForecast: number[]; // 6 data points: 3 actual + 3 forecast
}

/* ── segment health data ── */
const SEGMENTS: Record<Segment, SegmentData> = {
  Hatchbacks: {
    label: "Hatchbacks",
    icon: "directions_car",
    score: 72,
    trend: "Stable",
    trendColor: "#10b981",
    summary: "Steady demand, limited new supply",
    priceChange: "Flat",
    priceForecast: [5.2, 5.3, 5.2, 5.2, 5.1, 5.2],
  },
  Sedans: {
    label: "Sedans",
    icon: "local_taxi",
    score: 45,
    trend: "Declining",
    trendColor: "#ef4444",
    summary: "SUV preference eroding sedan demand",
    priceChange: "-8 to 12%",
    priceForecast: [9.8, 9.5, 9.2, 8.9, 8.6, 8.4],
  },
  SUVs: {
    label: "SUVs",
    icon: "airport_shuttle",
    score: 88,
    trend: "Strong",
    trendColor: "#10b981",
    summary: "Highest demand, fast turnover",
    priceChange: "-3 to 5%",
    priceForecast: [12.5, 12.8, 12.6, 12.3, 12.1, 12.0],
  },
  Premium: {
    label: "Premium / Luxury",
    icon: "star",
    score: 55,
    trend: "Neutral",
    trendColor: "#f59e0b",
    summary: "Selective demand, longer hold times",
    priceChange: "-2 to 4%",
    priceForecast: [28.0, 27.5, 27.8, 27.3, 27.0, 26.8],
  },
};

/* ── competitor pricing data ── */
const MODELS_COMPARE = ["Creta", "Seltos", "Nexon", "Swift", "City"] as const;
type CompareModel = (typeof MODELS_COMPARE)[number];

interface CompetitorPricing {
  carDekho: string;
  olx: string;
  autovinci: string;
  vsCarDekho: string;
  vsOLX: string;
}

const COMPETITOR_DATA: Record<CompareModel, CompetitorPricing> = {
  Creta: {
    carDekho: "₹8.4L",
    olx: "₹7.9L",
    autovinci: "₹8.1L",
    vsCarDekho: "3.6% below",
    vsOLX: "2.5% above",
  },
  Seltos: {
    carDekho: "₹9.2L",
    olx: "₹8.6L",
    autovinci: "₹8.9L",
    vsCarDekho: "3.3% below",
    vsOLX: "3.5% above",
  },
  Nexon: {
    carDekho: "₹7.8L",
    olx: "₹7.2L",
    autovinci: "₹7.5L",
    vsCarDekho: "3.8% below",
    vsOLX: "4.2% above",
  },
  Swift: {
    carDekho: "₹5.6L",
    olx: "₹5.1L",
    autovinci: "₹5.3L",
    vsCarDekho: "5.4% below",
    vsOLX: "3.9% above",
  },
  City: {
    carDekho: "₹10.8L",
    olx: "₹10.1L",
    autovinci: "₹10.4L",
    vsCarDekho: "3.7% below",
    vsOLX: "3.0% above",
  },
};

/* ── actionable insights ── */
const INSIGHTS = [
  {
    icon: "trending_up",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    title: "Stock up on Creta / Seltos",
    detail: "Demand rising 15% next quarter",
  },
  {
    icon: "trending_down",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    title: "Offload Venue inventory",
    detail: "Prices dropping 8% in 60 days",
  },
  {
    icon: "verified",
    color: "#0dccf2",
    bg: "rgba(13,204,242,0.1)",
    title: "Swift remains evergreen",
    detail: "Consistent 22-day turnover",
  },
];

/* ── SVG path helpers ── */
function buildLinePath(data: number[], w: number, h: number, padding: number): string {
  const minV = Math.min(...data) * 0.9;
  const maxV = Math.max(...data) * 1.05;
  const range = maxV - minV || 1;
  const stepX = w / (data.length - 1);

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: padding + (1 - (v - minV) / range) * (h - padding * 2),
  }));

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    d += ` C${cpx},${points[i - 1].y} ${cpx},${points[i].y} ${points[i].x},${points[i].y}`;
  }
  return d;
}

/* ── component ── */
export default function ForecastPage() {
  const [compareModel, setCompareModel] = useState<CompareModel>("Creta");
  const pricing = COMPETITOR_DATA[compareModel];

  const W = 400;
  const H = 140;
  const PAD = 10;

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
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
          <Link href="/intelligence" className="p-1">
            <MaterialIcon name="arrow_back" className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">
              Market <span style={{ color: "#0dccf2" }}>Forecast</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide" style={{ color: "#94a3b8" }}>
              AI-powered predictions for next 90 days
            </p>
          </div>
        </div>
        <div
          className="size-10 rounded-full p-0.5 flex items-center justify-center"
          style={{ border: "2px solid rgba(13,204,242,0.3)" }}
        >
          <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
            AV
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
        {/* ── Market Overview ── */}
        <section
          className="rounded-2xl p-5 mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div
            className="absolute top-0 left-0 w-full h-0.5"
            style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)" }}
          />
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                Overall Market Trend
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold" style={{ color: "#f59e0b" }}>
                  Bearish
                </span>
                <MaterialIcon name="south_east" className="text-lg" style={{ color: "#f59e0b" }} />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
                Confidence
              </span>
              <span className="text-xl font-extrabold" style={{ color: "#0dccf2" }}>
                78%
              </span>
            </div>
          </div>
          <p className="text-xs font-medium leading-relaxed" style={{ color: "#94a3b8" }}>
            New model launches depressing used car prices in SUV segment. Sedan market continues to weaken as
            buyers shift to compact SUVs.
          </p>

          {/* Confidence bar */}
          <div className="mt-4">
            <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: "78%",
                  background: "linear-gradient(to right, #0dccf2, #f59e0b)",
                }}
              />
            </div>
          </div>
        </section>

        {/* ── Segment Health Dashboard ── */}
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: "#94a3b8" }}
          >
            <MaterialIcon name="dashboard" className="text-sm text-[#0dccf2]" /> Segment Health
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(SEGMENTS) as Segment[]).map((seg) => {
              const s = SEGMENTS[seg];
              return (
                <div
                  key={seg}
                  className="rounded-xl p-4 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-0.5"
                    style={{ background: `linear-gradient(to right, transparent, ${s.trendColor}60, transparent)` }}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <MaterialIcon name={s.icon} className="text-base" style={{ color: s.trendColor }} />
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${s.trendColor}15`, color: s.trendColor }}
                    >
                      {s.trend}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">{s.label}</h3>

                  {/* Score ring */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke={s.trendColor}
                          strokeWidth="3"
                          strokeDasharray={`${(s.score / 100) * 94.2} 94.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span
                        className="absolute text-[10px] font-extrabold"
                        style={{ color: s.trendColor }}
                      >
                        {s.score}
                      </span>
                    </div>
                    <span className="text-[9px] font-medium leading-tight" style={{ color: "#94a3b8" }}>
                      {s.summary}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Price Forecast Chart ── */}
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: "#94a3b8" }}
          >
            <MaterialIcon name="auto_graph" className="text-sm text-[#0dccf2]" /> 90-Day Price Forecast
          </h2>

          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            {/* Chart legend */}
            <div className="flex items-center gap-4 mb-3 text-[10px] font-bold" style={{ color: "#94a3b8" }}>
              {(Object.keys(SEGMENTS) as Segment[]).map((seg) => (
                <span key={seg} className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: SEGMENTS[seg].trendColor }}
                  />
                  {SEGMENTS[seg].label.replace(" / Luxury", "")}
                </span>
              ))}
            </div>

            <div className="relative w-full" style={{ height: 160 }}>
              <svg className="w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((pct) => (
                  <line
                    key={pct}
                    x1={0}
                    y1={H * pct}
                    x2={W}
                    y2={H * pct}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}

                {/* Forecast divider — vertical dashed line at midpoint */}
                <line
                  x1={W / 2}
                  y1={0}
                  x2={W / 2}
                  y2={H}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />

                {/* Segment lines */}
                {(Object.keys(SEGMENTS) as Segment[]).map((seg) => {
                  const s = SEGMENTS[seg];
                  const actual = s.priceForecast.slice(0, 3);
                  const forecast = s.priceForecast.slice(2); // overlap at point 3

                  // Normalize all to same scale for comparison
                  const allVals = Object.values(SEGMENTS).flatMap((x) => x.priceForecast);
                  const minV = Math.min(...allVals) * 0.85;
                  const maxV = Math.max(...allVals) * 1.05;
                  const range = maxV - minV || 1;

                  const toY = (v: number) => PAD + (1 - (v - minV) / range) * (H - PAD * 2);
                  const stepActual = (W / 2) / (actual.length - 1);
                  const stepForecast = (W / 2) / (forecast.length - 1);

                  const actualPoints = actual.map((v, i) => `${i * stepActual},${toY(v)}`).join(" L");
                  const forecastPoints = forecast.map((v, i) => `${W / 2 + i * stepForecast},${toY(v)}`).join(" L");

                  return (
                    <g key={seg}>
                      <path
                        d={`M${actualPoints}`}
                        fill="transparent"
                        stroke={s.trendColor}
                        strokeWidth="2.5"
                        style={{ filter: `drop-shadow(0 0 3px ${s.trendColor})` }}
                      />
                      <path
                        d={`M${forecastPoints}`}
                        fill="transparent"
                        stroke={s.trendColor}
                        strokeWidth="2"
                        strokeDasharray="6,4"
                        opacity="0.6"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X-axis */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                {["Jan", "Feb", "Today", "+30d", "+60d", "+90d"].map((label) => (
                  <span
                    key={label}
                    className="text-[9px] font-bold"
                    style={{ color: label.startsWith("+") ? "#0dccf2" : "#94a3b8" }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Annotation */}
              <div
                className="absolute top-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  right: 0,
                  background: "rgba(13,204,242,0.1)",
                  color: "#0dccf2",
                }}
              >
                Forecast zone
              </div>
              <div
                className="absolute top-1 text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  left: 0,
                  background: "rgba(148,163,184,0.1)",
                  color: "#94a3b8",
                }}
              >
                Actual
              </div>
            </div>

            {/* Change summaries */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {(Object.keys(SEGMENTS) as Segment[]).map((seg) => {
                const s = SEGMENTS[seg];
                return (
                  <div key={seg} className="text-center">
                    <p className="text-[9px] font-bold uppercase" style={{ color: "#94a3b8" }}>
                      {s.label.replace(" / Luxury", "")}
                    </p>
                    <p className="text-xs font-extrabold" style={{ color: s.trendColor }}>
                      {s.priceChange}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Competitor Price Monitor ── */}
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: "#94a3b8" }}
          >
            <MaterialIcon name="monitoring" className="text-sm text-[#0dccf2]" /> Competitor Price Monitor
          </h2>

          {/* Model tabs */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
            {MODELS_COMPARE.map((m) => (
              <button
                key={m}
                onClick={() => setCompareModel(m)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                style={{
                  background: compareModel === m ? "#0dccf2" : "rgba(255,255,255,0.05)",
                  color: compareModel === m ? "#0a0a0a" : "#94a3b8",
                  border: compareModel === m ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            {/* Platform rows */}
            <div className="space-y-3 mb-4">
              {[
                { name: "CarDekho", price: pricing.carDekho, color: "#ef4444" },
                { name: "OLX", price: pricing.olx, color: "#f59e0b" },
                { name: "Autovinci", price: pricing.autovinci, color: "#0dccf2" },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: platform.color }}
                    />
                    <span className="text-xs font-semibold text-white">{platform.name}</span>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color: platform.color }}>
                    {platform.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Comparison insight */}
            <div
              className="rounded-lg p-3 text-xs font-medium leading-relaxed"
              style={{
                background: "rgba(13,204,242,0.05)",
                border: "1px solid rgba(13,204,242,0.1)",
                color: "#94a3b8",
              }}
            >
              <span style={{ color: "#0dccf2" }}>You&apos;re</span> {pricing.vsCarDekho} CarDekho,{" "}
              {pricing.vsOLX} OLX for {compareModel}
            </div>
          </div>
        </section>

        {/* ── Actionable Insights ── */}
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
            style={{ color: "#94a3b8" }}
          >
            <MaterialIcon name="lightbulb" className="text-sm text-[#0dccf2]" /> Actionable Insights
          </h2>
          <div className="space-y-3">
            {INSIGHTS.map((insight) => (
              <div
                key={insight.title}
                className="rounded-xl p-4 flex items-start gap-3 relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                  border: "1px solid rgba(148,163,184,0.1)",
                }}
              >
                <div
                  className="absolute top-0 left-0 w-0.5 h-full"
                  style={{ background: insight.color }}
                />
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: insight.bg }}
                >
                  <MaterialIcon name={insight.icon} className="text-base" style={{ color: insight.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color: "#94a3b8" }}>
                    {insight.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bank / NBFC Data Point ── */}
        <section className="mb-4">
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(13,204,242,0.15)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-0.5"
              style={{ background: "linear-gradient(to right, transparent, #0dccf240, transparent)" }}
            />
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(13,204,242,0.1)" }}
              >
                <MaterialIcon name="account_balance" className="text-lg" style={{ color: "#0dccf2" }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1">Lender Fair Market Values</h3>
                <p className="text-[11px] font-medium leading-relaxed" style={{ color: "#94a3b8" }}>
                  Bank &amp; NBFC fair market values updated daily. Pricing validated against
                  ICICI, HDFC, SBI, and Bajaj Finance benchmarks.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(13,204,242,0.1)",
                      color: "#0dccf2",
                      border: "1px solid rgba(13,204,242,0.2)",
                    }}
                  >
                    API available for Enterprise
                  </span>
                  <span
                    className="flex items-center gap-1 text-[9px] font-bold"
                    style={{ color: "#10b981" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#10b981" }}
                    />
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t md:hidden"
        style={{
          background: "rgba(10,10,10,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Inventory</span>
        </Link>
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
