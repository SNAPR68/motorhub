"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const TABS = ["All", "Reviews", "Comparisons", "Tips"] as const;

const VIDEOS = [
  {
    id: "v1",
    title: "Tata Nexon Facelift 2025 — Full Review",
    category: "Reviews",
    duration: "14:32",
    views: "1.2M",
    gradient: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(217,119,6,0.15))",
  },
  {
    id: "v2",
    title: "Hyundai Creta vs Kia Seltos — Which One to Buy?",
    category: "Comparisons",
    duration: "18:05",
    views: "856K",
    gradient: "linear-gradient(135deg, rgba(17,82,212,0.2), rgba(99,102,241,0.15))",
  },
  {
    id: "v3",
    title: "5 Things to Check Before Buying a Used Car",
    category: "Tips",
    duration: "9:47",
    views: "2.1M",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.15))",
  },
  {
    id: "v4",
    title: "Maruti Brezza vs Tata Nexon — Best Compact SUV?",
    category: "Comparisons",
    duration: "16:20",
    views: "640K",
    gradient: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.12))",
  },
  {
    id: "v5",
    title: "Mahindra XUV700 Long-Term Ownership Review",
    category: "Reviews",
    duration: "22:10",
    views: "1.8M",
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
  },
  {
    id: "v6",
    title: "How to Negotiate the Best Price at a Dealership",
    category: "Tips",
    duration: "11:55",
    views: "3.4M",
    gradient: "linear-gradient(135deg, rgba(234,179,8,0.18), rgba(217,119,6,0.12))",
  },
];

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");

  const filtered =
    activeTab === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === activeTab);

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
          <h1 className="text-base font-bold text-white flex-1">Car Videos</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#94a3b8",
                  border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Video cards */}
        <div className="space-y-3">
          {filtered.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="block rounded-2xl border border-white/5 overflow-hidden transition-all active:scale-[0.99]"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Thumbnail placeholder */}
              <div
                className="w-full h-44 flex items-center justify-center relative"
                style={{ background: video.gradient }}
              >
                <MaterialIcon name="play_circle" className="text-[56px] text-white/30" />
                <span
                  className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ background: "rgba(0,0,0,0.7)" }}
                >
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <MaterialIcon name="visibility" className="text-[12px] text-slate-500" />
                  <span className="text-[11px] text-slate-500">{video.views} views</span>
                  <span className="text-[11px] text-slate-700">|</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(17,82,212,0.12)", color: "#60a5fa" }}
                  >
                    {video.category}
                  </span>
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
