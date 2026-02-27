"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Model-Specific EMI Calculator ─── */

const CAR_PRICE = 1050000; // 10,50,000

function calcEmi(principal: number, rateAnnual: number, tenureMonths: number): number {
  if (principal <= 0) return 0;
  const r = rateAnnual / 100 / 12;
  const n = tenureMonths;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function formatINR(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
  return n.toLocaleString("en-IN");
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ModelEmiCalculatorPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

  const [downPct, setDownPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(5);
  const [rate, setRate] = useState(9.5);

  const tenureMonths = tenureYears * 12;
  const downAmt = Math.round(CAR_PRICE * (downPct / 100));
  const principal = CAR_PRICE - downAmt;

  const emi = useMemo(() => calcEmi(principal, rate, tenureMonths), [principal, rate, tenureMonths]);
  const totalPaid = emi * tenureMonths + downAmt;
  const totalInterest = totalPaid - CAR_PRICE;

  // Donut percentages
  const principalPct = totalPaid > 0 ? Math.round((principal / totalPaid) * 100) : 0;
  const interestPct = 100 - principalPct;

  // SVG donut
  const circumference = 2 * Math.PI * 54; // r=54
  const principalDash = (principalPct / 100) * circumference;
  const interestDash = (interestPct / 100) * circumference;

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/${brand}/${model}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">{displayModel} EMI Calculator</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── EMI Result ─── */}
        <div
          className="rounded-2xl p-5 border border-blue-500/20"
          style={{ background: "rgba(17,82,212,0.06)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
            Monthly EMI
          </p>
          <p className="text-4xl font-black text-white">
            {emi.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            for {tenureMonths} months at {rate}% p.a.
          </p>
        </div>

        {/* ─── Donut Breakdown ─── */}
        <div
          className="rounded-2xl p-5 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Principal vs Interest
          </p>
          <div className="flex items-center gap-6">
            {/* SVG Donut */}
            <div className="relative shrink-0" style={{ width: "130px", height: "130px" }}>
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                {/* Principal arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#1152d4"
                  strokeWidth="10"
                  strokeDasharray={`${principalDash} ${circumference}`}
                  strokeLinecap="round"
                />
                {/* Interest arc */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="10"
                  strokeDasharray={`${interestDash} ${circumference}`}
                  strokeDashoffset={-principalDash}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-500">Total</span>
                <span className="text-sm font-black text-white">{formatINR(totalPaid)}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#1152d4" }} />
                  <span className="text-xs text-slate-400">Principal</span>
                </div>
                <p className="text-sm font-bold text-white pl-5">{formatINR(principal)}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <span className="text-xs text-slate-400">Interest</span>
                </div>
                <p className="text-sm font-bold text-white pl-5">{formatINR(totalInterest)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Sliders ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5 space-y-6"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {/* Car Price (readonly display) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Car Price (Ex-showroom)</p>
              <span className="text-sm font-bold text-white">
                {CAR_PRICE.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "100%", background: "#1152d4" }} />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Down Payment</p>
              <p className="text-xs font-bold text-white">
                {downPct}% -- {downAmt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}
              </p>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">10%</span>
              <span className="text-[10px] text-slate-600">50%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Loan Tenure</p>
              <p className="text-xs font-bold text-white">
                {tenureYears} {tenureYears === 1 ? "year" : "years"} ({tenureMonths} months)
              </p>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">1 yr</span>
              <span className="text-[10px] text-slate-600">7 yr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Interest Rate</p>
              <p className="text-xs font-bold text-white">{rate.toFixed(1)}% p.a.</p>
            </div>
            <input
              type="range"
              min={7}
              max={15}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">7%</span>
              <span className="text-[10px] text-slate-600">15%</span>
            </div>
          </div>
        </div>

        {/* ─── Summary ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Payment Summary
          </p>
          <div className="space-y-2.5">
            {[
              { label: "Car Price", val: `${CAR_PRICE.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}` },
              { label: "Down Payment", val: `${downAmt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}` },
              { label: "Loan Amount", val: `${principal.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}` },
              { label: "Total Interest", val: `${totalInterest.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}`, color: "#ef4444" },
              { label: "Total Amount Paid", val: `${totalPaid.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })}`, bold: true },
            ].map(({ label, val, color, bold }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span
                  className={`text-xs ${bold ? "font-black text-white" : "font-semibold"}`}
                  style={{ color: color || (bold ? "#fff" : "#94a3b8") }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── CTA ─── */}
        <Link
          href="/car-loan/eligibility"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="account_balance" className="text-[18px]" />
          Apply for Loan
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
