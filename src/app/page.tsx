"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useAuthStore } from "@/lib/stores";
import {
  BODY_TYPES,
  BUDGET_SEGMENTS,
  CITIES,
  formatEmi,
} from "@/lib/car-catalog";
import { fetchCarBrands, fetchCarModels, type ApiBrand, type ApiCarModel } from "@/lib/api";

/* ─── CaroBest Homepage — Cinematic Automotive ─── */

const POPULAR_SEARCHES = ["Brezza", "Creta", "Nexon", "Swift", "Seltos", "XUV700"];

interface UsedCar {
  id: string;
  name: string;
  year: number;
  price: number;
  priceDisplay?: string;
  km: string;
  fuel: string;
  location: string;
  images: string[];
}

const HERO_SLIDES = [
  { src: "/hero-1.jpg", alt: "Premium SUV", label: "Tata Harrier" },
  { src: "/hero-2.webp", alt: "Hyundai Creta", label: "Hyundai Creta" },
  { src: "/hero-3.webp", alt: "Mahindra XUV700", label: "Mahindra XUV700" },
  { src: "/hero-4.jpg", alt: "Car on open road", label: "Tata Nexon" },
];

type BrowseTab = "body" | "budget" | "brand";

/* ─── Inline keyframes for the page ─── */
const PAGE_STYLES = `
@keyframes cb-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes cb-glow-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
@keyframes cb-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes cb-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cb-hero-reveal {
  from { opacity: 0; transform: scale(1.08); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes cb-slide-down {
  from { opacity: 0; transform: translateY(-8px); max-height: 0; }
  to { opacity: 1; transform: translateY(0); max-height: 500px; }
}
@keyframes cb-border-glow {
  0%, 100% { border-color: rgba(17,82,212,0.15); }
  50% { border-color: rgba(17,82,212,0.4); }
}
.cb-stagger-1 { animation: cb-fade-up 0.6s ease-out 0.1s both; }
.cb-stagger-2 { animation: cb-fade-up 0.6s ease-out 0.2s both; }
.cb-stagger-3 { animation: cb-fade-up 0.6s ease-out 0.3s both; }
.cb-stagger-4 { animation: cb-fade-up 0.6s ease-out 0.4s both; }
.cb-card-enter { animation: cb-fade-up 0.5s ease-out both; }
`;

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [usedCars, setUsedCars] = useState<UsedCar[]>([]);
  const [usedCarsLoading, setUsedCarsLoading] = useState(true);
  const [popularBrands, setPopularBrands] = useState<ApiBrand[]>([]);
  const [popularModels, setPopularModels] = useState<ApiCarModel[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [browseTab, setBrowseTab] = useState<BrowseTab>("body");
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  /* Auto-rotate hero */
  const nextSlide = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  useEffect(() => {
    const saved = localStorage.getItem("carobest_city");
    if (saved) setSelectedCity(saved);
  }, []);

  useEffect(() => {
    async function loadUsedCars() {
      try {
        const res = await fetch("/api/vehicles?status=AVAILABLE&limit=6&sort=newest");
        if (res.ok) {
          const data = await res.json();
          setUsedCars(data.vehicles || []);
        }
      } catch { /* silent */ }
      setUsedCarsLoading(false);
    }
    loadUsedCars();
  }, []);

  useEffect(() => {
    fetchCarBrands().then((d) => setPopularBrands(d.brands.filter((b) => b.popular))).catch(() => {});
    fetchCarModels({ popular: true, limit: 8 }).then((d) => setPopularModels(d.models)).catch(() => {});
  }, []);

  /* Close browse dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (browseRef.current && !browseRef.current.contains(e.target as Node)) {
        setBrowseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem("carobest_city", city);
    setShowCityPicker(false);
    setCitySearch("");
  };

  const filteredCities = citySearch
    ? CITIES.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
    : CITIES;

  const handleSearch = (q?: string) => {
    const term = q ?? search.trim();
    router.push(term ? `/new-cars?q=${encodeURIComponent(term)}` : "/new-cars");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <BuyerAppShell>
    <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />
    <div className="min-h-dvh w-full" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── MOBILE HEADER ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/5 md:hidden"
        style={{ background: "rgba(8,10,15,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1152d4, #3b82f6)" }}>
            <MaterialIcon name="diamond" className="text-[14px] text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
            CaroBest
          </span>
        </Link>
        <button
          onClick={() => setShowCityPicker(true)}
          className="flex items-center gap-1 rounded-full px-3 h-8 text-xs font-semibold active:scale-95 transition-transform"
          style={{ background: "rgba(17,82,212,0.1)", color: "#60a5fa", border: "1px solid rgba(17,82,212,0.2)" }}
        >
          <MaterialIcon name="location_on" className="text-[13px]" />
          {selectedCity}
          <MaterialIcon name="expand_more" className="text-[13px]" />
        </button>
        <div className="flex items-center gap-1.5">
          {isAuthenticated && user ? (
            <Link href="/my-account" className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg, #1152d4, #4f8ef7)" }}>
              {userInitials}
            </Link>
          ) : (
            <Link href="/login/buyer" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <MaterialIcon name="person" className="text-[18px] text-slate-400" />
            </Link>
          )}
        </div>
      </header>

      {/* ─── HERO — Cinematic Split Layout ─── */}
      <section
        className="relative w-full overflow-hidden md:-mx-8 lg:-mx-12 md:-mt-6 md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)]"
        style={{ minHeight: "480px" }}
      >
        {/* Ambient background mesh */}
        <div className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(17,82,212,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(17,82,212,0.06) 0%, transparent 60%), #080a0f",
        }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Desktop: Split layout */}
        <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[480px]">
          {/* Left: Text + Search */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8 md:px-12 lg:px-16 md:pt-12 md:pb-12">
            <div className="max-w-xl cb-stagger-1">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
                style={{
                  background: "linear-gradient(135deg, rgba(17,82,212,0.15) 0%, rgba(59,130,246,0.08) 100%)",
                  border: "1px solid rgba(17,82,212,0.25)",
                }}
              >
                <MaterialIcon name="auto_awesome" className="text-[11px]" style={{ color: "#60a5fa" }} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: "#60a5fa" }}>AI-Powered Marketplace</span>
              </div>

              <h1 className="text-3xl md:text-[3.2rem] lg:text-[3.6rem] font-bold text-white leading-[1.05] mb-4 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Find Your
                <br />
                <span style={{ color: "#60a5fa" }}>Perfect</span> Car
              </h1>

              <p className="text-sm md:text-[15px] leading-relaxed mb-7 max-w-md" style={{ color: "#8b9dc3", fontFamily: "Manrope, sans-serif" }}>
                AI-inspected, dealer-certified vehicles across 50+ Indian cities. Every car passes our 200-point quality check.
              </p>

              {/* Search bar */}
              <div className="w-full max-w-lg cb-stagger-2">
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 md:py-3.5 transition-all duration-300"
                  style={{
                    background: searchFocused ? "rgba(17,82,212,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${searchFocused ? "rgba(17,82,212,0.4)" : "rgba(255,255,255,0.1)"}`,
                    backdropFilter: "blur(20px)",
                    boxShadow: searchFocused ? "0 0 30px rgba(17,82,212,0.1), inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
                  }}
                >
                  <MaterialIcon name="search" className="text-[22px] shrink-0" style={{ color: searchFocused ? "#60a5fa" : "#475569" }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search by brand, model, or budget..."
                    className="flex-1 bg-transparent text-sm md:text-[15px] text-white outline-none placeholder:text-slate-500"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0 transition-all duration-200 active:scale-90 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, #1152d4, #2563eb)", boxShadow: "0 4px 15px rgba(17,82,212,0.3)" }}
                  >
                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                  </button>
                </div>

                {/* Popular searches */}
                <div className="flex items-center gap-2 mt-3.5 overflow-x-auto no-scrollbar cb-stagger-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] shrink-0 font-bold" style={{ color: "#475569", fontFamily: "Manrope, sans-serif" }}>
                    Trending
                  </span>
                  {POPULAR_SEARCHES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSearch(q)}
                      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 hover:text-white active:scale-95"
                      style={{
                        color: "#64748b",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(17,82,212,0.1)"; e.currentTarget.style.borderColor = "rgba(17,82,212,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Car Image (desktop) */}
          <div className="hidden md:flex flex-1 items-end justify-center relative overflow-hidden">
            {/* Luminous halo behind car */}
            <div className="absolute bottom-0 right-0 w-full h-full" style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 70%, rgba(17,82,212,0.15) 0%, rgba(17,82,212,0.05) 40%, transparent 70%)",
              animation: "cb-glow-pulse 4s ease-in-out infinite",
            }} />

            {/* Car images */}
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.alt}
                className="absolute inset-0 flex items-end justify-center transition-all duration-1000"
                style={{
                  opacity: heroIndex === i ? 1 : 0,
                  transform: heroIndex === i ? "scale(1) translateX(0)" : "scale(0.95) translateX(30px)",
                  zIndex: heroIndex === i ? 1 : 0,
                }}
              >
                <div className="relative w-[90%] h-[85%]">
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="50vw"
                    className="object-contain object-bottom drop-shadow-2xl"
                    priority={i === 0}
                    unoptimized
                  />
                </div>
              </div>
            ))}

            {/* Car label + dots */}
            <div className="absolute bottom-6 right-8 z-20 flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Manrope, sans-serif" }}>
                {HERO_SLIDES[heroIndex].label}
              </span>
              <div className="flex items-center gap-1.5">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: heroIndex === i ? "20px" : "6px",
                      height: "6px",
                      background: heroIndex === i ? "#1152d4" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Car image underneath text */}
          <div className="relative h-48 w-full overflow-hidden md:hidden -mt-4">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={`mob-${slide.alt}`}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: heroIndex === i ? 1 : 0, zIndex: heroIndex === i ? 1 : 0 }}
              >
                <Image src={slide.src} alt={slide.alt} fill sizes="100vw" className="object-cover object-center" priority={i === 0} unoptimized />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #080a0f 0%, rgba(8,10,15,0.3) 60%, rgba(8,10,15,0.6) 100%)" }} />
              </div>
            ))}
            {/* Mobile dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: heroIndex === i ? "18px" : "5px", height: "5px", background: heroIndex === i ? "#1152d4" : "rgba(255,255,255,0.25)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CITY PICKER MODAL ─── */}
      {showCityPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setShowCityPicker(false)}>
          <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: "blur(8px)" }} />
          <div
            className="relative w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[70vh] flex flex-col"
            style={{ background: "linear-gradient(180deg, #111827 0%, #0e1117 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Select City</h3>
              <button onClick={() => setShowCityPicker(false)} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                <MaterialIcon name="close" className="text-[18px] text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <MaterialIcon name="search" className="text-[18px] text-slate-500" />
              <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" autoFocus />
            </div>
            {!citySearch && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>Popular Cities</p>
                <div className="flex flex-wrap gap-2">
                  {["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"].map((c) => (
                    <button key={c} onClick={() => handleCitySelect(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${selectedCity === c ? "text-white" : "text-slate-400"}`} style={{ background: selectedCity === c ? "linear-gradient(135deg, #1152d4, #2563eb)" : "rgba(255,255,255,0.04)", border: `1px solid ${selectedCity === c ? "transparent" : "rgba(255,255,255,0.08)"}` }}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{citySearch ? "Results" : "All Cities"}</p>
            <div className="flex-1 overflow-y-auto space-y-0.5">
              {filteredCities.map((c) => (
                <button key={c} onClick={() => handleCitySelect(c)} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.99]" style={{ background: selectedCity === c ? "rgba(17,82,212,0.1)" : "transparent" }}>
                  <MaterialIcon name="location_on" className="text-[16px]" style={{ color: selectedCity === c ? "#1152d4" : "#475569" }} />
                  <span className="text-sm font-medium" style={{ color: selectedCity === c ? "#60a5fa" : "#cbd5e1" }}>{c}</span>
                  {selectedCity === c && <MaterialIcon name="check" className="text-[16px] ml-auto" style={{ color: "#1152d4" }} />}
                </button>
              ))}
              {filteredCities.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No cities found</p>}
            </div>
          </div>
        </div>
      )}

      {/* ─── TRUST STRIP — Elegant horizontal stats ─── */}
      <section className="px-4 md:px-0 pt-8 md:pt-10">
        <div
          className="flex items-center justify-between md:justify-center md:gap-0 rounded-2xl py-4 px-5 md:px-0"
          style={{
            background: "linear-gradient(135deg, rgba(17,82,212,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(17,82,212,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { value: "50K+", label: "New Cars", icon: "directions_car" },
            { value: "12K+", label: "Certified Used", icon: "verified" },
            { value: "2.5K+", label: "Trusted Dealers", icon: "storefront" },
            { value: "4.8", label: "User Rating", icon: "star", star: true },
          ].map((s, idx) => (
            <div key={s.label} className="flex items-center gap-0 md:gap-3 flex-col md:flex-row text-center md:text-left">
              {idx > 0 && <div className="hidden md:block w-px h-8 mx-6" style={{ background: "rgba(255,255,255,0.06)" }} />}
              <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(17,82,212,0.1)" }}>
                <MaterialIcon name={s.icon} className="text-[18px]" style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <p className="text-lg md:text-xl font-extrabold text-white leading-none" style={{ fontFamily: "Manrope, sans-serif" }}>
                  {s.value}{s.star && <span className="text-amber-400 ml-0.5 text-sm">&#9733;</span>}
                </p>
                <p className="text-[10px] md:text-[11px] font-medium mt-0.5" style={{ color: "#64748b", fontFamily: "Manrope, sans-serif" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BROWSE FILTERS — Frosted glass dropdown ─── */}
      <section className="px-4 md:px-0 pt-8 md:pt-10 pb-2">
        <div ref={browseRef} className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-3">
            <h2 className="text-base md:text-xl font-bold text-white mr-1 tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              Browse by
            </h2>
            {([
              { key: "body" as BrowseTab, label: "Body Type", icon: "directions_car" },
              { key: "budget" as BrowseTab, label: "Budget", icon: "account_balance_wallet" },
              { key: "brand" as BrowseTab, label: "Brand", icon: "star" },
            ]).map((tab) => {
              const isActive = browseTab === tab.key && browseOpen;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setBrowseTab(tab.key); setBrowseOpen(browseTab === tab.key ? !browseOpen : true); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: isActive ? "rgba(17,82,212,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(17,82,212,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: isActive ? "#60a5fa" : "#94a3b8",
                    boxShadow: isActive ? "0 0 20px rgba(17,82,212,0.08)" : "none",
                  }}
                >
                  <MaterialIcon name={tab.icon} className="text-[15px]" />
                  {tab.label}
                  <MaterialIcon
                    name={isActive ? "expand_less" : "expand_more"}
                    className="text-[16px] -mr-1"
                  />
                </button>
              );
            })}
          </div>

          {/* Dropdown panel with frosted glass */}
          {browseOpen && (
            <div
              className="rounded-2xl p-4 md:p-5 mb-4"
              style={{
                background: "rgba(15,20,35,0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                animation: "cb-slide-down 0.25s ease-out both",
              }}
            >
              {browseTab === "body" && (
                <div className="flex flex-wrap gap-2.5 md:gap-3">
                  {BODY_TYPES.map((bt) => (
                    <Link
                      key={bt.value}
                      href={`/new-cars?body=${bt.value}`}
                      className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(17,82,212,0.1)"; e.currentTarget.style.borderColor = "rgba(17,82,212,0.3)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      <span className="text-lg">{bt.icon}</span>
                      {bt.label}
                    </Link>
                  ))}
                </div>
              )}
              {browseTab === "budget" && (
                <div className="flex flex-wrap gap-2.5 md:gap-3">
                  {BUDGET_SEGMENTS.map((b) => (
                    <Link
                      key={b.label}
                      href={`/new-cars?minPrice=${b.min}&maxPrice=${b.max}`}
                      className="group flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(17,82,212,0.1)"; e.currentTarget.style.borderColor = "rgba(17,82,212,0.3)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      <MaterialIcon name="currency_rupee" className="text-[15px]" style={{ color: "#60a5fa" }} />
                      {b.label}
                    </Link>
                  ))}
                </div>
              )}
              {browseTab === "brand" && (
                <div className="flex flex-wrap gap-2.5 md:gap-3">
                  {popularBrands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/new-cars?brand=${brand.slug}`}
                      className="group flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(17,82,212,0.1)"; e.currentTarget.style.borderColor = "rgba(17,82,212,0.3)"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      <div
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                        style={{ background: `${brand.color}18`, border: `1px solid ${brand.color}33`, color: brand.color }}
                      >
                        {brand.logo}
                      </div>
                      {brand.name.split(" ")[0]}
                    </Link>
                  ))}
                  <Link
                    href="/new-cars"
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-95"
                    style={{ color: "#60a5fa", background: "rgba(17,82,212,0.06)", border: "1px solid rgba(17,82,212,0.2)" }}
                  >
                    View all brands
                    <MaterialIcon name="arrow_forward" className="text-[15px]" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── POPULAR NEW CARS — Premium Card Grid ─── */}
      <section className="mb-12 md:mb-16 pt-4 md:pt-6">
        <div className="flex items-end justify-between px-4 md:px-0 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: "#1152d4", fontFamily: "Manrope, sans-serif" }}>New Arrivals</p>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
              Popular New Cars
            </h2>
          </div>
          <Link
            href="/new-cars"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 group"
            style={{ color: "#60a5fa" }}
          >
            View all
            <MaterialIcon name="arrow_forward" className="text-[16px] transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:snap-none md:px-0">
          {popularModels.map((car, idx) => (
            <Link
              key={car.slug}
              href={`/${car.brand.slug}/${car.slug}`}
              className="group shrink-0 w-[260px] md:w-auto md:shrink snap-start rounded-2xl overflow-hidden transition-all duration-300 block cb-card-enter"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                animationDelay: `${idx * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(17,82,212,0.2)";
                e.currentTarget.style.borderColor = "rgba(17,82,212,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              {/* Car image with light gradient backdrop */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #1a2332 0%, #0f1923 50%, #162030 100%)" }} />
                <Image
                  src={car.image}
                  alt={car.fullName}
                  fill
                  sizes="(max-width: 768px) 260px, 25vw"
                  className="object-cover relative z-[1] transition-transform duration-500 group-hover:scale-[1.06]"
                  unoptimized
                />
                {/* Bottom gradient for text readability */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.7) 0%, transparent 100%)" }} />

                {car.tag && (
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{
                    background: "linear-gradient(135deg, #1152d4, #2563eb)",
                    boxShadow: "0 2px 8px rgba(17,82,212,0.3)",
                  }}>
                    {car.tag}
                  </span>
                )}
                <div className="absolute bottom-3 right-3 z-[3] flex items-center gap-1 text-amber-400">
                  <span className="text-xs font-bold">{car.rating}</span>
                  <MaterialIcon name="star" fill className="text-[13px]" />
                </div>
              </div>

              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#64748b", fontFamily: "Manrope, sans-serif" }}>{car.brand.name}</p>
                <h3 className="text-sm md:text-[15px] font-bold text-white mt-1.5 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{car.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2.5">
                  <p className="text-sm md:text-base font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>{car.startingPriceDisplay}</p>
                  <span className="text-[10px] font-medium" style={{ color: "#64748b" }}>onwards</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] font-medium" style={{ color: "#64748b" }}>EMI {formatEmi(car.startingPrice)}</p>
                  <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "#60a5fa" }}>
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CERTIFIED USED CARS ─── */}
      {!usedCarsLoading && usedCars.length > 0 && (
        <section className="mb-12 md:mb-16">
          <div className="flex items-end justify-between px-4 md:px-0 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: "#10b981", fontFamily: "Manrope, sans-serif" }}>Inspected &amp; Warranted</p>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>
                Certified Used Cars
              </h2>
            </div>
            <Link href="/used-cars" className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 group" style={{ color: "#34d399" }}>
              View all
              <MaterialIcon name="arrow_forward" className="text-[16px] transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none md:px-0">
            {usedCars.map((car, idx) => (
              <Link
                key={car.id}
                href={`/used-cars/details/${car.id}`}
                className="group shrink-0 w-[260px] md:w-auto md:shrink snap-start rounded-2xl overflow-hidden transition-all duration-300 block cb-card-enter"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animationDelay: `${idx * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(16,185,129,0.2)";
                  e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #1a2332 0%, #0f1923 50%, #162030 100%)" }} />
                  {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={car.name} fill sizes="(max-width: 768px) 260px, 33vw" className="object-cover relative z-[1] transition-transform duration-500 group-hover:scale-[1.06]" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center relative z-[1]" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <MaterialIcon name="directions_car" className="text-[40px]" style={{ color: "#1e293b" }} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.7) 0%, transparent 100%)" }} />
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white flex items-center gap-1" style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                  }}>
                    <MaterialIcon name="verified" className="text-[11px]" />
                    Certified
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#64748b", fontFamily: "Manrope, sans-serif" }}>{car.year} &middot; {car.fuel}</p>
                  <h3 className="text-sm md:text-[15px] font-bold text-white mt-1.5 leading-tight" style={{ fontFamily: "Manrope, sans-serif" }}>{car.name}</h3>
                  <p className="text-sm md:text-base font-extrabold text-white mt-2.5">{car.priceDisplay || `\u20B9${(car.price / 100000).toFixed(1)} Lakh`}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] font-medium" style={{ color: "#64748b" }}>{car.km} &middot; {car.location || selectedCity}</p>
                    <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "#34d399" }}>
                      View &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA STRIP — Gradient Action Cards ─── */}
      <section className="px-4 md:px-0 mb-12 md:mb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Sell your car */}
          <Link
            href="/sell-car"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(16,185,129,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {/* Decorative corner accent */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <MaterialIcon name="sell" className="text-[24px]" style={{ color: "#34d399" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Sell Your Car</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>AI valuation in 30 seconds</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: "rgba(16,185,129,0.1)" }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: "#34d399" }} />
              </div>
            </div>
          </Link>

          {/* AI Concierge */}
          <Link
            href="/concierge"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, rgba(17,82,212,0.12) 0%, rgba(17,82,212,0.04) 100%)",
              border: "1px solid rgba(17,82,212,0.15)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(17,82,212,0.35)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(17,82,212,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(17,82,212,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #1152d4, transparent)" }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(17,82,212,0.15)", border: "1px solid rgba(17,82,212,0.2)" }}>
                <MaterialIcon name="smart_toy" className="text-[24px]" style={{ color: "#60a5fa" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>AI Concierge</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Tell us your needs, AI finds your match</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: "rgba(17,82,212,0.1)" }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: "#60a5fa" }} />
              </div>
            </div>
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(245,158,11,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
                <MaterialIcon name="compare_arrows" className="text-[24px]" style={{ color: "#fbbf24" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Compare Cars</p>
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Side-by-side specs comparison</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: "rgba(245,158,11,0.1)" }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: "#fbbf24" }} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── QUICK LINKS ─── */}
      <section className="px-4 md:px-0 mb-10 md:mb-14">
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold mr-1" style={{ color: "#334155", fontFamily: "Manrope, sans-serif" }}>Explore</span>
          {[
            { label: "EMI Calculator", href: "/car-loan/emi-calculator", icon: "calculate" },
            { label: "Fuel Prices", href: "/fuel-price", icon: "local_gas_station" },
            { label: "Car Insurance", href: "/car-insurance", icon: "shield" },
            { label: "Car Loan", href: "/car-loan", icon: "account_balance" },
            { label: "Upcoming Cars", href: "/upcoming-cars", icon: "event" },
            { label: "Electric Cars", href: "/electric-cars", icon: "bolt" },
            { label: "Find Dealers", href: "/dealers", icon: "storefront" },
            { label: "Car News", href: "/car-news", icon: "newspaper" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={{ color: "#64748b", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
            >
              <MaterialIcon name={link.icon} className="text-[13px]" />
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-4 md:px-0 pb-4 md:pb-8">
        <div className="pt-8 md:pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="md:flex md:items-start md:justify-between md:gap-12">
            <div className="mb-5 md:mb-0">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1152d4, #3b82f6)" }}>
                  <MaterialIcon name="diamond" className="text-[13px] text-white" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "Playfair Display, serif" }}>CaroBest</span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: "#475569", fontFamily: "Manrope, sans-serif" }}>
                India&apos;s AI-powered car marketplace. Buy, sell &amp; compare new and used cars with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2.5">
              {[
                { label: "About", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Dealers", href: "/dealers" },
                { label: "Luxury Portal", href: "/landing" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs transition-colors duration-200" style={{ color: "#475569", fontFamily: "Manrope, sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#475569"; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <p className="text-[10px]" style={{ color: "#1e293b", fontFamily: "Manrope, sans-serif" }}>&copy; 2026 The Singularity Covenant LLP. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
    </BuyerAppShell>
  );
}
