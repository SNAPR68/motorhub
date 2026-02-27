"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Pros & Cons Page ─── */

const PROS = [
  "Spacious cabin with generous headroom and legroom",
  "Feature-loaded across all variants",
  "Good mileage for its segment",
  "Strong resale value in the used car market",
  "Low maintenance cost over ownership period",
];

const CONS = [
  "No diesel option available",
  "Firm ride quality on rough roads",
  "Limited boot space compared to rivals",
];

const EXPERT_VERDICT =
  "A well-rounded package that balances practicality with modern features. The spacious cabin, efficient engine, and strong resale value make it an excellent choice for families. While the ride quality could be softer and boot space is a trade-off, the overall ownership experience is highly satisfying.";

const RATING = 4;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ProsConsPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

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
          <h1 className="text-base font-bold text-white">{displayModel} Pros & Cons</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── Pros ─── */}
        <div
          className="rounded-2xl border border-emerald-500/20 overflow-hidden"
          style={{ background: "rgba(16,185,129,0.04)" }}
        >
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(16,185,129,0.15)" }}
            >
              <MaterialIcon name="thumb_up" className="text-[16px] text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">Pros</p>
              <p className="text-[10px] text-slate-500">{PROS.length} advantages</p>
            </div>
          </div>

          {PROS.map((pro, i) => (
            <div
              key={pro}
              className={`flex items-start gap-3 px-4 py-3 border-t border-emerald-500/10`}
            >
              <div className="mt-0.5 shrink-0">
                <MaterialIcon name="thumb_up" className="text-[16px] text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-slate-200">{pro}</p>
              </div>
              <span className="ml-auto shrink-0 text-[10px] font-bold text-emerald-500/60 mt-0.5">
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Cons ─── */}
        <div
          className="rounded-2xl border border-red-500/20 overflow-hidden"
          style={{ background: "rgba(239,68,68,0.04)" }}
        >
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.15)" }}
            >
              <MaterialIcon name="thumb_down" className="text-[16px] text-red-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-400">Cons</p>
              <p className="text-[10px] text-slate-500">{CONS.length} drawbacks</p>
            </div>
          </div>

          {CONS.map((con, i) => (
            <div
              key={con}
              className={`flex items-start gap-3 px-4 py-3 border-t border-red-500/10`}
            >
              <div className="mt-0.5 shrink-0">
                <MaterialIcon name="thumb_down" className="text-[16px] text-red-500" />
              </div>
              <div>
                <p className="text-sm text-slate-200">{con}</p>
              </div>
              <span className="ml-auto shrink-0 text-[10px] font-bold text-red-500/60 mt-0.5">
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Expert Verdict ─── */}
        <div
          className="rounded-2xl border border-amber-500/20 overflow-hidden"
          style={{ background: "rgba(245,158,11,0.04)" }}
        >
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(245,158,11,0.15)" }}
            >
              <MaterialIcon name="workspace_premium" className="text-[16px] text-amber-400" />
            </div>
            <p className="text-sm font-bold text-amber-400">Expert Verdict</p>
          </div>

          <div className="px-4 pb-4 border-t border-amber-500/10 pt-3">
            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MaterialIcon
                    key={i}
                    name={i < RATING ? "star" : "star_border"}
                    fill={i < RATING}
                    className={`text-[20px] ${i < RATING ? "text-amber-400" : "text-slate-700"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{RATING}/5</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{EXPERT_VERDICT}</p>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <Link
          href="/expert-reviews"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <MaterialIcon name="article" className="text-[18px]" />
          Read Full Review
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
