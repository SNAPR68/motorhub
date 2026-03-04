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

/* ─── CaroBest Homepage — Fresh Marketplace Design ─── */
/* Color palette: P2P Marketplace Dark Mode (UI/UX Pro #50) */
/* Primary: #00969E (teal), CTA: #FF4D33 (coral), Secondary: #4A9A6A (green) */

const C = {
  bg: "#111318",
  surface: "#1A1D24",
  primary: "#00969E",
  primaryLight: "#00b8c2",
  secondary: "#4A9A6A",
  secondaryLight: "#5cb87c",
  cta: "#FF4D33",
  ctaLight: "#ff6b55",
  text: "#F5F5F5",
  muted: "#8B95A5",
  dim: "#5a6374",
  border: "#252830",
  glass: "rgba(26,29,36,0.75)",
  glassBorder: "rgba(255,255,255,0.06)",
} as const;

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

/* ─── Inline keyframes ─── */
const PAGE_STYLES = `
@keyframes cb-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes cb-slide-down {
  from { opacity: 0; transform: translateY(-8px); max-height: 0; }
  to { opacity: 1; transform: translateY(0); max-height: 500px; }
}
@keyframes cb-glow-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
@keyframes cb-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.cb-stagger-1 { animation: cb-fade-up 0.5s ease-out 0.05s both; }
.cb-stagger-2 { animation: cb-fade-up 0.5s ease-out 0.15s both; }
.cb-stagger-3 { animation: cb-fade-up 0.5s ease-out 0.25s both; }
.cb-stagger-4 { animation: cb-fade-up 0.5s ease-out 0.35s both; }
.cb-card-enter { animation: cb-fade-up 0.45s ease-out both; }
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
    <div className="min-h-dvh w-full" style={{ background: C.bg, color: C.text, fontFamily: "Inter, sans-serif" }}>

      {/* ─── MOBILE HEADER ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b md:hidden"
        style={{ background: "rgba(17,19,24,0.92)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderColor: C.glassBorder }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` }}>
            <MaterialIcon name="diamond" className="text-[14px] text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            CaroBest
          </span>
        </Link>
        <button
          onClick={() => setShowCityPicker(true)}
          className="flex items-center gap-1 rounded-full px-3 h-8 text-xs font-semibold active:scale-95 transition-transform"
          style={{ background: `${C.primary}15`, color: C.primaryLight, border: `1px solid ${C.primary}30` }}
        >
          <MaterialIcon name="location_on" className="text-[13px]" />
          {selectedCity}
          <MaterialIcon name="expand_more" className="text-[13px]" />
        </button>
        <div className="flex items-center gap-1.5">
          {isAuthenticated && user ? (
            <Link href="/my-account" className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` }}>
              {userInitials}
            </Link>
          ) : (
            <Link href="/login/buyer" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}` }}>
              <MaterialIcon name="person" className="text-[18px]" style={{ color: C.muted }} />
            </Link>
          )}
        </div>
      </header>

      {/* ─── HERO — Modern Split Layout ─── */}
      <section
        className="relative w-full overflow-hidden md:-mx-8 lg:-mx-12 md:-mt-6 md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)]"
        style={{ minHeight: "480px" }}
      >
        {/* Ambient gradient mesh */}
        <div className="absolute inset-0 z-0" style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${C.primary}12 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, ${C.primary}08 0%, transparent 60%), ${C.bg}`,
        }} />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 z-[1] opacity-[0.025]" style={{
          backgroundImage: `radial-gradient(${C.muted} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />

        {/* Desktop: Split layout */}
        <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[480px]">
          {/* Left: Text + Search */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8 md:px-12 lg:px-16 md:pt-12 md:pb-12">
            <div className="max-w-xl cb-stagger-1">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
                style={{
                  background: `${C.primary}12`,
                  border: `1px solid ${C.primary}25`,
                }}
              >
                <MaterialIcon name="verified" className="text-[12px]" style={{ color: C.primary }} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: C.primary }}>100% Verified Cars</span>
              </div>

              <h1
                className="text-3xl md:text-[3.2rem] lg:text-[3.6rem] font-bold text-white leading-[1.08] mb-4 tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Find Your
                <br />
                <span style={{ color: C.primary }}>Perfect</span> Car
              </h1>

              <p className="text-sm md:text-[15px] leading-relaxed mb-7 max-w-md" style={{ color: C.muted }}>
                AI-inspected, dealer-certified vehicles across 50+ Indian cities. Every car passes our 200-point quality check.
              </p>

              {/* Search bar */}
              <div className="w-full max-w-lg cb-stagger-2">
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 md:py-3.5 transition-all duration-300"
                  style={{
                    background: searchFocused ? `${C.primary}0a` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${searchFocused ? `${C.primary}50` : C.glassBorder}`,
                    backdropFilter: "blur(16px)",
                    boxShadow: searchFocused ? `0 0 30px ${C.primary}10, inset 0 1px 0 rgba(255,255,255,0.04)` : "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                >
                  <MaterialIcon name="search" className="text-[22px] shrink-0" style={{ color: searchFocused ? C.primary : C.dim }} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search by brand, model, or budget..."
                    className="flex-1 bg-transparent text-sm md:text-[15px] text-white outline-none placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0 transition-all duration-200 active:scale-90 hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${C.cta}, ${C.ctaLight})`, boxShadow: `0 4px 15px ${C.cta}40` }}
                  >
                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                  </button>
                </div>

                {/* Popular searches */}
                <div className="flex items-center gap-2 mt-3.5 overflow-x-auto no-scrollbar cb-stagger-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] shrink-0 font-bold" style={{ color: C.dim }}>
                    Trending
                  </span>
                  {POPULAR_SEARCHES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSearch(q)}
                      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 hover:text-white active:scale-95"
                      style={{
                        color: C.muted,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${C.glassBorder}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.borderColor = `${C.primary}30`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.glassBorder; }}
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
            {/* Teal halo behind car */}
            <div className="absolute bottom-0 right-0 w-full h-full" style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 70%, ${C.primary}18 0%, ${C.primary}08 40%, transparent 70%)`,
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
              <span className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>
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
                      background: heroIndex === i ? C.primary : "rgba(255,255,255,0.2)",
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
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, rgba(17,19,24,0.3) 60%, rgba(17,19,24,0.6) 100%)` }} />
              </div>
            ))}
            {/* Mobile dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: heroIndex === i ? "18px" : "5px", height: "5px", background: heroIndex === i ? C.primary : "rgba(255,255,255,0.25)" }}
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
            style={{ background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, border: `1px solid ${C.glassBorder}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Select City</h3>
              <button onClick={() => setShowCityPicker(false)} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                <MaterialIcon name="close" className="text-[18px]" style={{ color: C.muted }} />
              </button>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}>
              <MaterialIcon name="search" className="text-[18px]" style={{ color: C.dim }} />
              <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" autoFocus />
            </div>
            {!citySearch && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.dim }}>Popular Cities</p>
                <div className="flex flex-wrap gap-2">
                  {["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"].map((c) => (
                    <button key={c} onClick={() => handleCitySelect(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${selectedCity === c ? "text-white" : "text-slate-400"}`} style={{ background: selectedCity === c ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : "rgba(255,255,255,0.04)", border: `1px solid ${selectedCity === c ? "transparent" : C.glassBorder}` }}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.dim }}>{citySearch ? "Results" : "All Cities"}</p>
            <div className="flex-1 overflow-y-auto space-y-0.5">
              {filteredCities.map((c) => (
                <button key={c} onClick={() => handleCitySelect(c)} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.99]" style={{ background: selectedCity === c ? `${C.primary}12` : "transparent" }}>
                  <MaterialIcon name="location_on" className="text-[16px]" style={{ color: selectedCity === c ? C.primary : C.dim }} />
                  <span className="text-sm font-medium" style={{ color: selectedCity === c ? C.primaryLight : "#cbd5e1" }}>{c}</span>
                  {selectedCity === c && <MaterialIcon name="check" className="text-[16px] ml-auto" style={{ color: C.primary }} />}
                </button>
              ))}
              {filteredCities.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No cities found</p>}
            </div>
          </div>
        </div>
      )}

      {/* ─── TRUST STRIP ─── */}
      <section className="px-4 md:px-0 pt-8 md:pt-10">
        <div
          className="flex items-center justify-between md:justify-center md:gap-0 rounded-2xl py-4 px-5 md:px-0"
          style={{
            background: `linear-gradient(135deg, ${C.primary}08 0%, rgba(255,255,255,0.02) 50%, ${C.primary}06 100%)`,
            border: `1px solid ${C.glassBorder}`,
          }}
        >
          {[
            { value: "50K+", label: "New Cars", icon: "directions_car" },
            { value: "12K+", label: "Certified Used", icon: "verified" },
            { value: "2.5K+", label: "Trusted Dealers", icon: "storefront" },
            { value: "4.8", label: "User Rating", icon: "star", star: true },
          ].map((s, idx) => (
            <div key={s.label} className="flex items-center gap-0 md:gap-3 flex-col md:flex-row text-center md:text-left">
              {idx > 0 && <div className="hidden md:block w-px h-8 mx-6" style={{ background: C.glassBorder }} />}
              <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${C.primary}12` }}>
                <MaterialIcon name={s.icon} className="text-[18px]" style={{ color: C.primary }} />
              </div>
              <div>
                <p className="text-lg md:text-xl font-extrabold text-white leading-none" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {s.value}{s.star && <span className="text-amber-400 ml-0.5 text-sm">&#9733;</span>}
                </p>
                <p className="text-[10px] md:text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BROWSE FILTERS ─── */}
      <section className="px-4 md:px-0 pt-8 md:pt-10 pb-2">
        <div ref={browseRef} className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-3">
            <h2 className="text-base md:text-xl font-bold text-white mr-1 tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
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
                    background: isActive ? `${C.primary}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `${C.primary}40` : C.glassBorder}`,
                    color: isActive ? C.primaryLight : C.muted,
                    boxShadow: isActive ? `0 0 20px ${C.primary}10` : "none",
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

          {/* Dropdown panel */}
          {browseOpen && (
            <div
              className="rounded-2xl p-4 md:p-5 mb-4"
              style={{
                background: C.glass,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${C.glassBorder}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
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
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.borderColor = `${C.primary}30`; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.color = "#cbd5e1"; }}
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
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.borderColor = `${C.primary}30`; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      <MaterialIcon name="currency_rupee" className="text-[15px]" style={{ color: C.primary }} />
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
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primary}12`; e.currentTarget.style.borderColor = `${C.primary}30`; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.color = "#cbd5e1"; }}
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
                    style={{ color: C.primaryLight, background: `${C.primary}08`, border: `1px solid ${C.primary}25` }}
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

      {/* ─── POPULAR NEW CARS ─── */}
      <section className="mb-12 md:mb-16 pt-4 md:pt-6">
        <div className="flex items-end justify-between px-4 md:px-0 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: C.primary }}>New Arrivals</p>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Popular New Cars
            </h2>
          </div>
          <Link
            href="/new-cars"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 group"
            style={{ color: C.primaryLight }}
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
                background: C.surface,
                border: `1px solid ${C.border}`,
                animationDelay: `${idx * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${C.primary}30`;
                e.currentTarget.style.borderColor = `${C.primary}35`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              {/* Car image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(135deg, ${C.surface} 0%, #151820 50%, ${C.surface} 100%)` }} />
                <Image
                  src={car.image}
                  alt={car.fullName}
                  fill
                  sizes="(max-width: 768px) 260px, 25vw"
                  className="object-cover relative z-[1] transition-transform duration-500 group-hover:scale-[1.06]"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: `linear-gradient(to top, ${C.surface}cc 0%, transparent 100%)` }} />

                {car.tag && (
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                    boxShadow: `0 2px 8px ${C.primary}40`,
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
                <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.muted }}>{car.brand.name}</p>
                <h3 className="text-sm md:text-[15px] font-bold text-white mt-1.5 leading-tight">{car.name}</h3>
                <div className="flex items-baseline gap-1.5 mt-2.5">
                  <p className="text-sm md:text-base font-extrabold" style={{ color: C.cta }}>{car.startingPriceDisplay}</p>
                  <span className="text-[10px] font-medium" style={{ color: C.muted }}>onwards</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] font-medium" style={{ color: C.muted }}>EMI {formatEmi(car.startingPrice)}</p>
                  <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: C.primaryLight }}>
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
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5" style={{ color: C.secondary }}>Inspected &amp; Warranted</p>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Certified Used Cars
              </h2>
            </div>
            <Link href="/used-cars" className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-200 group" style={{ color: C.secondaryLight }}>
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
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  animationDelay: `${idx * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${C.secondary}30`;
                  e.currentTarget.style.borderColor = `${C.secondary}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = C.border;
                }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <div className="absolute inset-0 z-0" style={{ background: `linear-gradient(135deg, ${C.surface} 0%, #151820 50%, ${C.surface} 100%)` }} />
                  {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={car.name} fill sizes="(max-width: 768px) 260px, 33vw" className="object-cover relative z-[1] transition-transform duration-500 group-hover:scale-[1.06]" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center relative z-[1]" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <MaterialIcon name="directions_car" className="text-[40px]" style={{ color: C.border }} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: `linear-gradient(to top, ${C.surface}cc 0%, transparent 100%)` }} />
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white flex items-center gap-1" style={{
                    background: `linear-gradient(135deg, ${C.secondary}, ${C.secondaryLight})`,
                    boxShadow: `0 2px 8px ${C.secondary}40`,
                  }}>
                    <MaterialIcon name="verified" className="text-[11px]" />
                    Certified
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.muted }}>{car.year} &middot; {car.fuel}</p>
                  <h3 className="text-sm md:text-[15px] font-bold text-white mt-1.5 leading-tight">{car.name}</h3>
                  <p className="text-sm md:text-base font-extrabold mt-2.5" style={{ color: C.cta }}>{car.priceDisplay || `\u20B9${(car.price / 100000).toFixed(1)} Lakh`}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] font-medium" style={{ color: C.muted }}>{car.km} &middot; {car.location || selectedCity}</p>
                    <span className="text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: C.secondaryLight }}>
                      View &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA STRIP ─── */}
      <section className="px-4 md:px-0 mb-12 md:mb-16">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Sell your car */}
          <Link
            href="/sell-car"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${C.primary}14 0%, ${C.primary}06 100%)`,
              border: `1px solid ${C.primary}20`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C.primary}40`; e.currentTarget.style.boxShadow = `0 8px 30px ${C.primary}12`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C.primary}20`; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.primary}, transparent)` }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: `${C.primary}18`, border: `1px solid ${C.primary}25` }}>
                <MaterialIcon name="sell" className="text-[24px]" style={{ color: C.primaryLight }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Sell Your Car</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>AI valuation in 30 seconds</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: `${C.primary}12` }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: C.primaryLight }} />
              </div>
            </div>
          </Link>

          {/* AI Concierge */}
          <Link
            href="/concierge"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${C.cta}12 0%, ${C.cta}04 100%)`,
              border: `1px solid ${C.cta}18`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C.cta}38`; e.currentTarget.style.boxShadow = `0 8px 30px ${C.cta}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C.cta}18`; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.cta}, transparent)` }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: `${C.cta}15`, border: `1px solid ${C.cta}20` }}>
                <MaterialIcon name="smart_toy" className="text-[24px]" style={{ color: C.ctaLight }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">AI Concierge</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Tell us your needs, AI finds your match</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: `${C.cta}10` }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: C.ctaLight }} />
              </div>
            </div>
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="group relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${C.secondary}14 0%, ${C.secondary}06 100%)`,
              border: `1px solid ${C.secondary}20`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${C.secondary}40`; e.currentTarget.style.boxShadow = `0 8px 30px ${C.secondary}10`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C.secondary}20`; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${C.secondary}, transparent)` }} />
            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: `${C.secondary}18`, border: `1px solid ${C.secondary}25` }}>
                <MaterialIcon name="compare_arrows" className="text-[24px]" style={{ color: C.secondaryLight }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Compare Cars</p>
                <p className="text-xs mt-0.5" style={{ color: C.muted }}>Side-by-side specs comparison</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-200 group-hover:translate-x-1" style={{ background: `${C.secondary}12` }}>
                <MaterialIcon name="arrow_forward" className="text-[16px]" style={{ color: C.secondaryLight }} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── QUICK LINKS ─── */}
      <section className="px-4 md:px-0 mb-10 md:mb-14">
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold mr-1" style={{ color: C.dim }}>Explore</span>
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
              style={{ color: C.muted, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.glassBorder}` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = C.glassBorder; }}
            >
              <MaterialIcon name={link.icon} className="text-[13px]" />
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-4 md:px-0 pb-4 md:pb-8">
        <div className="pt-8 md:pt-10" style={{ borderTop: `1px solid ${C.glassBorder}` }}>
          <div className="md:flex md:items-start md:justify-between md:gap-12">
            <div className="mb-5 md:mb-0">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` }}>
                  <MaterialIcon name="diamond" className="text-[13px] text-white" />
                </div>
                <span className="text-sm font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>CaroBest</span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: C.dim }}>
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
                <Link key={l.href} href={l.href} className="text-xs transition-colors duration-200" style={{ color: C.dim }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#cbd5e1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = C.dim; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${C.glassBorder}` }}>
            <p className="text-[10px]" style={{ color: C.border }}>&copy; 2026 The Singularity Covenant LLP. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
    </BuyerAppShell>
  );
}
