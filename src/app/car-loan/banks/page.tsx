"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── Bank data ──────────────────────────────────── */
type BankType = "Public" | "Private" | "NBFC";

interface Bank {
  name: string;
  rate: number;
  maxTenure: number;
  maxAmount: number;
  maxAmountLabel: string;
  type: BankType;
  processingFee: string;
  color: string;
}

const BANKS: Bank[] = [
  { name: "SBI", rate: 8.6, maxTenure: 84, maxAmount: 7500000, maxAmountLabel: "₹75L", type: "Public", processingFee: "0.5%", color: "#1a73e8" },
  { name: "HDFC", rate: 8.75, maxTenure: 84, maxAmount: 5000000, maxAmountLabel: "₹50L", type: "Private", processingFee: "0.5%", color: "#004b93" },
  { name: "ICICI", rate: 8.8, maxTenure: 84, maxAmount: 5000000, maxAmountLabel: "₹50L", type: "Private", processingFee: "0.5%", color: "#f37020" },
  { name: "Axis", rate: 8.9, maxTenure: 84, maxAmount: 4000000, maxAmountLabel: "₹40L", type: "Private", processingFee: "1%", color: "#800055" },
  { name: "Kotak", rate: 8.95, maxTenure: 84, maxAmount: 3500000, maxAmountLabel: "₹35L", type: "Private", processingFee: "0.5%", color: "#ed1c24" },
  { name: "BOB", rate: 8.6, maxTenure: 84, maxAmount: 6000000, maxAmountLabel: "₹60L", type: "Public", processingFee: "0.25%", color: "#f47920" },
  { name: "PNB", rate: 8.65, maxTenure: 84, maxAmount: 5000000, maxAmountLabel: "₹50L", type: "Public", processingFee: "0.35%", color: "#003580" },
  { name: "Bajaj Finance", rate: 9.5, maxTenure: 60, maxAmount: 2500000, maxAmountLabel: "₹25L", type: "NBFC", processingFee: "2%", color: "#004b8d" },
];

const FILTERS: ("All" | BankType)[] = ["All", "Public", "Private", "NBFC"];
const SORTS = ["By Rate", "By Max Amount"] as const;

/* ── Badge colors ── */
const typeBadge: Record<BankType, { bg: string; text: string }> = {
  Public: { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
  Private: { bg: "rgba(99,102,241,0.12)", text: "#818cf8" },
  NBFC: { bg: "rgba(234,179,8,0.12)", text: "#eab308" },
};

export default function BankRatesPage() {
  const [filter, setFilter] = useState<"All" | BankType>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("By Rate");

  const filtered = useMemo(() => {
    let list = filter === "All" ? [...BANKS] : BANKS.filter((b) => b.type === filter);
    if (sort === "By Rate") {
      list.sort((a, b) => a.rate - b.rate);
    } else {
      list.sort((a, b) => b.maxAmount - a.maxAmount);
    }
    return list;
  }, [filter, sort]);

  return (
    <div className="min-h-dvh pb-36" style={{ background: "#080a0f", color: "#f1f5f9" }}>
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
        <h1 className="text-lg font-bold text-white">Bank Loan Rates</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors"
              style={{
                background: filter === f ? "#1152d4" : "rgba(255,255,255,0.06)",
                color: filter === f ? "#fff" : "#94a3b8",
                border: filter === f ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <MaterialIcon name="sort" className="text-[16px] text-slate-400" />
          <span className="text-slate-400 text-xs">Sort:</span>
          {SORTS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: sort === s ? "rgba(17,82,212,0.15)" : "transparent",
                color: sort === s ? "#60a5fa" : "#64748b",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Bank cards */}
        <div className="space-y-3">
          {filtered.map((bank, idx) => {
            const badge = typeBadge[bank.type];
            return (
              <div
                key={bank.name}
                className="rounded-2xl p-5 border border-white/10"
                style={{ background: "#111827" }}
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Bank identity */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base"
                      style={{ background: bank.color }}
                    >
                      {bank.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{bank.name}</p>
                      <span
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {bank.type}
                      </span>
                    </div>
                  </div>
                  {/* Rate */}
                  <div className="text-right">
                    <p className="text-emerald-400 text-2xl font-bold">{bank.rate.toFixed(2)}%</p>
                    <p className="text-slate-500 text-[10px]">p.a. onwards</p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">Max Tenure</p>
                    <p className="text-white text-sm font-semibold mt-0.5">{bank.maxTenure} mo</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">Max Amount</p>
                    <p className="text-white text-sm font-semibold mt-0.5">{bank.maxAmountLabel}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">Processing</p>
                    <p className="text-white text-sm font-semibold mt-0.5">{bank.processingFee}</p>
                  </div>
                </div>

                {/* Apply button */}
                <Link
                  href="/car-loan/apply"
                  className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1152d4" }}
                >
                  Apply with {bank.name}
                  <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </Link>

                {/* Best rate badge */}
                {idx === 0 && (
                  <div className="flex items-center gap-1.5 mt-3 justify-center">
                    <MaterialIcon name="verified" className="text-[14px] text-emerald-400" fill />
                    <span className="text-emerald-400 text-[10px] font-semibold">
                      {sort === "By Rate" ? "Lowest Rate" : "Highest Amount"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4" style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}>
          <div className="flex items-start gap-2">
            <MaterialIcon name="info" className="text-[16px] text-amber-400 mt-0.5" />
            <p className="text-amber-200/70 text-xs leading-relaxed">
              Rates shown are indicative and may vary based on credit score, loan amount, and tenure. Final rates will be confirmed by the bank.
            </p>
          </div>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
