"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerSearch } from "@/lib/api";
import type { PublicDealer } from "@/lib/api";

const BRANDS = ["All", "Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra", "Kia"] as const;

const BRAND_COLORS: Record<string, string> = {
  Maruti: "#3B82F6",
  Hyundai: "#0055a4",
  Honda: "#cc0000",
  Tata: "#003a8c",
  Toyota: "#e50000",
  Mahindra: "#d62027",
  Kia: "#c62026",
};

function StarRating({ count }: { count: number }) {
  return (<div className="flex items-center gap-1">
      <MaterialIcon name="storefront" className="text-[14px] text-blue-400" />
      <span className="text-blue-400 text-xs font-semibold">{count} cars</span>
    </div>
  );
}

export default function DealersClient() {
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useApi(
    () => fetchDealerSearch({ limit: 30 }),
    []
  );
  const dealers: PublicDealer[] = data?.dealers ?? [];

  const filtered = dealers.filter((d) => {
    const matchBrand = activeBrand === "All" || d.dealershipName.toLowerCase().includes(activeBrand.toLowerCase());
    const matchSearch =
      search === "" ||
      d.dealershipName.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <BuyerAppShell>
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#0A1628", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#0A1628" }}
      >
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Find Dealers</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/10"
          style={{ background: "#111827" }}
        >
          <MaterialIcon name="search" className="text-[20px] text-slate-400" />
          <input
            type="text"
            placeholder="Search dealer name or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <MaterialIcon name="close" className="text-[18px] text-slate-400" />
            </button>
          )}
        </div>

        {/* Brand pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: activeBrand === brand ? "#3B82F6" : "#111827",
                color: activeBrand === brand ? "#fff" : "#94a3b8",
                border: activeBrand === brand ? "1px solid #3B82F6" : "1px solid transparent",
              }}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-4 border border-white/10 animate-pulse"
                style={{ background: "#111827" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="h-8 bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Dealer cards */}
        {!isLoading && (
          <div className="space-y-4">
            {filtered.map((dealer) => (
              <div
                key={dealer.id}
                className="rounded-2xl p-4 border border-white/10"
                style={{ background: "#111827" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: BRAND_COLORS[activeBrand] ?? "#3B82F6" }}
                    >
                      {dealer.dealershipName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{dealer.dealershipName}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {dealer.address ? `${dealer.address}, ` : ""}{dealer.city || "India"}
                      </p>
                    </div>
                  </div>
                  {dealer.plan === "ENTERPRISE" && (
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(196,181,253,0.15)", color: "#c4b5fd" }}
                    >
                      Platinum
                    </span>
                  )}
                  {dealer.plan === "GROWTH" && (
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
                    >
                      Gold
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <StarRating count={dealer.vehicleCount} />
                  {dealer.state && (
                    <span className="text-slate-500 text-xs">{dealer.state}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {dealer.city && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(dealer.dealershipName + " " + dealer.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 border border-white/15 text-slate-300"
                      style={{ background: "#0F1D32" }}
                    >
                      <MaterialIcon name="directions" className="text-[15px]" />
                      Directions
                    </a>
                  )}
                  <Link
                    href={`/dealers/profile/${dealer.id}`}
                    className="flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 text-white"
                    style={{ background: "#3B82F6" }}
                  >
                    <MaterialIcon name="storefront" className="text-[15px]" />
                    View
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <MaterialIcon name="storefront" className="text-[48px] text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">
                  {dealers.length === 0
                    ? "No dealers registered yet. Be the first!"
                    : "No dealers found for your search."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </BuyerAppShell>
  );
}
