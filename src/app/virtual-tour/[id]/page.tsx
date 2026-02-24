"use client";

import { useState, use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";
import { INTERIOR } from "@/lib/car-images";

/* Stitch: ai_virtual_tour_experience — #1773cf, Manrope, #111921 */

const HOTSPOTS = [
  {
    label: "Hand-stitched Leather",
    category: "CRAFTSMANSHIP",
    desc: "Premium semi-aniline leather with bespoke diamond quilting.",
    x: 25,
    y: 50,
  },
  {
    label: "Vinci OS Cockpit",
    category: "TECHNOLOGY",
    desc: "Dual 14-inch OLED displays with 4K resolution.",
    x: 50,
    y: 45,
  },
  {
    label: "Spatial Audio System",
    category: "AUDIO",
    desc: "22-speaker immersive surround by Meridian.",
    x: 75,
    y: 33,
  },
];

export default function VirtualTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#111921] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div
      className="relative h-dvh w-full flex flex-col overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#111921" }}
    >
      {/* Top HUD Navigation */}
      <header className="absolute top-0 left-0 w-full z-20 px-4 pt-6 pb-4">
        <div
          className="flex items-center justify-between rounded-xl p-2 px-3"
          style={{
            background: "rgba(17,25,33,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Link
            href={`/showcase/${vehicle.id}`}
            className="flex items-center justify-center p-2 hover:bg-[#1773cf]/20 rounded-lg transition-colors"
          >
            <MaterialIcon
              name="arrow_back_ios_new"
              className="text-slate-100"
            />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-100">
              Autovinci
            </h1>
            <p className="text-[10px] text-[#1773cf] font-semibold">
              360{"\u00B0"} INTERIOR VIEW
            </p>
          </div>
          <button className="flex items-center justify-center p-2 hover:bg-[#1773cf]/20 rounded-lg transition-colors">
            <MaterialIcon name="share" className="text-slate-100" />
          </button>
        </div>
      </header>

      {/* Immersive 360 View */}
      <div className="absolute inset-0 z-0">
        <div
          className="relative h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${INTERIOR}')` }}
        >
          {/* Hotspots */}
          {HOTSPOTS.map((h, i) => (
            <div
              key={i}
              className="absolute group"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
            >
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveHotspot(activeHotspot === i ? null : i)
                  }
                  className="w-6 h-6 bg-[#1773cf] rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    boxShadow:
                      activeHotspot === i
                        ? "0 0 0 8px rgba(23,115,207,0.3)"
                        : "0 0 0 0 rgba(23,115,207,0.7)",
                    animation:
                      activeHotspot !== i
                        ? "hotspot-pulse 2s infinite"
                        : "none",
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </button>
                {activeHotspot === i && (
                  <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 rounded-lg p-3 z-30"
                    style={{
                      background: "rgba(17,25,33,0.7)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <p className="text-xs font-bold text-[#1773cf] mb-1">
                      {h.category}
                    </p>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {h.label}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {h.desc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />

          {/* Drag hint */}
          <div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(17,25,33,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(23,115,207,0.3)",
            }}
          >
            <MaterialIcon
              name="swipe_up"
              className="text-xs text-[#1773cf]"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">
              Drag to look around
            </span>
          </div>
        </div>
      </div>

      {/* AI Concierge Bubble */}
      <div className="absolute bottom-24 right-4 z-20 group">
        <Link
          href="/concierge"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1773cf] shadow-lg shadow-[#1773cf]/40 text-white transition-transform active:scale-95"
        >
          <MaterialIcon name="smart_toy" className="text-2xl" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
          </span>
        </Link>
      </div>

      {/* Bottom Action Bar & Navigation */}
      <div className="absolute bottom-0 left-0 w-full z-20">
        {/* Dynamic HUD buttons */}
        <div className="px-4 pb-4 flex gap-3">
          <Link
            href={`/showcase/${vehicle.id}`}
            className="flex-1 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            style={{
              background: "rgba(17,25,33,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <MaterialIcon name="info" className="text-xl" />
            <span className="text-sm font-bold tracking-wide">Full Specs</span>
          </Link>
          <button className="flex-1 bg-[#1773cf] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#1773cf]/20">
            <MaterialIcon name="calendar_month" className="text-xl" />
            <span className="text-sm font-bold tracking-wide">Book View</span>
          </button>
        </div>

        {/* Bottom Nav */}
        <nav className="flex gap-2 border-t border-slate-800/50 bg-[#111921]/95 backdrop-blur-md px-4 pb-6 pt-2">
          <Link
            href="/showroom"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="directions_car" className="text-[24px]" />
            <p className="text-[10px] font-medium leading-normal">Showroom</p>
          </Link>
          <span className="flex flex-1 flex-col items-center justify-center gap-1 text-[#1773cf]">
            <MaterialIcon
              name="auto_videocam"
              fill
              className="text-[24px]"
            />
            <p className="text-[10px] font-bold leading-normal">
              Virtual Tour
            </p>
          </span>
          <Link
            href="/inventory"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="search" className="text-[24px]" />
            <p className="text-[10px] font-medium leading-normal">Search</p>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="favorite" className="text-[24px]" />
            <p className="text-[10px] font-medium leading-normal">Saved</p>
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="account_circle" className="text-[24px]" />
            <p className="text-[10px] font-medium leading-normal">Profile</p>
          </Link>
        </nav>
      </div>

      {/* Pulse animation keyframes */}
      <style jsx>{`
        @keyframes hotspot-pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(23, 115, 207, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(23, 115, 207, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(23, 115, 207, 0);
          }
        }
      `}</style>
    </div>
  );
}
