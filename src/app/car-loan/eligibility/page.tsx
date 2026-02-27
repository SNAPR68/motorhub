"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business"] as const;
const CIBIL_OPTIONS = ["750-900", "700-749", "650-699", "Don't know"] as const;

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function EligibilityPage() {
  const [employment, setEmployment] = useState<string>("Salaried");
  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [city, setCity] = useState("");
  const [cibil, setCibil] = useState<string>("750-900");
  const [showResult, setShowResult] = useState(false);

  // Eligibility computation
  const netIncome = monthlyIncome - existingEmi;
  const rawEligible = netIncome * 30;
  const eligible = Math.min(rawEligible, 5000000); // cap ₹50L
  const rate = employment === "Salaried" ? 8.75 : 9.5;
  const lowCibil = cibil === "650-699";

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setShowResult(true);
  }

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
          href="/car-loan"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Check Eligibility</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 pt-5">
        <form onSubmit={handleCheck} className="space-y-5">
          {/* Employment type */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide block">
              Employment Type
            </label>
            <div className="flex gap-2">
              {EMPLOYMENT_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setEmployment(t)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: employment === t ? "#1152d4" : "#1a2235",
                    color: employment === t ? "#fff" : "#94a3b8",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly income slider */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                Monthly Income
              </label>
              <span className="text-white font-bold text-base">
                {formatINR(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={300000}
              step={5000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>₹20K</span>
              <span>₹3 Lakh</span>
            </div>
          </div>

          {/* Existing EMIs slider */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                Existing EMIs
              </label>
              <span className="text-white font-bold text-base">
                {existingEmi === 0 ? "None" : formatINR(existingEmi)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={2500}
              value={existingEmi}
              onChange={(e) => setExistingEmi(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>₹0</span>
              <span>₹50K</span>
            </div>
          </div>

          {/* City */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide block">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm border border-white/10 focus:outline-none focus:border-blue-500"
              style={{ background: "#1a2235" }}
            />
          </div>

          {/* CIBIL score */}
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wide block">
              CIBIL Score{" "}
              <span className="normal-case font-normal text-slate-500">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CIBIL_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setCibil(opt)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: cibil === opt ? "#1152d4" : "#1a2235",
                    color: cibil === opt ? "#fff" : "#94a3b8",
                    border: cibil === opt ? "1px solid #1152d4" : "1px solid transparent",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-4 text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="fact_check" className="text-[20px]" />
            Check Eligibility
          </button>
        </form>

        {/* Result */}
        {showResult && (
          <div className="space-y-4">
            {/* Banner */}
            {lowCibil ? (
              <div
                className="rounded-2xl p-4 flex items-center gap-3 border border-amber-500/40"
                style={{ background: "#1a1500" }}
              >
                <MaterialIcon name="warning" fill className="text-[28px] text-amber-400" />
                <div>
                  <p className="text-amber-400 font-bold text-base">Improve Your CIBIL</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    A score above 700 unlocks better rates. Pay existing dues on time.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-4 flex items-center gap-3 border border-emerald-500/40"
                style={{ background: "#0a1f14" }}
              >
                <MaterialIcon name="check_circle" fill className="text-[28px] text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-bold text-base">You are eligible!</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Great profile — multiple banks will offer you competitive rates.
                  </p>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ background: "#111827" }}>
                <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">
                  Eligible Amount
                </p>
                <p className="text-white font-bold text-base">{formatINR(eligible)}</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "#111827" }}>
                <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">
                  Tenure
                </p>
                <p className="text-white font-bold text-base">60 mo</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: "#111827" }}>
                <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">
                  Est. Rate
                </p>
                <p className="text-emerald-400 font-bold text-base">{rate}%</p>
              </div>
            </div>

            <Link
              href="/car-loan/apply"
              className="flex items-center justify-center gap-2 w-full rounded-xl py-4 text-white font-bold text-base transition-opacity hover:opacity-90"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="assignment" className="text-[20px]" />
              Apply Now
            </Link>
          </div>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
