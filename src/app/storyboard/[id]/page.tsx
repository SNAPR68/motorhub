"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";

/* Stitch: cinematic_vehicle_storyboard — #1773cf, Manrope, #0b0f14 */

const SECTIONS = [
  {
    title: "Pure\nEvolution",
    subtitle: "Performance refined through decades of engineering excellence.",
    align: "left" as const,
    gradient: "from-[#0b0f14] via-transparent to-black/40",
  },
  {
    label: "The Cabin",
    title: "Premium Leather Interior",
    subtitle:
      "Hand-stitched Nappa leather meets brushed aluminum for a sensory experience that matches the drive.",
    align: "center" as const,
    useInterior: true,
    overlay: "bg-black/40 backdrop-blur-[2px]",
  },
  {
    label: "Innovation",
    title: "AI-Optimized Lighting",
    subtitle:
      "Adaptive matrix beam technology that anticipates the road ahead, ensuring perfect visibility.",
    align: "left" as const,
    overlay: "bg-gradient-to-r from-[#0b0f14]/90 via-transparent to-transparent",
  },
  {
    title: "Sculpted",
    titleAccent: "Aerodynamics",
    subtitle: "Every curve serves a purpose. Engineered for stability at highway speeds.",
    align: "right" as const,
    gradient: "from-[#0b0f14] via-transparent to-transparent",
  },
];

export default function StoryboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0b0f14] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div
      className="relative h-dvh w-full overflow-hidden max-w-[430px] mx-auto"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0b0f14" }}
    >
      {/* Sticky Header */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/80 to-transparent">
        <Link
          href={`/showcase/${id}`}
          className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white"
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-2xl" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-semibold">
            Autovinci
          </span>
          <h1 className="text-sm font-bold tracking-widest uppercase text-white">
            {vehicle.name.split(" ").slice(-1)[0]}
          </h1>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
          <MaterialIcon name="more_vert" className="text-2xl" />
        </button>
      </header>

      {/* Floating Share Button */}
      <div className="fixed bottom-24 right-6 z-50 max-w-[430px]">
        <button className="flex items-center justify-center size-14 rounded-full bg-[#1773cf] text-white shadow-lg shadow-[#1773cf]/30 ring-4 ring-[#0b0f14]/50">
          <MaterialIcon name="share" />
        </button>
      </div>

      {/* Vertical Progress Indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {[...SECTIONS, { cta: true }].map((_, i) => (
          <div
            key={i}
            className={`w-0.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? "h-4 bg-[#1773cf]" : "h-2 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Main Scrollable Storyboard */}
      <main
        className="relative h-dvh overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          const idx = Math.round(el.scrollTop / el.clientHeight);
          setActiveIdx(idx);
        }}
      >
        {SECTIONS.map((s, i) => (
          <section
            key={i}
            className={`relative h-dvh w-full snap-start overflow-hidden flex ${
              s.align === "center"
                ? "items-center justify-center px-8"
                : "flex-col justify-end pb-20"
            }`}
          >
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${s.useInterior ? INTERIOR : vehicle.image}')`,
                }}
              />
              {s.gradient && (
                <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient}`} />
              )}
              {s.overlay && <div className={`absolute inset-0 ${s.overlay}`} />}
            </div>
            <div
              className={`relative z-10 px-8 ${
                s.align === "center"
                  ? "text-center space-y-4 max-w-md"
                  : s.align === "right"
                  ? "text-right ml-auto"
                  : ""
              }`}
            >
              {s.label && (
                <span className="text-[#1773cf] uppercase tracking-[0.4em] text-xs font-bold block mb-2">
                  {s.label}
                </span>
              )}
              <h2
                className={`${
                  s.align === "center"
                    ? "text-3xl font-light"
                    : "text-4xl font-extrabold"
                } tracking-tighter text-white mb-4 leading-none uppercase whitespace-pre-line`}
              >
                {s.title}
                {"titleAccent" in s && s.titleAccent && (
                  <>
                    <br />
                    <span className="text-[#1773cf] font-black not-italic">
                      {s.titleAccent}
                    </span>
                  </>
                )}
              </h2>
              {s.align === "center" && (
                <div className="w-12 h-px bg-[#1773cf] mx-auto" />
              )}
              <p
                className={`text-slate-300 text-sm max-w-xs leading-relaxed ${
                  s.align === "right"
                    ? "ml-auto"
                    : s.align === "center"
                    ? "mx-auto"
                    : ""
                }`}
              >
                {s.subtitle}
              </p>
            </div>
          </section>
        ))}

        {/* Section 5: CTA */}
        <section className="relative h-dvh w-full snap-start bg-[#0b0f14] flex flex-col items-center justify-center px-8 text-center">
          <div className="mb-12">
            <div className="size-20 rounded-2xl bg-[#1773cf]/10 flex items-center justify-center mb-6 mx-auto">
              <MaterialIcon name="verified" className="text-[#1773cf] text-4xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Own the Legend</h2>
            <p className="text-slate-400">
              {vehicle.year} {vehicle.name}
            </p>
            <div className="mt-4 text-2xl font-light text-slate-100">
              {vehicle.price}
            </div>
          </div>
          <div className="w-full space-y-4 max-w-sm">
            <Link
              href="/reservation"
              className="block w-full py-5 bg-[#1773cf] text-white font-bold rounded-xl tracking-wide uppercase text-sm shadow-xl shadow-[#1773cf]/20 text-center"
            >
              Book a Private Viewing
            </Link>
            <Link
              href={`/showcase/${id}`}
              className="block w-full py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl tracking-wide uppercase text-sm text-center"
            >
              View Full Specifications
            </Link>
          </div>
          <div className="mt-16 flex flex-col items-center opacity-40">
            <div className="h-12 w-px bg-gradient-to-b from-white to-transparent mb-4" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-white">
              Autovinci Inventory
            </span>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-[#0b0f14]/80 backdrop-blur-xl border-t border-white/5 md:hidden">
        <div className="flex items-center justify-around h-20 px-4">
          <Link
            href={`/storyboard/${id}`}
            className="flex flex-col items-center gap-1 text-[#1773cf]"
          >
            <MaterialIcon name="auto_stories" fill />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Story
            </span>
          </Link>
          <Link
            href={`/showcase/${id}`}
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="analytics" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Specs
            </span>
          </Link>
          <Link
            href="/inventory"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="map" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Dealer
            </span>
          </Link>
          <Link
            href="/concierge"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="mail" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Inquire
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
