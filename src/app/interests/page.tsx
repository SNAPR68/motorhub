"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: curated_interests_grid — #137fec, Manrope, #0a0c10 */

export default function InterestsPage() {
  const { data } = useApi(() => fetchVehicles({ limit: 6 }), []);
  const allVehicles = (data?.vehicles ?? []).map(adaptVehicle);
  const GRID_ITEMS = allVehicles.slice(0, 4);
  const RECOMMENDATIONS = allVehicles.slice(4, 6);

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto overflow-x-hidden text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0c10" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0c10]/80 backdrop-blur-md border-b border-slate-800/50">
        <Link
          href="/"
          className="flex items-center justify-center size-10 rounded-full hover:bg-slate-800 transition-colors"
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-[24px]" />
        </Link>
        <h1 className="text-sm font-bold tracking-[0.2em] uppercase">
          Saved Collection
        </h1>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-800 transition-colors">
          <MaterialIcon name="share" className="text-[24px]" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Grid Title */}
        <div className="px-6 pt-8 pb-4 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-[#137fec] tracking-[0.3em] uppercase mb-1">
              Portfolio
            </p>
            <h2 className="text-2xl font-light tracking-tight">Curated Grid</h2>
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
            {GRID_ITEMS.length} Items
          </span>
        </div>

        {/* 2x2 Interest Grid */}
        <div className="grid grid-cols-2 gap-3 px-6 pb-10">
          {GRID_ITEMS.map((v) => (
            <Link
              key={v.id}
              href={`/showcase/${v.id}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-900 border border-slate-800"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%), url("${v.image}")`,
                }}
              />
              <div className="absolute bottom-3 left-3">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/90">
                  {v.name.split(" ").slice(-1)[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* AI Concierge Section */}
        <div className="pt-8 border-t border-slate-800/60">
          <div className="px-6 flex items-center gap-2 mb-6">
            <MaterialIcon
              name="auto_awesome"
              fill
              className="text-[#137fec] text-[20px]"
            />
            <h3 className="text-sm font-bold tracking-[0.1em] uppercase">
              Recommended by AI Concierge
            </h3>
          </div>

          {/* Horizontal Scroll */}
          <div className="flex gap-4 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4">
            {RECOMMENDATIONS.map((v, i) => (
              <Link
                key={v.id}
                href={`/showcase/${v.id}`}
                className="flex-none w-[280px] group"
              >
                <div className="relative h-[180px] rounded-xl overflow-hidden mb-3 bg-slate-900 border border-slate-800">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#137fec]/20 backdrop-blur-md text-[#137fec] text-[10px] font-bold px-2 py-1 rounded border border-[#137fec]/30 tracking-wider">
                      {i === 0 ? "98" : "94"}% MATCH
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${v.image}")` }}
                  />
                </div>
                <h4 className="text-sm font-bold tracking-tight">{v.name}</h4>
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  {v.engine} {"\u2022"} {v.year}
                </p>
              </Link>
            ))}
          </div>

          <div className="px-6 mt-8">
            <Link
              href="/inventory"
              className="block w-full py-4 rounded-xl border border-slate-800 text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:bg-slate-900 transition-colors text-center"
            >
              View Full Inventory
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#0a0c10]/95 backdrop-blur-xl border-t border-slate-800/80 px-6 pt-3 pb-8 flex justify-between items-center z-50 md:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="home" className="text-[26px]" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="search" className="text-[26px]" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
        </Link>
        <Link href="/interests" className="flex flex-col items-center gap-1 text-[#137fec]">
          <MaterialIcon name="grid_view" fill className="text-[26px]" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Collection</span>
        </Link>
        <Link href="/concierge" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="smart_toy" className="text-[26px]" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Concierge</span>
        </Link>
        <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="person" className="text-[26px]" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
