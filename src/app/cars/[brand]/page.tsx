"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Types ─── */
interface CarModel {
  name: string;
  price: string;
  img: string;
  type: "SUV" | "Sedan" | "Hatchback" | "EV" | "MPV" | "Coupe" | "Pickup";
  slug: string;
}

interface BrandMeta {
  tagline: string;
  color: string;
  accentColor: string;
  modelCount: number;
}

/* ─── Static Data ─── */
const BRAND_META: Record<string, BrandMeta> = {
  maruti: { tagline: "India's Most Trusted", color: "#16a34a", accentColor: "#4ade80", modelCount: 16 },
  hyundai: { tagline: "Drive Your Way", color: "#1152d4", accentColor: "#60a5fa", modelCount: 12 },
  tata: { tagline: "Built for India", color: "#1152d4", accentColor: "#60a5fa", modelCount: 10 },
  mahindra: { tagline: "Explore the Impossible", color: "#dc2626", accentColor: "#f87171", modelCount: 9 },
  honda: { tagline: "The Power of Dreams", color: "#dc2626", accentColor: "#f87171", modelCount: 7 },
  toyota: { tagline: "Let's Go Places", color: "#b45309", accentColor: "#fbbf24", modelCount: 8 },
  kia: { tagline: "Movement That Inspires", color: "#dc2626", accentColor: "#f87171", modelCount: 6 },
  volkswagen: { tagline: "Das Auto", color: "#1152d4", accentColor: "#60a5fa", modelCount: 6 },
  skoda: { tagline: "Simply Clever", color: "#16a34a", accentColor: "#4ade80", modelCount: 5 },
  bmw: { tagline: "Sheer Driving Pleasure", color: "#1152d4", accentColor: "#60a5fa", modelCount: 11 },
  audi: { tagline: "Vorsprung Durch Technik", color: "#9ca3af", accentColor: "#e5e7eb", modelCount: 10 },
  "mercedes-benz": { tagline: "The Best or Nothing", color: "#9ca3af", accentColor: "#e5e7eb", modelCount: 13 },
  ford: { tagline: "Built Ford Tough", color: "#1152d4", accentColor: "#60a5fa", modelCount: 5 },
  jeep: { tagline: "Go Anywhere. Do Anything.", color: "#16a34a", accentColor: "#4ade80", modelCount: 4 },
  mg: { tagline: "Emotion for Life", color: "#dc2626", accentColor: "#f87171", modelCount: 5 },
  byd: { tagline: "Build Your Dreams", color: "#1152d4", accentColor: "#60a5fa", modelCount: 4 },
  nissan: { tagline: "Innovation That Excites", color: "#dc2626", accentColor: "#f87171", modelCount: 5 },
};

const DEFAULT_META: BrandMeta = {
  tagline: "Drive the Difference",
  color: "#1152d4",
  accentColor: "#60a5fa",
  modelCount: 4,
};

