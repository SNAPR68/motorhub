"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import {
  CAR_MODELS,
  BRANDS,
  BODY_TYPES,
  BUDGET_SEGMENTS,
  formatEmi,
  formatPrice,
} from "@/lib/car-catalog";

/* ─── Autovinci Homepage — CarDekho-style consumer marketplace ─── */

const POPULAR_SEARCHES_NEW = ["Brezza", "Creta", "Nexon", "Swift", "Seltos", "XUV700"];
const POPULAR_SEARCHES_USED = ["Creta 2021", "Swift 2020", "Nexon Diesel", "City 2022", "i20"];

const POPULAR_BRANDS = BRANDS.filter((b) => b.popular);
const POPULAR_MODELS = CAR_MODELS.filter((m) => m.popular).slice(0, 8);

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"new" | "used">("new");
  const [newSearch, setNewSearch] = useState("");
  const [usedSearch, setUsedSearch] = useState("");

  const handleNewSearch = (q?: string) => {
    const term = q ?? newSearch.trim();
    router.push(term ? `/new-cars?q=${encodeURIComponent(term)}` : "/new-cars");
  };

  const handleUsedSearch = (q?: string) => {
    const term = q ?? usedSearch.trim();
    router.push(term ? `/used-cars?q=${encodeURIComponent(term)}` : "/used-cars");
  };

  return (
    <div
      className="min-h-dvh w-full max-w-lg mx-auto pb-28"
      style={{ background: "#080a0f", color: "#e2e8f0", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <MaterialIcon name="token" className="text-[24px]" style={{ color: "#1152d4" }} />
          <span className="text-lg font-bold text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
            Autovinci
          </span>
        </Link>

        <button
          className="flex items-center gap-1 rounded-full px-3 h-8 text-xs font-semibold border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          <MaterialIcon name="location_on" className="text-[13px]" style={{ color: "#1152d4" }} />
          Bengaluru
          <MaterialIcon name="keyboard_arrow_down" className="text-[13px]" />
        </button>

        <div className="flex items-center gap-1.5">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MaterialIcon name="search" className="text-[18px] text-slate-400" />
          </button>
          <Link href="/login/buyer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MaterialIcon name="person" className="text-[18px] text-slate-400" />
          </Link>
        </div>
      </header>

      {/* ─── HERO SEARCH ─── */}
      <section className="px-4 pt-6 pb-5" style={{ background: "linear-gradient(180deg, rgba(17,82,212,0.08) 0%, transparent 100%)" }}>
        <h1 className="text-2xl font-bold text-white leading-tight mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
          Find Your Perfect Car
        </h1>
        <p className="text-sm text-slate-400 mb-4">New, used &amp; upcoming cars — all in one place</p>

        {/* Tab toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 mb-3" style={{ background: "rgba(255,255,255,0.04)" }}>
          {(["new", "used"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 text-sm font-bold transition-all"
              style={{
                background: activeTab === tab ? "#1152d4" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              {tab === "new" ? "New Cars" : "Used Cars"}
            </button>
          ))}
        </div>

        {/* Search input */}
        {activeTab === "new" ? (
          <div>
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-blue-500/40 transition-colors"
              style={{ background: "rgba(15,18,27,0.98)" }}
            >
              <MaterialIcon name="search" className="text-[20px] text-slate-500 shrink-0" />
              <input
                type="text"
                value={newSearch}
                onChange={(e) => setNewSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewSearch()}
                placeholder="Search brand or model..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => handleNewSearch()}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0"
                style={{ background: "#1152d4" }}
              >
                <MaterialIcon name="arrow_forward" className="text-[17px]" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-slate-600 shrink-0 font-semibold">Popular:</span>
              {POPULAR_SEARCHES_NEW.map((q) => (
                <button key={q} onClick={() => handleNewSearch(q)} className="shrink-0 rounded-full px-3 py-1 text-[11px] text-slate-400 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div
              className="flex items-center gap-2.5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-blue-500/40 transition-colors"
              style={{ background: "rgba(15,18,27,0.98)" }}
            >
              <MaterialIcon name="search" className="text-[20px] text-slate-500 shrink-0" />
              <input
                type="text"
                value={usedSearch}
                onChange={(e) => setUsedSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUsedSearch()}
                placeholder="Search used cars by brand or model..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={() => handleUsedSearch()}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0"
                style={{ background: "#1152d4" }}
              >
                <MaterialIcon name="arrow_forward" className="text-[17px]" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] text-slate-600 shrink-0 font-semibold">Popular:</span>
              {POPULAR_SEARCHES_USED.map((q) => (
                <button key={q} onClick={() => handleUsedSearch(q)} className="shrink-0 rounded-full px-3 py-1 text-[11px] text-slate-400 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="mx-4 mb-5 rounded-2xl px-4 py-3 border border-blue-500/15" style={{ background: "rgba(17,82,212,0.05)" }}>
        <div className="grid grid-cols-4 gap-1 text-center">
          {[{ v: "50K+", l: "New Cars" }, { v: "12K+", l: "Used Cars" }, { v: "2.5K+", l: "Dealers" }, { v: "4.8★", l: "Rated" }].map((s) => (
            <div key={s.l}>
              <p className="text-sm font-black text-white">{s.v}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BROWSE BY BODY TYPE ─── */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Browse by Body Type</h2>
          <Link href="/new-cars" className="text-xs font-semibold" style={{ color: "#1152d4" }}>View all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {BODY_TYPES.map((bt) => (
            <Link
              key={bt.value}
              href={`/new-cars?body=${bt.value}`}
              className="flex flex-col items-center gap-2 rounded-2xl py-3 px-4 border border-white/6 shrink-0 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)", minWidth: "72px" }}
            >
              <span className="text-2xl">{bt.icon}</span>
              <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap">{bt.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── POPULAR NEW CARS ─── */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Popular New Cars</h2>
            <p className="text-[11px] text-slate-500">Top picks in India right now</p>
          </div>
          <Link href="/new-cars" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "#1152d4" }}>
            See all <MaterialIcon name="chevron_right" className="text-[14px]" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {POPULAR_MODELS.map((car) => (
            <Link
              key={car.slug}
              href={`/${car.brand}/${car.slug}`}
              className="shrink-0 w-44 snap-start rounded-2xl overflow-hidden border border-white/6 transition-all active:scale-[0.98] block"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <Image
                  src={car.image}
                  alt={car.fullName}
                  fill
                  sizes="176px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.6) 0%, transparent 60%)" }} />
                {car.tag && (
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "rgba(17,82,212,0.9)" }}
                  >
                    {car.tag}
                  </span>
                )}
                <span
                  className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-400"
                >
                  {car.rating}★
                </span>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide truncate">{car.brand.toUpperCase()}</p>
                <h3 className="text-[13px] font-bold text-white truncate mt-0.5">{car.name}</h3>
                <p className="text-xs font-black text-white mt-1">{car.startingPriceDisplay} <span className="text-[10px] font-normal text-slate-500">onwards</span></p>
                <p className="text-[10px] text-slate-500 mt-0.5">EMI {formatEmi(car.startingPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── BROWSE BY BUDGET ─── */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Browse by Budget</h2>
          <Link href="/new-cars" className="text-xs font-semibold" style={{ color: "#1152d4" }}>See all</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BUDGET_SEGMENTS.map((b) => (
            <Link
              key={b.label}
              href={`/new-cars?minPrice=${b.min}&maxPrice=${b.max}`}
              className="flex flex-col items-center gap-1.5 rounded-2xl py-3.5 px-2 border border-white/6 text-center transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <MaterialIcon name="currency_rupee" className="text-[18px]" style={{ color: "#1152d4" }} />
              <span className="text-[11px] font-bold text-slate-300 leading-tight">{b.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── POPULAR BRANDS ─── */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Popular Brands</h2>
          <Link href="/new-cars" className="text-xs font-semibold" style={{ color: "#1152d4" }}>All brands</Link>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {POPULAR_BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/new-cars?brand=${brand.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl py-3 px-2 border border-white/6 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-black"
                style={{ background: `${brand.color}22`, border: `1px solid ${brand.color}44`, color: brand.color }}
              >
                {brand.logo}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 text-center leading-tight">{brand.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── USED CARS BANNER ─── */}
      <section className="px-4 mb-4">
        <Link
          href="/used-cars"
          className="flex items-center gap-4 rounded-2xl p-4 border border-emerald-500/20 transition-all active:scale-[0.99] block"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.03) 100%)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
            <MaterialIcon name="directions_car" className="text-[26px] text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Certified Used Cars</p>
            <p className="text-xs text-slate-400 mt-0.5">Inspected, warranted &amp; ready to drive</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">12,000+ listings available</p>
          </div>
          <MaterialIcon name="arrow_forward_ios" className="text-[14px] text-emerald-400 shrink-0" />
        </Link>
      </section>

      {/* ─── AI CONCIERGE BANNER ─── */}
      <section className="px-4 mb-5">
        <Link
          href="/concierge"
          className="flex items-center gap-4 rounded-2xl p-4 border border-blue-500/20 transition-all active:scale-[0.99] block"
          style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.1) 0%, rgba(17,82,212,0.04) 100%)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(17,82,212,0.18)" }}>
            <MaterialIcon name="smart_toy" className="text-[26px]" style={{ color: "#1152d4" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">AI Car Concierge</p>
            <p className="text-xs text-slate-400 mt-0.5">Tell us your budget &amp; needs — AI finds your match</p>
          </div>
          <MaterialIcon name="arrow_forward_ios" className="text-[14px] text-blue-400 shrink-0" />
        </Link>
      </section>

      {/* ─── DEALER / SELL CTA ─── */}
      <section className="px-4 mb-5">
        <div className="rounded-2xl p-4 border border-white/7" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
              <MaterialIcon name="sell" className="text-[22px] text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sell Your Car</p>
              <p className="text-xs text-slate-500">Free listing · AI-enhanced · Instant valuation</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/login/dealer" className="flex items-center justify-center gap-2 h-10 rounded-xl text-white font-bold text-xs active:scale-95" style={{ background: "#1152d4" }}>
              <MaterialIcon name="storefront" className="text-[16px]" />
              Dealer Portal
            </Link>
            <Link href="/used-cars/sell" className="flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-xs active:scale-95 border border-white/10 text-slate-300" style={{ background: "rgba(255,255,255,0.05)" }}>
              <MaterialIcon name="person" className="text-[16px]" />
              Sell as Owner
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-4 pb-4 text-center">
        <div className="flex justify-center gap-4 mb-2">
          {[{ label: "About", href: "/about" }, { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "For Dealers", href: "/dashboard" }].map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-slate-700 hover:text-slate-500 transition-colors">{l.label}</Link>
          ))}
        </div>
        <p className="text-[10px] text-slate-700">© 2026 Autovinci Technologies Pvt. Ltd.</p>
      </footer>

      <BuyerBottomNav />
    </div>
  );
}
