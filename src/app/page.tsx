"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { VEHICLE_CATEGORIES } from "@/lib/constants";

const BRANDS = [
  { name: "Maruti", initial: "M", color: "#1565C0" },
  { name: "Hyundai", initial: "H", color: "#0D47A1" },
  { name: "Tata", initial: "T", color: "#283593" },
  { name: "Mahindra", initial: "M", color: "#B71C1C" },
  { name: "Honda", initial: "H", color: "#C62828" },
  { name: "Toyota", initial: "T", color: "#E65100" },
  { name: "Kia", initial: "K", color: "#1B5E20" },
  { name: "MG", initial: "MG", color: "#4A148C" },
  { name: "Renault", initial: "R", color: "#880E4F" },
  { name: "Skoda", initial: "S", color: "#33691E" },
];

const BUDGETS = [
  { label: "Under ₹3 Lakh", range: "0-300000", bg: "#FFF3E0", accent: "#E65100" },
  { label: "₹3 – 5 Lakh", range: "300000-500000", bg: "#E8F5E9", accent: "#2E7D32" },
  { label: "₹5 – 10 Lakh", range: "500000-1000000", bg: "#E3F2FD", accent: "#1565C0" },
  { label: "₹10 – 20 Lakh", range: "1000000-2000000", bg: "#FCE4EC", accent: "#C62828" },
  { label: "₹20 – 50 Lakh", range: "2000000-5000000", bg: "#F3E5F5", accent: "#6A1B9A" },
  { label: "Above ₹50 Lakh", range: "5000000-99999999", bg: "#E0F7FA", accent: "#00695C" },
];

const TRUST_STATS = [
  { value: "50,000+", label: "Verified Cars" },
  { value: "2,500+", label: "Dealers" },
  { value: "15+", label: "Cities" },
  { value: "4.8★", label: "Rating" },
];

