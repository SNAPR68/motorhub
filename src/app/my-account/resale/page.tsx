"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── static data ─────────────────────────────────────────────── */

const PURCHASE_PRICE = 920000;
const CURRENT_VALUE = 845000;
const DEPRECIATION = PURCHASE_PRICE - CURRENT_VALUE; // 75000
const DEPRECIATION_PCT = ((DEPRECIATION / PURCHASE_PRICE) * 100).toFixed(1); // 8.2

const VALUE_POINTS = [
  { month: "Jul", value: 920000 },
  { month: "Aug", value: 910000 },
  { month: "Sep", value: 898000 },
  { month: "Oct", value: 885000 },
  { month: "Nov", value: 872000 },
  { month: "Dec", value: 863000 },
  { month: "Jan", value: 855000 },
  { month: "Feb", value: 845000 },
];

const DEPRECIATION_BREAKDOWN = [
  { label: "Age depreciation", amount: "45,000", icon: "calendar_today" },
  { label: "KM depreciation", amount: "18,000", icon: "speed" },
  { label: "Market adjustment", amount: "12,000", icon: "trending_down" },
];

/* ── SVG chart helpers ───────────────────────────────────────── */

const CHART_W = 340;
const CHART_H = 140;
const CHART_PAD_X = 36;
const CHART_PAD_Y = 16;

function buildPolyline() {
  const minV = 840000;
  const maxV = 925000;
  const rangeV = maxV - minV;
  const usableW = CHART_W - CHART_PAD_X * 2;
  const usableH = CHART_H - CHART_PAD_Y * 2;

  const points = VALUE_POINTS.map((p, i) => {
    const x = CHART_PAD_X + (i / (VALUE_POINTS.length - 1)) * usableW;
    const y =
      CHART_PAD_Y + (1 - (p.value - minV) / rangeV) * usableH;
    return `${x},${y}`;
  }).join(" ");

  // area fill path
  const first = VALUE_POINTS[0];
  const last = VALUE_POINTS[VALUE_POINTS.length - 1];
  const firstX = CHART_PAD_X;
  const lastX = CHART_PAD_X + usableW;
  const areaPath = `M${firstX},${CHART_PAD_Y + (1 - (first.value - minV) / rangeV) * usableH} ${VALUE_POINTS.map((p, i) => {
    const x = CHART_PAD_X + (i / (VALUE_POINTS.length - 1)) * usableW;
    const y = CHART_PAD_Y + (1 - (p.value - minV) / rangeV) * usableH;
    return `L${x},${y}`;
  }).join(" ")} L${lastX},${CHART_H} L${firstX},${CHART_H} Z`;

  return { points, areaPath };
}

const { points: polylinePoints, areaPath } = buildPolyline();

/* ── page ─────────────────────────────────────────────────────── */

