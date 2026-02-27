"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel, type ApiCarModelDetail } from "@/lib/api";
import { formatPrice } from "@/lib/car-catalog";

/* ─── Service schedule data ─── */
interface ServiceInterval {
  km: string;
  cost: number;
  includes: string[];
}

const SERVICE_SCHEDULE: ServiceInterval[] = [
  {
    km: "5,000 km",
    cost: 2500,
    includes: ["Engine oil change", "Oil filter replacement", "General inspection", "Top-up fluids"],
  },
  {
    km: "10,000 km",
    cost: 4200,
    includes: ["Engine oil & filter", "Air filter cleaning", "Brake inspection", "Wheel alignment check"],
  },
  {
    km: "20,000 km",
    cost: 6800,
    includes: ["Engine oil & filter", "Air filter replacement", "Spark plugs check", "Brake pad inspection", "Coolant top-up"],
  },
  {
    km: "30,000 km",
    cost: 4200,
    includes: ["Engine oil & filter", "Cabin filter replacement", "Suspension check", "Battery health test"],
  },
  {
    km: "40,000 km",
    cost: 8500,
    includes: ["Engine oil & filter", "Air & cabin filter replacement", "Brake pad replacement", "Transmission fluid check", "Full body inspection"],
  },
  {
    km: "50,000 km",
    cost: 6800,
    includes: ["Engine oil & filter", "Coolant flush & replace", "Spark plug replacement", "Drive belt inspection", "Wheel bearing check"],
  },
];

const TOTAL_3YR_COST = SERVICE_SCHEDULE.reduce((sum, s) => sum + s.cost, 0);

/* ─── Competitor costs ─── */
const COMPETITORS = [
  { name: "Rival A", cost: 45000, color: "#64748b" },
  { name: "Rival B", cost: 52000, color: "#64748b" },
];

export default function ServiceCostPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => { if (!cancelled) setCar(res.model); })
      .catch(() => { if (!cancelled) setCar(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [brandSlug, modelSlug]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── 404 state ── */
  if (!car) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Model not found</p>
          <Link href="/new-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse New Cars
          </Link>
        </div>
      </div>
    );
  }

  const thisCost = TOTAL_3YR_COST;
  const maxCost = Math.max(thisCost, ...COMPETITORS.map((c) => c.cost));

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/${brandSlug}/${modelSlug}`} className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{car.brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} Service Cost</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ─── 3-YEAR TOTAL SUMMARY ─── */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
              <MaterialIcon name="savings" className="text-[18px] text-emerald-400" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">3-Year Maintenance Cost</p>
          </div>
          <p className="text-3xl font-black text-white">{formatPrice(thisCost)}</p>
          <p className="text-xs text-slate-500 mt-1">
            Approx. <span className="text-white font-semibold">{formatPrice(Math.round(thisCost / 36))}/month</span> over 6 scheduled services
          </p>
        </div>

        {/* ─── SERVICE SCHEDULE ─── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Service Schedule</h2>
          <div className="space-y-2">
            {SERVICE_SCHEDULE.map((interval, i) => (
              <div
                key={interval.km}
                className="rounded-2xl border border-white/5 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {/* Interval header */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0" style={{ background: "#1152d4" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{interval.km}</p>
                      <p className="text-[10px] text-slate-500">Scheduled service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-white">{formatPrice(interval.cost)}</p>
                    <p className="text-[10px] text-slate-500">est. cost</p>
                  </div>
                </div>

                {/* What is included */}
                <div className="px-4 pb-3 pt-1 border-t border-white/[0.03]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Includes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {interval.includes.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-medium border border-white/5" style={{ background: "rgba(255,255,255,0.03)", color: "#94a3b8" }}>
                        <MaterialIcon name="check" className="text-[10px] text-emerald-500" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── COMPETITOR COMPARISON ─── */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">vs Competition (3-Year Cost)</h2>
          <div className="rounded-2xl border border-white/5 p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
            {/* This car */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{car.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                    Lowest
                  </span>
                </div>
                <span className="text-xs font-black text-emerald-400">{formatPrice(thisCost)}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${(thisCost / maxCost) * 100}%`, background: "#10b981" }} />
              </div>
            </div>

            {/* Competitors */}
            {COMPETITORS.map((comp) => (
              <div key={comp.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-400">{comp.name}</span>
                  <span className="text-xs font-bold text-slate-300">{formatPrice(comp.cost)}</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(comp.cost / maxCost) * 100}%`, background: "#475569" }} />
                </div>
              </div>
            ))}

            <p className="text-[10px] text-slate-600 pt-1">
              You save up to <span className="text-emerald-400 font-bold">{formatPrice(Math.max(...COMPETITORS.map((c) => c.cost)) - thisCost)}</span> over 3 years compared to competition.
            </p>
          </div>
        </div>

        {/* ─── EXTENDED WARRANTY ─── */}
        <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.1)" }}>
              <MaterialIcon name="verified_user" className="text-[20px]" style={{ color: "#60a5fa" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white mb-1">Extended Warranty</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                Extend your peace of mind with an additional 2-year / 40,000 km extended warranty covering engine, transmission, electrical, and more.
              </p>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Coverage</p>
                  <p className="text-xs font-bold text-white">2 Years / 40,000 km</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Starting At</p>
                  <p className="text-xs font-bold text-white">{formatPrice(12999)}</p>
                </div>
              </div>
              <button
                className="h-9 px-5 rounded-xl text-[11px] font-bold transition-all"
                style={{ background: "rgba(17,82,212,0.12)", color: "#60a5fa" }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* ─── DISCLAIMER ─── */}
        <p className="text-[10px] text-slate-600 leading-relaxed pb-4">
          Service costs are approximate and may vary based on variant, location, parts availability, and labour charges. Contact your nearest authorized service center for exact pricing.
        </p>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
