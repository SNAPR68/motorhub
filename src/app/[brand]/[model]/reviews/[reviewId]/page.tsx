"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel } from "@/lib/api";
import type { ApiCarModelDetail } from "@/lib/api";

/* ─── Deterministic hash from string ─── */
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* ─── Seeded pseudo-random from hash ─── */
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

/* ─── Format date from seed ─── */
function generateDate(seed: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const monthIdx = seed % 12;
  const day = (seed % 28) + 1;
  const year = 2025 + (seed % 2);
  return `${months[monthIdx]} ${day}, ${year}`;
}

/* ─── Expert reviewer names ─── */
const EXPERT_NAMES = [
  "Rajesh Sharma", "Ankit Verma", "Priya Mehta", "Siddharth Nair",
  "Kavita Iyer", "Vikram Deshmukh", "Neha Gupta", "Arjun Reddy",
];

/* ─── User reviewer names ─── */
const USER_NAMES = [
  "Amit P.", "Sunita R.", "Karthik M.", "Deepa S.",
  "Rohit K.", "Meera J.", "Suresh B.", "Ananya T.",
  "Vikas G.", "Pallavi N.", "Nikhil D.", "Shreya L.",
];

/* ─── Cities ─── */
const CITIES = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad",
  "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
];

/* ─── Variants driven ─── */
const VARIANTS_DRIVEN = [
  "ZXi+ AT", "VXi", "SX(O)", "HTX", "Creative", "Alpha",
  "GTX+", "Smart+", "Pure", "Delta", "EX", "Fearless",
];

/* ─── Category rating config ─── */
const CATEGORIES = [
  { label: "Comfort", icon: "weekend", color: "#8b5cf6" },
  { label: "Performance", icon: "speed", color: "#1152d4" },
  { label: "Mileage", icon: "local_gas_station", color: "#10b981" },
  { label: "Features", icon: "settings_suggest", color: "#f59e0b" },
  { label: "Value for Money", icon: "currency_rupee", color: "#ec4899" },
];

