"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatCity(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const OFFERS = [
  {
    id: 1,
    brand: "Maruti Suzuki",
    model: "Swift",
    discount: "45,000",
    validity: "Valid till 28 Feb 2026",
    type: "Cash Discount",
    color: "#e11d48",
  },
  {
    id: 2,
    brand: "Hyundai",
    model: "i20",
    discount: "60,000",
    validity: "Valid till 15 Mar 2026",
    type: "Exchange Bonus",
    color: "#1152d4",
  },
  {
    id: 3,
    brand: "Tata",
    model: "Nexon",
    discount: "35,000",
    validity: "Valid till 28 Feb 2026",
    type: "Corporate Discount",
    color: "#0d9488",
  },
  {
    id: 4,
    brand: "Kia",
    model: "Seltos",
    discount: "75,000",
    validity: "Valid till 10 Mar 2026",
    type: "Cash + Exchange",
    color: "#7c3aed",
  },
  {
    id: 5,
    brand: "Honda",
    model: "City",
    discount: "50,000",
    validity: "Valid till 28 Feb 2026",
    type: "Loyalty Bonus",
    color: "#ea580c",
  },
  {
    id: 6,
    brand: "Toyota",
    model: "Glanza",
    discount: "30,000",
    validity: "Valid till 31 Mar 2026",
    type: "Cash Discount",
    color: "#dc2626",
  },
];

export default function CityOffersPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const cityName = formatCity(city);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/offers"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Offers in {cityName}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="rounded-2xl p-4 border border-white/5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: offer.color }}
                >
                  {offer.brand.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{offer.brand}</p>
                  <p className="text-slate-500 text-xs">{offer.model}</p>
                </div>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}
              >
                {offer.type}
              </span>
            </div>

            <div
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-wide">Discount</p>
                <p className="text-emerald-400 text-xl font-bold mt-0.5">Rs {offer.discount}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] uppercase tracking-wide">Validity</p>
                <p className="text-slate-300 text-xs font-medium mt-0.5">{offer.validity}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <MaterialIcon name="location_on" className="text-[14px] text-slate-500" />
              <span className="text-[11px] text-slate-500">Available at all {offer.brand} dealers in {cityName}</span>
            </div>
          </div>
        ))}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
