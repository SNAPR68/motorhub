"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: DemandPulse — Depreciation Curves & Heatmaps */
/* Design tokens: #0dccf2 (cyan), Manrope, #0a0a0a bg, #161b1d card */

const MODELS = ["Swift", "Creta", "Nexon", "Venue", "Brezza"] as const;
type Model = (typeof MODELS)[number];

/* ── depreciation data by model ── */
interface DepreciationData {
  newPrice: number; // in lakhs
  curve: number[]; // value at year 0..8 in lakhs
  firstYearDrop: string;
  annualAvg: string;
  buySpot: string;
  sellSpot: string;
  daysToSell: number;
}

const MODEL_DATA: Record<Model, DepreciationData> = {
  Swift: {
    newPrice: 8.0,
    curve: [8.0, 6.24, 5.44, 4.8, 4.24, 3.76, 3.36, 3.04, 2.8],
    firstYearDrop: "-22%",
    annualAvg: "-8%",
    buySpot: "3-4 years",
    sellSpot: "Before year 5",
    daysToSell: 22,
  },
  Creta: {
    newPrice: 12.5,
    curve: [12.5, 10.0, 8.75, 7.5, 6.5, 5.6, 5.0, 4.5, 4.1],
    firstYearDrop: "-20%",
    annualAvg: "-9%",
    buySpot: "2-3 years",
    sellSpot: "Before year 4",
    daysToSell: 18,
  },
  Nexon: {
    newPrice: 10.0,
    curve: [10.0, 7.8, 6.8, 5.9, 5.2, 4.5, 4.0, 3.6, 3.3],
    firstYearDrop: "-22%",
    annualAvg: "-8%",
    buySpot: "3-4 years",
    sellSpot: "Before year 5",
    daysToSell: 28,
  },
  Venue: {
    newPrice: 9.5,
    curve: [9.5, 7.2, 6.2, 5.3, 4.6, 3.9, 3.4, 3.0, 2.7],
    firstYearDrop: "-24%",
    annualAvg: "-9%",
    buySpot: "3-4 years",
    sellSpot: "Before year 4",
    daysToSell: 45,
  },
  Brezza: {
    newPrice: 9.0,
    curve: [9.0, 7.2, 6.3, 5.5, 4.8, 4.2, 3.8, 3.4, 3.1],
    firstYearDrop: "-20%",
    annualAvg: "-7%",
    buySpot: "3-4 years",
    sellSpot: "Before year 5",
    daysToSell: 24,
  },
};

/* Market average depreciation curve (for comparison line) */
const MARKET_AVG = [10.0, 7.6, 6.5, 5.6, 4.8, 4.2, 3.7, 3.3, 3.0];

/* ── demand heatmap data ── */
const CITIES = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Jaipur", "Ahmedabad"] as const;

type DemandLevel = "high" | "medium" | "low";

interface CityDemand {
  level: DemandLevel;
  change: string; // e.g. "+23%"
}

const DEMAND_MAP: Record<Model, Record<string, CityDemand>> = {
  Swift: {
    Delhi: { level: "high", change: "+18%" },
    Mumbai: { level: "high", change: "+15%" },
    Bangalore: { level: "medium", change: "+8%" },
    Chennai: { level: "medium", change: "+5%" },
    Hyderabad: { level: "medium", change: "+10%" },
    Pune: { level: "high", change: "+20%" },
    Jaipur: { level: "low", change: "-2%" },
    Ahmedabad: { level: "medium", change: "+6%" },
  },
  Creta: {
    Delhi: { level: "high", change: "+22%" },
    Mumbai: { level: "high", change: "+19%" },
    Bangalore: { level: "high", change: "+25%" },
    Chennai: { level: "medium", change: "+12%" },
    Hyderabad: { level: "high", change: "+17%" },
    Pune: { level: "high", change: "+23%" },
    Jaipur: { level: "medium", change: "+9%" },
    Ahmedabad: { level: "medium", change: "+11%" },
  },
  Nexon: {
    Delhi: { level: "medium", change: "+10%" },
    Mumbai: { level: "medium", change: "+12%" },
    Bangalore: { level: "high", change: "+18%" },
    Chennai: { level: "low", change: "+3%" },
    Hyderabad: { level: "medium", change: "+8%" },
    Pune: { level: "high", change: "+16%" },
    Jaipur: { level: "low", change: "-1%" },
    Ahmedabad: { level: "low", change: "+2%" },
  },
  Venue: {
    Delhi: { level: "low", change: "-5%" },
    Mumbai: { level: "medium", change: "+6%" },
    Bangalore: { level: "medium", change: "+7%" },
    Chennai: { level: "low", change: "-3%" },
    Hyderabad: { level: "low", change: "-2%" },
    Pune: { level: "medium", change: "+4%" },
    Jaipur: { level: "low", change: "-6%" },
    Ahmedabad: { level: "low", change: "-4%" },
  },
  Brezza: {
    Delhi: { level: "high", change: "+16%" },
    Mumbai: { level: "medium", change: "+11%" },
    Bangalore: { level: "medium", change: "+9%" },
    Chennai: { level: "medium", change: "+7%" },
    Hyderabad: { level: "high", change: "+14%" },
    Pune: { level: "medium", change: "+10%" },
    Jaipur: { level: "high", change: "+19%" },
    Ahmedabad: { level: "medium", change: "+8%" },
  },
};

