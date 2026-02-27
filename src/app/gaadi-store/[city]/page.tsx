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

interface Store {
  id: number;
  name: string;
  address: string;
  timings: string;
  services: string[];
  phone: string;
}

const CITY_STORES: Record<string, Store[]> = {
  mumbai: [
    {
      id: 1,
      name: "Autovinci Experience Center — Andheri",
      address: "Ground Floor, Link Road, Andheri West, Mumbai 400053",
      timings: "10:00 AM - 8:00 PM (Mon-Sat), 11:00 AM - 6:00 PM (Sun)",
      services: ["Test Drive", "150-Point Inspection", "Instant Finance", "RC Transfer"],
      phone: "022-4812-3456",
    },
    {
      id: 2,
      name: "Autovinci Studio — Powai",
      address: "Hiranandani Gardens, Central Avenue, Powai, Mumbai 400076",
      timings: "10:00 AM - 8:00 PM (Mon-Sat), Closed Sunday",
      services: ["Test Drive", "150-Point Inspection", "Insurance"],
      phone: "022-4812-7890",
    },
    {
      id: 3,
      name: "Autovinci Hub — Thane",
      address: "Viviana Mall, Eastern Express Highway, Thane West 400601",
      timings: "11:00 AM - 9:00 PM (All Days)",
      services: ["Test Drive", "Instant Finance", "Accessories"],
      phone: "022-4812-1122",
    },
  ],
};

const DEFAULT_STORES: Store[] = [
  {
    id: 10,
    name: "Autovinci Experience Center — City Center",
    address: "Main Road, City Center, Near Central Mall",
    timings: "10:00 AM - 8:00 PM (Mon-Sat), 11:00 AM - 6:00 PM (Sun)",
    services: ["Test Drive", "150-Point Inspection", "Instant Finance", "RC Transfer"],
    phone: "1800-123-4567",
  },
  {
    id: 11,
    name: "Autovinci Studio — East",
    address: "IT Park Road, Eastern Hub, Near Metro Station",
    timings: "10:00 AM - 8:00 PM (Mon-Sat), Closed Sunday",
    services: ["Test Drive", "150-Point Inspection", "Insurance"],
    phone: "1800-123-4568",
  },
  {
    id: 12,
    name: "Autovinci Hub — West",
    address: "Ring Road, Western Plaza, Near Highway Junction",
    timings: "11:00 AM - 9:00 PM (All Days)",
    services: ["Test Drive", "Instant Finance", "Accessories"],
    phone: "1800-123-4569",
  },
];

const SERVICE_ICONS: Record<string, { icon: string; color: string }> = {
  "Test Drive": { icon: "directions_car", color: "#1152d4" },
  "150-Point Inspection": { icon: "search", color: "#10b981" },
  "Instant Finance": { icon: "account_balance", color: "#f59e0b" },
  "RC Transfer": { icon: "swap_horiz", color: "#8b5cf6" },
  Insurance: { icon: "verified_user", color: "#ef4444" },
  Accessories: { icon: "build", color: "#ec4899" },
};

export default function GaadiStoreCityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = use(params);
  const cityName = formatCity(city);
  const stores = CITY_STORES[city] || DEFAULT_STORES;

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/gaadi-store"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Stores in {cityName}</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Store cards */}
        <div className="space-y-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="rounded-2xl p-4 border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <h3 className="text-sm font-bold text-white leading-snug mb-3">{store.name}</h3>

              {/* Address */}
              <div className="flex items-start gap-2 mb-2">
                <MaterialIcon name="location_on" className="text-[16px] text-slate-500 mt-0.5" />
                <span className="text-xs text-slate-400 leading-relaxed">{store.address}</span>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-2 mb-2">
                <MaterialIcon name="schedule" className="text-[16px] text-slate-500 mt-0.5" />
                <span className="text-xs text-slate-400 leading-relaxed">{store.timings}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 mb-3">
                <MaterialIcon name="phone" className="text-[16px] text-slate-500" />
                <span className="text-xs text-slate-400">{store.phone}</span>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-2">
                {store.services.map((svc) => {
                  const s = SERVICE_ICONS[svc] || { icon: "check_circle", color: "#94a3b8" };
                  return (
                    <span
                      key={svc}
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ background: `${s.color}15`, color: s.color }}
                    >
                      <MaterialIcon name={s.icon} className="text-[12px]" />
                      {svc}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Store Locations
          </p>
          <div
            className="rounded-2xl h-48 flex flex-col items-center justify-center border border-white/5"
            style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.08), rgba(99,102,241,0.05))" }}
          >
            <MaterialIcon name="map" className="text-[40px] text-white/15 mb-2" />
            <p className="text-xs text-slate-500">Map view coming soon</p>
          </div>
        </div>

        {/* Contact CTA */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div>
            <p className="text-sm font-semibold text-white">Need help finding a store?</p>
            <p className="text-xs text-slate-500 mt-0.5">Call us for directions and availability</p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="phone" className="text-[20px] text-white" />
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
