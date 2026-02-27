"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── SwapDirect Hub — P2P Car Exchange ─── */

const BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda",
  "Toyota", "Kia", "Ford", "Volkswagen", "MG", "Renault", "Nissan",
];

const YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

const STEPS = [
  { icon: "directions_car", label: "List Your Car", desc: "Tell us what you drive and what you want", color: "#1152d4" },
  { icon: "auto_awesome", label: "AI Matching", desc: "Our engine finds compatible swap partners", color: "#8b5cf6" },
  { icon: "verified", label: "Dual Inspection", desc: "Both cars get 250-point VehiclePassport check", color: "#10b981" },
  { icon: "swap_horiz", label: "Single Transaction", desc: "One payment, both RCs transfer simultaneously", color: "#f59e0b" },
];

const VALUE_CARDS = [
  { icon: "savings", label: "Save ₹1.5-2L", sub: "No dealer margins on either side", color: "#10b981" },
  { icon: "verified_user", label: "Both Cars Inspected", sub: "250-point VehiclePassport for each", color: "#1152d4" },
  { icon: "account_balance", label: "One EMI for Gap", sub: "Finance only the price difference", color: "#8b5cf6" },
  { icon: "shield", label: "Escrow Protection", sub: "Gap amount held safe until transfer", color: "#f59e0b" },
];

export default function SwapDirectPage() {
  const [yourBrand, setYourBrand] = useState("");
  const [yourYear, setYourYear] = useState("");
  const [yourModel, setYourModel] = useState("");
  const [yourKm, setYourKm] = useState("");

  const [wantBrand, setWantBrand] = useState("");
  const [wantYear, setWantYear] = useState("");
  const [wantModel, setWantModel] = useState("");

  const canSearch = yourBrand && yourYear && wantBrand;

  const searchHref = canSearch
    ? `/swap/matches?yourBrand=${encodeURIComponent(yourBrand)}&yourYear=${yourYear}&yourModel=${encodeURIComponent(yourModel)}&yourKm=${yourKm}&wantBrand=${encodeURIComponent(wantBrand)}&wantYear=${wantYear}&wantModel=${encodeURIComponent(wantModel)}`
    : "#";

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white">SwapDirect</h1>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>P2P</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* Hero */}
        <div className="rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden" style={{ background: "rgba(16,185,129,0.06)" }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: "rgba(16,185,129,0.12)", filter: "blur(24px)" }} />
          <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full" style={{ background: "rgba(17,82,212,0.10)", filter: "blur(20px)" }} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">SwapDirect by Autovinci</p>
          <h2 className="text-2xl font-black text-white leading-tight mb-1">Swap Your Car<br />Directly</h2>
          <p className="text-xs text-slate-400">Exchange cars peer-to-peer. Skip the dealer. Save lakhs.</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <MaterialIcon name="swap_horiz" className="text-[14px]" />
              12,400+ swaps
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
              <MaterialIcon name="savings" className="text-[14px]" />
              Avg ₹1.8L saved
            </div>
          </div>
        </div>

        {/* Your Car Form */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(17,82,212,0.15)" }}>
              <MaterialIcon name="directions_car" className="text-[14px] text-blue-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Car</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Brand</label>
            <select
              value={yourBrand}
              onChange={(e) => setYourBrand(e.target.value)}
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
                value={yourYear}
                onChange={(e) => setYourYear(e.target.value)}
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <option value="">Year</option>
                {YEARS.map((y) => <option key={y} value={y} style={{ background: "#111" }}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Model</label>
              <input
                type="text"
                value={yourModel}
                onChange={(e) => setYourModel(e.target.value)}
                placeholder="e.g. Creta"
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">KM Driven</label>
            <input
              type="number"
              value={yourKm}
              onChange={(e) => setYourKm(e.target.value)}
              placeholder="e.g. 45000"
              className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
          </div>
        </div>

        {/* Car You Want Form */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
              <MaterialIcon name="search" className="text-[14px] text-purple-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Car You Want</p>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Brand</label>
            <select
              value={wantBrand}
              onChange={(e) => setWantBrand(e.target.value)}
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
                value={wantYear}
                onChange={(e) => setWantYear(e.target.value)}
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <option value="">Any year</option>
                {YEARS.map((y) => <option key={y} value={y} style={{ background: "#111" }}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Model</label>
              <input
                type="text"
                value={wantModel}
                onChange={(e) => setWantModel(e.target.value)}
                placeholder="e.g. Nexon"
                className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={searchHref}
          className={`flex items-center justify-center gap-2 h-13 rounded-2xl text-sm font-bold text-white w-full transition-all ${!canSearch ? "opacity-40 pointer-events-none" : ""}`}
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="swap_horiz" className="text-[18px]" />
          Find Swap Matches
        </Link>

        {/* How SwapDirect Works */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">How SwapDirect Works</p>
          <div className="space-y-2">
            {STEPS.map((step, i) => (
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

        {/* Value Proposition */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Why SwapDirect</p>
          <div className="grid grid-cols-2 gap-2">
            {VALUE_CARDS.map(({ icon, label, sub, color }) => (
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

        {/* Fee Info */}
        <div className="rounded-2xl p-4 border border-emerald-500/15 relative overflow-hidden" style={{ background: "rgba(16,185,129,0.04)" }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
              <MaterialIcon name="percent" className="text-[20px] text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Flat 2.5% Platform Fee</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cheaper than dealer margins (8-12%). One fee covers both sides.</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0" style={{ background: "#8b5cf6" }}>A</div>
            <div>
              <p className="text-xs font-bold text-white">Ankit Mehta</p>
              <p className="text-[10px] text-slate-500">Swapped Creta for Nexon EV &middot; Mumbai</p>
            </div>
            <div className="ml-auto flex gap-0.5">
              {[...Array(5)].map((_, i) => <MaterialIcon key={i} name="star" className="text-[12px] text-amber-400" />)}
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">&ldquo;Saved over ₹2L compared to selling and buying separately. Both cars were inspected at my doorstep. Whole process took 5 days.&rdquo;</p>
        </div>

      </main>

      <BuyerBottomNav />
    </div>
  );
}
