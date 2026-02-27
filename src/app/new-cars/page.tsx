"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import {
  BODY_TYPES,
  BUDGET_SEGMENTS,
  formatEmi,
} from "@/lib/car-catalog";
import { fetchCarBrands, fetchCarModels, type ApiBrand, type ApiCarModel } from "@/lib/api";

/* ─── New Cars Browse Page ─── */

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];

export default function NewCarsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}><div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" /></div>}>
      <NewCarsInner />
    </Suspense>
  );
}

function NewCarsInner() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeBody, setActiveBody] = useState(searchParams.get("body") ?? "all");
  const [activeBrand, setActiveBrand] = useState(searchParams.get("brand") ?? "all");
  const [activeFuel, setActiveFuel] = useState("");
  const [minPrice, setMinPrice] = useState(Number(searchParams.get("minPrice") ?? 0));
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get("maxPrice") ?? 999999999));
  const [showFilters, setShowFilters] = useState(false);

  const [allModels, setAllModels] = useState<ApiCarModel[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all models + brands from DB on mount
  useEffect(() => {
    Promise.all([
      fetchCarModels({ limit: 100 }),
      fetchCarBrands(),
    ])
      .then(([modelsData, brandsData]) => {
        setAllModels(modelsData.models);
        setBrands(brandsData.brands);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Client-side filtering (dataset is small)
  const filtered = useMemo(() => {
    return allModels.filter((m) => {
      if (search && !m.fullName.toLowerCase().includes(search.toLowerCase()) &&
        !m.brand.slug.toLowerCase().includes(search.toLowerCase()) &&
        !m.brand.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeBody !== "all" && m.category.toLowerCase() !== activeBody) return false;
      if (activeBrand !== "all" && m.brand.slug !== activeBrand) return false;
      if (activeFuel && !m.fuelTypes.some((f) => f.toLowerCase() === activeFuel.toLowerCase())) return false;
      if (m.startingPrice < minPrice || m.startingPrice > maxPrice) return false;
      return true;
    });
  }, [allModels, search, activeBody, activeBrand, activeFuel, minPrice, maxPrice]);

  const activeFilterCount = [
    activeBody !== "all",
    activeBrand !== "all",
    !!activeFuel,
    minPrice > 0 || maxPrice < 999999999,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch(""); setActiveBody("all"); setActiveBrand("all");
    setActiveFuel(""); setMinPrice(0); setMaxPrice(999999999);
  };

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 pt-3 pb-0">

          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
              <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
            </Link>
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-blue-500/40" style={{ background: "rgba(255,255,255,0.05)" }}>
              <MaterialIcon name="search" className="text-[18px] text-slate-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search new cars..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-500 hover:text-slate-300">
                  <MaterialIcon name="close" className="text-[15px]" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ background: showFilters ? "#1152d4" : "rgba(255,255,255,0.05)", color: showFilters ? "#fff" : "#94a3b8" }}
            >
              <MaterialIcon name="tune" className="text-[20px]" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: "#ef4444" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Body type pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
            <button
              onClick={() => setActiveBody("all")}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all"
              style={{ background: activeBody === "all" ? "#1152d4" : "rgba(255,255,255,0.05)", color: activeBody === "all" ? "#fff" : "#94a3b8" }}
            >
              🚘 All
            </button>
            {BODY_TYPES.map((bt) => (
              <button
                key={bt.value}
                onClick={() => setActiveBody(bt.value)}
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all"
                style={{ background: activeBody === bt.value ? "#1152d4" : "rgba(255,255,255,0.05)", color: activeBody === bt.value ? "#fff" : "#94a3b8" }}
              >
                {bt.icon} {bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="max-w-lg mx-auto px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {/* Budget */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Budget</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {BUDGET_SEGMENTS.map((b) => {
                  const isActive = minPrice === b.min && maxPrice === b.max;
                  return (
                    <button
                      key={b.label}
                      onClick={() => { setMinPrice(isActive ? 0 : b.min); setMaxPrice(isActive ? 999999999 : b.max); }}
                      className="shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold border"
                      style={{ background: isActive ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)", color: isActive ? "#fff" : "#94a3b8", borderColor: isActive ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Fuel */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Fuel</p>
                <div className="flex flex-wrap gap-1.5">
                  {FUEL_TYPES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFuel(activeFuel === f ? "" : f)}
                      className="h-7 px-2.5 rounded-full text-[11px] font-semibold border"
                      style={{ background: activeFuel === f ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)", color: activeFuel === f ? "#fff" : "#94a3b8", borderColor: activeFuel === f ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Brand</p>
                <select
                  value={activeBrand}
                  onChange={(e) => setActiveBrand(e.target.value)}
                  className="w-full h-9 rounded-xl text-white text-xs px-3 outline-none border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <option value="all" style={{ background: "#080a0f" }}>All Brands</option>
                  {brands.map((b) => (
                    <option key={b.slug} value={b.slug} style={{ background: "#080a0f" }}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="flex h-8 items-center gap-1.5 px-4 rounded-xl text-xs font-semibold border border-red-500/20" style={{ background: "rgba(239,68,68,0.06)", color: "#f87171" }}>
                <MaterialIcon name="close" className="text-[13px]" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </header>

      {/* ─── RESULTS ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">
            {loading ? "Loading..." : <><span className="text-white font-semibold">{filtered.length}</span> cars found</>}
          </p>
          {activeFilterCount > 0 && (
            <button onClick={clearAll} className="text-xs font-semibold flex items-center gap-1" style={{ color: "#1152d4" }}>
              Clear all <MaterialIcon name="close" className="text-[13px]" />
            </button>
          )}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-400">No cars found</p>
            <p className="text-xs text-slate-600 mt-1">Try adjusting your filters</p>
            <button onClick={clearAll} className="mt-4 px-6 py-2 rounded-full text-sm font-semibold text-white" style={{ background: "#1152d4" }}>Clear filters</button>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((car) => (
            <NewCarCard key={car.slug} car={car} />
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

function NewCarCard({ car }: { car: ApiCarModel }) {
  return (
    <Link
      href={`/${car.brand.slug}/${car.slug}`}
      className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/12 block"
      style={{ background: "rgba(255,255,255,0.035)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Image */}
      <div className="relative w-36 shrink-0" style={{ minHeight: "120px" }}>
        <Image
          src={car.image}
          alt={car.fullName}
          fill
          sizes="144px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.25))" }} />
        {car.tag && (
          <span
            className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: "rgba(17,82,212,0.9)", backdropFilter: "blur(4px)" }}
          >
            {car.tag}
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-400">
          {car.rating}★
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{car.brand.name.toUpperCase()}</p>
          <h3 className="text-[13px] font-bold text-white leading-tight">{car.name}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">{car.reviewCount.toLocaleString()} reviews</p>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {[car.bodyType, car.fuelTypes[0], `${car.seating} Seats`].map((val) => (
            <span
              key={val}
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              {val}
            </span>
          ))}
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-white">{car.startingPriceDisplay}</span>
            <span className="text-[10px] text-slate-500">onwards</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            EMI <span className="text-slate-400 font-semibold">{formatEmi(car.startingPrice)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
