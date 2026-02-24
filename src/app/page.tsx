"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { VehicleCard } from "@/components/VehicleCard";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { BLUR_DATA_URL, CRETA, SWIFT, NEXON_EV, XUV700, FORTUNER, SEDAN, KIA, BREZZA, resizeUrl } from "@/lib/car-images";
import { VEHICLE_CATEGORIES } from "@/lib/constants";

/* ── Featured brands for quick filter ── */
const POPULAR_BRANDS = [
  { name: "Maruti", icon: "directions_car", count: "12,400+" },
  { name: "Hyundai", icon: "directions_car", count: "8,200+" },
  { name: "Tata", icon: "directions_car", count: "6,800+" },
  { name: "Mahindra", icon: "directions_car", count: "4,500+" },
  { name: "Honda", icon: "directions_car", count: "3,900+" },
  { name: "Toyota", icon: "directions_car", count: "2,100+" },
];

/* ── Budget ranges ── */
const BUDGETS = [
  { label: "Under ₹5L", value: "0-500000", icon: "savings" },
  { label: "₹5L – 10L", value: "500000-1000000", icon: "account_balance_wallet" },
  { label: "₹10L – 20L", value: "1000000-2000000", icon: "payments" },
  { label: "₹20L+", value: "2000000-99999999", icon: "diamond" },
];

/* ── AI features for the platform section ── */
const AI_FEATURES = [
  { icon: "auto_fix_high", title: "AI Photo Enhance", desc: "Studio-quality car photos in one tap" },
  { icon: "smart_toy", title: "AI Concierge", desc: "Smart assistant for buyers & dealers" },
  { icon: "campaign", title: "Content Studio", desc: "Generate social posts & reels instantly" },
  { icon: "verified", title: "AI Inspection", desc: "Automated vehicle quality scoring" },
];

