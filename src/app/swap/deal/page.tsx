"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── SwapDirect — Swap Deal Details ─── */

const TIMELINE_STEPS = [
  {
    icon: "handshake",
    label: "Both Parties Agree",
    desc: "You and the swap partner confirm the deal terms",
    status: "active" as const,
    color: "#1152d4",
  },
  {
    icon: "verified",
    label: "Both Cars Inspected",
    desc: "250-point VehiclePassport inspection at your doorstep",
    status: "pending" as const,
    color: "#10b981",
  },
  {
    icon: "account_balance",
    label: "Gap Amount in Escrow",
    desc: "₹3.4L held securely until both transfers complete",
    status: "pending" as const,
    color: "#f59e0b",
  },
  {
    icon: "swap_horiz",
    label: "Both RCs Transfer",
    desc: "Simultaneous RC transfer — both cars change hands together",
    status: "pending" as const,
    color: "#8b5cf6",
  },
];

export default function SwapDealPage() {
  const [depositAgreed, setDepositAgreed] = useState(false);

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/swap/matches" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">Swap Deal</h1>
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.12)" }}>
            <MaterialIcon name="verified" className="text-[14px] text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400">92% Match</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* Deal Summary */}
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="px-4 pt-4 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Deal Summary</p>

            {/* Side by side cars */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Your car */}
              <div className="rounded-xl p-3 border border-blue-500/15" style={{ background: "rgba(17,82,212,0.05)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400 mb-2">Your Car</p>
                <div className="h-16 w-full rounded-lg flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <MaterialIcon name="directions_car" className="text-[28px] text-slate-600" />
                </div>
                <p className="text-xs font-bold text-white leading-tight">Hyundai Creta</p>
                <p className="text-[10px] text-slate-500 mt-0.5">2021 &middot; 42,000 km</p>
                <p className="text-sm font-black text-white mt-2">₹4.8L</p>
              </div>

              {/* Their car */}
              <div className="rounded-xl p-3 border border-purple-500/15" style={{ background: "rgba(139,92,246,0.05)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider text-purple-400 mb-2">Their Car</p>
                <div className="h-16 w-full rounded-lg flex items-center justify-center mb-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <MaterialIcon name="directions_car" className="text-[28px] text-slate-600" />
                </div>
                <p className="text-xs font-bold text-white leading-tight">Tata Nexon EV</p>
                <p className="text-[10px] text-slate-500 mt-0.5">2023 &middot; 18,200 km</p>
                <p className="text-sm font-black text-white mt-2">₹8.2L</p>
              </div>
            </div>

            {/* Value breakdown */}
            <div className="rounded-xl p-3 border border-white/5 space-y-2" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Value Gap</span>
                <span className="text-white font-bold">₹3,40,000</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Platform Fee (2.5%)</span>
                <span className="text-white font-bold">₹8,500</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Inspection (x2)</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold">Total You Pay</span>
                <span className="text-base font-black text-white">₹3,48,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Inspection */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
              <MaterialIcon name="verified" className="text-[14px] text-emerald-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dual Inspection</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Both cars undergo a comprehensive 250-point VehiclePassport inspection at your doorstep. No surprises after the swap.
          </p>

          <div className="space-y-2">
            {/* Your car inspection */}
            <div className="rounded-xl p-3 flex items-center gap-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.15)" }}>
                <MaterialIcon name="directions_car" className="text-[18px] text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">Hyundai Creta</p>
                <p className="text-[10px] text-slate-500">Your car &middot; 250-point check</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(245,158,11,0.12)" }}>
                <MaterialIcon name="schedule" className="text-[12px] text-amber-400" />
                <span className="text-[9px] font-bold text-amber-400">Pending</span>
              </div>
            </div>

            {/* Their car inspection */}
            <div className="rounded-xl p-3 flex items-center gap-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.15)" }}>
                <MaterialIcon name="directions_car" className="text-[18px] text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">Tata Nexon EV</p>
                <p className="text-[10px] text-slate-500">Their car &middot; 250-point check</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(245,158,11,0.12)" }}>
                <MaterialIcon name="schedule" className="text-[12px] text-amber-400" />
                <span className="text-[9px] font-bold text-amber-400">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Flow Timeline */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(17,82,212,0.15)" }}>
              <MaterialIcon name="timeline" className="text-[14px] text-blue-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Transaction Flow</p>
          </div>

          <div className="space-y-0">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex gap-3">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2"
                    style={{
                      background: step.status === "active" ? `${step.color}20` : "rgba(255,255,255,0.03)",
                      borderColor: step.status === "active" ? step.color : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <MaterialIcon
                      name={step.icon}
                      className="text-[16px]"
                      style={{ color: step.status === "active" ? step.color : "#475569" }}
                    />
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="w-0.5 h-10 my-1" style={{ background: i === 0 ? step.color : "rgba(255,255,255,0.06)" }} />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 pb-4">
                  <p className={`text-xs font-bold ${step.status === "active" ? "text-white" : "text-slate-500"}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  {step.status === "active" && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: step.color }} />
                      <span className="text-[9px] font-bold" style={{ color: step.color }}>Current Step</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EMI Option */}
        <div className="rounded-2xl p-4 border border-purple-500/15 relative overflow-hidden" style={{ background: "rgba(139,92,246,0.05)" }}>
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ background: "rgba(139,92,246,0.12)", filter: "blur(20px)" }} />
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
              <MaterialIcon name="account_balance" className="text-[14px] text-purple-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400">EMI Option</p>
          </div>
          <p className="text-sm font-bold text-white mb-1">Finance the gap amount</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Don&apos;t want to pay ₹3.4L upfront? Finance just the gap amount with our lending partners.
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-500">EMI from</p>
              <p className="text-lg font-black text-white">₹5,200<span className="text-xs text-slate-400 font-normal">/month</span></p>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div>
              <p className="text-[10px] text-slate-500">Tenure</p>
              <p className="text-xs font-bold text-white">Up to 60 months</p>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div>
              <p className="text-[10px] text-slate-500">Interest</p>
              <p className="text-xs font-bold text-white">9.5% p.a.</p>
            </div>
          </div>
        </div>

        {/* Escrow Protection */}
        <div className="rounded-2xl p-4 border border-emerald-500/15 relative overflow-hidden" style={{ background: "rgba(16,185,129,0.04)" }}>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full" style={{ background: "rgba(16,185,129,0.10)", filter: "blur(20px)" }} />
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
              <MaterialIcon name="shield" className="text-[22px] text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Escrow Protection</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                The gap amount of ₹3.4L is held in a secure escrow account. Money is released only after both RC transfers are verified. Full refund if the deal falls through.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pl-14">
            <div className="flex items-center gap-1">
              <MaterialIcon name="lock" className="text-[12px] text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400">RBI Regulated</span>
            </div>
            <div className="flex items-center gap-1">
              <MaterialIcon name="verified" className="text-[12px] text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400">100% Refundable</span>
            </div>
          </div>
        </div>

        {/* Swap partner info */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0" style={{ background: "rgba(139,92,246,0.2)" }}>P</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white">Priya S.</p>
              <p className="text-[10px] text-slate-500">Andheri, Mumbai &middot; Verified profile</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <MaterialIcon key={i} name="star" className="text-[10px] text-amber-400" />)}
                </div>
                <span className="text-[10px] text-slate-500">4.9 rating</span>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.12)" }}>
              <MaterialIcon name="verified_user" className="text-[12px] text-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-400">Verified</span>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-24 left-0 right-0 z-30 px-4">
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl p-3 border border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center gap-3 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={depositAgreed}
                  onChange={(e) => setDepositAgreed(e.target.checked)}
                  className="h-4 w-4 rounded accent-blue-600"
                />
                <span className="text-[11px] text-slate-400">I agree to the ₹999 refundable deposit</span>
              </label>
            </div>
            <button
              disabled={!depositAgreed}
              className={`flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all ${!depositAgreed ? "opacity-40" : ""}`}
              style={{ background: depositAgreed ? "#1152d4" : "#1152d4" }}
            >
              <MaterialIcon name="swap_horiz" className="text-[18px]" />
              Initiate Swap &mdash; ₹999 Refundable Deposit
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Fully refundable if either party cancels before inspection
            </p>
          </div>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
