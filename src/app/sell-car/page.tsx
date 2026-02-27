"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Sell My Car — entry hub ─── */

const SELL_STEPS = [
  { icon: "search", label: "Get Instant Valuation", desc: "AI-powered price in 60 seconds", color: "#1152d4" },
  { icon: "verified", label: "Free Inspection", desc: "250-point certified inspection at home", color: "#10b981" },
  { icon: "payments", label: "Instant Payment", desc: "Same-day bank transfer on deal close", color: "#f59e0b" },
  { icon: "description", label: "RC Transfer Handled", desc: "Full paperwork — we do it all", color: "#8b5cf6" },
];

const BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda",
  "Toyota", "Kia", "Ford", "Volkswagen", "MG", "Renault", "Nissan",
];

const YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

const WHY_CARDS = [
  { icon: "bolt", label: "Sell in 24 Hours", sub: "Fastest in India", color: "#f59e0b" },
  { icon: "trending_up", label: "Best Price", sub: "AI-matched market rate", color: "#10b981" },
  { icon: "shield", label: "Zero Hassle", sub: "We handle RC + insurance", color: "#1152d4" },
  { icon: "support_agent", label: "Doorstep Service", sub: "Inspection at your home", color: "#8b5cf6" },
];

export default function SellCarPage() {
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");

  const canProceed = brand && year;

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">Sell My Car</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* Hero */}
        <div className="rounded-2xl p-5 border border-blue-500/20 relative overflow-hidden" style={{ background: "rgba(17,82,212,0.07)" }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: "rgba(17,82,212,0.12)", filter: "blur(24px)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Autovinci Instant Sell</p>
          <h2 className="text-2xl font-black text-white leading-tight mb-1">Get the best price<br />for your car today</h2>
          <p className="text-xs text-slate-400">AI valuation · Free inspection · Same-day payment</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <MaterialIcon name="check_circle" className="text-[14px]" />
              12,400+ cars sold
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
              <MaterialIcon name="star" className="text-[14px]" />
              4.8/5 seller rating
            </div>
          </div>
        </div>

        {/* Quick form */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Quick Valuation</p>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Car Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <option value="">Select brand</option>
              {BRANDS.map((b) => <option key={b} value={b} style={{ background: "#111" }}>{b}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y} value={y} style={{ background: "#111" }}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">KM driven</label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="e.g. 45000"
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <Link
            href={canProceed ? `/sell-car/valuation?brand=${encodeURIComponent(brand)}&year=${year}&km=${km}` : "#"}
            className={`flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all ${!canProceed ? "opacity-40 pointer-events-none" : ""}`}
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="auto_awesome" className="text-[18px]" />
            Get Instant Valuation
          </Link>
        </div>

        {/* How it works */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">How It Works</p>
          <div className="space-y-2">
            {SELL_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${step.color}18` }}>
                  <MaterialIcon name={step.icon} className="text-[18px]" style={{ color: step.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{step.label}</p>
                  <p className="text-[10px] text-slate-500">{step.desc}</p>
                </div>
                <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Autovinci */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Why Sell with Autovinci</p>
          <div className="grid grid-cols-2 gap-2">
            {WHY_CARDS.map(({ icon, label, sub, color }) => (
              <div key={label} className="rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}18` }}>
                  <MaterialIcon name={icon} className="text-[16px]" style={{ color }} />
                </div>
                <p className="text-xs font-bold text-white leading-tight">{label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0" style={{ background: "#1152d4" }}>R</div>
            <div>
              <p className="text-xs font-bold text-white">Rahul Sharma</p>
              <p className="text-[10px] text-slate-500">Sold 2019 Hyundai Creta · Delhi</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => <MaterialIcon key={i} name="star" className="text-[12px] text-amber-400" />)}
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">&ldquo;Got ₹82,000 more than what CarDekho quoted. Inspection happened at my office. Money in account same day.&rdquo;</p>
        </div>

      </main>

      <BuyerBottomNav />
    </div>
  );
}
