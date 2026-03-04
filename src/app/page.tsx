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

/* ─── CaroBest Homepage — Premium Automotive Marketplace ─── */

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

/* Browse filter tab type */
type BrowseTab = "body" | "budget" | "brand";

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
    <div className="min-h-dvh w-full" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── MOBILE HEADER ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 border-b border-white/5 md:hidden"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <MaterialIcon name="token" className="text-[24px]" style={{ color: "#1152d4" }} />
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Newsreader, serif" }}>
            CaroBest
          </span>
        </Link>
        <button
          onClick={() => setShowCityPicker(true)}
          className="flex items-center gap-1 rounded-full px-3 h-8 text-xs font-semibold border border-white/10 active:scale-95"
          style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          <MaterialIcon name="location_on" className="text-[13px]" style={{ color: "#1152d4" }} />
          {selectedCity}
          <MaterialIcon name="keyboard_arrow_down" className="text-[13px]" />
        </button>
        <div className="flex items-center gap-1.5">
          {isAuthenticated && user ? (
            <Link href="/my-account" className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: "linear-gradient(135deg, #1152d4, #4f8ef7)" }}>
              {userInitials}
            </Link>
          ) : (
            <Link href="/login/buyer" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <MaterialIcon name="person" className="text-[18px] text-slate-400" />
            </Link>
          )}
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        className="relative w-full overflow-hidden md:-mx-8 lg:-mx-12 md:-mt-6 md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)]"
        style={{ height: "520px", maxHeight: "65vh" }}
      >
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0c1a35 0%, #0a1225 50%, #0e1a30 100%)" }} />

        {HERO_SLIDES.map((slide, i) => (
          <div
            key={slide.alt}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: heroIndex === i ? 1 : 0, zIndex: heroIndex === i ? 1 : 0 }}
          >
            <Image src={slide.src} alt={slide.alt} fill sizes="100vw" className="object-cover" priority={i === 0} unoptimized />
          </div>
        ))}

        {/* Gradient overlay -- lighter to show car */}
        <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.95) 0%, rgba(8,10,15,0.5) 35%, rgba(8,10,15,0.1) 70%, rgba(8,10,15,0.2) 100%)" }} />

        {/* Hero content */}
        <div className="relative z-30 flex flex-col items-center justify-end h-full pb-8 md:pb-12 px-6 text-center md:items-start md:text-left md:px-12 lg:px-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border border-blue-400/20" style={{ background: "rgba(17,82,212,0.12)" }}>
              <MaterialIcon name="auto_awesome" className="text-[12px] text-blue-400" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-blue-400">AI-Powered Marketplace</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-3" style={{ fontFamily: "Newsreader, serif" }}>
              Find Your Next Car
            </h1>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-6 max-w-md">
              AI-inspected, dealer-certified cars across 50+ Indian cities. 200-point check, 1-year warranty, easy returns.
            </p>

            {/* Search bar -- the main action */}
            <div className="w-full max-w-lg">
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3.5 md:py-4 border border-white/15 focus-within:border-blue-500/50 transition-all"
                style={{ background: "rgba(8,10,15,0.85)", backdropFilter: "blur(20px)" }}
              >
                <MaterialIcon name="search" className="text-[22px] text-slate-500 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search any car..."
                  className="flex-1 bg-transparent text-sm md:text-base text-white outline-none placeholder:text-slate-500"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                />
                <button
                  onClick={() => handleSearch()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0 transition-transform active:scale-95"
                  style={{ background: "#1152d4" }}
                >
                  <MaterialIcon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                <span className="text-[11px] text-slate-600 shrink-0 font-medium" style={{ fontFamily: "Manrope, sans-serif" }}>Popular:</span>
                {POPULAR_SEARCHES.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSearch(q)}
                    className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium text-slate-400 border border-white/8 transition-all hover:border-white/20 hover:text-white active:scale-95"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:translate-x-0 flex items-center gap-2">
            <span className="text-[10px] font-medium text-white/50 mr-1 hidden md:block">{HERO_SLIDES[heroIndex].label}</span>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="h-1.5 rounded-full transition-all"
                style={{ width: heroIndex === i ? "24px" : "6px", background: heroIndex === i ? "#1152d4" : "rgba(255,255,255,0.25)" }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CITY PICKER MODAL ─── */}
      {showCityPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={() => setShowCityPicker(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[70vh] flex flex-col"
            style={{ background: "#0e1117", border: "1px solid rgba(255,255,255,0.08)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Select City</h3>
              <button onClick={() => setShowCityPicker(false)} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <MaterialIcon name="close" className="text-[18px] text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
              <MaterialIcon name="search" className="text-[18px] text-slate-500" />
              <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" autoFocus />
            </div>
            {!citySearch && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Popular Cities</p>
                <div className="flex flex-wrap gap-2">
                  {["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"].map((c) => (
                    <button key={c} onClick={() => handleCitySelect(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${selectedCity === c ? "text-white" : "text-slate-400 border border-white/10"}`} style={{ background: selectedCity === c ? "#1152d4" : "rgba(255,255,255,0.04)" }}>{c}</button>
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

      {/* ─── STATS + BROWSE FILTERS (consolidated) ─── */}
      <section className="px-4 md:px-0 pt-8 md:pt-10 pb-6">
        {/* Stats row */}
        <div className="flex items-center justify-between md:justify-start md:gap-12 mb-8">
          {[
            { value: "50K+", label: "New Cars" },
            { value: "12K+", label: "Used Cars" },
            { value: "2.5K+", label: "Dealers" },
            { value: "4.8", label: "Rating", star: true },
          ].map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <p className="text-lg md:text-2xl font-extrabold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
                {s.value}{s.star && <span className="text-amber-400 ml-0.5">★</span>}
              </p>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Browse filters -- dropdown tabs instead of icon grids */}
        <div ref={browseRef} className="relative">
          <div className="flex items-center gap-2 md:gap-3 mb-4">
            <h2 className="text-base md:text-lg font-bold text-white mr-2" style={{ fontFamily: "Newsreader, serif" }}>Browse by</h2>
            {([
              { key: "body" as BrowseTab, label: "Body Type", icon: "directions_car" },
              { key: "budget" as BrowseTab, label: "Budget", icon: "currency_rupee" },
              { key: "brand" as BrowseTab, label: "Brand", icon: "star" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setBrowseTab(tab.key); setBrowseOpen(browseTab === tab.key ? !browseOpen : true); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all active:scale-95 ${
                  browseTab === tab.key && browseOpen
                    ? "text-white border-blue-500/50"
                    : "text-slate-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
                style={{
                  background: browseTab === tab.key && browseOpen ? "rgba(17,82,212,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${browseTab === tab.key && browseOpen ? "rgba(17,82,212,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <MaterialIcon name={tab.icon} className="text-[16px]" />
                {tab.label}
                <MaterialIcon
                  name={browseTab === tab.key && browseOpen ? "expand_less" : "expand_more"}
                  className="text-[16px] -mr-1"
                />
              </button>
            ))}
          </div>

          {/* Dropdown content */}
          {browseOpen && (
            <div
              className="rounded-2xl p-4 md:p-5 mb-2 border border-white/8 animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {browseTab === "body" && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {BODY_TYPES.map((bt) => (
                    <Link
                      key={bt.value}
                      href={`/new-cars?body=${bt.value}`}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 border border-white/8 transition-all hover:border-blue-500/30 hover:text-white hover:bg-blue-500/5 active:scale-95"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <span className="text-lg">{bt.icon}</span>
                      {bt.label}
                    </Link>
                  ))}
                </div>
              )}
              {browseTab === "budget" && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {BUDGET_SEGMENTS.map((b) => (
                    <Link
                      key={b.label}
                      href={`/new-cars?minPrice=${b.min}&maxPrice=${b.max}`}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 border border-white/8 transition-all hover:border-blue-500/30 hover:text-white hover:bg-blue-500/5 active:scale-95"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <MaterialIcon name="currency_rupee" className="text-[16px] text-blue-400" />
                      {b.label}
                    </Link>
                  ))}
                </div>
              )}
              {browseTab === "brand" && (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {popularBrands.map((brand) => (
                    <Link
                      key={brand.slug}
                      href={`/new-cars?brand=${brand.slug}`}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 border border-white/8 transition-all hover:border-blue-500/30 hover:text-white hover:bg-blue-500/5 active:scale-95"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black"
                        style={{ background: `${brand.color}22`, border: `1px solid ${brand.color}44`, color: brand.color }}
                      >
                        {brand.logo}
                      </div>
                      {brand.name.split(" ")[0]}
                    </Link>
                  ))}
                  <Link
                    href="/new-cars"
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-400 border border-blue-500/20 transition-all hover:bg-blue-500/5 active:scale-95"
                    style={{ background: "rgba(17,82,212,0.05)" }}
                  >
                    View all brands
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── POPULAR NEW CARS ─── */}
      <section className="mb-10 md:mb-14">
        <div className="flex items-center justify-between px-4 md:px-0 mb-5">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-white" style={{ fontFamily: "Newsreader, serif" }}>
              Popular New Cars
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">Top picks across India</p>
          </div>
          <Link
            href="/new-cars"
            className="flex items-center gap-1 text-xs md:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:snap-none md:px-0">
          {popularModels.map((car) => (
            <Link
              key={car.slug}
              href={`/${car.brand.slug}/${car.slug}`}
              className="group shrink-0 w-[280px] md:w-auto md:shrink snap-start rounded-2xl overflow-hidden border border-white/[0.06] transition-all hover:border-white/15 active:scale-[0.98] block"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={car.image}
                  alt={car.fullName}
                  fill
                  sizes="(max-width: 768px) 280px, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.6) 0%, transparent 50%)" }} />
                {car.tag && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: "rgba(17,82,212,0.85)", backdropFilter: "blur(4px)" }}>
                    {car.tag}
                  </span>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-amber-400">
                  <span className="text-xs font-bold">{car.rating}</span>
                  <MaterialIcon name="star" fill className="text-[14px]" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{car.brand.name}</p>
                <h3 className="text-sm md:text-base font-bold text-white mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>{car.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-sm md:text-base font-extrabold text-white">{car.startingPriceDisplay}</p>
                  <span className="text-[10px] text-slate-500 font-medium">onwards</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">EMI {formatEmi(car.startingPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── RECENTLY LISTED USED CARS ─── */}
      {!usedCarsLoading && usedCars.length > 0 && (
        <section className="mb-10 md:mb-14">
          <div className="flex items-center justify-between px-4 md:px-0 mb-5">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white" style={{ fontFamily: "Newsreader, serif" }}>
                Certified Used Cars
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">Inspected &amp; warranted in {selectedCity}</p>
            </div>
            <Link href="/used-cars" className="flex items-center gap-1 text-xs md:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              View all <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none md:px-0">
            {usedCars.map((car) => (
              <Link
                key={car.id}
                href={`/used-cars/details/${car.id}`}
                className="group shrink-0 w-[280px] md:w-auto md:shrink snap-start rounded-2xl overflow-hidden border border-white/[0.06] transition-all hover:border-white/15 active:scale-[0.98] block"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={car.name} fill sizes="(max-width: 768px) 280px, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <MaterialIcon name="directions_car" className="text-[40px] text-slate-700" />
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.6) 0%, transparent 50%)" }} />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: "rgba(16,185,129,0.85)", backdropFilter: "blur(4px)" }}>
                    Certified
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{car.year} · {car.fuel}</p>
                  <h3 className="text-sm md:text-base font-bold text-white mt-1" style={{ fontFamily: "Manrope, sans-serif" }}>{car.name}</h3>
                  <p className="text-sm md:text-base font-extrabold text-white mt-2">{car.priceDisplay || `₹${(car.price / 100000).toFixed(1)} Lakh`}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{car.km} · {car.location || selectedCity}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA STRIP ─── */}
      <section className="px-4 md:px-0 mb-10 md:mb-14">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Sell your car */}
          <Link
            href="/sell-car"
            className="group flex items-center gap-4 rounded-2xl p-5 md:p-6 border border-emerald-500/15 transition-all hover:border-emerald-500/30 active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.02) 100%)" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
              <MaterialIcon name="sell" className="text-[24px] text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Sell Your Car</p>
              <p className="text-xs text-slate-500 mt-0.5">AI valuation in 30 seconds</p>
            </div>
            <MaterialIcon name="arrow_forward" className="text-[18px] text-emerald-400/50 group-hover:text-emerald-400 transition-colors shrink-0" />
          </Link>

          {/* AI Concierge */}
          <Link
            href="/concierge"
            className="group flex items-center gap-4 rounded-2xl p-5 md:p-6 border border-blue-500/15 transition-all hover:border-blue-500/30 active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.08) 0%, rgba(17,82,212,0.03) 100%)" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(17,82,212,0.15)" }}>
              <MaterialIcon name="smart_toy" className="text-[24px] text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>AI Concierge</p>
              <p className="text-xs text-slate-500 mt-0.5">Tell us your needs, AI finds your match</p>
            </div>
            <MaterialIcon name="arrow_forward" className="text-[18px] text-blue-400/50 group-hover:text-blue-400 transition-colors shrink-0" />
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="group flex items-center gap-4 rounded-2xl p-5 md:p-6 border border-amber-500/15 transition-all hover:border-amber-500/30 active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
              <MaterialIcon name="compare_arrows" className="text-[24px] text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white" style={{ fontFamily: "Manrope, sans-serif" }}>Compare Cars</p>
              <p className="text-xs text-slate-500 mt-0.5">Side-by-side specs comparison</p>
            </div>
            <MaterialIcon name="arrow_forward" className="text-[18px] text-amber-400/50 group-hover:text-amber-400 transition-colors shrink-0" />
          </Link>
        </div>
      </section>

      {/* ─── QUICK LINKS ─── */}
      <section className="px-4 md:px-0 mb-8 md:mb-12">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-xs text-slate-600 font-medium mr-1">Quick links:</span>
          {[
            { label: "EMI Calculator", href: "/car-loan/emi-calculator" },
            { label: "Fuel Prices", href: "/fuel-price" },
            { label: "Car Insurance", href: "/car-insurance" },
            { label: "Car Loan", href: "/car-loan" },
            { label: "Upcoming Cars", href: "/upcoming-cars" },
            { label: "Electric Cars", href: "/electric-cars" },
            { label: "Find Dealers", href: "/dealers" },
            { label: "Car News", href: "/car-news" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-full border border-white/6 hover:text-white hover:border-white/15 transition-all"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-4 md:px-0 pb-4 md:pb-8">
        <div className="border-t border-white/[0.06] pt-6 md:pt-8">
          <div className="md:flex md:items-start md:justify-between md:gap-12">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <MaterialIcon name="token" className="text-[18px]" style={{ color: "#1152d4" }} />
                <span className="text-sm font-bold text-white" style={{ fontFamily: "Newsreader, serif" }}>CaroBest</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                India&apos;s AI-powered car marketplace. Buy, sell &amp; compare new and used cars with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy-policy" },
                { label: "Dealers", href: "/dealers" },
                { label: "Luxury Portal", href: "/landing" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.04] mt-6 pt-4">
            <p className="text-[10px] text-slate-700">&copy; 2026 The Singularity Covenant LLP</p>
          </div>
        </div>
      </footer>

    </div>
    </BuyerAppShell>
  );
}