/* ─── Build review data from params ─── */
function buildReviewData(
  reviewId: string,
  brandSlug: string,
  modelSlug: string,
  brandName: string,
  modelName: string,
  fullName: string,
) {
  const seed = hashCode(reviewId);
  const isExpert = reviewId.includes("expert");

  // Rating: 3.5 to 5.0 range in 0.5 steps
  const ratingSteps = [3.5, 4.0, 4.0, 4.5, 4.5, 4.5, 5.0];
  const overallRating = ratingSteps[seed % ratingSteps.length];

  // Reviewer info
  const reviewerName = isExpert
    ? EXPERT_NAMES[seed % EXPERT_NAMES.length]
    : USER_NAMES[seed % USER_NAMES.length];
  const reviewerOrg = isExpert ? "Autovinci Expert Team" : undefined;
  const reviewerCity = !isExpert ? CITIES[seed % CITIES.length] : undefined;
  const date = generateDate(seed);

  // Variant driven
  const variantDriven = VARIANTS_DRIVEN[seed % VARIANTS_DRIVEN.length];
  const kmDriven = isExpert
    ? `${((seed % 8) + 2) * 500} km`
    : `${((seed % 30) + 5) * 1000} km`;

  // Category ratings
  const categoryRatings = CATEGORIES.map((cat, i) => {
    const base = overallRating;
    const offset = seededRandom(seed, i + 10) * 1.0 - 0.5;
    const raw = base + offset;
    const clamped = Math.max(2.5, Math.min(5.0, raw));
    return {
      ...cat,
      score: Math.round(clamped * 10) / 10,
    };
  });

  // Pros
  const allPros = [
    `Refined engine delivers smooth power across the rev range`,
    `Cabin materials feel premium and well-finished for the ${modelName} segment`,
    `Suspension soaks up bumps effectively on Indian roads`,
    `Infotainment system is responsive with wireless Android Auto and CarPlay`,
    `Safety package is comprehensive with 6 airbags across variants`,
    `Spacious rear seat with generous legroom and headroom`,
    `Boot space is practical and well-shaped for daily use`,
    `Low NVH levels make highway cruising effortless`,
    `Climate control cools the cabin quickly even in peak summer`,
    `LED headlamps provide excellent illumination at night`,
  ];
  const proStart = seed % 4;
  const pros = allPros.slice(proStart, proStart + 4);

  // Cons
  const allCons = [
    `Rear AC vents could be more powerful for the second row`,
    `Tyre size feels undersized for the ${modelName}'s weight`,
    `No wireless charging pad in the mid variants`,
    `Turning radius is on the wider side for tight city lanes`,
    `Music system bass response is average without aftermarket upgrades`,
    `Ground clearance could be better for unpaved roads`,
    `No ventilated seats available even on the top variant`,
    `Fuel tank capacity limits highway range between fills`,
  ];
  const conStart = seed % 3;
  const cons = allCons.slice(conStart, conStart + 3);

  // Helpful counts
  const thumbsUp = 24 + (seed % 120);
  const thumbsDown = 3 + (seed % 18);

  // Overall impression paragraphs
  const impressionParagraphs = [
    `The ${fullName} has been one of the most anticipated models in its segment, and after spending quality time with it, we can say it largely lives up to the hype. From the moment you approach the car, the ${brandName} design language is evident — sharp lines, purposeful stance, and a modern face that stands out in traffic. The build quality is evident when you close the doors — a solid, reassuring thunk that suggests attention to detail in manufacturing.`,
    `On the road, the ${modelName} feels planted and composed. The suspension has been tuned for Indian conditions, handling everything from speed breakers to potholed stretches with commendable poise. The steering is well-weighted — light enough for city driving yet firms up nicely at highway speeds, inspiring confidence during lane changes. Whether navigating through busy morning traffic or cruising on the expressway, the ${modelName} delivers a driving experience that feels a class above its price point.`,
    `Where the ${modelName} truly impresses is in its feature list. The cabin is loaded with technology that makes daily commuting more enjoyable and long drives less fatiguing. The ${brandName} team has clearly listened to customer feedback, addressing previous pain points while adding new features that competitors in this price range simply do not offer. For families, first-time buyers, and even enthusiasts looking for a practical daily, the ${fullName} deserves a serious look.`,
  ];

  // Verdict
  const verdictText = overallRating >= 4.5
    ? `The ${fullName} is an outstanding choice in its segment. It excels in comfort, features, and driving dynamics, making it easy to recommend to anyone shopping in this price bracket. A few minor niggles aside, this is a car that punches well above its weight and sets a new benchmark. One of the best in class, period.`
    : overallRating >= 4.0
    ? `The ${fullName} delivers a well-rounded package that balances style, practicality, and value. While it is not without a few compromises, the overall ownership experience is rewarding. It competes strongly against established rivals and offers enough differentiation to justify its positioning. A solid buy for most use cases.`
    : `The ${fullName} is a competent offering that gets the basics right. It serves its purpose well for daily commuting and occasional highway trips. However, in a fiercely competitive segment, a few areas feel like missed opportunities. Worth considering, especially if the ${brandName} service network is strong in your city.`;

  // Related reviews
  const relatedReviewIds = [
    isExpert ? "user-review-1" : "expert-review-1",
    `review-${(seed + 3) % 100}`,
    `expert-long-term-${(seed + 7) % 50}`,
  ];
  const relatedReviewNames = [
    isExpert ? USER_NAMES[(seed + 2) % USER_NAMES.length] : EXPERT_NAMES[(seed + 1) % EXPERT_NAMES.length],
    USER_NAMES[(seed + 5) % USER_NAMES.length],
    EXPERT_NAMES[(seed + 3) % EXPERT_NAMES.length],
  ];
  const relatedReviewTypes: ("Expert Review" | "User Review")[] = [
    isExpert ? "User Review" : "Expert Review",
    "User Review",
    "Expert Review",
  ];
  const relatedReviewRatings = [
    ratingSteps[(seed + 1) % ratingSteps.length],
    ratingSteps[(seed + 4) % ratingSteps.length],
    ratingSteps[(seed + 2) % ratingSteps.length],
  ];

  return {
    isExpert,
    overallRating,
    reviewerName,
    reviewerOrg,
    reviewerCity,
    date,
    variantDriven,
    kmDriven,
    categoryRatings,
    pros,
    cons,
    thumbsUp,
    thumbsDown,
    impressionParagraphs,
    verdictText,
    relatedReviews: relatedReviewIds.map((id, i) => ({
      id,
      reviewer: relatedReviewNames[i],
      type: relatedReviewTypes[i],
      rating: relatedReviewRatings[i],
    })),
  };
}