/* ── supply vs demand data ── */
interface SupplyDemand {
  city: string;
  supply: number;
  demand: number;
}

const SUPPLY_DEMAND: Record<Model, SupplyDemand[]> = {
  Swift: [
    { city: "Delhi", supply: 340, demand: 280 },
    { city: "Mumbai", supply: 190, demand: 250 },
    { city: "Bangalore", supply: 220, demand: 200 },
    { city: "Pune", supply: 140, demand: 180 },
    { city: "Hyderabad", supply: 160, demand: 150 },
  ],
  Creta: [
    { city: "Delhi", supply: 280, demand: 350 },
    { city: "Mumbai", supply: 220, demand: 310 },
    { city: "Bangalore", supply: 300, demand: 320 },
    { city: "Pune", supply: 120, demand: 190 },
    { city: "Chennai", supply: 150, demand: 140 },
  ],
  Nexon: [
    { city: "Delhi", supply: 200, demand: 180 },
    { city: "Mumbai", supply: 160, demand: 190 },
    { city: "Bangalore", supply: 240, demand: 260 },
    { city: "Pune", supply: 130, demand: 170 },
    { city: "Hyderabad", supply: 110, demand: 100 },
  ],
  Venue: [
    { city: "Delhi", supply: 180, demand: 120 },
    { city: "Mumbai", supply: 150, demand: 130 },
    { city: "Bangalore", supply: 130, demand: 110 },
    { city: "Pune", supply: 90, demand: 70 },
    { city: "Chennai", supply: 100, demand: 80 },
  ],
  Brezza: [
    { city: "Delhi", supply: 260, demand: 290 },
    { city: "Mumbai", supply: 180, demand: 200 },
    { city: "Bangalore", supply: 170, demand: 160 },
    { city: "Jaipur", supply: 100, demand: 150 },
    { city: "Hyderabad", supply: 190, demand: 210 },
  ],
};

/* ── helpers ── */
const DEMAND_COLORS: Record<DemandLevel, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#3b82f6",
};

const DEMAND_BG: Record<DemandLevel, string> = {
  high: "rgba(239,68,68,0.15)",
  medium: "rgba(245,158,11,0.15)",
  low: "rgba(59,130,246,0.15)",
};

function formatL(n: number): string {
  return `₹${n.toFixed(1)}L`;
}

/* ── SVG helpers ── */
function buildCurvePath(data: number[], maxVal: number, w: number, h: number): string {
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => ({
    x: i * stepX,
    y: h - (v / maxVal) * h * 0.85 - h * 0.05,
  }));

  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    d += ` C${cpx},${points[i - 1].y} ${cpx},${points[i].y} ${points[i].x},${points[i].y}`;
  }
  return d;
}

function buildAreaPath(data: number[], maxVal: number, w: number, h: number): string {
  const curve = buildCurvePath(data, maxVal, w, h);
  return `${curve} L${w},${h} L0,${h} Z`;
}

