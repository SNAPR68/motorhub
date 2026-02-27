"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Brand Data ─── */
interface BrandEntry {
  name: string;
  slug: string;
  models: number;
  color: string;
}

interface OriginGroup {
  origin: string;
  icon: string;
  brands: BrandEntry[];
}

const BRAND_GROUPS: OriginGroup[] = [
  {
    origin: "Indian",
    icon: "flag",
    brands: [
      { name: "Tata", slug: "tata", models: 10, color: "#1152d4" },
      { name: "Mahindra", slug: "mahindra", models: 9, color: "#dc2626" },
      { name: "Maruti Suzuki", slug: "maruti", models: 16, color: "#16a34a" },
    ],
  },
  {
    origin: "Japanese",
    icon: "language",
    brands: [
      { name: "Honda", slug: "honda", models: 7, color: "#dc2626" },
      { name: "Toyota", slug: "toyota", models: 8, color: "#b45309" },
      { name: "Nissan", slug: "nissan", models: 5, color: "#dc2626" },
    ],
  },
  {
    origin: "Korean",
    icon: "language",
    brands: [
      { name: "Hyundai", slug: "hyundai", models: 12, color: "#1152d4" },
      { name: "Kia", slug: "kia", models: 6, color: "#dc2626" },
    ],
  },
  {
    origin: "European",
    icon: "language",
    brands: [
      { name: "Volkswagen", slug: "volkswagen", models: 6, color: "#1152d4" },
      { name: "Skoda", slug: "skoda", models: 5, color: "#16a34a" },
      { name: "BMW", slug: "bmw", models: 11, color: "#1152d4" },
      { name: "Audi", slug: "audi", models: 10, color: "#9ca3af" },
      { name: "Mercedes-Benz", slug: "mercedes-benz", models: 13, color: "#9ca3af" },
    ],
  },
  {
    origin: "American",
    icon: "language",
    brands: [
      { name: "Ford", slug: "ford", models: 5, color: "#1152d4" },
      { name: "Jeep", slug: "jeep", models: 4, color: "#16a34a" },
    ],
  },
  {
    origin: "Chinese",
    icon: "language",
    brands: [
      { name: "MG", slug: "mg", models: 5, color: "#dc2626" },
      { name: "BYD", slug: "byd", models: 4, color: "#1152d4" },
    ],
  },
];

const ALL_BRANDS: BrandEntry[] = BRAND_GROUPS.flatMap((g) => g.brands);

/* ─── Brand Avatar ─── */
function BrandAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-[18px] flex-shrink-0"
      style={{ backgroundColor: `${color}22`, border: `2px solid ${color}44` }}
    >
      <span style={{ color }}>{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

/* ─── Page ─── */
export default function AllBrandsPage() {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return BRAND_GROUPS;
    const q = search.toLowerCase();
    return BRAND_GROUPS.map((g) => ({
      ...g,
      brands: g.brands.filter((b) => b.name.toLowerCase().includes(q)),
    })).filter((g) => g.brands.length > 0);
  }, [search]);

  const totalFiltered = filteredGroups.reduce((sum, g) => sum + g.brands.length, 0);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/95 backdrop-blur border-b border-white/5 max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
        <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors -ml-2">
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </Link>
        <h1 className="font-semibold text-[17px] tracking-tight flex-1">All Car Brands</h1>
      </header>

      <main className="max-w-lg mx-auto px-4">
        {/* Search */}
        <div className="mt-4 relative">
          <MaterialIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div className="mt-4 flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
          <MaterialIcon name="directions_car" className="text-[22px] text-[#1152d4]" />
          <div>
            <p className="font-bold text-sm text-white">
              {search ? `${totalFiltered} Brand${totalFiltered !== 1 ? "s" : ""} found` : "32 Brands · 500+ Models"}
            </p>
            <p className="text-xs text-slate-500">Available in India's used car market</p>
          </div>
        </div>

        {/* Brand Groups */}
        <div className="mt-5 space-y-6">
          {filteredGroups.map((group) => (
            <section key={group.origin}>
              {/* Section label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {group.origin}
                </span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[11px] text-slate-600">{group.brands.length}</span>
              </div>

              {/* Brands list */}
              <div className="space-y-2">
                {group.brands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/cars/${brand.slug}`}
                    className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3.5 hover:border-[#1152d4]/30 hover:bg-white/[0.05] transition-all group"
                  >
                    <BrandAvatar name={brand.name} color={brand.color} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-white group-hover:text-[#60a5fa] transition-colors">
                        {brand.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {brand.models} models available
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1152d4] bg-[#1152d4]/10 px-2 py-0.5 rounded-full">
                        {brand.models}
                      </span>
                      <MaterialIcon name="chevron_right" className="text-[20px] text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {filteredGroups.length === 0 && (
            <div className="text-center py-16">
              <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium">No brands found for "{search}"</p>
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-[#60a5fa] hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        {!search && (
          <p className="text-center text-xs text-slate-600 mt-6 mb-2">
            Showing all brands available in the Indian market
          </p>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
