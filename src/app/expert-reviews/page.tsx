"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const FILTERS = ["All", "SUV", "Sedan", "Hatchback", "EV", "Upcoming"];

const REVIEWS = [
  {
    id: 1,
    car: "Hyundai Creta 2024",
    score: 8.2,
    verdict: "Redefining the mid-size SUV segment",
    author: "Priya Sharma",
    role: "Auto Journalist",
    date: "3 days ago",
    readTime: "8 min read",
    category: "SUV",
    gradient: "linear-gradient(135deg, rgba(17,82,212,0.2), rgba(59,130,246,0.12))",
  },
  {
    id: 2,
    car: "Tata Nexon EV",
    score: 8.7,
    verdict: "Best electric SUV under ₹20L",
    author: "Rahul Verma",
    role: "EV Specialist",
    date: "5 days ago",
    readTime: "6 min read",
    category: "EV",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.12))",
  },
  {
    id: 3,
    car: "Maruti Swift 2024",
    score: 8.9,
    verdict: "Still the benchmark hatchback",
    author: "Ankit Joshi",
    role: "Road Test Editor",
    date: "1 week ago",
    readTime: "5 min read",
    category: "Hatchback",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))",
  },
  {
    id: 4,
    car: "Kia Seltos 2024",
    score: 8.0,
    verdict: "Feature-loaded but has its quirks",
    author: "Deepa Nair",
    role: "Senior Reviewer",
    date: "2 weeks ago",
    readTime: "7 min read",
    category: "SUV",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.08))",
  },
  {
    id: 5,
    car: "Toyota Fortuner GR Sport",
    score: 8.4,
    verdict: "More exciting than ever",
    author: "Kunal Mehta",
    role: "Performance Editor",
    date: "3 weeks ago",
    readTime: "9 min read",
    category: "SUV",
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(99,102,241,0.12))",
  },
];

const SCORE_COLOR = (score: number) => {
  if (score >= 8.5) return "#34d399";
  if (score >= 7.5) return "#fbbf24";
  return "#f87171";
};

function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const fill = (score / 10) * circumference;
  const color = SCORE_COLOR(score);

  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${fill} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-black" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function ExpertReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? REVIEWS : REVIEWS.filter((r) => r.category === activeFilter);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Expert Reviews</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Featured Review */}
        <Link
          href="/expert-reviews/hyundai-creta-review"
          className="block rounded-2xl overflow-hidden border border-white/5 transition-all active:scale-[0.99]"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="h-44 relative flex flex-col items-start justify-end p-4"
            style={{
              background: "linear-gradient(135deg, rgba(17,82,212,0.25) 0%, rgba(99,102,241,0.15) 50%, rgba(8,10,15,0.6) 100%)",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <MaterialIcon name="directions_car" className="text-[80px] text-white/8" />
            </div>
            <span
              className="relative text-[10px] font-bold px-2.5 py-1 rounded-full mb-2"
              style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24" }}
            >
              Featured Review
            </span>
            <h2 className="relative text-base font-black text-white leading-snug">
              2025 Maruti Brezza: The Undisputed King?
            </h2>
          </div>
          <div className="p-4 flex items-center gap-3">
            <ScoreRing score={8.5} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, #1152d4, #4f8ef7)" }}
                >
                  VM
                </div>
                <p className="text-xs font-semibold text-white">Vikram Mehta</p>
                <span className="text-[10px] text-slate-600">·</span>
                <p className="text-[11px] text-slate-500">Senior Auto Editor</p>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-slate-600">1 day ago</span>
                <span className="text-[10px] text-slate-700">·</span>
                <span className="text-[10px] text-slate-600">10 min read</span>
              </div>
            </div>
            <MaterialIcon name="chevron_right" className="text-[20px] text-slate-700" />
          </div>
        </Link>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#94a3b8",
                  border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {filtered.map((review) => (
            <Link
              key={review.id}
              href={`/expert-reviews/${review.id}`}
              className="flex gap-3 p-4 rounded-2xl border border-white/5 transition-all active:scale-[0.99]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <ScoreRing score={review.score} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white">{review.car}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 italic">&quot;{review.verdict}&quot;</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #1152d4, #4f8ef7)" }}
                  >
                    {review.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-[11px] text-slate-500">{review.author}</span>
                  <span className="text-[10px] text-slate-700">·</span>
                  <span className="text-[10px] text-slate-600">{review.date}</span>
                  <span className="text-[10px] text-slate-700">·</span>
                  <span className="text-[10px] text-slate-600">{review.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