/* ── component ── */
export default function DepreciationPage() {
  const [selected, setSelected] = useState<Model>("Creta");
  const data = MODEL_DATA[selected];
  const demand = DEMAND_MAP[selected];
  const supplyDemand = SUPPLY_DEMAND[selected];

  const maxVal = Math.max(data.newPrice, ...MARKET_AVG);
  const W = 400;
  const H = 180;

  const curvePath = buildCurvePath(data.curve, maxVal, W, H);
  const areaPath = buildAreaPath(data.curve, maxVal, W, H);
  const avgPath = buildCurvePath(MARKET_AVG, maxVal, W, H);

  // Key annotation points: year 3 and year 5
  const stepX = W / (data.curve.length - 1);
  const y3 = H - (data.curve[3] / maxVal) * H * 0.85 - H * 0.05;
  const y5 = H - (data.curve[5] / maxVal) * H * 0.85 - H * 0.05;
  const retainedY3 = Math.round((data.curve[3] / data.curve[0]) * 100);
  const retainedY5 = Math.round((data.curve[5] / data.curve[0]) * 100);

  // Inventory bar chart data
  const inventoryModels = MODELS.map((m) => ({
    name: m,
    days: MODEL_DATA[m].daysToSell,
  }));
  const maxDays = Math.max(...inventoryModels.map((m) => m.days));

  /* ── stat cards ── */
  const statCards = [
    { icon: "trending_down", label: "First year drop", value: data.firstYearDrop, color: "#ef4444" },
    { icon: "show_chart", label: "Annual avg after yr 1", value: data.annualAvg, color: "#f59e0b" },
    { icon: "shopping_cart", label: "Sweet spot to buy", value: data.buySpot, color: "#10b981" },
    { icon: "sell", label: "Sweet spot to sell", value: data.sellSpot, color: "#0dccf2" },
  ];

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
              Depreciation &amp; <span style={{ color: "#0dccf2" }}>Demand</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide" style={{ color: "#94a3b8" }}>
              Real market data, updated weekly
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

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* ── Model Selector ── */}
        <div className="flex gap-2 py-4 overflow-x-auto no-scrollbar">
          {MODELS.map((m) => (
            <button
              key={m}
              onClick={() => setSelected(m)}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              style={{
                background: selected === m ? "#0dccf2" : "rgba(255,255,255,0.05)",
                color: selected === m ? "#0a0a0a" : "#94a3b8",
                border: selected === m ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* ── Depreciation Curve ── */}
        <section
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
            border: "1px solid rgba(148,163,184,0.1)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                Depreciation Curve
              </h2>
              <p className="text-sm font-semibold text-white">
                {selected} &mdash; {formatL(data.newPrice)} new
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold" style={{ color: "#94a3b8" }}>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded" style={{ background: "#0dccf2" }} />
                {selected}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded" style={{ background: "#94a3b8", opacity: 0.5 }} />
                Avg
              </span>
            </div>
          </div>

          <div className="relative w-full" style={{ height: 200 }}>
            <svg className="w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0dccf2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0dccf2" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y grid lines */}
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

              {/* Area fill */}
              <path d={areaPath} fill="url(#depGrad)" />

              {/* Market average dashed line */}
              <path
                d={avgPath}
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.4"
              />

              {/* Main curve */}
              <path
                d={curvePath}
                fill="transparent"
                stroke="#0dccf2"
                strokeWidth="3"
                style={{ filter: "drop-shadow(0 0 4px #0dccf2)" }}
              />

              {/* Annotation dots */}
              <circle cx={3 * stepX} cy={y3} r="5" fill="#0dccf2" />
              <circle cx={5 * stepX} cy={y5} r="5" fill="#f59e0b" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} className="text-[9px] font-bold" style={{ color: "#94a3b8" }}>
                  {i === 0 ? "New" : `Y${i}`}
                </span>
              ))}
            </div>

            {/* Annotation labels */}
            <div
              className="absolute text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                left: `${(3 / 8) * 100}%`,
                top: `${(y3 / H) * 100 - 14}%`,
                background: "rgba(13,204,242,0.15)",
                color: "#0dccf2",
                transform: "translateX(-50%)",
              }}
            >
              Yr 3: {retainedY3}% retained
            </div>
            <div
              className="absolute text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                left: `${(5 / 8) * 100}%`,
                top: `${(y5 / H) * 100 + 6}%`,
                background: "rgba(245,158,11,0.15)",
                color: "#f59e0b",
                transform: "translateX(-50%)",
              }}
            >
              Yr 5: {retainedY5}% retained
            </div>
          </div>
        </section>

        {/* ── Key Depreciation Stats ── */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                border: "1px solid rgba(148,163,184,0.1)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{ background: `linear-gradient(to right, transparent, ${s.color}40, transparent)` }}
              />
              <MaterialIcon name={s.icon} className="text-base mb-2" style={{ color: s.color }} />
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                {s.label}
              </p>
              <p className="text-lg font-extrabold" style={{ color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </section>

        {/* ── Demand Heatmap ── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#94a3b8" }}>
            <MaterialIcon name="map" className="text-sm text-[#0dccf2]" /> Demand Heatmap &mdash; {selected}
          </h2>
          <div
            className="rounded-2xl p-4"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div className="space-y-2">
              {CITIES.map((city) => {
                const d = demand[city];
                return (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white w-24 shrink-0">{city}</span>
                    <div className="flex-1 mx-3">
                      <div
                        className="h-5 rounded-md flex items-center px-2"
                        style={{
                          background: DEMAND_BG[d.level],
                          width: d.level === "high" ? "100%" : d.level === "medium" ? "65%" : "35%",
                        }}
                      >
                        <span className="text-[9px] font-bold uppercase" style={{ color: DEMAND_COLORS[d.level] }}>
                          {d.level}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold tabular-nums w-12 text-right"
                      style={{ color: d.change.startsWith("-") ? "#ef4444" : "#10b981" }}
                    >
                      {d.change}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {(["high", "medium", "low"] as DemandLevel[]).map((lvl) => (
                <span key={lvl} className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: "#94a3b8" }}>
                  <span className="w-2 h-2 rounded-sm" style={{ background: DEMAND_COLORS[lvl] }} />
                  {lvl}
                </span>
              ))}
              <span className="ml-auto text-[9px] font-medium" style={{ color: "#94a3b880" }}>
                This month vs last
              </span>
            </div>
          </div>
        </section>

        {/* ── Supply vs Demand ── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#94a3b8" }}>
            <MaterialIcon name="balance" className="text-sm text-[#0dccf2]" /> Supply vs Demand
          </h2>
          <div className="space-y-3">
            {supplyDemand.map((sd) => {
              const ratio = sd.supply / sd.demand;
              const isOver = ratio > 1.05;
              const isUnder = ratio < 0.95;
              const status = isOver ? "Oversupplied" : isUnder ? "Undersupplied" : "Balanced";
              const statusColor = isOver ? "#ef4444" : isUnder ? "#10b981" : "#f59e0b";

              return (
                <div
                  key={sd.city}
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{
                    background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                    border: "1px solid rgba(148,163,184,0.1)",
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{sd.city}</h3>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: "#94a3b8" }}>
                      Supply {sd.supply} / Demand {sd.demand}
                    </p>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: `${statusColor}15`, color: statusColor }}
                  >
                    {status}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Inventory Intelligence — Days to Sell ── */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#94a3b8" }}>
            <MaterialIcon name="inventory_2" className="text-sm text-[#0dccf2]" /> Avg Days to Sell
          </h2>
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div className="space-y-3">
              {inventoryModels.map((m) => {
                const pct = (m.days / maxDays) * 100;
                const barColor =
                  m.days <= 22 ? "#10b981" : m.days <= 30 ? "#0dccf2" : m.days <= 40 ? "#f59e0b" : "#ef4444";
                const isSelected = m.name === selected;

                return (
                  <div key={m.name} className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold w-16 shrink-0"
                      style={{ color: isSelected ? "#0dccf2" : "#94a3b8" }}
                    >
                      {m.name}
                    </span>
                    <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div
                        className="h-full rounded-md flex items-center justify-end pr-2 transition-all duration-500"
                        style={{ width: `${pct}%`, background: `${barColor}30` }}
                      >
                        <span className="text-[10px] font-bold" style={{ color: barColor }}>
                          {m.days}d
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
