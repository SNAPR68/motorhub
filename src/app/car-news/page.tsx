"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const CATEGORIES = ["All", "Launches", "Reviews", "EV", "Comparison", "Price Drops", "Industry"];

const NEWS = [
  {
    id: 1,
    title: "Tata Nexon facelift launched at ₹8.1L",
    category: "Launches",
    timeAgo: "2 hours ago",
    readTime: "4 min read",
    views: "12.4K",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(217,119,6,0.15))",
    icon: "rocket_launch",
  },
  {
    id: 2,
    title: "Top 5 SUVs under ₹15 lakh in 2025",
    category: "Reviews",
    timeAgo: "1 day ago",
    readTime: "7 min read",
    views: "34.2K",
    gradient: "linear-gradient(135deg, rgba(17,82,212,0.2), rgba(99,102,241,0.15))",
    icon: "star",
  },
  {
    id: 3,
    title: "Maruti Swift 2025 first drive review",
    category: "Reviews",
    timeAgo: "2 days ago",
    readTime: "5 min read",
    views: "28.7K",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
    icon: "drive_eta",
  },
  {
    id: 4,
    title: "EV sales cross 1 lakh mark in India",
    category: "EV",
    timeAgo: "3 days ago",
    readTime: "3 min read",
    views: "41.8K",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.15))",
    icon: "bolt",
  },
  {
    id: 5,
    title: "Hyundai Creta vs Kia Seltos: Which to buy?",
    category: "Comparison",
    timeAgo: "4 days ago",
    readTime: "6 min read",
    views: "52.1K",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.12))",
    icon: "compare_arrows",
  },
  {
    id: 6,
    title: "Price hike: Toyota raises Fortuner price by ₹1.2L",
    category: "Price Drops",
    timeAgo: "5 days ago",
    readTime: "2 min read",
    views: "19.3K",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(220,38,38,0.1))",
    icon: "trending_up",
  },
];

const TRENDING = [
  { id: 1, title: "Best diesel cars 2025", timeAgo: "1h ago" },
  { id: 2, title: "Maruti Suzuki discount offers", timeAgo: "3h ago" },
  { id: 3, title: "India auto expo 2026 preview", timeAgo: "5h ago" },
];

const CATEGORY_COLOR: Record<string, { bg: string; color: string }> = {
  Launches: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
  Reviews: { bg: "rgba(17,82,212,0.12)", color: "#60a5fa" },
  EV: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
  Comparison: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
  "Price Drops": { bg: "rgba(239,68,68,0.1)", color: "#f87171" },
  Industry: { bg: "rgba(139,92,246,0.12)", color: "#a78bfa" },
};

export default function CarNewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? NEWS : NEWS.filter((n) => n.category === activeCategory);

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
          <h1 className="text-base font-bold text-white flex-1">Car News</h1>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl relative"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="notifications" className="text-[20px] text-slate-400" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#ef4444" }}
            />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#94a3b8",
                  border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* News Cards */}
        <div className="space-y-3">
          {filtered.map((article) => {
            const catStyle = CATEGORY_COLOR[article.category] || { bg: "rgba(255,255,255,0.08)", color: "#94a3b8" };
            return (
              <Link
                key={article.id}
                href={`/car-news/${article.id}`}
                className="flex gap-3 p-3 rounded-2xl border border-white/5 transition-all active:scale-[0.99]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {/* Image placeholder */}
                <div
                  className="w-24 h-20 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                  style={{ background: article.gradient }}
                >
                  <MaterialIcon name={article.icon} className="text-[32px] text-white/25" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: catStyle.bg, color: catStyle.color }}
                  >
                    {article.category}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1.5 leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-600">{article.timeAgo}</span>
                    <span className="text-[10px] text-slate-700">·</span>
                    <span className="text-[10px] text-slate-600">{article.readTime}</span>
                    <span className="text-[10px] text-slate-700">·</span>
                    <MaterialIcon name="visibility" className="text-[11px] text-slate-600" />
                    <span className="text-[10px] text-slate-600">{article.views}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Trending section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Trending Now</p>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {TRENDING.map((item) => (
              <Link
                key={item.id}
                href={`/car-news/${item.id}`}
                className="flex-shrink-0 w-44 p-3 rounded-xl border border-white/5 transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="h-20 rounded-lg flex items-center justify-center mb-2"
                  style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.15), rgba(99,102,241,0.1))" }}
                >
                  <MaterialIcon name="trending_up" className="text-[28px] text-white/15" />
                </div>
                <p className="text-xs font-semibold text-white leading-snug">{item.title}</p>
                <p className="text-[10px] text-slate-600 mt-1">{item.timeAgo}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
