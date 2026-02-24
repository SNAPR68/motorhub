"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BLUR_DATA_URL, CRETA, SWIFT, NEXON_EV, XUV700, FORTUNER, SEDAN, KIA, BREZZA } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { VEHICLE_CATEGORIES } from "@/lib/constants";

const POPULAR_BRANDS = [
  { name: "Maruti", initial: "M", color: "#1152d4" },
  { name: "Hyundai", initial: "H", color: "#137fec" },
  { name: "Tata", initial: "T", color: "#1152d4" },
  { name: "Mahindra", initial: "M", color: "#137fec" },
  { name: "Honda", initial: "H", color: "#1152d4" },
  { name: "Toyota", initial: "T", color: "#137fec" },
  { name: "Kia", initial: "K", color: "#1152d4" },
  { name: "MG", initial: "MG", color: "#137fec" },
];

const BUDGETS = [
  { label: "Under ₹5L", value: "0-500000" },
  { label: "₹5L – 10L", value: "500000-1000000" },
  { label: "₹10L – 20L", value: "1000000-2000000" },
  { label: "₹20L+", value: "2000000-99999999" },
];

const TRUST_STATS = [
  { value: "50,000+", label: "Verified Cars" },
  { value: "2,500+", label: "Trusted Dealers" },
  { value: "15+", label: "Cities" },
  { value: "4.8★", label: "Rating" },
];