/* ── Trust stats ── */
const TRUST_STATS = [
  { value: "50,000+", label: "Verified Cars" },
  { value: "2,500+", label: "Trusted Dealers" },
  { value: "15+", label: "Cities" },
  { value: "4.8★", label: "User Rating" },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Fetch featured vehicles from the API
  const { data } = useApi(
    () => fetchVehicles({ limit: 6, status: "AVAILABLE" }),
    []
  );
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
      className="min-h-dvh w-full pb-28"
      style={{ background: "#0a0c10", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 border-b border-white/5" style={{ background: "rgba(10,12,16,0.92)", backdropFilter: "blur(16px)" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-2">
            <MaterialIcon name="token" className="text-[24px] text-primary" />
            <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
              Autovinci
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/concierge"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors relative"
            >
              <MaterialIcon name="smart_toy" className="text-[20px] text-slate-300" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0a0c10]" />
            </Link>
            <Link
              href="/login/buyer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <MaterialIcon name="person" className="text-[20px] text-slate-300" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto">
        {/* ═══ HERO SEARCH ═══ */}
        <section className="relative px-5 pt-8 pb-6">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

          <div className="relative">
            <h1 className="text-2xl font-bold text-white leading-snug mb-1">
              Find your perfect<br />
              <span className="text-primary">used car</span>
            </h1>
            <p className="text-sm text-slate-400 mb-5">
              India&apos;s AI-powered used car marketplace
            </p>

            {/* Search bar */}
            <div
              className="flex items-center gap-3 rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3.5 transition-all focus-within:border-primary/40 focus-within:bg-white/[0.08]"
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
                <button type="button" onClick={() => setSearch("")} className="text-slate-500 hover:text-white">
                  <MaterialIcon name="close" className="text-[18px]" />
                </button>
              )}
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shrink-0 active:scale-95 transition-transform"
              >
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </button>
            </div>

            {/* Quick links */}
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <span>Popular:</span>
              {["Creta", "Swift", "Nexon", "XUV700"].map((car) => (
                <Link
                  key={car}
                  href={`/showroom?q=${car}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                >
                  {car}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY PILLS ═══ */}
        <section className="px-5 pb-6">
          <div className="grid grid-cols-4 gap-3">
            {VEHICLE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/showroom?category=${cat.value}`}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/[0.04] border border-white/5 p-4 hover:bg-white/[0.07] hover:border-primary/20 transition-all active:scale-95"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-slate-300">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ TRUST STRIP ═══ */}
        <section className="px-5 pb-6">
          <div className="grid grid-cols-4 gap-2 rounded-xl bg-primary/[0.06] border border-primary/10 p-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-sm font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ BUDGET FILTER ═══ */}
        <section className="px-5 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Shop by Budget</h2>
            <Link href="/showroom" className="text-xs text-primary font-semibold flex items-center gap-1">
              View all <MaterialIcon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUDGETS.map((b) => (
              <Link
                key={b.value}
                href={`/showroom?price=${b.value}`}
                className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/5 p-4 hover:bg-white/[0.07] hover:border-primary/20 transition-all active:scale-95"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MaterialIcon name={b.icon} className="text-[20px] text-primary" />
                </div>
                <span className="text-sm font-semibold text-white">{b.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ FEATURED VEHICLES ═══ */}
        <section className="pb-8">
          <div className="flex items-center justify-between px-5 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Featured Cars</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hand-picked by our AI</p>
            </div>
            <Link href="/showroom" className="text-xs text-primary font-semibold flex items-center gap-1">
              See all <MaterialIcon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>

          {vehicles.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar snap-x snap-mandatory">
              {vehicles.map((v) => (
                <div key={v.id} className="w-[280px] shrink-0 snap-start">
                  <FeaturedCarCard vehicle={v} />
                </div>
              ))}
            </div>
          ) : (
            /* Skeleton while loading */
            <div className="flex gap-4 overflow-x-auto px-5 no-scrollbar">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-[280px] shrink-0">
                  <div className="aspect-[4/3] rounded-xl bg-white/5 animate-pulse" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ═══ POPULAR BRANDS ═══ */}
        <section className="px-5 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Popular Brands</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                href={`/showroom?q=${brand.name}`}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/[0.04] border border-white/5 p-4 hover:bg-white/[0.07] hover:border-primary/20 transition-all active:scale-95"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]">
                  <MaterialIcon name={brand.icon} className="text-[20px] text-slate-300" />
                </div>
                <span className="text-xs font-semibold text-white">{brand.name}</span>
                <span className="text-[10px] text-slate-500">{brand.count} cars</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ AI CONCIERGE TEASER ═══ */}
        <section className="px-5 pb-8">
          <Link
            href="/concierge"
            className="block rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 transition-all hover:border-primary/30 active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 shrink-0">
                <MaterialIcon name="smart_toy" className="text-[28px] text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">AI Car Concierge</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tell us what you need — budget, city, features — and our AI finds the best matches instantly.
                </p>
                <div className="flex items-center gap-2 mt-3 text-primary text-sm font-semibold">
                  <span>Chat now</span>
                  <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ═══ AI-POWERED PLATFORM FEATURES ═══ */}
        <section className="px-5 pb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">
              For Dealers
            </p>
            <h2 className="text-base font-bold text-white">AI-Powered Selling Tools</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AI_FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-white/[0.04] border border-white/5 p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <MaterialIcon name={f.icon} className="text-[18px] text-primary" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SELL YOUR CAR CTA ═══ */}
        <section className="px-5 pb-8">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 shrink-0">
                <MaterialIcon name="sell" className="text-[28px] text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">Sell Your Car</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  List your car for free. AI-enhanced photos, instant valuation, and reach thousands of buyers.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Link
                href="/login/dealer"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-white font-bold text-sm transition-all hover:bg-primary/90 active:scale-95"
              >
                <MaterialIcon name="storefront" className="text-[18px]" />
                I&apos;m a Dealer
              </Link>
              <Link
                href="/login/buyer"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-white/[0.08] border border-white/10 text-white font-bold text-sm transition-all hover:bg-white/[0.12] active:scale-95"
              >
                <MaterialIcon name="person" className="text-[18px]" />
                I&apos;m a Seller
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="px-5 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MaterialIcon name="token" className="text-[20px] text-primary/60" />
            <span className="text-sm font-bold text-slate-500">Autovinci</span>
          </div>
          <div className="flex justify-center gap-4 mb-3 text-xs text-slate-600">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
            <Link href="/dashboard" className="hover:text-slate-400 transition-colors">Dealer Portal</Link>
          </div>
          <p className="text-[10px] text-slate-700">
            &copy; 2026 Autovinci Technologies Pvt. Ltd. &bull; Bengaluru, India
          </p>
        </footer>
      </div>

      {/* Bottom Nav */}
      <BuyerBottomNav />
    </div>
  );
}

/* ── Featured Car Card (compact horizontal scroll variant) ── */
function FeaturedCarCard({ vehicle }: { vehicle: ReturnType<typeof adaptVehicle> }) {
  return (
    <Link
      href={`/vehicle/${vehicle.id}`}
      className="block rounded-xl overflow-hidden bg-white/[0.04] border border-white/5 transition-all hover:border-white/10 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="280px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        {vehicle.aiTag && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <MaterialIcon name="auto_awesome" className="text-[12px]" />
            AI Verified
          </div>
        )}
        {vehicle.badge && (
          <div className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {vehicle.badge}
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
          {vehicle.year} &bull; {vehicle.km} km &bull; {vehicle.fuel}
        </p>
        <h3 className="text-sm font-bold text-white truncate">{vehicle.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-bold text-white">{vehicle.price}</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <MaterialIcon name="verified" className="text-[12px]" />
            Score {vehicle.aiScore}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5">
          <MaterialIcon name="location_on" className="text-[11px] align-text-bottom" /> {vehicle.location}
        </p>
      </div>
    </Link>
  );
}
