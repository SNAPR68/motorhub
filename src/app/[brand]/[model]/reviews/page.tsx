"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel, type ApiCarModelDetail } from "@/lib/api";

/* ─── Rating distribution ─── */
const RATING_DIST = [
  { stars: 5, pct: 45 },
  { stars: 4, pct: 30 },
  { stars: 3, pct: 15 },
  { stars: 2, pct: 7 },
  { stars: 1, pct: 3 },
];

/* ─── Expert reviews ─── */
const EXPERT_REVIEWS = [
  {
    title: "A solid all-rounder",
    rating: 4.5,
    author: "Autovinci Expert Team",
    date: "Jan 2026",
    pros: [
      "Refined and peppy engine with good low-end torque",
      "Best-in-class boot space and rear legroom",
      "Feature-rich even in mid-variants",
    ],
    cons: [
      "Rear seat could use better under-thigh support",
      "No diesel powertrain option available",
    ],
    verdict:
      "An excellent everyday companion that balances comfort, features, and running costs better than most in its segment. Highly recommended for families and first-time buyers alike.",
  },
  {
    title: "Best in class safety",
    rating: 4.0,
    author: "Autovinci Safety Lab",
    date: "Dec 2025",
    pros: [
      "6 airbags standard across all variants",
      "5-star GNCAP crash test rating with strong adult protection",
    ],
    cons: [
      "ESC not available on base variant",
      "No Level 2 ADAS — expected at this price point",
    ],
    verdict:
      "Sets a new safety benchmark for the segment. The structural rigidity and passive safety package are genuinely impressive. A few active safety omissions keep it from a perfect score.",
  },
];

/* ─── User reviews ─── */
const USER_REVIEWS = [
  {
    name: "Rahul M.",
    city: "Bengaluru",
    rating: 5,
    date: "Feb 2026",
    text: "Brilliant car for the price. Fuel economy is exactly as advertised, and the cabin is surprisingly quiet on the highway.",
    helpful: 42,
    verified: true,
  },
  {
    name: "Priya S.",
    city: "Mumbai",
    rating: 4,
    date: "Jan 2026",
    text: "Good overall but the infotainment lags occasionally. Build quality and ride comfort are top notch though.",
    helpful: 28,
    verified: true,
  },
  {
    name: "Arun K.",
    city: "Chennai",
    rating: 4,
    date: "Dec 2025",
    text: "Spacious, safe, and practical. Perfect for my family of four. Service costs are very reasonable compared to competition.",
    helpful: 19,
    verified: false,
  },
];

const TABS = ["Expert Reviews", "User Reviews"] as const;

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <MaterialIcon
          key={i}
          name={i < Math.floor(rating) ? "star" : i < rating ? "star_half" : "star_border"}
          className={`text-[${size}px]`}
          style={{ color: i < rating ? "#f59e0b" : "#374151", fontSize: `${size}px` }}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Expert Reviews");

  useEffect(() => {
    setLoading(true);
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => setCar(res.model))
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
  }, [brandSlug, modelSlug]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── 404 state ── */
  if (!car) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Model not found</p>
          <Link href="/new-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse New Cars
          </Link>
        </div>
      </div>
    );
  }

  const overallRating = 4.3;
  const totalRatings = 342;

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/${brandSlug}/${modelSlug}`} className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{car.brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} Reviews</h1>
          </div>
        </div>
      </header>

      {/* ─── OVERALL RATING HERO ─── */}
      <div className="max-w-lg mx-auto px-4 py-5 border-b border-white/5">
        <div className="flex items-center gap-5">
          {/* Big number */}
          <div className="text-center shrink-0">
            <p className="text-4xl font-black text-white leading-none">{overallRating}</p>
            <StarRating rating={overallRating} size={16} />
            <p className="text-[10px] text-slate-500 mt-1">{totalRatings} ratings</p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {RATING_DIST.map((d) => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-5 text-right font-medium">{d.stars}★</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${d.pct}%`,
                      background: d.stars >= 4 ? "#10b981" : d.stars === 3 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
                <span className="text-[10px] text-slate-600 w-7 font-medium">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="sticky top-14 z-30 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
              style={{
                borderColor: activeTab === tab ? "#1152d4" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ── Expert Reviews ── */}
        {activeTab === "Expert Reviews" &&
          EXPERT_REVIEWS.map((review) => (
            <div
              key={review.title}
              className="rounded-2xl border border-white/5 p-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{review.title}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{review.author} · {review.date}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg shrink-0" style={{ background: "rgba(245,158,11,0.1)" }}>
                  <MaterialIcon name="star" className="text-[14px]" style={{ color: "#f59e0b" }} />
                  <span className="text-xs font-bold text-amber-400">{review.rating}</span>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-3">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">Pros</p>
                {review.pros.map((p) => (
                  <div key={p} className="flex items-start gap-2 mb-1">
                    <MaterialIcon name="add_circle" className="text-[13px] text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-300">{p}</span>
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="mb-3">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5">Cons</p>
                {review.cons.map((c) => (
                  <div key={c} className="flex items-start gap-2 mb-1">
                    <MaterialIcon name="remove_circle" className="text-[13px] text-red-500 mt-0.5 shrink-0" />
                    <span className="text-[11px] text-slate-300">{c}</span>
                  </div>
                ))}
              </div>

              {/* Verdict */}
              <div className="rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verdict</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">{review.verdict}</p>
              </div>
            </div>
          ))
        }

        {/* ── User Reviews ── */}
        {activeTab === "User Reviews" && (
          <>
            {USER_REVIEWS.map((review) => (
              <div
                key={review.name}
                className="rounded-2xl border border-white/5 p-4"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: "#1152d4" }}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-white">{review.name}</p>
                        {review.verified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                            <MaterialIcon name="verified" className="text-[10px]" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{review.city} · {review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size={12} />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">{review.text}</p>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <MaterialIcon name="thumb_up" className="text-[12px]" />
                  <span>{review.helpful} found this helpful</span>
                </div>
              </div>
            ))}

            {/* Write a Review CTA */}
            <button
              className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="rate_review" className="text-[18px]" />
              Write a Review
            </button>
          </>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