// Hero carousel images
const HERO_IMAGES = [CRETA, SWIFT, XUV700, FORTUNER];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);

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
    <div
      className="min-h-dvh w-full max-w-lg mx-auto pb-32"
      style={{ background: "#0a0c10", fontFamily: "'Noto Sans', sans-serif", color: "#e2e8f0" }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-5 h-14 border-b border-white/5"
        style={{ background: "rgba(10,12,16,0.92)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-2">
          <MaterialIcon name="token" className="text-[26px]" style={{ color: "#1152d4" }} />
          <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
            Autovinci
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/concierge"
            className="relative flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="smart_toy" className="text-[20px] text-slate-300" />
            <span
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
              style={{ background: "#10B981", borderColor: "#0a0c10" }}
            />
          </Link>
          <Link
            href="/login/buyer"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="person" className="text-[20px] text-slate-300" />
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative h-72 overflow-hidden">
        <Image
          src={HERO_IMAGES[heroIdx]}
          alt="Featured car"
          fill
          className="object-cover transition-all duration-700"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0c10 0%, rgba(10,12,16,0.4) 60%, rgba(10,12,16,0.2) 100%)" }} />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-1" style={{ color: "#1152d4" }}>
            Intelligence &amp; Elegance
          </p>
          <h1 className="text-2xl font-bold text-white leading-snug mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
            Find your perfect<br />used car in India
          </h1>

          {/* Dot nav */}
          <div className="flex gap-1.5 mb-4">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === heroIdx ? "20px" : "6px",
                  background: i === heroIdx ? "#1152d4" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="px-5 -mt-4 relative z-10 pb-5">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3.5 border"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <MaterialIcon name="search" className="text-[20px] text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by car name, brand..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white shrink-0 active:scale-95 transition-transform"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>

        {/* Quick tags */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-500 shrink-0">Popular:</span>
          {["Creta", "Swift", "Nexon EV", "XUV700", "Brezza"].map((car) => (
            <Link
              key={car}
              href={`/showroom?q=${car}`}
              className="shrink-0 rounded-full px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors border"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
            >
              {car}
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="mx-5 mb-6 rounded-xl px-4 py-3 border" style={{ background: "rgba(17,82,212,0.06)", borderColor: "rgba(17,82,212,0.15)" }}>
        <div className="grid grid-cols-4 gap-1">
          {TRUST_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Browse by Type</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#1152d4" }}>View all</Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {VEHICLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/showroom?category=${cat.value}`}
              className="flex flex-col items-center gap-2 rounded-xl p-3 border transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[11px] font-semibold text-slate-300">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED CARS ── */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <div>
            <h2 className="text-sm font-bold text-white">Featured Cars</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Hand-picked by our AI</p>
          </div>
          <Link href="/showroom" className="text-xs font-semibold flex items-center gap-0.5" style={{ color: "#1152d4" }}>
            See all <MaterialIcon name="chevron_right" className="text-[15px]" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 snap-x snap-mandatory">
          {vehicles.length > 0
            ? vehicles.map((v) => (
                <div key={v.id} className="w-[220px] shrink-0 snap-start">
                  <CarCard vehicle={v} />
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div key={i} className="w-[220px] shrink-0">
                  <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="aspect-[4/3] animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="p-3 space-y-2">
                      <div className="h-3.5 w-3/4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="h-3 w-1/2 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="h-4 w-2/3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Popular Brands</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {POPULAR_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/showroom?q=${brand.name}`}
              className="flex flex-col items-center gap-2 rounded-xl p-3 border transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(17,82,212,0.15)", border: "1px solid rgba(17,82,212,0.3)" }}
              >
                <span className="text-sm font-black" style={{ color: "#137fec" }}>{brand.initial}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BUDGET ── */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Shop by Budget</h2>
          <Link href="/showroom" className="text-xs font-semibold" style={{ color: "#1152d4" }}>See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BUDGETS.map((b) => (
            <Link
              key={b.value}
              href={`/showroom?price=${b.value}`}
              className="flex items-center gap-3 rounded-xl p-4 border transition-all active:scale-95 hover:border-blue-500/30"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
                style={{ background: "rgba(17,82,212,0.15)" }}
              >
                <MaterialIcon name="currency_rupee" className="text-[18px]" style={{ color: "#1152d4" }} />
              </div>
              <span className="text-xs font-bold text-slate-200">{b.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI CONCIERGE ── */}
      <section className="px-5 mb-6">
        <Link
          href="/concierge"
          className="flex items-start gap-4 rounded-2xl p-5 border transition-all active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, rgba(17,82,212,0.12) 0%, rgba(19,127,236,0.06) 100%)",
            borderColor: "rgba(17,82,212,0.25)",
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(17,82,212,0.2)" }}
          >
            <MaterialIcon name="smart_toy" className="text-[26px]" style={{ color: "#1152d4" }} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-1">AI Car Concierge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tell us your budget, city &amp; needs — AI finds your perfect match instantly.
            </p>
            <div className="flex items-center gap-1 mt-3 text-sm font-semibold" style={{ color: "#1152d4" }}>
              <span>Chat now</span>
              <MaterialIcon name="arrow_forward" className="text-[15px]" />
            </div>
          </div>
        </Link>
      </section>

      {/* ── DEALER / SELL CTA ── */}
      <section className="px-5 mb-6">
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-start gap-4 mb-5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <MaterialIcon name="sell" className="text-[26px] text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Sell Your Car</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Free listing, AI-enhanced photos, instant valuation &amp; thousands of buyers.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/login/dealer"
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-white font-bold text-sm transition-all active:scale-95"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="storefront" className="text-[18px]" />
              Dealer
            </Link>
            <Link
              href="/login/buyer"
              className="flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm transition-all active:scale-95 border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#e2e8f0" }}
            >
              <MaterialIcon name="person" className="text-[18px]" />
              Seller
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-5 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MaterialIcon name="token" className="text-[18px]" style={{ color: "rgba(17,82,212,0.6)" }} />
          <span className="text-sm font-bold text-slate-500">Autovinci</span>
        </div>
        <div className="flex justify-center gap-4 mb-3">
          {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Dealer Portal", href: "/dashboard" }].map((l) => (
            <Link key={l.href} href={l.href} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{l.label}</Link>
          ))}
        </div>
        <p className="text-[10px] text-slate-700">
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
      className="block rounded-xl overflow-hidden transition-all active:scale-[0.98]"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="220px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(10,12,16,0.9) 0%, transparent 100%)" }} />
        {vehicle.aiTag && (
          <div
            className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold text-white"
            style={{ background: "rgba(17,82,212,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(17,82,212,0.4)" }}
          >
            <MaterialIcon name="auto_awesome" className="text-[10px]" />
            AI Verified
          </div>
        )}
        {vehicle.badge && (
          <div className="absolute top-2.5 right-2.5 rounded-full px-2.5 py-1 text-[9px] font-bold text-white" style={{ background: "rgba(16,185,129,0.85)", backdropFilter: "blur(8px)" }}>
            {vehicle.badge}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-slate-500">
          {vehicle.year} · {vehicle.km} km · {vehicle.fuel}
        </p>
        <h3 className="text-sm font-bold text-white truncate">{vehicle.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-white">{vehicle.price}</span>
          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
            <MaterialIcon name="verified" className="text-[11px]" />
            {vehicle.aiScore}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5 truncate">
          <MaterialIcon name="location_on" className="text-[11px] align-text-bottom" /> {vehicle.location}
        </p>
      </div>
    </Link>
  );
}
