"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── EMI Calculator ─── */

const BANKS = [
  { name: "SBI", rate: 8.65 },
  { name: "HDFC Bank", rate: 8.75 },
  { name: "ICICI Bank", rate: 8.80 },
  { name: "Axis Bank", rate: 8.90 },
  { name: "Kotak", rate: 8.95 },
  { name: "Bank of Baroda", rate: 8.60 },
];

function calcEmiValue(principal: number, rateAnnual: number, tenureMonths: number): number {
  if (principal <= 0) return 0;
  const r = rateAnnual / 100 / 12;
  const n = tenureMonths;
  return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function EmiCalculatorPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}><div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>}>
      <EmiCalculatorInner />
    </Suspense>
  );
}

function EmiCalculatorInner() {
  const searchParams = useSearchParams();
  const initialPrice = Number(searchParams.get("price") ?? 1000000);

  const [carPrice, setCarPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(60); // months
  const [rate, setRate] = useState(8.75);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const downAmt = Math.round(carPrice * (downPct / 100));
  const principal = carPrice - downAmt;

  const emi = useMemo(() => calcEmiValue(principal, rate, tenure), [principal, rate, tenure]);
  const totalPaid = emi * tenure + downAmt;
  const totalInterest = totalPaid - carPrice;
  const interestPct = carPrice > 0 ? ((totalInterest / carPrice) * 100).toFixed(1) : "0";

  // Donut chart values
  const principalPct = carPrice > 0 ? Math.round((principal / totalPaid) * 100) : 0;
  const interestPctVal = 100 - principalPct;

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/my-account" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">EMI Calculator</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ─── EMI Result card ─── */}
        <div className="rounded-2xl p-5 border border-blue-500/20" style={{ background: "rgba(17,82,212,0.06)" }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Monthly EMI</p>
              <p className="text-4xl font-black text-white">
                ₹{emi.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-slate-500 mt-1">for {tenure} months</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-0.5">Loan Amount</div>
              <div className="text-lg font-bold text-white">{formatINR(principal)}</div>
            </div>
          </div>

          {/* Visual bar: principal vs interest */}
          <div className="mt-4">
            <div className="flex h-2 rounded-full overflow-hidden gap-px">
              <div className="h-full rounded-l-full transition-all" style={{ width: `${principalPct}%`, background: "#1152d4" }} />
              <div className="h-full rounded-r-full transition-all" style={{ width: `${interestPctVal}%`, background: "#ef4444" }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#1152d4" }} /> Principal {formatINR(principal)}</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: "#ef4444" }} /> Interest {formatINR(totalInterest)}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
            {[
              { label: "Total Payable", val: formatINR(totalPaid) },
              { label: "Total Interest", val: formatINR(totalInterest) },
              { label: "Interest %", val: `${interestPct}%` },
            ].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-xs font-bold text-white">{val}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Sliders ─── */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-6" style={{ background: "rgba(255,255,255,0.03)" }}>

          {/* Car Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Car Price</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">₹</span>
                <input
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Math.max(100000, Math.min(20000000, Number(e.target.value))))}
                  className="text-sm font-bold text-white bg-transparent outline-none w-24 text-right"
                  style={{ border: "none" }}
                />
              </div>
            </div>
            <input type="range" min={200000} max={20000000} step={50000} value={carPrice}
              onChange={(e) => setCarPrice(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">₹2L</span>
              <span className="text-[10px] text-slate-600">₹2Cr</span>
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Down Payment</p>
              <p className="text-xs font-bold text-white">{downPct}% · {formatINR(downAmt)}</p>
            </div>
            <input type="range" min={10} max={60} step={5} value={downPct}
              onChange={(e) => setDownPct(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">10%</span>
              <span className="text-[10px] text-slate-600">60%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold text-slate-300">Loan Tenure</p>
              <p className="text-xs font-bold text-white">{tenure} months ({(tenure / 12).toFixed(1)} yr)</p>
            </div>
            <input type="range" min={12} max={84} step={12} value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
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
              <p className="text-xs font-bold text-white">{rate.toFixed(2)}% p.a.</p>
            </div>
            <input type="range" min={7} max={18} step={0.05} value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 rounded-full"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-600">7%</span>
              <span className="text-[10px] text-slate-600">18%</span>
            </div>
          </div>
        </div>

        {/* ─── Bank comparison ─── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bank Comparison</p>
            <button onClick={() => setShowBreakdown(!showBreakdown)} className="text-[10px] font-semibold" style={{ color: "#1152d4" }}>
              {showBreakdown ? "Hide" : "Show"}
            </button>
          </div>
          {showBreakdown && (
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              {BANKS.map((bank, i) => {
                const bankEmi = calcEmiValue(principal, bank.rate, tenure);
                const isSelected = Math.abs(bank.rate - rate) < 0.1;
                return (
                  <button
                    key={bank.name}
                    onClick={() => setRate(bank.rate)}
                    className={`flex items-center justify-between px-4 py-3 w-full text-left transition-all ${i > 0 ? "border-t border-white/5" : ""}`}
                    style={{ background: isSelected ? "rgba(17,82,212,0.08)" : "transparent" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                        style={{ background: isSelected ? "#1152d4" : "rgba(255,255,255,0.07)" }}>
                        {bank.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{bank.name}</p>
                        <p className="text-[10px] text-slate-500">{bank.rate}% p.a.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">₹{bankEmi.toLocaleString("en-IN")}/mo</p>
                      {isSelected && <p className="text-[9px] text-blue-400">Selected</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Monthly schedule preview ─── */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Repayment Summary</p>
          <div className="space-y-2">
            {[
              { label: "Down Payment", val: formatINR(downAmt), color: "#94a3b8" },
              { label: `${tenure} × Monthly EMI`, val: `${tenure} × ₹${emi.toLocaleString("en-IN")}`, color: "#94a3b8" },
              { label: "Total Amount Paid", val: formatINR(totalPaid), color: "#fff", bold: true },
            ].map(({ label, val, color, bold }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`text-xs ${bold ? "font-black" : "font-semibold"}`} style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white" style={{ background: "#1152d4" }}>
          <MaterialIcon name="account_balance" className="text-[18px]" />
          Apply for Car Loan
        </button>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
