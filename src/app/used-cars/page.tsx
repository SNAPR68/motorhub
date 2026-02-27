"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import type { Vehicle } from "@/lib/types";
import { formatEmi } from "@/lib/car-catalog";

/* ─── Used Cars Marketplace ─── */

const FUEL_OPTS = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const TRANS_OPTS = ["Manual", "Automatic", "CVT", "AMT", "DCT"];
const OWNER_OPTS = ["1st Owner", "2nd Owner", "3rd Owner+"];
const SORT_OPTS = [
  { label: "Relevance", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Lowest Km", value: "km_asc" },
];
const BUDGET_PILLS = [
  { label: "Under ₹3L", max: 300000 },
  { label: "₹3L–6L", max: 600000 },
  { label: "₹6L–10L", max: 1000000 },
  { label: "₹10L–15L", max: 1500000 },
  { label: "₹15L+", max: 999999999 },
];

export default function UsedCarsPage() {
  const { data, isLoading: loading } = useApi(() => fetchVehicles({ limit: 50 }), []);
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const [search, setSearch] = useState("");
  const [activeFuel, setActiveFuel] = useState("");
  const [activeTrans, setActiveTrans] = useState("");
  const [activeOwner, setActiveOwner] = useState("");
  const [maxBudget, setMaxBudget] = useState(999999999);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeFuel && v.fuel.toLowerCase() !== activeFuel.toLowerCase()) return false;
      if (activeTrans && v.transmission.toLowerCase() !== activeTrans.toLowerCase()) return false;
      if (v.priceNumeric > maxBudget) return false;
      return true;
    });

    if (sort === "price_asc") list = [...list].sort((a, b) => a.priceNumeric - b.priceNumeric);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.priceNumeric - a.priceNumeric);
    if (sort === "newest") list = [...list].sort((a, b) => b.year - a.year);

    return list;
  }, [vehicles, search, activeFuel, activeTrans, activeOwner, maxBudget, sort]);

  const activeFilterCount = [
    !!activeFuel,
    !!activeTrans,
    !!activeOwner,
    maxBudget < 999999999,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch(""); setActiveFuel(""); setActiveTrans("");
    setActiveOwner(""); setMaxBudget(999999999); setSort("featured");
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
                placeholder="Search used cars..."
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

          {/* Sort strip */}
          <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
            <MaterialIcon name="sort" className="text-[16px] text-slate-500 shrink-0" />
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {SORT_OPTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className="flex h-7 shrink-0 items-center px-3 rounded-full text-[11px] font-semibold border transition-all"
                  style={{
                    background: sort === s.value ? "rgba(17,82,212,0.15)" : "rgba(255,255,255,0.03)",
                    color: sort === s.value ? "#fff" : "#64748b",
                    borderColor: sort === s.value ? "#1152d4" : "rgba(255,255,255,0.08)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="max-w-lg mx-auto px-4 pb-4 border-t border-white/5 pt-3 space-y-4">
            {/* Budget */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Budget</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {BUDGET_PILLS.map((b) => {
                  const isActive = maxBudget === b.max;
                  return (
                    <button
                      key={b.label}
                      onClick={() => setMaxBudget(isActive ? 999999999 : b.max)}
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
                  {FUEL_OPTS.map((f) => (
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

              {/* Transmission */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Gearbox</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRANS_OPTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTrans(activeTrans === t ? "" : t)}
                      className="h-7 px-2.5 rounded-full text-[11px] font-semibold border"
                      style={{ background: activeTrans === t ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)", color: activeTrans === t ? "#fff" : "#94a3b8", borderColor: activeTrans === t ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Ownership</p>
              <div className="flex gap-2">
                {OWNER_OPTS.map((o) => (
                  <button
                    key={o}
                    onClick={() => setActiveOwner(activeOwner === o ? "" : o)}
                    className="h-7 px-3 rounded-full text-[11px] font-semibold border"
                    style={{ background: activeOwner === o ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)", color: activeOwner === o ? "#fff" : "#94a3b8", borderColor: activeOwner === o ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                  >
                    {o}
                  </button>
                ))}
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
            <span className="text-white font-semibold">{loading ? "..." : filtered.length}</span> used cars found
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

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex rounded-2xl overflow-hidden border border-white/5 animate-pulse" style={{ background: "rgba(255,255,255,0.03)", minHeight: "120px" }}>
                <div className="w-36 shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3 w-1/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((car) => (
            <UsedCarCard key={car.id} car={car} />
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

function UsedCarCard({ car }: { car: Vehicle }) {
  const kmFormatted = car.km
    ? Number(car.km.replace(/\D/g, "")).toLocaleString("en-IN") + " km"
    : "N/A";

  return (
    <Link
      href={`/used-cars/details/${car.id}`}
      className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/12 block"
      style={{ background: "rgba(255,255,255,0.035)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Image */}
      <div className="relative w-36 shrink-0" style={{ minHeight: "120px" }}>
        {car.image ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            sizes="144px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MaterialIcon name="directions_car" className="text-[36px] text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3))" }} />
        {car.gallery && car.gallery.length > 1 && (
          <span className="absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: "rgba(0,0,0,0.65)" }}>
            {car.gallery.length} photos
          </span>
        )}
        {car.aiTag && (
          <span className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "rgba(17,82,212,0.9)", backdropFilter: "blur(4px)" }}>
            AI
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-white leading-tight truncate">{car.name}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{car.year} · {car.owner}</p>
            </div>
            <MaterialIcon name="favorite_border" className="text-[18px] text-slate-600 shrink-0" />
          </div>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {[car.fuel, car.transmission, kmFormatted].map((val) => (
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
            <span className="text-sm font-black text-white">{car.price}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            EMI <span className="text-slate-400 font-semibold">{formatEmi(car.priceNumeric)}</span>
            {car.location && <span className="ml-2 text-slate-600">· {car.location}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
}
