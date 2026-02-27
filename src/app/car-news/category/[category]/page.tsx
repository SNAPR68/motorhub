"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatCategory(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const CATEGORY_ARTICLES: Record<string, { id: number; title: string; timeAgo: string; readTime: string; views: string; icon: string }[]> = {
  launch: [
    { id: 101, title: "Tata Curvv EV launched at Rs 17.49 lakh", timeAgo: "3 hours ago", readTime: "4 min", views: "14.2K", icon: "rocket_launch" },
    { id: 102, title: "Hyundai Alcazar facelift debuts with new design", timeAgo: "6 hours ago", readTime: "3 min", views: "9.8K", icon: "new_releases" },
    { id: 103, title: "Maruti Suzuki Dzire 2026 edition arrives", timeAgo: "1 day ago", readTime: "5 min", views: "22.1K", icon: "directions_car" },
    { id: 104, title: "Mahindra BE 6e revealed at Auto Expo", timeAgo: "2 days ago", readTime: "6 min", views: "31.4K", icon: "bolt" },
    { id: 105, title: "Toyota Urban Cruiser Taisor launched", timeAgo: "3 days ago", readTime: "3 min", views: "8.7K", icon: "rocket_launch" },
    { id: 106, title: "MG Windsor EV gets new variant at Rs 12.5L", timeAgo: "4 days ago", readTime: "4 min", views: "11.3K", icon: "new_releases" },
  ],
  reviews: [
    { id: 201, title: "Tata Nexon 2025: Comprehensive ownership review", timeAgo: "2 hours ago", readTime: "7 min", views: "18.5K", icon: "star" },
    { id: 202, title: "Hyundai Creta diesel: 6-month report card", timeAgo: "1 day ago", readTime: "6 min", views: "24.3K", icon: "drive_eta" },
    { id: 203, title: "Kia Seltos HTX+ turbo: Is it worth the premium?", timeAgo: "2 days ago", readTime: "5 min", views: "15.9K", icon: "star" },
    { id: 204, title: "Maruti Brezza CNG long-term review", timeAgo: "3 days ago", readTime: "8 min", views: "20.1K", icon: "drive_eta" },
    { id: 205, title: "Mahindra XUV700 AX7: 1-year experience", timeAgo: "4 days ago", readTime: "9 min", views: "33.7K", icon: "star" },
    { id: 206, title: "Skoda Kushaq Monte Carlo edition tested", timeAgo: "5 days ago", readTime: "5 min", views: "12.6K", icon: "drive_eta" },
  ],
  industry: [
    { id: 301, title: "India auto sales cross 4 million mark in FY26", timeAgo: "5 hours ago", readTime: "4 min", views: "41.2K", icon: "trending_up" },
    { id: 302, title: "FAME III subsidy: What it means for EV buyers", timeAgo: "1 day ago", readTime: "6 min", views: "28.9K", icon: "policy" },
    { id: 303, title: "Tata Motors and JLR post record quarterly profit", timeAgo: "2 days ago", readTime: "3 min", views: "19.4K", icon: "trending_up" },
    { id: 304, title: "New scrappage policy to boost used car market", timeAgo: "3 days ago", readTime: "5 min", views: "35.6K", icon: "recycling" },
    { id: 305, title: "Tesla India entry delayed to 2027: Report", timeAgo: "4 days ago", readTime: "3 min", views: "52.8K", icon: "public" },
    { id: 306, title: "Bharat NCAP crash test results for top 10 cars", timeAgo: "5 days ago", readTime: "7 min", views: "44.1K", icon: "shield" },
  ],
};

const DEFAULT_ARTICLES = [
  { id: 401, title: "Top 10 cars to look forward to in 2026", timeAgo: "1 day ago", readTime: "5 min", views: "26.3K", icon: "auto_awesome" },
  { id: 402, title: "Best family cars under Rs 15 lakh", timeAgo: "2 days ago", readTime: "6 min", views: "19.7K", icon: "family_restroom" },
  { id: 403, title: "Electric vs petrol: Running cost comparison", timeAgo: "3 days ago", readTime: "4 min", views: "31.5K", icon: "bolt" },
  { id: 404, title: "Top safety-rated cars in India right now", timeAgo: "4 days ago", readTime: "5 min", views: "22.8K", icon: "shield" },
  { id: 405, title: "Upcoming SUV launches this quarter", timeAgo: "5 days ago", readTime: "3 min", views: "14.1K", icon: "rocket_launch" },
  { id: 406, title: "How car prices have changed in 5 years", timeAgo: "6 days ago", readTime: "7 min", views: "17.9K", icon: "trending_up" },
];

export default function NewsByCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const label = formatCategory(category);
  const articles = CATEGORY_ARTICLES[category] || DEFAULT_ARTICLES;

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/car-news"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">{label} News</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/car-news/${article.id}`}
            className="flex gap-3 p-3 rounded-2xl border border-white/5 transition-all active:scale-[0.99]"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {/* Image placeholder */}
            <div
              className="w-24 h-20 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.15), rgba(99,102,241,0.1))" }}
            >
              <MaterialIcon name={article.icon} className="text-[28px] text-white/25" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 py-0.5">
              <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-slate-600">{article.timeAgo}</span>
                <span className="text-[10px] text-slate-700">.</span>
                <span className="text-[10px] text-slate-600">{article.readTime} read</span>
                <span className="text-[10px] text-slate-700">.</span>
                <MaterialIcon name="visibility" className="text-[11px] text-slate-600" />
                <span className="text-[10px] text-slate-600">{article.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