export default function ResaleValuePage() {
  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon
              name="arrow_back"
              className="text-[20px] text-slate-400"
            />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">
            Resale Value Tracker
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* ── Current Value Card ─────────────────────────────── */}
        <section
          className="rounded-2xl overflow-hidden border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="px-4 pt-4 pb-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(17,82,212,0.1) 0%, rgba(139,92,246,0.06) 100%)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Current Market Value
            </p>
            <h2 className="text-sm font-bold text-white mb-2">
              2022 Maruti Suzuki Brezza ZXi
            </h2>
            <p className="text-3xl font-black text-white leading-none">
              ₹8,45,000
            </p>
          </div>

          <div className="px-4 py-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-slate-600">Purchase Price</p>
              <p className="text-sm font-bold text-white">₹9,20,000</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-600">Depreciation</p>
              <p className="text-sm font-bold text-red-400">
                -₹75,000
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-600">Change</p>
              <div className="flex items-center gap-1">
                <MaterialIcon
                  name="trending_down"
                  className="text-[14px] text-red-400"
                />
                <p className="text-sm font-bold text-red-400">
                  -{DEPRECIATION_PCT}%
                </p>
              </div>
            </div>
          </div>

          {/* Trend badge */}
          <div className="px-4 pb-4">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <MaterialIcon
                name="south"
                className="text-[14px] text-red-400"
              />
              <span className="text-[11px] font-bold text-red-400">
                Declining trend over 8 months
              </span>
            </div>
          </div>
        </section>

        {/* ── Value Chart ────────────────────────────────────── */}
        <section
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <h3 className="text-sm font-bold text-white mb-3">
            Value Over Time
          </h3>
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient
                id="areaGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1152d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1152d4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[920, 880, 845].map((val) => {
              const y =
                CHART_PAD_Y +
                (1 - (val * 1000 - 840000) / 85000) * (CHART_H - CHART_PAD_Y * 2);
              return (
                <g key={val}>
                  <line
                    x1={CHART_PAD_X}
                    y1={y}
                    x2={CHART_W - CHART_PAD_X}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={CHART_PAD_X - 4}
                    y={y + 3}
                    textAnchor="end"
                    fill="#475569"
                    fontSize="8"
                  >
                    {val / 100}L
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#1152d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dots */}
            {VALUE_POINTS.map((p, i) => {
              const x =
                CHART_PAD_X +
                (i / (VALUE_POINTS.length - 1)) *
                  (CHART_W - CHART_PAD_X * 2);
              const y =
                CHART_PAD_Y +
                (1 - (p.value - 840000) / 85000) *
                  (CHART_H - CHART_PAD_Y * 2);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="3.5" fill="#1152d4" />
                  <circle
                    cx={x}
                    cy={y}
                    r="1.5"
                    fill="#fff"
                  />
                </g>
              );
            })}

            {/* X labels */}
            {VALUE_POINTS.map((p, i) => {
              const x =
                CHART_PAD_X +
                (i / (VALUE_POINTS.length - 1)) *
                  (CHART_W - CHART_PAD_X * 2);
              return (
                <text
                  key={i}
                  x={x}
                  y={CHART_H + 4}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="8"
                >
                  {p.month}
                </text>
              );
            })}
          </svg>
        </section>

        {/* ── Market Insight ─────────────────────────────────── */}
        <section
          className="rounded-2xl p-4 border border-white/5"
          style={{
            background: "rgba(139,92,246,0.04)",
            borderColor: "rgba(139,92,246,0.12)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="insights"
              className="text-[18px]"
              style={{ color: "#8b5cf6" }}
            />
            <h3 className="text-sm font-bold text-white">
              Market Insight
            </h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <MaterialIcon
                name="schedule"
                className="text-[16px] text-purple-400 mt-0.5 shrink-0"
              />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">
                  Best time to sell:
                </span>{" "}
                Next 3 months before BS-VI price correction
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <MaterialIcon
                name="directions_car"
                className="text-[16px] text-purple-400 mt-0.5 shrink-0"
              />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">
                  Similar Brezzas in your area:
                </span>{" "}
                ₹8.2L - ₹9.1L
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <MaterialIcon
                name="location_on"
                className="text-[16px] text-purple-400 mt-0.5 shrink-0"
              />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-white">
                  Demand in Delhi:
                </span>{" "}
                <span className="text-emerald-400 font-bold">High</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Depreciation Breakdown ─────────────────────────── */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3">
            Depreciation Breakdown
          </h3>
          <div className="space-y-2">
            {DEPRECIATION_BREAKDOWN.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.08)" }}
                  >
                    <MaterialIcon
                      name={item.icon}
                      className="text-[18px] text-red-400"
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-red-400">
                  -₹{item.amount}
                </span>
              </div>
            ))}
          </div>

          {/* Total bar */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-2xl mt-2"
            style={{
              background: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <span className="text-sm font-bold text-white">
              Total Depreciation
            </span>
            <span className="text-sm font-black text-red-400">
              -₹75,000
            </span>
          </div>
        </section>

        {/* ── Quick Actions ──────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-3">
          <Link
            href="/sell-car"
            className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="sell" className="text-[18px]" />
            Sell Now
          </Link>
          <Link
            href="/used-cars/valuation"
            className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)", color: "#e2e8f0" }}
          >
            <MaterialIcon name="calculate" className="text-[18px]" />
            Get Valuation
          </Link>
        </section>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
