"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

interface ShortlistedCar {
  id: number;
  name: string;
  year: number;
  price: string;
  priceNum: string;
  fuel: string;
  transmission: string;
  image: string;
  slug: string;
}

const SHORTLISTED_CARS: ShortlistedCar[] = [
  {
    id: 1,
    name: "Maruti Brezza",
    year: 2024,
    price: "₹14.5L",
    priceNum: "₹14,50,000",
    fuel: "Petrol",
    transmission: "Manual",
    image: "/cars/brezza.jpg",
    slug: "maruti-brezza-2024",
  },
  {
    id: 2,
    name: "Hyundai Creta",
    year: 2024,
    price: "₹18.2L",
    priceNum: "₹18,20,000",
    fuel: "Diesel",
    transmission: "Automatic",
    image: "/cars/creta.jpg",
    slug: "hyundai-creta-2024",
  },
  {
    id: 3,
    name: "Tata Nexon",
    year: 2024,
    price: "₹11.8L",
    priceNum: "₹11,80,000",
    fuel: "Petrol",
    transmission: "AMT",
    image: "/cars/nexon.jpg",
    slug: "tata-nexon-2024",
  },
];

export default function MyShortlistPage() {
  const [cars, setCars] = useState<ShortlistedCar[]>(SHORTLISTED_CARS);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeCar = (id: number) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
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
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            {cars.length} cars
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {cars.length === 0 ? (
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
                      {/* Car thumbnail placeholder */}
                      <div
                        className="h-20 w-24 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <MaterialIcon name="directions_car" className="text-[28px] text-slate-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              {car.name} {car.year}
                            </h3>
                            <p className="text-base font-bold mt-0.5" style={{ color: "#60a5fa" }}>
                              {car.price}
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
                        href={`/cars/${car.slug}`}
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

      <BuyerBottomNav />
    </div>
  );
}