const CAR_TABS = ["Used Cars", "New Cars", "Electric"] as const;

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof CAR_TABS)[number]>("Used Cars");

  const { data } = useApi(() => fetchVehicles({ limit: 8, status: "AVAILABLE" }), []);
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/showroom?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/showroom");
    }
  };

  return (
    <div className="min-h-dvh w-full max-w-lg mx-auto pb-32" style={{ background: "#F5F5F5", fontFamily: "'Noto Sans', sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "#C62828" }} className="sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <MaterialIcon name="token" className="text-[26px] text-white" />
            <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
              Autovinci
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/concierge" className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5">
              <MaterialIcon name="smart_toy" className="text-[16px] text-white" />
              <span className="text-xs font-bold text-white">AI Help</span>
            </Link>
            <Link href="/login/buyer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <MaterialIcon name="person" className="text-[20px] text-white" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4 pt-1">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 shadow-sm">
            <MaterialIcon name="search" className="text-[22px] text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search car name, brand, model..."
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
            {search ? (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <MaterialIcon name="close" className="text-[18px]" />
              </button>
            ) : null}
            <button
              onClick={handleSearch}
              style={{ background: "#C62828" }}
              className="flex items-center justify-center h-8 w-8 rounded-md text-white shrink-0 active:scale-95 transition-transform"
            >
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── TRUST STRIP ── */}
      <div style={{ background: "#B71C1C" }} className="px-4 py-2.5">
        <div className="grid grid-cols-4 gap-1">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-bold text-white leading-tight">{s.value}</p>
              <p className="text-[9px] text-red-200 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK POPULAR TAGS ── */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {["Creta", "Swift", "Nexon EV", "XUV700", "Brezza", "City", "Seltos"].map((car) => (
            <Link
              key={car}
              href={`/showroom?q=${car}`}
              className="shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-red-300 hover:text-red-700 transition-colors shadow-sm"
            >
              {car}
            </Link>
          ))}
        </div>
      </div>

      {/* ── BROWSE BRANDS ── */}
      <section className="px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Browse by Brand</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#C62828" }}>
            View all
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/showroom?q=${brand.name}`}
              className="shrink-0 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center shadow-md"
                style={{ background: brand.color }}
              >
                <span className="text-white font-black text-lg leading-none">{brand.initial}</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-700">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-2 bg-gray-200" />

      {/* ── CAR TYPE TABS + LISTINGS ── */}
      <section className="bg-white pt-4 pb-5">
        <div className="flex items-center gap-0 px-4 mb-4 border-b border-gray-100">
          {CAR_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-3 mr-6 text-sm font-bold transition-colors"
              style={{ color: activeTab === tab ? "#C62828" : "#6B7280" }}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#C62828" }} />
              )}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 mb-4">
          {VEHICLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/showroom?category=${cat.value}`}
              className="shrink-0 flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
          <Link
            href="/showroom?q=luxury"
            className="shrink-0 flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <span>👑</span><span>Luxury</span>
          </Link>
        </div>

        {/* Cars horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {vehicles.length > 0
            ? vehicles.map((v) => (
                <div key={v.id} className="w-[200px] shrink-0 snap-start">
                  <CarCard vehicle={v} />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[200px] shrink-0 snap-start">
                  <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3.5 w-3/4 rounded bg-gray-200 animate-pulse" />
                      <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
                      <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className="px-4 mt-4">
          <Link
            href="/showroom"
            className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border-2 text-sm font-bold transition-colors"
            style={{ borderColor: "#C62828", color: "#C62828" }}
          >
            View All Cars
            <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-2 bg-gray-200" />

      {/* ── SHOP BY BUDGET ── */}
      <section className="bg-white pt-4 pb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-base font-bold text-gray-900">Shop by Budget</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#C62828" }}>
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {BUDGETS.map((b) => (
            <Link
              key={b.range}
              href={`/showroom?price=${b.range}`}
              className="rounded-xl p-4 flex items-center gap-3 active:scale-95 transition-transform shadow-sm border border-gray-100"
              style={{ background: b.bg }}
            >
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: b.accent }}
              >
                <MaterialIcon name="currency_rupee" className="text-[18px] text-white" />
              </div>
              <span className="text-xs font-bold text-gray-800 leading-snug">{b.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-2 bg-gray-200" />

      {/* ── AI CONCIERGE BANNER ── */}
      <section className="px-4 py-4 bg-white">
        <Link
          href="/concierge"
          className="flex items-center gap-4 rounded-xl p-4 border border-blue-100 shadow-sm active:scale-[0.99] transition-transform"
          style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)" }}
        >
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#1565C0" }}>
            <MaterialIcon name="smart_toy" className="text-[26px] text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">AI Car Concierge</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Tell us your budget & city — AI finds your best match
            </p>
          </div>
          <MaterialIcon name="chevron_right" className="text-[22px] text-blue-600 shrink-0" />
        </Link>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-2 bg-gray-200" />

      {/* ── SELL / DEALER CTA ── */}
      <section className="bg-white px-4 py-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">Are You a Dealer?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/login/dealer"
            className="flex flex-col items-center gap-2 rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform"
            style={{ background: "#FFF3E0" }}
          >
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "#E65100" }}>
              <MaterialIcon name="storefront" className="text-[22px] text-white" />
            </div>
            <span className="text-xs font-bold text-gray-800 text-center">Dealer Portal</span>
            <span className="text-[10px] text-gray-500 text-center">Manage inventory & leads</span>
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-col items-center gap-2 rounded-xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-transform"
            style={{ background: "#E8F5E9" }}
          >
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "#2E7D32" }}>
              <MaterialIcon name="sell" className="text-[22px] text-white" />
            </div>
            <span className="text-xs font-bold text-gray-800 text-center">Sell Your Car</span>
            <span className="text-[10px] text-gray-500 text-center">Free listing, AI photos</span>
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="h-2 bg-gray-200" />

      {/* ── FOOTER ── */}
      <footer className="bg-white px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MaterialIcon name="token" className="text-[18px]" style={{ color: "#C62828" }} />
          <span className="text-sm font-bold text-gray-700">Autovinci</span>
        </div>
        <div className="flex justify-center gap-4 mb-3">
          {[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Dealer Login", href: "/login/dealer" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-gray-500 hover:text-gray-800 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <p className="text-[10px] text-gray-400">
          © 2026 Autovinci Technologies Pvt. Ltd. · Bengaluru, India
        </p>
      </footer>

      <BuyerBottomNav />
    </div>
  );
}

/* ── Car Card ── */
function CarCard({ vehicle }: { vehicle: ReturnType<typeof adaptVehicle> }) {
  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="block rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm transition-all active:scale-[0.98] hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="200px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        {vehicle.aiTag && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ background: "#C62828" }}>
            <MaterialIcon name="verified" className="text-[10px]" />
            AI Verified
          </div>
        )}
        {vehicle.badge && (
          <div className="absolute top-2 right-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-white">
            {vehicle.badge}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 truncate">{vehicle.name}</h3>
        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
          {vehicle.year} · {vehicle.km} km · {vehicle.fuel}
        </p>
        <p className="text-sm font-black mt-1.5" style={{ color: "#C62828" }}>
          {vehicle.price}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">
          <MaterialIcon name="location_on" className="text-[11px] align-text-bottom" /> {vehicle.location}
        </p>
      </div>
    </Link>
  );
}
