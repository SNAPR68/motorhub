"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const BRANDS = ["All", "Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Mahindra", "Kia"] as const;

const DEALERS = [
  {
    id: "mandovi-motors",
    name: "Mandovi Motors",
    brand: "Maruti",
    area: "Indiranagar",
    city: "Bengaluru",
    rating: 4.5,
    reviews: 342,
    hours: "8AM – 8PM",
    distance: "3.2 km",
  },
  {
    id: "trident-hyundai",
    name: "Trident Hyundai",
    brand: "Hyundai",
    area: "Koramangala",
    city: "Bengaluru",
    rating: 4.3,
    reviews: 218,
    hours: "9AM – 7PM",
    distance: "5.1 km",
  },
  {
    id: "prerana-honda",
    name: "Prerana Honda",
    brand: "Honda",
    area: "HSR Layout",
    city: "Bengaluru",
    rating: 4.6,
    reviews: 189,
    hours: "9AM – 8PM",
    distance: "6.4 km",
  },
  {
    id: "concorde-tata",
    name: "Concorde Tata",
    brand: "Tata",
    area: "Whitefield",
    city: "Bengaluru",
    rating: 4.2,
    reviews: 156,
    hours: "8AM – 7PM",
    distance: "12.1 km",
  },
  {
    id: "toyota-kirloskar",
    name: "Toyota Kirloskar",
    brand: "Toyota",
    area: "Domlur",
    city: "Bengaluru",
    rating: 4.7,
    reviews: 421,
    hours: "9AM – 7PM",
    distance: "7.8 km",
  },
];

const BRAND_COLORS: Record<string, string> = {
  Maruti: "#1152d4",
  Hyundai: "#0055a4",
  Honda: "#cc0000",
  Tata: "#003a8c",
  Toyota: "#e50000",
  Mahindra: "#d62027",
  Kia: "#c62026",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <MaterialIcon name="star" fill className="text-[14px] text-amber-400" />
      <span className="text-amber-400 text-xs font-semibold">{rating}</span>
    </div>
  );
}

export default function FindDealersPage() {
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = DEALERS.filter((d) => {
    const matchBrand = activeBrand === "All" || d.brand === activeBrand;
    const matchSearch =
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.area.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchSearch;
  });

  return (
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
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
        {/* City selector */}
        <button
          className="flex items-center gap-2 rounded-full px-4 py-2 border border-white/15"
          style={{ background: "#111827" }}
        >
          <MaterialIcon name="location_on" fill className="text-[16px] text-blue-400" />
          <span className="text-white text-sm font-semibold">Bengaluru</span>
          <MaterialIcon name="keyboard_arrow_down" className="text-[18px] text-slate-400" />
        </button>

        {/* Search bar */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/10"
          style={{ background: "#111827" }}
        >
          <MaterialIcon name="search" className="text-[20px] text-slate-400" />
          <input
            type="text"
            placeholder="Search dealer name or area"
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
                background: activeBrand === brand ? "#1152d4" : "#111827",
                color: activeBrand === brand ? "#fff" : "#94a3b8",
                border: activeBrand === brand ? "1px solid #1152d4" : "1px solid transparent",
              }}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Map placeholder */}
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ height: 160, background: "#111827" }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, #1152d430 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1152d430 0px, transparent 1px, transparent 40px)",
            }}
          />
          <div className="flex flex-col items-center gap-2 z-10">
            <MaterialIcon name="map" className="text-[40px] text-slate-600" />
            <p className="text-slate-500 text-xs">Map view</p>
          </div>
          {/* Fake pins */}
          {[
            { top: "30%", left: "25%" },
            { top: "50%", left: "55%" },
            { top: "65%", left: "35%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
              style={{ top: pos.top, left: pos.left, background: "#1152d4" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          ))}
        </div>

        {/* Dealer cards */}
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
                    style={{ background: BRAND_COLORS[dealer.brand] ?? "#1152d4" }}
                  >
                    {dealer.brand[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{dealer.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {dealer.area}, {dealer.city}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold rounded-full px-2.5 py-1"
                  style={{ background: "#1a2235", color: "#94a3b8" }}
                >
                  {dealer.distance}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StarRating rating={dealer.rating} />
                <span className="text-slate-500 text-xs">{dealer.reviews} reviews</span>
                <div className="flex items-center gap-1 ml-auto">
                  <MaterialIcon name="schedule" className="text-[13px] text-slate-400" />
                  <span className="text-slate-400 text-xs">{dealer.hours}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(dealer.name + " " + dealer.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 border border-white/15 text-slate-300"
                  style={{ background: "#1a2235" }}
                >
                  <MaterialIcon name="directions" className="text-[15px]" />
                  Directions
                </a>
                <a
                  href="tel:+918001234567"
                  className="flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 border border-white/15 text-slate-300"
                  style={{ background: "#1a2235" }}
                >
                  <MaterialIcon name="call" className="text-[15px]" />
                  Call
                </a>
                <Link
                  href={`/dealers/${dealer.id}`}
                  className="flex-1 rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 text-white"
                  style={{ background: "#1152d4" }}
                >
                  <MaterialIcon name="storefront" className="text-[15px]" />
                  View
                </Link>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MaterialIcon name="search_off" className="text-[48px] text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No dealers found for your search.</p>
            </div>
          )}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
