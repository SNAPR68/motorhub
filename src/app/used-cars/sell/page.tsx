"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const RECENT_SALES = [
  { name: "Hyundai Creta", year: 2021, price: "₹8.4L", fuel: "Petrol", km: "38,200 km", daysAgo: 2 },
  { name: "Maruti Swift", year: 2020, price: "₹4.9L", fuel: "Petrol", km: "52,100 km", daysAgo: 5 },
  { name: "Tata Nexon", year: 2022, price: "₹11.2L", fuel: "Diesel", km: "21,800 km", daysAgo: 7 },
];

const WHY_SELL = [
  {
    icon: "bolt",
    title: "Fastest Payout",
    desc: "Money in your account within 24 hours of inspection.",
  },
  {
    icon: "psychology",
    title: "Best Price AI",
    desc: "Live market data across 80+ cities prices your car fairly.",
  },
  {
    icon: "description",
    title: "Zero Paperwork",
    desc: "We handle RC transfer, NOC, and all documentation.",
  },
  {
    icon: "garage",
    title: "Doorstep Pickup",
    desc: "Inspector comes to you. No need to visit any office.",
  },
];

const STEPS = [
  {
    num: 1,
    icon: "timer",
    title: "Instant Valuation",
    sub: "60 seconds",
    desc: "AI-powered pricing based on live market demand, condition & mileage.",
    color: "#1152d4",
  },
  {
    num: 2,
    icon: "home_pin",
    title: "Home Inspection",
    sub: "Free · At your doorstep",
    desc: "Certified inspector visits you. 250-point check, 45 min, zero cost.",
    color: "#10b981",
  },
  {
    num: 3,
    icon: "local_offer",
    title: "Best Offer",
    sub: "Guaranteed price",
    desc: "We beat any competing offer or pay you ₹5,000 as compensation.",
    color: "#f59e0b",
  },
  {
    num: 4,
    icon: "payments",
    title: "Instant Payment + RC Transfer",
    sub: "Same day",
    desc: "NEFT/IMPS to your bank account. RC transfer handled end-to-end.",
    color: "#a855f7",
  },
];

export default function SellCarPage() {
  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/used-cars"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1">
            <h1 className="text-[15px] font-bold text-white leading-tight">
              Sell Your Car
            </h1>
            <p className="text-[11px] text-slate-500">
              India&apos;s fastest car selling platform
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* ─── HERO CARD ─── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #065f46 0%, #047857 45%, #10b981 100%)",
          }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-3"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <MaterialIcon name="trending_up" className="text-[13px] text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                AI Price Boost
              </span>
            </div>
            <p className="text-[26px] font-black text-white leading-tight">
              Get{" "}
              <span
                className="px-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                ₹82,000
              </span>
            </p>
            <p className="text-[15px] font-semibold text-emerald-100 mt-1">
              more than market average
            </p>
            <p className="text-[12px] text-emerald-200 mt-2 leading-relaxed">
              Our AI analyses 2.4M+ transactions across India to price your car at its peak market value — not the average.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="text-[11px] text-emerald-300">Avg. sale time</p>
                <p className="text-[15px] font-bold text-white">3.2 days</p>
              </div>
              <div
                className="w-px h-8 self-center"
                style={{ background: "rgba(255,255,255,0.2)" }}
              />
              <div>
                <p className="text-[11px] text-emerald-300">Cars sold today</p>
                <p className="text-[15px] font-bold text-white">47</p>
              </div>
              <div
                className="w-px h-8 self-center"
                style={{ background: "rgba(255,255,255,0.2)" }}
              />
              <div>
                <p className="text-[11px] text-emerald-300">Satisfaction</p>
                <p className="text-[15px] font-bold text-white">98.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN CTA ─── */}
        <Link
          href="/used-cars/sell/evaluate"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #1152d4 0%, #1d4ed8 100%)",
            boxShadow: "0 8px 32px rgba(17,82,212,0.4)",
          }}
        >
          <MaterialIcon name="speed" className="text-[20px]" />
          Start Valuation — Free
          <MaterialIcon name="arrow_forward" className="text-[18px]" />
        </Link>

        {/* ─── STEP TIMELINE ─── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            How it works
          </p>
          <div className="space-y-0">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="flex gap-4">
                {/* Left: connector + circle */}
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: `${step.color}1a`,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    <MaterialIcon
                      name={step.icon}
                      className="text-[18px]"
                      style={{ color: step.color }}
                    />
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="w-px flex-1 my-1"
                      style={{ background: "rgba(255,255,255,0.07)", minHeight: "24px" }}
                    />
                  )}
                </div>
                {/* Right: text */}
                <div className="pb-5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: step.color }}
                    >
                      Step {step.num}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${step.color}15`,
                        color: step.color,
                        border: `1px solid ${step.color}30`,
                      }}
                    >
                      {step.sub}
                    </span>
                  </div>
                  <p className="text-[14px] font-bold text-white leading-tight">
                    {step.title}
                  </p>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── WHY SELL HERE ─── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Why sell on Autovinci
          </p>
          <div className="grid grid-cols-2 gap-3">
            {WHY_SELL.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-4 border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl mb-3"
                  style={{ background: "rgba(17,82,212,0.12)" }}
                >
                  <MaterialIcon
                    name={item.icon}
                    className="text-[18px]"
                    style={{ color: "#1152d4" }}
                  />
                </div>
                <p className="text-[13px] font-bold text-white leading-tight">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RECENT SALES STRIP ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Recently sold
            </p>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-2">
            {RECENT_SALES.map((car, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                  style={{ background: "rgba(16,185,129,0.1)" }}
                >
                  <MaterialIcon
                    name="check_circle"
                    className="text-[18px]"
                    fill
                    style={{ color: "#10b981" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white">
                    {car.name} {car.year}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {car.fuel} · {car.km}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-black text-emerald-400">
                    {car.price}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {car.daysAgo}d ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── BOTTOM CTA AGAIN ─── */}
        <Link
          href="/used-cars/sell/evaluate"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #1152d4 0%, #1d4ed8 100%)",
            boxShadow: "0 8px 32px rgba(17,82,212,0.35)",
          }}
        >
          <MaterialIcon name="speed" className="text-[20px]" />
          Get Instant Valuation
        </Link>

        {/* ─── TRUST STRIP ─── */}
        <div className="flex items-center justify-center gap-6 py-2">
          {[
            { icon: "security", label: "100% Secure" },
            { icon: "verified_user", label: "RTO Verified" },
            { icon: "support_agent", label: "24/7 Support" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1">
              <MaterialIcon
                name={t.icon}
                className="text-[18px] text-slate-500"
              />
              <span className="text-[9px] font-semibold text-slate-600">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
