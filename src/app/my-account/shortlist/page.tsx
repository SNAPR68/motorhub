"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useApi } from "@/lib/hooks/use-api";
import { fetchWishlist, type DbVehicle } from "@/lib/api";

export default function MyShortlistPage() {
  const { data, isLoading: loading } = useApi(() => fetchWishlist(), []);

  const allVehicles: DbVehicle[] = data?.wishlists?.map((w) => w.vehicle) ?? [];
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cars = allVehicles.filter((v) => !removedIds.has(v.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeCar = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <BuyerAppShell>
    <div className="min-h-dvh w-full " style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">My Shortlist</h1>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >
              {cars.length} cars
            </span>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {loading ? (
          /* Loading skeleton */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        ) : cars.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center py-20 text-center">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(239,68,68,0.08)" }}
            >
              <MaterialIcon name="favorite" className="text-[32px]" style={{ color: "#f87171" }} />
            </div>
            <h2 className="text-base font-bold text-white mb-1">No shortlisted cars yet</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-[260px]">
              Browse our collection and tap the heart icon to save cars you love.
            </p>
            <Link
              href="/new-cars"
              className="h-11 px-6 rounded-xl flex items-center gap-2 text-sm font-semibold text-white transition-all"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="search" className="text-[18px]" />
              Browse Cars
            </Link>
          </div>
        ) : (
          <>
            {/* Shortlisted Car Cards */}
            <div className="space-y-3">
              {cars.map((car) => {
                const isSelected = selected.has(car.id);
                const imageUrl = car.images?.[0];
                return (
                  <div
                    key={car.id}
                    className="p-4 rounded-2xl border transition-all"
                    style={{
                      background: isSelected ? "rgba(17,82,212,0.06)" : "rgba(255,255,255,0.03)",
                      borderColor: isSelected ? "rgba(17,82,212,0.3)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Car thumbnail */}
                      <div
                        className="h-20 w-24 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={car.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <MaterialIcon name="directions_car" className="text-[28px] text-slate-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              {car.name} {car.year}
                            </h3>
                            <p className="text-base font-bold mt-0.5" style={{ color: "#60a5fa" }}>
                              {car.priceDisplay}
                            </p>
                          </div>
                          {/* Remove (red heart) */}
                          <button
                            onClick={() => removeCar(car.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-all"
                            style={{ background: "rgba(239,68,68,0.1)" }}
                          >
                            <MaterialIcon name="favorite" className="text-[18px]" style={{ color: "#ef4444" }} />
                          </button>
                        </div>

                        {/* Spec chips */}
                        <div className="flex gap-1.5 mt-2">
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                          >
                            {car.fuel}
                          </span>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                          >
                            {car.transmission}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action row */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => toggleSelect(car.id)}
                        className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: isSelected ? "rgba(17,82,212,0.15)" : "rgba(255,255,255,0.05)",
                          color: isSelected ? "#60a5fa" : "#94a3b8",
                          border: isSelected ? "1px solid rgba(17,82,212,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <MaterialIcon
                          name={isSelected ? "check_circle" : "circle"}
                          className="text-[14px]"
                        />
                        Compare
                      </button>
                      <Link
                        href={`/vehicle/${car.id}`}
                        className="flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        style={{
                          background: "rgba(17,82,212,0.12)",
                          color: "#60a5fa",
                          border: "1px solid rgba(17,82,212,0.2)",
                        }}
                      >
                        View Details
                        <MaterialIcon name="arrow_forward" className="text-[14px]" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compare Selected */}
            <div className="pt-2">
              <button
                disabled={selected.size < 2}
                className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: selected.size >= 2 ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: selected.size >= 2 ? "#fff" : "#475569",
                  cursor: selected.size >= 2 ? "pointer" : "not-allowed",
                }}
              >
                <MaterialIcon name="compare_arrows" className="text-[20px]" />
                Compare Selected ({selected.size})
              </button>
            </div>
          </>
        )}
      </main>
    </div>
    </BuyerAppShell>
  );
}