/* ─── Star Rating Component ─── */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <MaterialIcon
            key={i}
            name={filled ? "star" : half ? "star_half" : "star_border"}
            style={{
              color: filled || half ? "#f59e0b" : "#374151",
              fontSize: `${size}px`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Rating Bar Component ─── */
function RatingBar({
  label,
  icon,
  color,
  score,
}: {
  label: string;
  icon: string;
  color: string;
  score: number;
}) {
  const pct = (score / 5) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <MaterialIcon name={icon} style={{ color, fontSize: "16px" }} />
          <span className="text-xs text-white/70 font-medium">{label}</span>
        </div>
        <span className="text-xs font-bold text-white">
          {score.toFixed(1)}
          <span className="text-white/30 font-normal">/5</span>
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Page Component ─── */
export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ brand: string; model: string; reviewId: string }>;
}) {
  const { brand: brandSlug, model: modelSlug, reviewId } = use(params);
  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpfulState, setHelpfulState] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => {
        if (!cancelled) setCar(res.model);
      })
      .catch(() => {
        if (!cancelled) setCar(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
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
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "#080a0f" }}
      >
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Review not found</p>
          <Link
            href="/new-cars"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#1152d4" }}
          >
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse New Cars
          </Link>
        </div>
      </div>
    );
  }

  const review = buildReviewData(
    reviewId,
    brandSlug,
    modelSlug,
    car.brand.name,
    car.name,
    car.fullName,
  );

  const helpfulUp = review.thumbsUp + (helpfulState === "up" ? 1 : 0);
  const helpfulDown = review.thumbsDown + (helpfulState === "down" ? 1 : 0);

  return (
    <div
      className="min-h-dvh w-full pb-36"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/${brandSlug}/${modelSlug}/reviews`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              {car.brand.name}
            </p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">
              {car.name} Review
            </h1>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="share" className="text-[18px] text-slate-400" />
          </button>
        </div>
      </header>

      {/* ─── REVIEW HERO ─── */}
      <section className="max-w-lg mx-auto px-4 pt-5 pb-4">
        <div
          className="rounded-2xl border border-white/5 p-5 relative overflow-hidden"
          style={{
            background: review.isExpert
              ? "linear-gradient(135deg, rgba(17,82,212,0.12), rgba(255,255,255,0.02))"
              : "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(255,255,255,0.02))",
          }}
        >
          {/* Decorative circle */}
          <div
            className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
            style={{
              background: review.isExpert
                ? "rgba(17,82,212,0.08)"
                : "rgba(245,158,11,0.06)",
            }}
          />

          <div className="relative">
            {/* Review type badge */}
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 mb-3"
              style={{
                background: review.isExpert
                  ? "rgba(17,82,212,0.15)"
                  : "rgba(245,158,11,0.12)",
                color: review.isExpert ? "#6b9aff" : "#fbbf24",
              }}
            >
              {review.isExpert ? "Expert Review" : "User Review"}
            </span>

            {/* Reviewer info */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{
                  background: review.isExpert ? "#1152d4" : "#f59e0b",
                }}
              >
                {review.reviewerName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {review.reviewerName}
                </p>
                {review.reviewerOrg && (
                  <p className="text-[10px] text-slate-500">{review.reviewerOrg}</p>
                )}
                {review.reviewerCity && (
                  <p className="text-[10px] text-slate-500">{review.reviewerCity}</p>
                )}
                <p className="text-[10px] text-slate-500">{review.date}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={review.overallRating} size={18} />
              <span className="text-lg font-bold text-white">
                {review.overallRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">/ 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAR INFO BAR ─── */}
      <section className="max-w-lg mx-auto px-4 pb-4">
        <div
          className="rounded-xl border border-white/5 p-3 flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <MaterialIcon
            name="directions_car"
            className="text-[20px] text-slate-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {car.fullName}
            </p>
            <p className="text-[10px] text-slate-500">
              {review.variantDriven} variant
              <span className="mx-1.5">|</span>
              {review.kmDriven} driven
              <span className="mx-1.5">|</span>
              {car.fuelTypes[0]}
            </p>
          </div>
        </div>
      </section>

      {/* ─── OVERALL IMPRESSION ─── */}
      <section className="max-w-lg mx-auto px-4 pb-5">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <MaterialIcon
            name="article"
            className="text-[18px]"
            style={{ color: "#1152d4" }}
          />
          Overall Impression
        </h2>
        <div className="space-y-3">
          {review.impressionParagraphs.map((para, i) => (
            <p
              key={i}
              className="text-[13px] text-slate-400 leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ─── PROS ─── */}
      <section className="max-w-lg mx-auto px-4 pb-4">
        <div
          className="rounded-xl border p-4"
          style={{
            background: "rgba(16,185,129,0.04)",
            borderColor: "rgba(16,185,129,0.1)",
          }}
        >
          <h3 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: "#10b981" }}>
            <MaterialIcon name="thumb_up" className="text-[16px]" />
            What We Liked
          </h3>
          <div className="space-y-2.5">
            {review.pros.map((pro) => (
              <div key={pro} className="flex items-start gap-2.5">
                <MaterialIcon
                  name="check_circle"
                  className="text-[14px] mt-0.5 shrink-0"
                  style={{ color: "#10b981" }}
                />
                <span className="text-[12px] text-slate-300 leading-relaxed">
                  {pro}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONS ─── */}
      <section className="max-w-lg mx-auto px-4 pb-5">
        <div
          className="rounded-xl border p-4"
          style={{
            background: "rgba(239,68,68,0.04)",
            borderColor: "rgba(239,68,68,0.1)",
          }}
        >
          <h3 className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color: "#ef4444" }}>
            <MaterialIcon name="thumb_down" className="text-[16px]" />
            What Could Improve
          </h3>
          <div className="space-y-2.5">
            {review.cons.map((con) => (
              <div key={con} className="flex items-start gap-2.5">
                <MaterialIcon
                  name="cancel"
                  className="text-[14px] mt-0.5 shrink-0"
                  style={{ color: "#ef4444" }}
                />
                <span className="text-[12px] text-slate-300 leading-relaxed">
                  {con}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY RATINGS ─── */}
      <section className="max-w-lg mx-auto px-4 pb-5">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <MaterialIcon
            name="bar_chart"
            className="text-[18px]"
            style={{ color: "#1152d4" }}
          />
          Rating Breakdown
        </h2>
        <div
          className="rounded-xl border border-white/5 p-4 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {review.categoryRatings.map((cat) => (
            <RatingBar
              key={cat.label}
              label={cat.label}
              icon={cat.icon}
              color={cat.color}
              score={cat.score}
            />
          ))}
        </div>
      </section>

      {/* ─── VERDICT ─── */}
      <section className="max-w-lg mx-auto px-4 pb-5">
        <div
          className="rounded-2xl border border-white/5 p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(17,82,212,0.08), rgba(255,255,255,0.02))",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="gavel"
              className="text-[18px]"
              style={{ color: "#1152d4" }}
            />
            <h2 className="text-base font-bold text-white">Verdict</h2>
          </div>

          {/* Overall score badge */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="h-16 w-16 rounded-2xl flex flex-col items-center justify-center shrink-0"
              style={{
                background:
                  review.overallRating >= 4.5
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : review.overallRating >= 4.0
                    ? "linear-gradient(135deg, #1152d4, #0e44b5)"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              <span className="text-xl font-black text-white leading-none">
                {review.overallRating.toFixed(1)}
              </span>
              <span className="text-[8px] text-white/70 font-bold uppercase tracking-wider">
                {review.overallRating >= 4.5
                  ? "Excellent"
                  : review.overallRating >= 4.0
                  ? "Very Good"
                  : "Good"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">
                Overall Score
              </p>
              <StarRating rating={review.overallRating} size={14} />
            </div>
          </div>

          <p className="text-[13px] text-slate-400 leading-relaxed">
            {review.verdictText}
          </p>
        </div>
      </section>

      {/* ─── WAS THIS HELPFUL? ─── */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <div
          className="rounded-xl border border-white/5 p-4 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-xs font-semibold text-slate-400">
            Was this review helpful?
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHelpfulState(helpfulState === "up" ? null : "up")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                background:
                  helpfulState === "up"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(255,255,255,0.05)",
              }}
            >
              <MaterialIcon
                name="thumb_up"
                fill={helpfulState === "up"}
                className="text-[16px]"
                style={{
                  color: helpfulState === "up" ? "#10b981" : "#64748b",
                }}
              />
              <span
                className="text-xs font-bold"
                style={{
                  color: helpfulState === "up" ? "#10b981" : "#64748b",
                }}
              >
                {helpfulUp}
              </span>
            </button>
            <button
              onClick={() => setHelpfulState(helpfulState === "down" ? null : "down")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                background:
                  helpfulState === "down"
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,255,255,0.05)",
              }}
            >
              <MaterialIcon
                name="thumb_down"
                fill={helpfulState === "down"}
                className="text-[16px]"
                style={{
                  color: helpfulState === "down" ? "#ef4444" : "#64748b",
                }}
              />
              <span
                className="text-xs font-bold"
                style={{
                  color: helpfulState === "down" ? "#ef4444" : "#64748b",
                }}
              >
                {helpfulDown}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── RELATED REVIEWS ─── */}
      <section className="max-w-lg mx-auto px-4 pb-6">
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <MaterialIcon
            name="reviews"
            className="text-[18px]"
            style={{ color: "#1152d4" }}
          />
          More {car.name} Reviews
        </h2>
        <div className="space-y-3">
          {review.relatedReviews.map((rel) => (
            <Link
              key={rel.id}
              href={`/${brandSlug}/${modelSlug}/reviews/${rel.id}`}
              className="block rounded-xl border border-white/5 p-4 transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{
                      background:
                        rel.type === "Expert Review" ? "#1152d4" : "#f59e0b",
                    }}
                  >
                    {rel.reviewer.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {rel.reviewer}
                    </p>
                    <span
                      className="inline-block text-[9px] font-bold uppercase tracking-wider mt-0.5 px-1.5 py-0.5 rounded"
                      style={{
                        background:
                          rel.type === "Expert Review"
                            ? "rgba(17,82,212,0.12)"
                            : "rgba(245,158,11,0.1)",
                        color:
                          rel.type === "Expert Review" ? "#6b9aff" : "#fbbf24",
                      }}
                    >
                      {rel.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <MaterialIcon
                    name="star"
                    className="text-[14px]"
                    style={{ color: "#f59e0b" }}
                  />
                  <span className="text-xs font-bold text-white">
                    {rel.rating.toFixed(1)}
                  </span>
                  <MaterialIcon
                    name="chevron_right"
                    className="text-[18px] text-slate-600"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── VIEW ALL REVIEWS CTA ─── */}
      <section className="max-w-lg mx-auto px-4 pb-8">
        <Link
          href={`/${brandSlug}/${modelSlug}/reviews`}
          className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="rate_review" className="text-[18px]" />
          View All {car.name} Reviews
        </Link>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
