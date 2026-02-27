"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const VIDEOS: Record<string, { title: string; date: string; views: string; description: string }> = {
  v1: {
    title: "Tata Nexon Facelift 2025 — Full Review",
    date: "Feb 15, 2026",
    views: "1.2M",
    description:
      "We take the all-new Tata Nexon Facelift for a thorough test drive. In this video we cover the updated exterior design, refreshed cabin, new infotainment system, improved ride quality, and the updated turbo-petrol and diesel powertrains. Is the 2025 Nexon still the best compact SUV in India? Watch to find out.",
  },
  v2: {
    title: "Hyundai Creta vs Kia Seltos — Which One to Buy?",
    date: "Feb 10, 2026",
    views: "856K",
    description:
      "The sibling rivalry continues! We compare the 2025 Hyundai Creta and the Kia Seltos across design, features, performance, ride comfort, and value for money. Both share the same platform, but which one is right for you?",
  },
  v3: {
    title: "5 Things to Check Before Buying a Used Car",
    date: "Feb 5, 2026",
    views: "2.1M",
    description:
      "Buying a used car can save you lakhs, but only if you avoid common pitfalls. In this guide we walk you through the five most critical checks: service history verification, body panel inspection, engine health, electrical systems, and legal documentation.",
  },
};

const RELATED = [
  { id: "v4", title: "Maruti Brezza vs Tata Nexon — Best Compact SUV?", duration: "16:20", views: "640K" },
  { id: "v5", title: "Mahindra XUV700 Long-Term Ownership Review", duration: "22:10", views: "1.8M" },
  { id: "v6", title: "How to Negotiate the Best Price at a Dealership", duration: "11:55", views: "3.4M" },
];

export default function VideoDetailPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = use(params);

  const video = VIDEOS[videoId] || {
    title: "Car Video",
    date: "Feb 2026",
    views: "10K",
    description: "Watch this detailed car video covering the latest in the Indian automotive market. From specifications and pricing to real-world performance, we cover everything you need to know.",
  };

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/videos"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1 truncate">Video</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Video player placeholder */}
        <div
          className="w-full aspect-video rounded-2xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.15), rgba(99,102,241,0.1))" }}
        >
          <MaterialIcon name="play_circle" className="text-[72px] text-white/25" />
        </div>

        {/* Video info */}
        <div>
          <h2 className="text-lg font-bold text-white leading-snug">{video.title}</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <MaterialIcon name="calendar_today" className="text-[13px] text-slate-500" />
              <span className="text-xs text-slate-500">{video.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MaterialIcon name="visibility" className="text-[13px] text-slate-500" />
              <span className="text-xs text-slate-500">{video.views} views</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-sm text-slate-400 leading-relaxed">{video.description}</p>
        </div>

        {/* Related Videos */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Related Videos
          </p>
          <div className="space-y-3">
            {RELATED.map((rv) => (
              <Link
                key={rv.id}
                href={`/videos/${rv.id}`}
                className="flex gap-3 p-3 rounded-2xl border border-white/5 transition-all active:scale-[0.99]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-28 h-20 rounded-xl flex items-center justify-center shrink-0 relative"
                  style={{ background: "linear-gradient(135deg, rgba(17,82,212,0.15), rgba(99,102,241,0.1))" }}
                >
                  <MaterialIcon name="play_circle" className="text-[32px] text-white/25" />
                  <span
                    className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                  >
                    {rv.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">{rv.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <MaterialIcon name="visibility" className="text-[11px] text-slate-600" />
                    <span className="text-[10px] text-slate-600">{rv.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
