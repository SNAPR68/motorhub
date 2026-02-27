"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BLUR_DATA_URL, CRETA, SWIFT, XUV700, FORTUNER, SEDAN, KIA, BREZZA, NEXON_EV,
} from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { VEHICLE_CATEGORIES } from "@/lib/constants";

/* ─── Autovinci Home — CarDekho-style buyer portal ─── */

const POPULAR_BRANDS = [
  { name: "Maruti", logo: "M", bg: "#1152d4" },
  { name: "Hyundai", logo: "H", bg: "#137fec" },
  { name: "Tata", logo: "T", bg: "#0f4fc4" },
  { name: "Mahindra", logo: "M", bg: "#1565c0" },
  { name: "Honda", logo: "H", bg: "#1152d4" },
  { name: "Toyota", logo: "T", bg: "#137fec" },
  { name: "Kia", logo: "K", bg: "#0f4fc4" },
  { name: "MG", logo: "MG", bg: "#1152d4" },
];

const BUDGETS = [
  { label: "Under ₹3L", range: "0-300000", icon: "💰" },
  { label: "₹3L – 5L", range: "300000-500000", icon: "🏷️" },
  { label: "₹5L – 8L", range: "500000-800000", icon: "🚘" },
  { label: "₹8L – 12L", range: "800000-1200000", icon: "🚗" },
  { label: "₹12L – 20L", range: "1200000-2000000", icon: "🚙" },
  { label: "₹20L+", range: "2000000-99999999", icon: "⭐" },
];

const HERO_SLIDES = [
  { img: CRETA, label: "Top Seller", name: "Hyundai Creta", tag: "2,400+ listings" },
  { img: XUV700, label: "Family SUV", name: "Mahindra XUV700", tag: "980+ listings" },
  { img: SWIFT, label: "Best Value", name: "Maruti Swift", tag: "5,100+ listings" },
  { img: FORTUNER, label: "Premium", name: "Toyota Fortuner", tag: "310+ listings" },
];

const POPULAR_SEARCHES = ["Creta", "Swift", "Nexon EV", "XUV700", "Brezza", "City", "Seltos"];

