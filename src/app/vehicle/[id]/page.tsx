"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: luxury_digital_showroom_(client_view) — #1773cf, Noto Serif + Noto Sans, #0a0a0a */

const TABS = ["Showroom", "Collections", "Concierge"];

export default function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: vehicleData } = useApi(() => fetchVehicle(id), [id]);
  const { data: allData } = useApi(() => fetchVehicles({ limit: 6 }), []);
  const vehicle = vehicleData?.vehicle ? adaptVehicle(vehicleData.vehicle) : null;
  const otherVehicles = (allData?.vehicles ?? []).map(adaptVehicle).filter((v) => v.id !== id).slice(0, 3);

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-lg mx-auto text-slate-100"
      style={{ fontFamily: "'Noto Sans', sans-serif", background: "#0a0a0a" }}
    >
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-6 h-16 max-w-lg mx-auto">
          <span
            className="text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Autovinci
          </span>
          <div className="flex gap-6 items-center">
            <button className="text-white/60 hover:text-white transition-colors">
              <MaterialIcon name="search" className="text-2xl" />
            </button>
            <button className="text-white/60 hover:text-white transition-colors">
              <MaterialIcon name="menu" className="text-2xl" />
            </button>
          </div>
        </div>
        {/* Sub Nav Tabs */}
        <div className="flex justify-center border-t border-white/5 bg-[#0a0a0a]/40">
          <div className="flex gap-8 px-4 h-12 items-center">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`text-xs font-bold tracking-[0.1em] uppercase h-full flex items-center border-b-2 transition-colors ${
                  i === 0
                    ? "border-[#1773cf] text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-28 pb-24 min-h-screen flex flex-col">
        {/* Cinematic Hero */}
        <section className="relative w-full aspect-[4/5] overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
            <h1
              className="text-4xl text-white mb-4 drop-shadow-lg"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              {vehicle.name}
            </h1>
            <p className="text-white/80 text-sm font-light tracking-widest uppercase mb-8">
              {vehicle.engine} &bull; {vehicle.fuel} &bull; {vehicle.transmission}
            </p>
            <Link
              href={`/virtual-tour/${vehicle.id}`}
              className="group/btn flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white hover:text-[#0a0a0a] transition-all duration-300 px-8 py-4 rounded-full text-white font-bold tracking-wider text-sm"
            >
              <span>ENTER EXPERIENCE</span>
              <MaterialIcon
                name="arrow_forward_ios"
                className="text-sm transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
          {/* Carousel indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="flex gap-2">
              <span className="w-8 h-0.5 bg-[#1773cf]" />
              <span className="w-8 h-0.5 bg-white/20" />
              <span className="w-8 h-0.5 bg-white/20" />
            </div>
          </div>
        </section>

        {/* Curated Collection */}
        <section className="px-6 py-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[#1773cf] text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                Available Now
              </span>
              <h2
                className="text-3xl text-white"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Curated Collection
              </h2>
            </div>
            <Link
              href="/inventory"
              className="text-white/40 text-xs font-bold tracking-widest uppercase hover:text-[#1773cf] transition-colors pb-1 border-b border-white/10"
            >
              View All
            </Link>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex overflow-x-auto gap-6 -mx-6 px-6 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {otherVehicles.map((v) => (
              <div
                key={v.id}
                className="flex-none w-[85%] snap-start group relative"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden relative">
                  <Image
                    alt={v.name}
                    fill
                    sizes="85vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    src={v.image}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
                    <div>
                      <h3
                        className="text-2xl text-white"
                        style={{ fontFamily: "'Noto Serif', serif" }}
                      >
                        {v.name}
                      </h3>
                      <p className="text-white/60 text-xs tracking-widest uppercase">
                        {v.engine} &bull; {v.fuel}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/showcase/${v.id}`}
                        className="flex-1 bg-white text-[#0a0a0a] text-xs font-bold py-3 rounded-lg hover:bg-[#1773cf] hover:text-white transition-colors uppercase tracking-widest text-center"
                      >
                        Inquire
                      </Link>
                      <Link
                        href={`/virtual-tour/${v.id}`}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <MaterialIcon name="visibility" className="text-sm" />
                        AI Tour
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Concierge Teaser */}
        <section className="px-6 py-10 bg-white/[0.02] border-y border-white/5">
          <div className="flex flex-col items-center text-center">
            <MaterialIcon
              name="diamond"
              className="text-[#1773cf] text-4xl mb-4"
            />
            <h3
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Bespoke Concierge
            </h3>
            <p className="text-white/50 text-sm max-w-[280px] mb-8 leading-relaxed">
              Personalized sourcing and management for the world&apos;s most
              discerning collectors.
            </p>
            <Link
              href="/concierge"
              className="border border-white/20 px-10 py-3 rounded-full text-white text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-[#0a0a0a] transition-all"
            >
              Connect With Us
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 pb-8 pt-3 max-w-lg mx-auto">
        <div className="max-w-lg mx-auto flex justify-around items-center px-4">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-[#1773cf]"
          >
            <MaterialIcon name="home" fill />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Home
            </span>
          </Link>
          <Link
            href="/my-cars"
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <MaterialIcon name="garage" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Garage
            </span>
          </Link>
          <Link
            href="/virtual-tour/creta-sxo"
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <MaterialIcon name="auto_awesome" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              AI Tour
            </span>
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition-colors"
          >
            <MaterialIcon name="person" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
