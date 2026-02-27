"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const FILTER_PILLS = ["All", "Comprehensive", "Third Party", "Zero Dep"] as const;

const PLANS = [
  {
    id: 1,
    insurer: "HDFC Ergo",
    planType: "Comprehensive",
    price: 6842,
    rating: 4.5,
    highlights: ["Cashless at 5000+ garages", "24/7 claim support"],
    color: "#e74c3c",
  },
  {
    id: 2,
    insurer: "ICICI Lombard",
    planType: "Zero Dep",
    price: 7210,
    rating: 4.3,
    highlights: ["Zero depreciation cover", "Instant claim settlement"],
    color: "#f39c12",
  },
  {
    id: 3,
    insurer: "Bajaj Allianz",
    planType: "Third Party",
    price: 5990,
    rating: 4.2,
    highlights: ["Lowest premium option", "4100+ network garages"],
    color: "#27ae60",
  },
  {
    id: 4,
    insurer: "Tata AIG",
    planType: "Comprehensive",
    price: 8450,
    rating: 4.6,
    highlights: ["98% claim settlement ratio", "24/7 roadside assistance"],
    color: "#2980b9",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <MaterialIcon name="star" fill className="text-[14px] text-amber-400" />
      <span className="text-amber-400 text-xs font-semibold">{rating}</span>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full mx-auto px-4">
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl"
        style={{ background: "#1152d4" }}
      >
        <MaterialIcon name="open_in_new" className="text-[18px] text-white" />
        <p className="text-white text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose}>
          <MaterialIcon name="close" className="text-[18px] text-white/70" />
        </button>
      </div>
    </div>
  );
}

function ComparePlansInner() {
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get("vehicleNumber") || "Your Vehicle";
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [toast, setToast] = useState<string | null>(null);

  const filteredPlans =
    activeFilter === "All"
      ? PLANS
      : PLANS.filter((p) => p.planType === activeFilter);

  function handleBuyNow(insurer: string) {
    setToast(`Redirecting to ${insurer} portal…`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/car-insurance"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Compare Plans</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-5 pt-5">
        {/* Vehicle chip */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/10"
          style={{ background: "#111827" }}
        >
          <MaterialIcon name="directions_car" className="text-[16px]" style={{ color: "#4d80f0" }} />
          <span className="text-white text-sm font-semibold tracking-wider font-mono">
            {vehicleNumber.toUpperCase()}
          </span>
          <Link href="/car-insurance" className="text-slate-400 text-xs hover:text-white ml-1">
            Change
          </Link>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveFilter(pill)}
              className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: activeFilter === pill ? "#1152d4" : "#111827",
                color: activeFilter === pill ? "#fff" : "#94a3b8",
                border: activeFilter === pill ? "1px solid #1152d4" : "1px solid transparent",
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl p-5 border border-white/10"
              style={{ background: "#111827" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: plan.color }}
                    >
                      {plan.insurer[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{plan.insurer}</p>
                      <StarRating rating={plan.rating} />
                    </div>
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: "#1152d420", color: "#4d80f0" }}
                >
                  {plan.planType}
                </span>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="text-3xl font-bold text-white">
                  ₹{plan.price.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-400 text-sm ml-1">/yr</span>
              </div>

              {/* Highlights */}
              <div className="space-y-1.5 mb-4">
                {plan.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2">
                    <MaterialIcon name="check_circle" fill className="text-[14px] text-emerald-400" />
                    <span className="text-slate-300 text-xs">{h}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-white/15 text-slate-300 hover:border-white/30 transition-colors"
                  style={{ background: "#1a2235" }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleBuyNow(plan.insurer)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1152d4" }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}

export default function ComparePlansPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-dvh flex items-center justify-center"
          style={{ background: "#080a0f" }}
        >
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ComparePlansInner />
    </Suspense>
  );
}