/** Rough EMI estimate */
function calcEmi(price: number): string {
  const principal = price * 0.8;
  const r = 0.09 / 12;
  const n = 84;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  if (emi < 1000) return "";
  return `₹${Math.round(emi / 1000)}k/mo`;
}

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const { data } = useApi(() => fetchVehicles({ limit: 8, status: "AVAILABLE" }), []);
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const handleSearch = (q?: string) => {
    const term = q ?? search.trim();
    router.push(term ? `/showroom?q=${encodeURIComponent(term)}` : "/showroom");
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setWishlist((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div
      className="min-h-dvh w-full max-w-lg mx-auto pb-28"
      style={{ background: "#080a0f", fontFamily: "'Noto Sans', sans-serif", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.95)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <MaterialIcon name="token" className="text-[24px]" style={{ color: "#1152d4" }} />
          <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
            Autovinci
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Location picker */}
          <button
            className="flex items-center gap-1 rounded-full px-2.5 h-8 text-xs font-semibold text-slate-400 border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <MaterialIcon name="location_on" className="text-[14px] text-blue-400" />
            Bengaluru
            <MaterialIcon name="keyboard_arrow_down" className="text-[14px]" />
          </button>
          <Link
            href="/login/buyer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <MaterialIcon name="person" className="text-[18px] text-slate-400" />
          </Link>
        </div>
      </header>

      {/* ─── HERO CAROUSEL ─── */}
      <section className="relative h-56 overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          >
            <Image src={slide.img} alt={slide.name} fill className="object-cover" priority={i === 0} placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080a0f 0%, rgba(8,10,15,0.5) 55%, rgba(8,10,15,0.1) 100%)" }} />
          </div>
        ))}

        {/* Slide info */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="flex items-end justify-between">
            <div>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
                style={{ background: "rgba(17,82,212,0.8)", color: "#fff", backdropFilter: "blur(4px)" }}
              >
                {HERO_SLIDES[heroIdx].label}
              </span>
              <p className="text-lg font-bold text-white leading-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
                {HERO_SLIDES[heroIdx].name}
              </p>
              <p className="text-[11px] text-slate-400">{HERO_SLIDES[heroIdx].tag}</p>
            </div>
            {/* Dot nav */}
            <div className="flex gap-1.5 pb-1">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === heroIdx ? "18px" : "5px",
                    height: "5px",
                    background: i === heroIdx ? "#1152d4" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SEARCH BAR ─── */}
      <section className="px-4 -mt-3 relative z-10 pb-4">
        <div
          className="flex items-center gap-2.5 rounded-2xl px-4 py-3.5 border border-white/10 shadow-xl shadow-black/50 focus-within:border-blue-500/40 transition-colors"
          style={{ background: "rgba(15,18,27,0.98)", backdropFilter: "blur(20px)" }}
        >
          <MaterialIcon name="search" className="text-[20px] text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search car, brand or model..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            onClick={() => handleSearch()}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white shrink-0 active:scale-95 transition-transform"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="arrow_forward" className="text-[17px]" />
          </button>
        </div>

        {/* Popular searches */}
        <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-600 shrink-0 font-semibold">Popular:</span>
          {POPULAR_SEARCHES.map((q) => (
            <button
              key={q}
              onClick={() => handleSearch(q)}
              className="shrink-0 rounded-full px-3 py-1 text-[11px] text-slate-400 hover:text-white transition-colors border border-white/8"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="mx-4 mb-5 rounded-2xl px-4 py-3 border border-blue-500/15" style={{ background: "rgba(17,82,212,0.05)" }}>
        <div className="grid grid-cols-4 gap-1 text-center">
          {[
            { v: "50K+", l: "Cars" },
            { v: "2.5K+", l: "Dealers" },
            { v: "15+", l: "Cities" },
            { v: "4.8★", l: "Rated" },
          ].map((s) => (
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
          <h2 className="text-sm font-bold text-white">Browse by Type</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#1152d4" }}>View all</Link>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {VEHICLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/showroom?category=${cat.value}`}
              className="flex flex-col items-center gap-2 rounded-2xl py-3 px-2 border border-white/6 transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold text-slate-300">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CARS ─── */}
      <section className="mb-5">
        <div className="flex items-center justify-between px-4 mb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Featured Cars</h2>
            <p className="text-[11px] text-slate-500">AI-verified, dealer-listed</p>
          </div>
          <Link href="/showroom" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "#1152d4" }}>
            See all <MaterialIcon name="chevron_right" className="text-[14px]" />
          </Link>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory">
          {vehicles.length > 0
            ? vehicles.map((v) => {
                const emi = calcEmi(v.priceNumeric);
                return (
                  <Link
                    key={v.id}
                    href={`/vehicle/${v.id}`}
                    className="relative w-48 shrink-0 snap-start rounded-2xl overflow-hidden border border-white/6 transition-all active:scale-[0.98] block"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3]">
                      <Image src={v.image || CRETA} alt={v.name} fill sizes="192px" className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.8) 0%, transparent 60%)" }} />
                      {/* Wishlist */}
                      <button
                        onClick={(e) => toggleWishlist(v.id, e)}
                        className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full"
                        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
                      >
                        <MaterialIcon
                          name="favorite"
                          fill={wishlist.has(v.id)}
                          className="text-[16px]"
                          style={{ color: wishlist.has(v.id) ? "#ef4444" : "rgba(255,255,255,0.6)" }}
                        />
                      </button>
                      {v.aiTag && (
                        <div
                          className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                          style={{ background: "rgba(17,82,212,0.88)" }}
                        >
                          <MaterialIcon name="verified" className="text-[9px]" />
                          AI
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <p className="text-[10px] text-slate-500 font-semibold truncate">{v.year} &bull; {v.owner} &bull; {v.fuel}</p>
                      <h3 className="text-[13px] font-bold text-white truncate mt-0.5">{v.name}</h3>
                      <div className="flex items-baseline gap-1.5 mt-1.5">
                        <span className="text-sm font-black text-white">{v.price}</span>
                      </div>
                      {emi && <p className="text-[10px] text-slate-500 mt-0.5">EMI <span className="text-slate-400">{emi}</span></p>}
                      <p className="flex items-center gap-0.5 text-[10px] text-slate-500 mt-1.5 truncate">
                        <MaterialIcon name="location_on" className="text-[10px]" />
                        {v.location}
                      </p>
                    </div>
                  </Link>
                );
              })
            : [1, 2, 3].map((i) => (
                <div key={i} className="w-48 shrink-0 rounded-2xl overflow-hidden border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="aspect-[4/3] animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-3/4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.07)" }} />
                    <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ─── BROWSE BY BUDGET ─── */}
      <section className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Browse by Budget</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#1152d4" }}>See all</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BUDGETS.map((b) => (
            <Link
              key={b.range}
              href={`/showroom?price=${b.range}`}
              className="flex flex-col items-center gap-2 rounded-2xl py-3.5 px-2 border border-white/6 text-center transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-xl">{b.icon}</span>
              <span className="text-[11px] font-bold text-slate-300 leading-tight">{b.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── POPULAR BRANDS ─── */}
      <section className="px-4 mb-5">
        <h2 className="text-sm font-bold text-white mb-3">Popular Brands</h2>
        <div className="grid grid-cols-4 gap-2.5">
          {POPULAR_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/showroom?q=${brand.name}`}
              className="flex flex-col items-center gap-2 rounded-2xl py-3 px-2 border border-white/6 transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-black text-white"
                style={{ background: `${brand.bg}22`, border: `1px solid ${brand.bg}44`, color: brand.bg }}
              >
                {brand.logo}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AI CONCIERGE BANNER ─── */}
      <section className="px-4 mb-5">
        <Link
          href="/concierge"
          className="flex items-center gap-4 rounded-2xl p-4 border border-blue-500/20 transition-all active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.12) 0%, rgba(19,127,236,0.05) 100%)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(17,82,212,0.2)" }}>
            <MaterialIcon name="smart_toy" className="text-[26px]" style={{ color: "#1152d4" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">AI Car Concierge</p>
            <p className="text-xs text-slate-400 mt-0.5">Tell us your budget &amp; needs — we find the perfect match</p>
          </div>
          <MaterialIcon name="arrow_forward_ios" className="text-[14px] text-blue-400 shrink-0" />
        </Link>
      </section>

      {/* ─── SELL / DEALER CTA ─── */}
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
            <Link
              href="/login/dealer"
              className="flex items-center justify-center gap-2 h-10 rounded-xl text-white font-bold text-xs transition-all active:scale-95"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="storefront" className="text-[16px]" />
              Dealer Portal
            </Link>
            <Link
              href="/login/buyer"
              className="flex items-center justify-center gap-2 h-10 rounded-xl font-bold text-xs transition-all active:scale-95 border border-white/10 text-slate-300"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="person" className="text-[16px]" />
              Sell as Owner
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-4 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MaterialIcon name="token" className="text-[16px]" style={{ color: "rgba(17,82,212,0.5)" }} />
          <span className="text-xs font-bold text-slate-600">Autovinci</span>
        </div>
        <div className="flex justify-center gap-4 mb-2">
          {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "For Dealers", href: "/dashboard" }].map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-slate-700 hover:text-slate-500 transition-colors">{l.label}</Link>
          ))}
        </div>
        <p className="text-[10px] text-slate-700">© 2026 Autovinci Technologies Pvt. Ltd. · Bengaluru</p>
      </footer>

      <BuyerBottomNav />
    </div>
  );
}
