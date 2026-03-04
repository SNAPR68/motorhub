"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useAuthStore } from "@/lib/stores";
import {
  BODY_TYPES,
  BUDGET_SEGMENTS,
  CITIES,
  formatEmi,
} from "@/lib/car-catalog";
import { fetchCarBrands, fetchCarModels, type ApiBrand, type ApiCarModel } from "@/lib/api";
import {
  Gem,
  ShieldCheck,
  Search,
  ArrowRight,
  MapPin,
  ChevronDown,
  ChevronUp,
  Car,
  Star,
  Wallet,
  Store,
  User,
  X,
  Check,
  IndianRupee,
  Tag,
  Bot,
  ArrowLeftRight,
  Calculator,
  Fuel,
  Shield,
  Landmark,
  Calendar,
  Zap,
  Newspaper,
  Sparkles,
} from "lucide-react";

/* ─── CaroBest Homepage — Premium Automotive Design ─── */
/* Color palette: UI/UX Pro Automotive #54 Dark Mode */
/* Primary: #3B82F6 (brand blue), CTA: #E5C158 (gold), BG: #0A1628 (showroom navy) */

const C = {
  bg: "#0A1628",
  surface: "#0F1D32",
  primary: "#1E3A5F",
  primaryLight: "#3B82F6",
  accent: "#E5C158",
  accentGlow: "rgba(229,193,88,0.45)",
  text: "#F8FAFC",
  muted: "#8B9BAA",
  dim: "#5A6B7A",
  border: "#1E3048",
  success: "#10B981",
  glass: "rgba(15,29,50,0.75)",
  glassBorder: "rgba(255,255,255,0.08)",
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

/* ─── Inline keyframes — Premium Automotive ─── */
const PAGE_STYLES = `
@keyframes cb-fade-up {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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
@keyframes cb-gold-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(229,193,88,0.12), 0 0 60px rgba(229,193,88,0.04); }
  50% { box-shadow: 0 0 30px rgba(229,193,88,0.22), 0 0 80px rgba(229,193,88,0.08); }
}
@keyframes cb-card-shine {
  0% { left: -100%; }
  100% { left: 200%; }
}
.cb-stagger-1 { animation: cb-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
.cb-stagger-2 { animation: cb-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
.cb-stagger-3 { animation: cb-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
.cb-stagger-4 { animation: cb-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
.cb-card-enter { animation: cb-fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both; }
/* Premium card glass */
.cb-glass-card {
  background: linear-gradient(145deg, rgba(15,29,50,0.85) 0%, rgba(10,22,40,0.65) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;
  position: relative;
}
.cb-glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(229,193,88,0.08) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}
.cb-glass-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.2), 0 0 40px rgba(59,130,246,0.06);
  border-color: rgba(59,130,246,0.2);
}
.cb-glass-card:hover .cb-card-img {
  transform: scale(1.08);
}
.cb-glass-card:hover .cb-card-shimmer {
  animation: cb-card-shine 0.8s ease-out;
}
/* Card image */
.cb-card-img {
  transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
/* Shimmer overlay */
.cb-card-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  transform: skewX(-15deg);
  z-index: 2;
  pointer-events: none;
}
/* CTA glass card */
.cb-cta-card {
  background: linear-gradient(145deg, rgba(15,29,50,0.8) 0%, rgba(10,22,40,0.6) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  position: relative;
  overflow: hidden;
}
.cb-cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.cb-cta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  border-color: rgba(255,255,255,0.1);
}
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
        style={{ background: "rgba(10,22,40,0.92)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", borderColor: C.glassBorder }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, #60A5FA)` }}>
            <Gem size={14} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            CaroBest
          </span>
        </Link>
        <button
          onClick={() => setShowCityPicker(true)}
          className="flex items-center gap-1 rounded-full px-3 h-8 text-xs font-semibold active:scale-95 transition-transform"
          style={{ background: `${C.primaryLight}15`, color: C.primaryLight, border: `1px solid ${C.primaryLight}30` }}
        >
          <MapPin size={13} strokeWidth={2.5} />
          {selectedCity}
          <ChevronDown size={13} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-1.5">
          {isAuthenticated && user ? (
            <Link href="/my-account" className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, #60A5FA)` }}>
              {userInitials}
            </Link>
          ) : (
            <Link href="/login/buyer" className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}` }}>
              <User size={18} strokeWidth={1.8} style={{ color: C.muted }} />
            </Link>
          )}
        </div>
      </header>

      {/* ─── HERO — Premium Split Layout ─── */}
      <section
        className="relative w-full overflow-hidden md:-mx-8 lg:-mx-12 md:-mt-6 md:w-[calc(100%+4rem)] lg:w-[calc(100%+6rem)]"
        style={{ minHeight: "480px" }}
      >
        {/* Deep ambient gradient mesh */}
        <div className="absolute inset-0 z-0" style={{
          background: `radial-gradient(ellipse 80% 60% at 70% 40%, ${C.primaryLight}10 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, ${C.primaryLight}06 0%, transparent 60%), ${C.bg}`,
        }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(${C.primaryLight}15 1px, transparent 1px), linear-gradient(90deg, ${C.primaryLight}15 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />

        {/* Desktop: Split layout */}
        <div className="relative z-10 flex flex-col md:flex-row h-full min-h-[480px]">
          {/* Left: Text + Search */}
          <div className="flex-1 flex flex-col justify-center px-6 pt-16 pb-8 md:px-12 lg:px-16 md:pt-12 md:pb-12">
            <div className="max-w-xl cb-stagger-1">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
                style={{
                  background: `${C.primaryLight}10`,
                  border: `1px solid ${C.primaryLight}20`,
                }}
              >
                <ShieldCheck size={12} strokeWidth={2.5} style={{ color: C.primaryLight }} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: C.primaryLight }}>100% Verified Cars</span>
              </div>

              <h1
                className="text-3xl md:text-[3.2rem] lg:text-[3.6rem] font-bold text-white leading-[1.08] mb-4 tracking-tight"
                style={{ fontFamily: "Newsreader, serif" }}
              >
                Find Your
                <br />
                <span style={{ color: C.accent }}>Perfect</span> Car
              </h1>

              <p className="text-sm md:text-[15px] leading-relaxed mb-7 max-w-md" style={{ color: C.muted }}>
                AI-inspected, dealer-certified vehicles across 50+ Indian cities. Every car passes our 200-point quality check.
              </p>

              {/* Search bar */}
              <div className="w-full max-w-lg cb-stagger-2">
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 md:py-3.5 transition-all duration-300"
                  style={{
                    background: searchFocused ? `${C.primaryLight}08` : C.glass,
                    border: `1px solid ${searchFocused ? `${C.primaryLight}40` : C.glassBorder}`,
                    backdropFilter: "blur(20px) saturate(180%)",
                    boxShadow: searchFocused ? `0 0 40px ${C.primaryLight}08, inset 0 1px 0 rgba(255,255,255,0.04)` : `0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)`,
                  }}
                >
                  <Search size={20} strokeWidth={2} className="shrink-0" style={{ color: searchFocused ? C.primaryLight : C.dim }} />
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
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-black shrink-0 transition-all duration-200 active:scale-90 hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${C.accent}, #F0D580)`, boxShadow: `0 4px 20px ${C.accentGlow}` }}
                  >
                    <ArrowRight size={18} strokeWidth={2.5} />
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
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primaryLight}10`; e.currentTarget.style.borderColor = `${C.primaryLight}25`; }}
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
            {/* Blue halo behind car */}
            <div className="absolute bottom-0 right-0 w-full h-full" style={{
              background: `radial-gradient(ellipse 70% 60% at 50% 70%, ${C.primaryLight}14 0%, ${C.primaryLight}06 40%, transparent 70%)`,
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
                      background: heroIndex === i ? C.accent : "rgba(255,255,255,0.2)",
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
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg} 0%, rgba(10,22,40,0.3) 60%, rgba(10,22,40,0.6) 100%)` }} />
              </div>
            ))}
            {/* Mobile dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: heroIndex === i ? "18px" : "5px", height: "5px", background: heroIndex === i ? C.accent : "rgba(255,255,255,0.25)" }}
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
                <X size={18} strokeWidth={2} style={{ color: C.muted }} />
              </button>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}>
              <Search size={18} strokeWidth={2} style={{ color: C.dim }} />
              <input type="text" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" autoFocus />
            </div>
            {!citySearch && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.dim }}>Popular Cities</p>
                <div className="flex flex-wrap gap-2">
                  {["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"].map((c) => (
                    <button key={c} onClick={() => handleCitySelect(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${selectedCity === c ? "text-white" : "text-slate-400"}`} style={{ background: selectedCity === c ? `linear-gradient(135deg, ${C.primaryLight}, #60A5FA)` : "rgba(255,255,255,0.04)", border: `1px solid ${selectedCity === c ? "transparent" : C.glassBorder}` }}>{c}</button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: C.dim }}>{citySearch ? "Results" : "All Cities"}</p>
            <div className="flex-1 overflow-y-auto space-y-0.5">
              {filteredCities.map((c) => (
                <button key={c} onClick={() => handleCitySelect(c)} className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.99]" style={{ background: selectedCity === c ? `${C.primaryLight}10` : "transparent" }}>
                  <MapPin size={16} strokeWidth={2} style={{ color: selectedCity === c ? C.primaryLight : C.dim }} />
                  <span className="text-sm font-medium" style={{ color: selectedCity === c ? C.primaryLight : "#cbd5e1" }}>{c}</span>
                  {selectedCity === c && <Check size={16} strokeWidth={2.5} className="ml-auto" style={{ color: C.primaryLight }} />}
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
          className="flex items-center justify-between md:justify-center md:gap-0 rounded-3xl py-4 px-5 md:px-0 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, rgba(15,29,50,0.8) 0%, rgba(10,22,40,0.6) 100%)`,
            backdropFilter: "blur(20px) saturate(180%)",
            border: `1px solid ${C.glassBorder}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)` }} />
          {[
            { value: "50K+", label: "New Cars", icon: Car },
            { value: "12K+", label: "Certified Used", icon: ShieldCheck },
            { value: "2.5K+", label: "Trusted Dealers", icon: Store },
            { value: "4.8", label: "User Rating", icon: Star, star: true },
          ].map((s, idx) => (
            <div key={s.label} className="flex items-center gap-0 md:gap-3 flex-col md:flex-row text-center md:text-left">
              {idx > 0 && <div className="hidden md:block w-px h-8 mx-6" style={{ background: C.glassBorder }} />}
              <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${C.primaryLight}10` }}>
                <s.icon size={18} strokeWidth={2} style={{ color: C.primaryLight }} />
              </div>
              <div>
                <p className="text-lg md:text-xl font-extrabold text-white leading-none" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {s.value}{s.star && <span className="ml-0.5 text-sm" style={{ color: C.accent }}>&#9733;</span>}
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
              { key: "body" as BrowseTab, label: "Body Type", icon: Car },
              { key: "budget" as BrowseTab, label: "Budget", icon: Wallet },
              { key: "brand" as BrowseTab, label: "Brand", icon: Star },
            ]).map((tab) => {
              const isActive = browseTab === tab.key && browseOpen;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setBrowseTab(tab.key); setBrowseOpen(browseTab === tab.key ? !browseOpen : true); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    background: isActive ? `${C.primaryLight}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `${C.primaryLight}35` : C.glassBorder}`,
                    color: isActive ? C.primaryLight : C.muted,
                    boxShadow: isActive ? `0 0 24px ${C.primaryLight}08` : "none",
                  }}
                >
                  <tab.icon size={15} strokeWidth={2} />
                  {tab.label}
                  {isActive ? <ChevronUp size={16} strokeWidth={2} className="-mr-1" /> : <ChevronDown size={16} strokeWidth={2} className="-mr-1" />}
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
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: `1px solid ${C.glassBorder}`,
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
                      style={{ color: "#cbd5e1", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.glassBorder}` }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primaryLight}10`; e.currentTarget.style.borderColor = `${C.primaryLight}25`; e.currentTarget.style.color = "#fff"; }}
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
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primaryLight}10`; e.currentTarget.style.borderColor = `${C.primaryLight}25`; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = C.glassBorder; e.currentTarget.style.color = "#cbd5e1"; }}
                    >
                      <IndianRupee size={15} strokeWidth={2} style={{ color: C.accent }} />
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
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${C.primaryLight}10`; e.currentTarget.style.borderColor = `${C.primaryLight}25`; e.currentTarget.style.color = "#fff"; }}
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
                    style={{ color: C.primaryLight, background: `${C.primaryLight}08`, border: `1px solid ${C.primaryLight}20` }}
                  >
                    View all brands
                    <ArrowRight size={15} strokeWidth={2} />
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
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: C.accent, letterSpacing: "0.25em" }}>New Arrivals</p>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Popular New Cars
            </h2>
          </div>
          <Link
            href="/new-cars"
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-300 group"
            style={{ color: C.primaryLight }}
          >
            View all
            <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:snap-none md:px-0">
          {popularModels.map((car, idx) => (
            <Link
              key={car.slug}
              href={`/${car.brand.slug}/${car.slug}`}
              className="group shrink-0 w-[260px] md:w-auto md:shrink snap-start cb-glass-card block cb-card-enter"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              {/* Shimmer overlay */}
              <div className="cb-card-shimmer" />

              {/* Car image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse at 50% 80%, ${C.primary}40 0%, ${C.surface} 70%)` }} />
                <Image
                  src={car.image}
                  alt={car.fullName}
                  fill
                  sizes="(max-width: 768px) 260px, 25vw"
                  className="object-cover relative z-[1] cb-card-img"
                  unoptimized
                  priority={idx < 2}
                />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 z-[2]" style={{ background: `linear-gradient(to top, rgba(15,29,50,0.95) 0%, rgba(15,29,50,0.4) 50%, transparent 100%)` }} />

                {/* Tag badge */}
                {car.tag && (
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{
                    background: `linear-gradient(135deg, ${C.primaryLight}, #60A5FA)`,
                    boxShadow: `0 4px 12px ${C.primaryLight}40`,
                  }}>
                    {car.tag}
                  </span>
                )}

                {/* Rating badge */}
                <div className="absolute bottom-3 right-3 z-[3] flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                  <Star size={12} strokeWidth={0} fill={C.accent} />
                  <span className="text-xs font-bold" style={{ color: C.accent }}>{car.rating}</span>
                </div>

                {/* Brand name overlaid on image */}
                <p className="absolute bottom-3 left-4 z-[3] text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {car.brand.name}
                </p>
              </div>

              {/* Card content */}
              <div className="p-4 relative z-[3]">
                <h3 className="text-[15px] md:text-base font-bold text-white leading-tight">{car.name}</h3>

                <div className="flex items-baseline gap-2 mt-3">
                  <p className="text-base md:text-lg font-extrabold" style={{ color: C.accent, fontFamily: "Space Grotesk, sans-serif" }}>{car.startingPriceDisplay}</p>
                  <span className="text-[10px] font-medium" style={{ color: C.dim }}>onwards</span>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.glassBorder}` }}>
                  <p className="text-[11px] font-medium" style={{ color: C.muted }}>EMI {formatEmi(car.startingPrice)}</p>
                  <span className="flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0" style={{ color: C.primaryLight }}>
                    Explore <ArrowRight size={12} strokeWidth={2.5} />
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
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-1.5" style={{ color: C.success, letterSpacing: "0.25em" }}>Inspected &amp; Warranted</p>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Certified Used Cars
              </h2>
            </div>
            <Link href="/used-cars" className="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition-all duration-300 group" style={{ color: C.success }}>
              View all
              <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:snap-none md:px-0">
            {usedCars.map((car, idx) => (
              <Link
                key={car.id}
                href={`/used-cars/details/${car.id}`}
                className="group shrink-0 w-[260px] md:w-auto md:shrink snap-start cb-glass-card block cb-card-enter"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="cb-card-shimmer" />

                <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                  <div className="absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse at 50% 80%, ${C.primary}40 0%, ${C.surface} 70%)` }} />
                  {car.images?.[0] ? (
                    <Image src={car.images[0]} alt={car.name} fill sizes="(max-width: 768px) 260px, 33vw" className="object-cover relative z-[1] cb-card-img" unoptimized />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center relative z-[1]" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <Car size={40} strokeWidth={1} style={{ color: C.dim }} />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 z-[2]" style={{ background: `linear-gradient(to top, rgba(15,29,50,0.95) 0%, rgba(15,29,50,0.4) 50%, transparent 100%)` }} />

                  {/* Certified badge */}
                  <span className="absolute top-3 left-3 z-[3] text-[10px] font-bold px-2.5 py-1 rounded-lg text-white flex items-center gap-1" style={{
                    background: `linear-gradient(135deg, ${C.success}, #34D399)`,
                    boxShadow: `0 4px 12px ${C.success}40`,
                  }}>
                    <ShieldCheck size={11} strokeWidth={2.5} />
                    Certified
                  </span>

                  {/* Year + fuel overlaid */}
                  <p className="absolute bottom-3 left-4 z-[3] text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {car.year} &middot; {car.fuel}
                  </p>
                </div>

                <div className="p-4 relative z-[3]">
                  <h3 className="text-[15px] md:text-base font-bold text-white leading-tight">{car.name}</h3>
                  <p className="text-base md:text-lg font-extrabold mt-3" style={{ color: C.accent, fontFamily: "Space Grotesk, sans-serif" }}>{car.priceDisplay || `\u20B9${(car.price / 100000).toFixed(1)} Lakh`}</p>

                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.glassBorder}` }}>
                    <p className="text-[11px] font-medium" style={{ color: C.muted }}>{car.km} &middot; {car.location || selectedCity}</p>
                    <span className="flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0" style={{ color: C.success }}>
                      View <ArrowRight size={12} strokeWidth={2.5} />
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
          {[
            { href: "/sell-car", icon: Tag, title: "Sell Your Car", desc: "AI valuation in 30 seconds", color: C.accent },
            { href: "/concierge", icon: Bot, title: "AI Concierge", desc: "Tell us your needs, AI finds your match", color: C.primaryLight },
            { href: "/compare", icon: ArrowLeftRight, title: "Compare Cars", desc: "Side-by-side specs comparison", color: C.success },
          ].map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              className="group cb-cta-card p-5 md:p-6 active:scale-[0.98]"
            >
              {/* Ambient glow orb */}
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]" style={{ background: `radial-gradient(circle, ${cta.color}, transparent)` }} />
              {/* Bottom edge glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${cta.color}40, transparent)` }} />

              <div className="relative flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${cta.color}15, ${cta.color}08)`,
                    border: `1px solid ${cta.color}20`,
                    boxShadow: `0 0 0 0 ${cta.color}00`,
                  }}
                >
                  <cta.icon size={22} strokeWidth={1.8} style={{ color: cta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{cta.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>{cta.desc}</p>
                </div>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-105"
                  style={{ background: `${cta.color}10`, border: `1px solid ${cta.color}15` }}
                >
                  <ArrowRight size={16} strokeWidth={2} style={{ color: cta.color }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── QUICK LINKS ─── */}
      <section className="px-4 md:px-0 mb-10 md:mb-14">
        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold mr-1" style={{ color: C.dim }}>Explore</span>
          {[
            { label: "EMI Calculator", href: "/car-loan/emi-calculator", icon: Calculator },
            { label: "Fuel Prices", href: "/fuel-price", icon: Fuel },
            { label: "Car Insurance", href: "/car-insurance", icon: Shield },
            { label: "Car Loan", href: "/car-loan", icon: Landmark },
            { label: "Upcoming Cars", href: "/upcoming-cars", icon: Calendar },
            { label: "Electric Cars", href: "/electric-cars", icon: Zap },
            { label: "Find Dealers", href: "/dealers", icon: Store },
            { label: "Car News", href: "/car-news", icon: Newspaper },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
              style={{ color: C.muted, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.glassBorder}` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = C.glassBorder; }}
            >
              <link.icon size={13} strokeWidth={2} />
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
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primaryLight}, #60A5FA)` }}>
                  <Gem size={13} strokeWidth={2.5} className="text-white" />
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