const BRAND_MODELS: Record<string, CarModel[]> = {
  maruti: [
    { name: "Swift", price: "₹6.49L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "swift" },
    { name: "Brezza", price: "₹8.34L", img: "/api/placeholder/300/200", type: "SUV", slug: "brezza" },
    { name: "Baleno", price: "₹6.61L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "baleno" },
    { name: "Ertiga", price: "₹8.69L", img: "/api/placeholder/300/200", type: "MPV", slug: "ertiga" },
    { name: "Fronx", price: "₹7.51L", img: "/api/placeholder/300/200", type: "SUV", slug: "fronx" },
    { name: "Dzire", price: "₹6.89L", img: "/api/placeholder/300/200", type: "Sedan", slug: "dzire" },
  ],
  hyundai: [
    { name: "Creta", price: "₹11.11L", img: "/api/placeholder/300/200", type: "SUV", slug: "creta" },
    { name: "i20", price: "₹7.04L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "i20" },
    { name: "Venue", price: "₹7.94L", img: "/api/placeholder/300/200", type: "SUV", slug: "venue" },
    { name: "Tucson", price: "₹29.02L", img: "/api/placeholder/300/200", type: "SUV", slug: "tucson" },
    { name: "Verna", price: "₹10.90L", img: "/api/placeholder/300/200", type: "Sedan", slug: "verna" },
    { name: "Ioniq 5", price: "₹44.95L", img: "/api/placeholder/300/200", type: "EV", slug: "ioniq-5" },
  ],
  tata: [
    { name: "Nexon", price: "₹8.10L", img: "/api/placeholder/300/200", type: "SUV", slug: "nexon" },
    { name: "Punch", price: "₹6.00L", img: "/api/placeholder/300/200", type: "SUV", slug: "punch" },
    { name: "Harrier", price: "₹15.49L", img: "/api/placeholder/300/200", type: "SUV", slug: "harrier" },
    { name: "Altroz", price: "₹6.59L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "altroz" },
    { name: "Nexon EV", price: "₹14.49L", img: "/api/placeholder/300/200", type: "EV", slug: "nexon-ev" },
    { name: "Safari", price: "₹15.49L", img: "/api/placeholder/300/200", type: "SUV", slug: "safari" },
  ],
  mahindra: [
    { name: "Scorpio-N", price: "₹13.09L", img: "/api/placeholder/300/200", type: "SUV", slug: "scorpio-n" },
    { name: "Thar", price: "₹11.35L", img: "/api/placeholder/300/200", type: "SUV", slug: "thar" },
    { name: "XUV700", price: "₹13.99L", img: "/api/placeholder/300/200", type: "SUV", slug: "xuv700" },
    { name: "BE 6", price: "₹18.90L", img: "/api/placeholder/300/200", type: "EV", slug: "be-6" },
  ],
  honda: [
    { name: "City", price: "₹11.89L", img: "/api/placeholder/300/200", type: "Sedan", slug: "city" },
    { name: "Amaze", price: "₹8.10L", img: "/api/placeholder/300/200", type: "Sedan", slug: "amaze" },
    { name: "Elevate", price: "₹11.69L", img: "/api/placeholder/300/200", type: "SUV", slug: "elevate" },
    { name: "WR-V", price: "₹9.50L", img: "/api/placeholder/300/200", type: "SUV", slug: "wr-v" },
  ],
  toyota: [
    { name: "Fortuner", price: "₹33.43L", img: "/api/placeholder/300/200", type: "SUV", slug: "fortuner" },
    { name: "Innova Crysta", price: "₹19.77L", img: "/api/placeholder/300/200", type: "MPV", slug: "innova-crysta" },
    { name: "Urban Cruiser Hyryder", price: "₹10.73L", img: "/api/placeholder/300/200", type: "SUV", slug: "hyryder" },
    { name: "Glanza", price: "₹6.86L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "glanza" },
  ],
};

const COMPARISONS: Record<string, string[][]> = {
  maruti: [["Swift", "i20"], ["Brezza", "Venue"], ["Baleno", "i20 Active"]],
  hyundai: [["Creta", "Seltos"], ["i20", "Swift"], ["Venue", "Brezza"]],
  tata: [["Nexon", "Venue"], ["Punch", "WagonR"], ["Harrier", "Hector"]],
  default: [["Model A", "Model B"], ["Model C", "Model D"]],
};

const FILTER_TYPES = ["All", "SUV", "Sedan", "Hatchback", "EV", "MPV"] as const;
type FilterType = typeof FILTER_TYPES[number];

const TYPE_COLORS: Record<string, string> = {
  SUV: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Sedan: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Hatchback: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  EV: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  MPV: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Coupe: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  Pickup: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getDefaultModels(brandName: string): CarModel[] {
  return [
    { name: `${brandName} Model A`, price: "₹10.00L", img: "/api/placeholder/300/200", type: "SUV", slug: "model-a" },
    { name: `${brandName} Model B`, price: "₹12.50L", img: "/api/placeholder/300/200", type: "Sedan", slug: "model-b" },
    { name: `${brandName} Model C`, price: "₹8.00L", img: "/api/placeholder/300/200", type: "Hatchback", slug: "model-c" },
    { name: `${brandName} Model D`, price: "₹15.00L", img: "/api/placeholder/300/200", type: "SUV", slug: "model-d" },
  ];
}

/* ─── Page ─── */
export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
  const { brand } = use(params);

  const brandName = capitalize(brand);
  const meta = BRAND_META[brand.toLowerCase()] ?? DEFAULT_META;
  const models = BRAND_MODELS[brand.toLowerCase()] ?? getDefaultModels(brandName);
  const comparisons = COMPARISONS[brand.toLowerCase()] ?? COMPARISONS.default;

  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredModels = useMemo(() => {
    if (activeFilter === "All") return models;
    return models.filter((m) => m.type === activeFilter);
  }, [models, activeFilter]);

  const availableTypes = useMemo(() => {
    const types = new Set(models.map((m) => m.type));
    return FILTER_TYPES.filter((t) => t === "All" || types.has(t as CarModel["type"]));
  }, [models]);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/95 backdrop-blur border-b border-white/5 max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
        <Link href="/cars" className="p-2 rounded-full hover:bg-white/10 transition-colors -ml-2">
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </Link>
        <h1 className="font-semibold text-[17px] tracking-tight flex-1">{brandName}</h1>
        <Link href="/used-cars" className="text-xs text-[#60a5fa] font-medium hover:underline">
          Buy Used
        </Link>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Brand Hero */}
        <div
          className="mx-4 mt-5 rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${meta.color}18 0%, ${meta.color}08 100%)`,
            border: `1px solid ${meta.color}22`,
          }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: meta.color, filter: "blur(40px)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative flex items-center gap-5">
            {/* Large avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-[36px] font-black flex-shrink-0"
              style={{ backgroundColor: `${meta.color}20`, border: `2px solid ${meta.color}40`, color: meta.accentColor }}
            >
              {brandName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{brandName}</h2>
              <p style={{ color: meta.accentColor }} className="text-sm font-medium mt-0.5">
                {meta.tagline}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <MaterialIcon name="directions_car" className="text-[15px] text-slate-500" />
                <span className="text-xs text-slate-500">{meta.modelCount} models in India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 mt-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  activeFilter === type
                    ? "bg-[#1152d4] border-[#1152d4] text-white"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-[#1152d4]/50"
                }`}
              >
                {type}
                {type !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    {models.filter((m) => m.type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        <div className="px-4 mt-4 grid grid-cols-2 gap-3">
          {filteredModels.map((model) => (
            <Link
              key={model.slug}
              href={`/${brand}/${model.slug}`}
              className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-[#1152d4]/30 hover:bg-white/[0.05] transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] bg-white/5 overflow-hidden">
                <Image
                  src={model.img}
                  alt={model.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Type chip */}
                <div className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[model.type] ?? "text-slate-300 bg-white/10 border-white/20"}`}>
                  {model.type}
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-bold text-sm text-white group-hover:text-[#60a5fa] transition-colors truncate">
                  {model.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Starts at</p>
                <p className="font-black text-[15px] text-white mt-0.5">{model.price}</p>
              </div>
            </Link>
          ))}

          {filteredModels.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <MaterialIcon name="search_off" className="text-[40px] text-slate-700 mb-2" />
              <p className="text-slate-500 text-sm">No {activeFilter} models found</p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-2 text-xs text-[#60a5fa] hover:underline"
              >
                Show all models
              </button>
            </div>
          )}
        </div>

        {/* Popular Comparisons */}
        <div className="px-4 mt-7 mb-4">
          <h3 className="text-[14px] font-bold text-white mb-3 flex items-center gap-2">
            <MaterialIcon name="compare_arrows" className="text-[20px] text-[#1152d4]" />
            Popular Comparisons
          </h3>
          <div className="space-y-2">
            {comparisons.map(([a, b], idx) => (
              <Link
                key={idx}
                href={`/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 hover:border-[#1152d4]/30 transition-all group"
              >
                <span className="text-sm font-medium text-slate-300 flex-1 group-hover:text-white transition-colors">
                  {a} vs {b}
                </span>
                <MaterialIcon name="chevron_right" className="text-[18px] text-slate-600 group-hover:text-slate-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* View all used cars for this brand */}
        <div className="px-4 mb-2">
          <Link
            href={`/used-cars?brand=${brandName}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#1152d4]/30 text-[#60a5fa] text-sm font-semibold hover:bg-[#1152d4]/10 transition-colors"
          >
            <MaterialIcon name="directions_car" className="text-[18px]" />
            Browse Used {brandName} Cars
            <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
