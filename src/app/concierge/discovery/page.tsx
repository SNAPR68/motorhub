"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: ai_assistant_discovery_view — #1773cf, Manrope, #0a0c10 */

export default function ConciergeDiscoveryPage() {
  const { data } = useApi(() => fetchVehicles({ limit: 1 }), []);
  const vehicle = data?.vehicles?.[0] ? adaptVehicle(data.vehicles[0]) : null;

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0c10] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden max-w-[430px] mx-auto border-x border-slate-800 shadow-2xl"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0c10" }}
    >
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link
          href="/showroom"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white"
        >
          <MaterialIcon name="chevron_left" />
        </Link>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/90">
            Concierge
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-white/70">
              VINCI AI ACTIVE
            </span>
          </div>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white">
          <MaterialIcon name="more_horiz" className="text-[20px]" />
        </button>
      </header>

      {/* Top Visual (38% of screen) */}
      <section className="relative h-[38%] w-full shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${vehicle.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent" />
        </div>
        {/* Car Metadata Overlay */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <span className="inline-block px-2 py-0.5 mb-2 rounded bg-[#1773cf] text-[10px] font-bold text-white uppercase tracking-wider">
              Available
            </span>
            <h1 className="text-2xl font-extrabold text-white leading-none">
              {vehicle.year} {vehicle.name}
            </h1>
            <p className="text-sm text-white/60 font-medium">
              Chassis No. MH12AB1234
            </p>
          </div>
          <Link
            href={`/virtual-tour/${vehicle.id}`}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1773cf] text-white shadow-lg shadow-[#1773cf]/30"
          >
            <MaterialIcon name="view_in_ar" />
          </Link>
        </div>
      </section>

      {/* Main Chat Area */}
      <main className="relative flex-1 flex flex-col overflow-hidden bg-[#0a0c10] rounded-t-xl -mt-4 z-10">
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* User Initial Query */}
          <div className="flex flex-col items-end mb-6">
            <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-slate-800 px-4 py-3">
              <p className="text-sm leading-relaxed text-slate-200">
                Tell me about the provenance of this Creta. Is the market value
                holding steady?
              </p>
            </div>
            <span className="mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
              11:04 AM
            </span>
          </div>

          {/* AI Response (Expert Insight) */}
          <div className="flex gap-3 mb-6">
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-[#1773cf] flex items-center justify-center text-white text-[18px]">
                <MaterialIcon name="smart_toy" />
              </div>
            </div>
            <div className="flex flex-col gap-3 max-w-[85%]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1773cf] tracking-wide">
                  EXPERT INSIGHT
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-400" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  Vinci AI
                </span>
              </div>

              {/* Insight Bubble */}
              <div className="rounded-2xl rounded-tl-none bg-[#1773cf]/10 border border-[#1773cf]/20 p-4">
                <p className="text-[15px] leading-relaxed text-slate-300">
                  This specific Creta shows a remarkable provenance. It has been
                  serviced exclusively at{" "}
                  <span className="text-[#1773cf] font-semibold">
                    Hyundai Authorised Service, Delhi
                  </span>{" "}
                  and retains 100% original factory paint.
                </p>

                {/* Market Data Card */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900 shadow-sm border border-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Market Valuation
                      </p>
                      <p className="text-lg font-extrabold text-[#1773cf]">
                        {vehicle.price}{" "}
                        <span className="text-[10px] text-green-500 font-bold ml-1">
                          {"\u2191"} 4.2%
                        </span>
                      </p>
                    </div>
                    <MaterialIcon
                      name="trending_up"
                      className="text-slate-300"
                    />
                  </div>
                  <div className="h-12 w-full flex items-end gap-1 px-1">
                    {[40, 45, 35, 60, 55, 80, 100].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm ${
                          i === 6
                            ? "bg-[#1773cf]"
                            : "bg-[#1773cf]/20"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 text-center italic leading-tight">
                    Last 12 months appreciation for Creta SX(O) configurations
                  </p>
                </div>
              </div>

              <div className="rounded-2xl rounded-tl-none bg-[#1773cf]/10 border border-[#1773cf]/20 px-4 py-3">
                <p className="text-[14px] leading-relaxed text-slate-300">
                  Would you like me to request a detailed inspection report or
                  verify the complete service history?
                </p>
              </div>
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex items-center gap-1 ml-11 text-slate-400">
            <div className="flex gap-1">
              <div className="h-1 w-1 rounded-full bg-[#1773cf]/40 animate-bounce" />
              <div className="h-1 w-1 rounded-full bg-[#1773cf]/40 animate-bounce [animation-delay:-.3s]" />
              <div className="h-1 w-1 rounded-full bg-[#1773cf]/40 animate-bounce [animation-delay:-.5s]" />
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="absolute bottom-20 left-0 right-0 z-20 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden whitespace-nowrap px-4 py-2 bg-gradient-to-t from-[#0a0c10]/80 to-transparent">
          <div className="flex gap-2">
            <button className="px-5 py-2.5 rounded-full bg-[#1773cf] text-white text-xs font-bold shadow-lg shadow-[#1773cf]/20 transition-transform active:scale-95">
              Request Video Walkthrough
            </button>
            <button className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-200 text-xs font-bold transition-transform active:scale-95 border border-slate-700">
              Verify Condition
            </button>
            <button className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-200 text-xs font-bold transition-transform active:scale-95 border border-slate-700">
              Speak to Dealer
            </button>
          </div>
        </div>

        {/* Bottom Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-4 pb-8 flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-slate-500">
            <MaterialIcon name="add" />
          </button>
          <div className="relative flex-1">
            <input
              className="w-full h-11 rounded-full border-none bg-slate-800 px-5 text-sm focus:ring-1 focus:ring-[#1773cf] text-white placeholder:text-slate-500"
              placeholder="Ask your assistant..."
              type="text"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1773cf]">
              <MaterialIcon name="mic" />
            </button>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1773cf] text-white shadow-md">
            <MaterialIcon name="send" />
          </button>
        </div>
      </main>
    </div>
  );
}
