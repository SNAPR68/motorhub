"use client";

import { useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { VEHICLE_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import type { Vehicle } from "@/lib/types";

/* ─── Autovinci Showroom — CarDekho-level buyer search experience ─── */

const PAGE_SIZE = 20;

const CATEGORIES = [
  { label: "All", value: "all", icon: "🚘" },
  ...VEHICLE_CATEGORIES,
];

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const TRANSMISSIONS = ["Manual", "Automatic"];

const BUDGET_RANGES = [
  { label: "Under ₹3L", value: "0-300000" },
  { label: "₹3–5L", value: "300000-500000" },
  { label: "₹5–8L", value: "500000-800000" },
  { label: "₹8–12L", value: "800000-1200000" },
  { label: "₹12–20L", value: "1200000-2000000" },
  { label: "₹20L+", value: "2000000-99999999" },
];

/** Rough EMI: 7-year loan, 9% p.a., 80% LTV */
function calcEmi(priceNumeric: number): string {
  const principal = priceNumeric * 0.8;
  const r = 0.09 / 12;
  const n = 84;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  if (emi < 1000) return "";
  return `₹${Math.round(emi / 1000)}k/mo`;
}

export default function ShowroomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const initialPrice = searchParams.get("price") ?? "";
  const initialSort = searchParams.get("sort") ?? "featured";

  const [search, setSearch] = useState(initialQuery);
  const [liveSearch, setLiveSearch] = useState(initialQuery);
  const [activeCatIdx, setActiveCatIdx] = useState(
    Math.max(0, CATEGORIES.findIndex((c) => c.value === initialCategory))
  );
  const [priceRange, setPriceRange] = useState(initialPrice);
  const [sort, setSort] = useState(initialSort);
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const category = CATEGORIES[activeCatIdx]?.value;

  const { data, isLoading } = useApi(
    () =>
      fetchVehicles({
        limit: PAGE_SIZE,
        status: "AVAILABLE",
        ...(category && category !== "all" ? { category: category.toUpperCase() } : {}),
        ...(liveSearch ? { search: liveSearch } : {}),
        ...(sort && sort !== "featured" ? { sort } : {}),
      }),
    [category, liveSearch, sort]
  );

  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);
  const total = data?.total ?? 0;

  const filtered = vehicles.filter((v) => {
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      if (v.priceNumeric < min || v.priceNumeric > max) return false;
    }
    if (fuel && v.fuel.toLowerCase() !== fuel.toLowerCase()) return false;
    if (transmission && v.transmission.toLowerCase() !== transmission.toLowerCase()) return false;
    return true;
  });

  const activeFilterCount = [priceRange, fuel, transmission].filter(Boolean).length;
  const hasFilters = !!(priceRange || fuel || transmission || liveSearch || activeCatIdx !== 0);

  const updateUrl = useCallback(
    (p: Record<string, string>) => {
      const sp = new URLSearchParams();
      if (p.q) sp.set("q", p.q);
      if (p.category && p.category !== "all") sp.set("category", p.category);
      if (p.price) sp.set("price", p.price);
      if (p.sort && p.sort !== "featured") sp.set("sort", p.sort);
      router.replace(`/showroom${sp.toString() ? `?${sp}` : ""}`, { scroll: false });
    },
    [router]
  );

  const commitSearch = () => {
    setLiveSearch(search);
    updateUrl({ q: search, category, price: priceRange, sort });
  };

  const clearAll = () => {
    setSearch(""); setLiveSearch(""); setActiveCatIdx(0);
    setPriceRange(""); setFuel(""); setTransmission(""); setSort("featured");
    router.replace("/showroom", { scroll: false });
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── STICKY HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 pt-3 pb-0">

          {/* Search row */}
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="flex h-9 w-9 items-center justify-center shrink-0 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
            </Link>

            <div
              className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 border border-white/10 focus-within:border-blue-500/40 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="search" className="text-[18px] text-slate-500 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && commitSearch()}
                placeholder="Search by name, brand, model..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              {search && (
                <button onClick={() => { setSearch(""); setLiveSearch(""); updateUrl({ category, price: priceRange, sort }); }} className="text-slate-500 hover:text-slate-300">
                  <MaterialIcon name="close" className="text-[16px]" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl shrink-0 transition-colors"
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

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.value}
                onClick={() => { setActiveCatIdx(i); updateUrl({ q: search, category: cat.value, price: priceRange, sort }); }}
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all"
                style={{
                  background: i === activeCatIdx ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: i === activeCatIdx ? "#fff" : "#94a3b8",
                  boxShadow: i === activeCatIdx ? "0 4px 12px rgba(17,82,212,0.25)" : "none",
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── FILTER PANEL ─── */}
        {showFilters && (
          <div className="max-w-lg mx-auto px-4 pb-4 border-t border-white/5 pt-4 space-y-4">
            {/* Budget */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Budget</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setPriceRange(priceRange === b.value ? "" : b.value)}
                    className="shrink-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all border"
                    style={{
                      background: priceRange === b.value ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)",
                      color: priceRange === b.value ? "#fff" : "#94a3b8",
                      borderColor: priceRange === b.value ? "#1152d4" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {b.label}
                  </button>
                ))}
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
                      onClick={() => setFuel(fuel === f ? "" : f)}
                      className="h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all border"
                      style={{
                        background: fuel === f ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)",
                        color: fuel === f ? "#fff" : "#94a3b8",
                        borderColor: fuel === f ? "#1152d4" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Gearbox</p>
                <div className="flex flex-col gap-1.5">
                  {TRANSMISSIONS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTransmission(transmission === t ? "" : t)}
                      className="h-7 px-2.5 rounded-full text-[11px] font-semibold transition-all border text-left"
                      style={{
                        background: transmission === t ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.03)",
                        color: transmission === t ? "#fff" : "#94a3b8",
                        borderColor: transmission === t ? "#1152d4" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort + clear */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sort by</p>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); updateUrl({ q: search, category, price: priceRange, sort: e.target.value }); }}
                  className="w-full h-9 rounded-xl text-white text-xs px-3 outline-none border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} style={{ background: "#080a0f" }}>{o.label}</option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="flex h-9 items-center gap-1.5 px-4 rounded-xl text-xs font-semibold border border-red-500/20"
                  style={{ background: "rgba(239,68,68,0.06)", color: "#f87171" }}
                >
                  <MaterialIcon name="close" className="text-[14px]" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ─── RESULTS ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">

        {/* Count bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">
            {isLoading ? (
              <span className="animate-pulse text-slate-600">Searching...</span>
            ) : (
              <>
                <span className="text-white font-semibold">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "car" : "cars"}
                {liveSearch && <> for <span className="text-blue-400">&ldquo;{liveSearch}&rdquo;</span></>}
              </>
            )}
          </p>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs font-semibold flex items-center gap-1" style={{ color: "#1152d4" }}>
              Clear all <MaterialIcon name="close" className="text-[13px]" />
            </button>
          )}
        </div>

        {/* Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-0 rounded-2xl overflow-hidden border border-white/5 animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-28 w-36 shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3.5 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 w-full rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <EmptyState
            icon="search_off"
            title="No cars found"
            description={liveSearch ? `No results for "${liveSearch}". Try different keywords or clear filters.` : "Try adjusting your filters."}
            action={{ label: "Browse All", onClick: clearAll }}
          />
        )}

        {/* ─── LIST ─── */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((v) => (
              <CarListCard key={v.id} vehicle={v} wishlisted={wishlist.has(v.id)} onWishlist={toggleWishlist} />
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && filtered.length > 0 && total > PAGE_SIZE && (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-600 mb-3">Showing {filtered.length} of {total}</p>
            <button className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-slate-300 border border-white/10 hover:border-white/20 transition-colors">
              <MaterialIcon name="expand_more" className="text-[18px]" />
              Load more
            </button>
          </div>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CAR LIST CARD — horizontal card, CarDekho-level info density
───────────────────────────────────────────────────────────────── */
function CarListCard({
  vehicle,
  wishlisted,
  onWishlist,
}: {
  vehicle: Vehicle;
  wishlisted: boolean;
  onWishlist: (id: string, e: React.MouseEvent) => void;
}) {
  const emi = calcEmi(vehicle.priceNumeric);

  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/10 block"
      style={{ background: "rgba(255,255,255,0.035)", borderColor: "rgba(255,255,255,0.07)" }}
    >
      {/* Image */}
      <div className="relative w-36 shrink-0 min-h-[112px]">
        <Image
          src={vehicle.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400"}
          alt={vehicle.name}
          fill
          sizes="144px"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.3))" }} />

        {/* Photo count */}
        {vehicle.gallery.length > 1 && (
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <MaterialIcon name="photo_library" className="text-[9px]" />
            {vehicle.gallery.length}
          </div>
        )}

        {/* AI badge */}
        {vehicle.aiTag && (
          <div
            className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
            style={{ background: "rgba(17,82,212,0.9)", backdropFilter: "blur(4px)" }}
          >
            <MaterialIcon name="verified" className="text-[9px]" />
            AI
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">

        {/* Name + wishlist */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-white leading-tight truncate">{vehicle.name}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{vehicle.year} &bull; {vehicle.owner}</p>
          </div>
          <button onClick={(e) => onWishlist(vehicle.id, e)} className="shrink-0 mt-0.5 p-0.5">
            <MaterialIcon
              name="favorite"
              fill={wishlisted}
              className="text-[20px] transition-colors"
              style={{ color: wishlisted ? "#ef4444" : "rgba(255,255,255,0.18)" }}
            />
          </button>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {[
            { icon: "local_gas_station", val: vehicle.fuel },
            { icon: "settings", val: vehicle.transmission },
            { icon: "speed", val: `${vehicle.km} km` },
          ].map(({ icon, val }) => (
            <span
              key={val}
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <MaterialIcon name={icon} className="text-[10px]" />
              {val}
            </span>
          ))}
        </div>

        {/* Price + EMI + location */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white">{vehicle.price}</span>
            {emi && (
              <span className="text-[11px] text-slate-500">
                EMI <span className="text-slate-400 font-semibold">{emi}</span>
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="flex items-center gap-1 text-[10px] text-slate-500 truncate">
              <MaterialIcon name="location_on" className="text-[11px] shrink-0" />
              {vehicle.location}
            </span>
            {vehicle.badge && (
              <span
                className="shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full border"
                style={{ color: "#34d399", background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.25)" }}
              >
                {vehicle.badge}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
