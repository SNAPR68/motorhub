"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const TOOLS = [
  {
    title: "EMI Calculator",
    desc: "Plan your monthly payments",
    icon: "calculate",
    href: "/car-loan/emi-calculator",
    color: "#1152d4",
  },
  {
    title: "Check Eligibility",
    desc: "Know your loan amount",
    icon: "fact_check",
    href: "/car-loan/eligibility",
    color: "#059669",
  },
  {
    title: "Apply Now",
    desc: "Quick online application",
    icon: "assignment",
    href: "/car-loan/apply",
    color: "#7c3aed",
  },
  {
    title: "Compare Banks",
    desc: "Find the best rate",
    icon: "account_balance",
    href: "/car-loan/banks",
    color: "#d97706",
  },
];

const BANK_RATES = [
  { bank: "SBI", rate: "8.60%", tenure: "84 mo", max: "₹75 L" },
  { bank: "HDFC", rate: "8.75%", tenure: "84 mo", max: "₹50 L" },
  { bank: "ICICI", rate: "8.80%", tenure: "84 mo", max: "₹50 L" },
  { bank: "Axis", rate: "8.90%", tenure: "84 mo", max: "₹40 L" },
  { bank: "Kotak", rate: "8.95%", tenure: "84 mo", max: "₹35 L" },
  { bank: "BOB", rate: "8.60%", tenure: "84 mo", max: "₹60 L" },
];

function calcEmi(principal: number, rateAnnual: number, months: number): string {
  const r = rateAnnual / 100 / 12;
  const n = months;
  const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  return `₹${emi.toLocaleString("en-IN")}/mo`;
}

const QUICK_EMI_PRESETS = [
  { label: "₹5 L", principal: 500000 },
  { label: "₹10 L", principal: 1000000 },
  { label: "₹20 L", principal: 2000000 },
];

export default function CarLoanPage() {
  return (
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Car Loan</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 pt-5">
        {/* Hero */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)",
          }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white mb-3">
            <MaterialIcon name="trending_down" className="text-[14px]" />
            Lowest rates from 8.5% p.a.
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight mb-1">
            Get car loan at 8.5% p.a.
          </h2>
          <p className="text-blue-200 text-sm mb-4">Quick approval in 24 hours</p>

          {/* Quick EMI preview */}
          <div className="rounded-xl p-4 bg-white/10">
            <div className="flex items-center justify-between mb-1">
              <p className="text-blue-200 text-xs">₹10L loan at 8.75% for 60 mo</p>
              <span className="text-white font-bold text-lg">
                {calcEmi(1000000, 8.75, 60)}
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/20">
              <div className="h-full w-3/5 rounded-full bg-white/60" />
            </div>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl p-4 flex flex-col gap-3 border border-white/10 hover:border-white/20 transition-colors"
                style={{ background: "#111827" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${tool.color}20` }}
                >
                  <MaterialIcon
                    name={tool.icon}
                    className="text-[22px]"
                    style={{ color: tool.color }}
                  />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{tool.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured offer */}
        <div
          className="rounded-2xl p-5 border border-emerald-500/30"
          style={{ background: "#0a1f14" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
              SBI
            </div>
            <div>
              <p className="text-white font-semibold text-sm">SBI CarLoan</p>
              <p className="text-emerald-400 text-xs font-semibold">Featured Offer</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">8.60% p.a.</p>
          <p className="text-slate-300 text-sm mb-3">Get up to ₹75 Lakh</p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2 bg-emerald-500/10">
            <MaterialIcon name="celebration" className="text-[16px] text-emerald-400" />
            <p className="text-emerald-400 text-xs font-semibold">
              No processing fee this month
            </p>
          </div>
        </div>

        {/* Bank rates table */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Bank Rates Comparison</h3>
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: "#111827" }}>
            {/* Header */}
            <div className="grid grid-cols-4 px-4 py-2 border-b border-white/10">
              {["Bank", "Rate", "Tenure", "Max"].map((h) => (
                <p key={h} className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">
                  {h}
                </p>
              ))}
            </div>
            {BANK_RATES.map((b, i) => (
              <div
                key={b.bank}
                className="grid grid-cols-4 px-4 py-3"
                style={{
                  borderBottom: i < BANK_RATES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}
              >
                <p className="text-white text-sm font-semibold">{b.bank}</p>
                <p className="text-emerald-400 text-sm font-semibold">{b.rate}</p>
                <p className="text-slate-300 text-sm">{b.tenure}</p>
                <p className="text-slate-300 text-sm">{b.max}</p>
              </div>
            ))}
          </div>
        </div>

        {/* EMI Quick Calc */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">
            Quick EMI Preview{" "}
            <span className="text-slate-400 font-normal">(8.75% · 60 months)</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_EMI_PRESETS.map((preset) => (
              <div
                key={preset.label}
                className="rounded-xl p-4 text-center"
                style={{ background: "#111827" }}
              >
                <p className="text-slate-400 text-xs mb-2">{preset.label}</p>
                <p className="text-white font-bold text-sm">
                  {calcEmi(preset.principal, 8.75, 60).split("/")[0]}
                </p>
                <p className="text-slate-400 text-[10px]">/month</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apply CTA */}
        <Link
          href="/car-loan/apply"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-4 text-white font-bold text-base transition-opacity hover:opacity-90"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="assignment" className="text-[20px]" />
          Apply Now
        </Link>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
