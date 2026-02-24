"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { VehicleCard } from "@/components/VehicleCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { VEHICLE_CATEGORIES, SORT_OPTIONS, INVENTORY_FILTERS } from "@/lib/constants";

/* Autovinci — Vehicle Search & Browse (Buyer-facing marketplace page) */

const CATEGORIES = [
  { label: "All", value: "all" },
  ...VEHICLE_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
];

const PAGE_SIZE = 20;

export default function ShowroomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial values from URL
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";
  const initialPrice = searchParams.get("price") ?? "";
  const initialSort = searchParams.get("sort") ?? "featured";

  const [search, setSearch] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.findIndex((c) => c.value === initialCategory) || 0
  );
  const [priceRange, setPriceRange] = useState(initialPrice);
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  // Build API params
  const category = CATEGORIES[activeCategory]?.value;
  const apiParams = {
    limit: PAGE_SIZE,
    ...(category && category !== "all" ? { category: category.toUpperCase() } : {}),
    ...(search ? { search } : {}),
    ...(sort && sort !== "featured" ? { sort } : {}),
    ...(priceRange ? {} : {}), // Price filtering handled client-side for now
  };

  const { data, isLoading, refetch } = useApi(
    () => fetchVehicles(apiParams),
    [category, search, sort]
  );

  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);
  const total = data?.total ?? 0;

  // Filter by price range client-side
  const filteredVehicles = priceRange
    ? vehicles.filter((v) => {
        const [min, max] = priceRange.split("-").map(Number);
        return v.priceNumeric >= min && v.priceNumeric <= max;
      })
    : vehicles;

  // Update URL when filters change
  const updateUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      if (params.category && params.category !== "all") sp.set("category", params.category);
      if (params.price) sp.set("price", params.price);
      if (params.sort && params.sort !== "featured") sp.set("sort", params.sort);
      const qs = sp.toString();
      router.replace(`/showroom${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  const handleSearch = () => {
    updateUrl({
      q: search,
      category: CATEGORIES[activeCategory]?.value ?? "all",
      price: priceRange,
      sort,
    });
  };

  const handleCategoryChange = (idx: number) => {
    setActiveCategory(idx);
    updateUrl({
      q: search,
      category: CATEGORIES[idx]?.value ?? "all",
      price: priceRange,
      sort,
    });
  };

  return (
    <div
      className="min-h-dvh w-full pb-28"
      style={{ background: "#0a0c10" }}
    >
      {/* ═══ STICKY HEADER WITH SEARCH ═══ */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(10,12,16,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-lg mx-auto px-4 pt-3 pb-3">
          {/* Search row */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center justify-center h-10 w-10 shrink-0">
              <MaterialIcon name="arrow_back" className="text-[22px] text-slate-300" />
            </Link>
            <div className="flex-1 flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/10 px-3 py-2.5 focus-within:border-primary/40">
              <MaterialIcon name="search" className="text-[18px] text-slate-500 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search cars, brands..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateUrl({ q: "", category: CATEGORIES[activeCategory]?.value ?? "all", price: priceRange, sort });
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  <MaterialIcon name="close" className="text-[16px]" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
                showFilters ? "bg-primary text-white" : "bg-white/[0.06] text-slate-400"
              }`}
            >
              <MaterialIcon name="tune" className="text-[20px]" />
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 -mx-1 px-1 pb-1">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryChange(i)}
                className={`flex h-8 shrink-0 items-center justify-center rounded-full px-4 text-xs font-semibold transition-all ${
                  i === activeCategory
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.1]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="max-w-lg mx-auto px-4 pb-4 border-t border-white/5 pt-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Price Range */}
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(e.target.value);
                    updateUrl({ q: search, category: CATEGORIES[activeCategory]?.value ?? "all", price: e.target.value, sort });
                  }}
                  className="w-full h-9 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs px-3 outline-none focus:border-primary/40"
                >
                  <option value="" className="bg-[#0a0c10]">All Prices</option>
                  {INVENTORY_FILTERS.find((f) => f.key === "price")?.options
                    .filter((o) => o.value)
                    .map((o) => (
                      <option key={o.value} value={o.value} className="bg-[#0a0c10]">
                        {o.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    updateUrl({ q: search, category: CATEGORIES[activeCategory]?.value ?? "all", price: priceRange, sort: e.target.value });
                  }}
                  className="w-full h-9 rounded-lg bg-white/[0.06] border border-white/10 text-white text-xs px-3 outline-none focus:border-primary/40"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-[#0a0c10]">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Fuel Type
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {["All", "Petrol", "Diesel", "Electric"].map((fuel) => (
                    <button
                      key={fuel}
                      type="button"
                      className="h-7 px-3 rounded-full text-[10px] font-semibold bg-white/[0.06] text-slate-400 hover:bg-white/[0.1] transition-colors"
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 block">
                  Transmission
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {["All", "Manual", "Automatic"].map((trans) => (
                    <button
                      key={trans}
                      type="button"
                      className="h-7 px-3 rounded-full text-[10px] font-semibold bg-white/[0.06] text-slate-400 hover:bg-white/[0.1] transition-colors"
                    >
                      {trans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══ RESULTS ═══ */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-slate-500">
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                <span className="text-white font-semibold">{filteredVehicles.length}</span>{" "}
                {filteredVehicles.length === 1 ? "car" : "cars"} found
                {search && (
                  <span>
                    {" "}for &ldquo;<span className="text-primary">{search}</span>&rdquo;
                  </span>
                )}
              </>
            )}
          </p>
          {(search || activeCategory !== 0 || priceRange) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory(0);
                setPriceRange("");
                setSort("featured");
                router.replace("/showroom", { scroll: false });
              }}
              className="text-xs text-primary font-semibold flex items-center gap-1"
            >
              Clear all <MaterialIcon name="close" className="text-[14px]" />
            </button>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-white/5 animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredVehicles.length === 0 && (
          <EmptyState
            icon="search_off"
            title="No cars found"
            description={
              search
                ? `No results for "${search}". Try a different search or browse all cars.`
                : "No vehicles match your filters. Try adjusting your criteria."
            }
            action={{
              label: "Browse All",
              onClick: () => {
                setSearch("");
                setActiveCategory(0);
                setPriceRange("");
                router.replace("/showroom", { scroll: false });
              },
            }}
          />
        )}

        {/* Vehicle grid */}
        {!isLoading && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {filteredVehicles.map((v) => (
              <ShowroomCarCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}

        {/* Load more / total indicator */}
        {!isLoading && filteredVehicles.length > 0 && total > PAGE_SIZE && (
          <div className="text-center py-6">
            <p className="text-xs text-slate-500 mb-3">
              Showing {filteredVehicles.length} of {total} cars
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/[0.1] transition-colors"
            >
              <MaterialIcon name="expand_more" className="text-[18px]" />
              Load more
            </button>
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <BuyerBottomNav />
    </div>
  );
}

/* ── Compact car card for showroom grid ── */
function ShowroomCarCard({ vehicle }: { vehicle: ReturnType<typeof adaptVehicle> }) {
  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="block rounded-xl overflow-hidden bg-white/[0.04] border border-white/5 transition-all hover:border-white/10 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 430px) 50vw, 215px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
        {vehicle.aiTag && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-bold text-white">
            <MaterialIcon name="auto_awesome" className="text-[10px]" />
            AI
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
          {vehicle.year} &bull; {vehicle.km} km
        </p>
        <h3 className="text-xs font-bold text-white truncate mt-0.5">{vehicle.name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-white">{vehicle.price}</span>
        </div>
        <p className="text-[9px] text-slate-500 mt-1">
          {vehicle.fuel} &bull; {vehicle.transmission}
        </p>
      </div>
    </Link>
  );
}
