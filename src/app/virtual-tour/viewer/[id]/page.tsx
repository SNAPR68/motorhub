"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle } from "@/lib/api";

/* Stitch: ai_virtual_tour_viewer — #7311d4, Work Sans, #191022 */

const HOTSPOTS = [
  { x: 30, y: 40, label: "Dashboard", desc: "4K OLED Display", category: "TECHNOLOGY" },
  { x: 55, y: 55, label: "Steering", desc: "Touch-Sensitive Controls", category: "CONTROLS" },
  { x: 80, y: 65, label: "Upholstery", desc: "Hand-Stitched Nappa", category: "CRAFTSMANSHIP" },
];

const TAGS = [
  { icon: "info", label: "Dashboard", active: true },
  { icon: "check_circle", label: "Leather Quality", active: false },
  { icon: "surround_sound", label: "Audio Setup", active: false },
  { icon: "lightbulb", label: "Ambient Light", active: false },
];

export default function VirtualTourViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const { data: vehicleData } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = vehicleData?.vehicle;

  // Prefer panoramaImageIdx as the first shown, then all images, fallback to INTERIOR
  const rawImages: string[] = vehicle?.images?.length ? vehicle.images : [INTERIOR];
  const panoramaIdx = vehicle?.panoramaImageIdx ?? null;
  const images: string[] =
    panoramaIdx !== null && rawImages[panoramaIdx]
      ? [rawImages[panoramaIdx], ...rawImages.filter((_, i) => i !== panoramaIdx)]
      : rawImages;

  const bgImage = images[activeImg] ?? INTERIOR;
  const vehicleName = vehicle?.name ?? "Interior Experience";
  const backHref = `/virtual-tour/${id}`;

  return (
    <div
      className="relative flex h-dvh w-full max-w-md mx-auto flex-col overflow-hidden"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      {/* 360 Interior Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#191022]/40 via-transparent to-[#191022]/60" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-12 pb-4">
        <Link
          href={backHref}
          className="flex size-10 items-center justify-center rounded-full text-slate-100"
          style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
        >
          <MaterialIcon name="arrow_back" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-semibold tracking-widest uppercase text-white/90 truncate max-w-[180px]">
            {vehicleName}
          </h1>
          <p className="text-[10px] text-[#7311d4] font-medium uppercase tracking-[0.2em]">Interior Experience</p>
        </div>
        <button
          className="flex size-10 items-center justify-center rounded-full text-slate-100"
          style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
        >
          <MaterialIcon name="share" />
        </button>
      </header>

      {/* Interactive Hotspots */}
      <div className="relative flex-1 z-10 pointer-events-none">
        {HOTSPOTS.map((h, i) => (
          <div
            key={h.label}
            className="absolute pointer-events-auto"
            style={{ top: `${h.y}%`, left: `${h.x}%` }}
          >
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                className="size-6 bg-[#7311d4] rounded-full border-2 border-white/50"
                style={{
                  animation: activeHotspot !== i ? "hotspot-pulse 2s infinite" : "none",
                }}
              />
              {activeHotspot === i && (
                <div
                  className="absolute left-8 rounded-lg px-3 py-2 min-w-[140px] z-20"
                  style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
                >
                  <p className="text-[10px] text-[#7311d4] font-bold uppercase">{h.category}</p>
                  <p className="text-xs text-white">{h.desc}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Controls */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        <div
          className="flex flex-col rounded-xl overflow-hidden"
          style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
        >
          <button className="p-3 text-white hover:bg-white/10 transition-colors">
            <MaterialIcon name="add" />
          </button>
          <div className="h-px bg-white/10 mx-2" />
          <button className="p-3 text-white hover:bg-white/10 transition-colors">
            <MaterialIcon name="remove" />
          </button>
        </div>
        <button
          className="p-3 rounded-xl text-white"
          style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
        >
          <MaterialIcon name="explore" />
        </button>
      </div>

      {/* Photo thumbnail switcher — right rail */}
      {images.length > 1 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className="w-10 h-10 rounded-lg overflow-hidden border-2 transition-all"
              style={{ borderColor: activeImg === i ? "#7311d4" : "rgba(255,255,255,0.2)" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Bottom UI */}
      <div className="relative z-10 mt-auto px-4 pb-8 space-y-4">
        {/* Tags */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2">
          {TAGS.map((tag) => (
            <div
              key={tag.label}
              className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4"
              style={{
                background: tag.active ? "rgba(115,17,212,0.2)" : "rgba(25,16,34,0.6)",
                backdropFilter: "blur(12px)",
                border: tag.active ? "1px solid rgba(115,17,212,0.4)" : "1px solid rgba(115,17,212,0.2)",
              }}
            >
              <MaterialIcon name={tag.icon} className={`text-[18px] ${tag.active ? "text-[#7311d4]" : "text-slate-400"}`} />
              <p className="text-white text-xs font-medium">{tag.label}</p>
            </div>
          ))}
        </div>

        {/* AI Concierge */}
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex-1 rounded-2xl p-4"
            style={{ background: "rgba(25,16,34,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(115,17,212,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs text-slate-300 italic">
                &ldquo;{vehicle
                  ? `Explore the ${vehicle.name} interior in detail...`
                  : "Explore the dashboard to see the AI integration..."
                }&rdquo;
              </p>
            </div>
          </div>
          <Link
            href="/concierge"
            className="flex size-14 items-center justify-center rounded-full bg-[#7311d4] text-white shadow-xl shadow-[#7311d4]/30 active:scale-95 transition-transform ring-4 ring-[#7311d4]/20"
          >
            <MaterialIcon name="smart_toy" className="text-[28px]" />
          </Link>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav
        className="relative z-10 border-t border-white/5 px-6 pb-6 pt-3"
        style={{ background: "rgba(25,16,34,0.8)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Link href={backHref} className="flex flex-col items-center gap-1 text-[#7311d4]">
            <MaterialIcon name="360" fill className="text-[24px]" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Tour</span>
          </Link>
          <Link href="/showroom" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="palette" className="text-[24px]" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Design</span>
          </Link>
          <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="precision_manufacturing" className="text-[24px]" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Specs</span>
          </Link>
          <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="person" className="text-[24px]" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Profile</span>
          </Link>
        </div>
      </nav>

      <style jsx>{`
        @keyframes hotspot-pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(115,17,212,0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(115,17,212,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(115,17,212,0); }
        }
      `}</style>
    </div>
  );
}
