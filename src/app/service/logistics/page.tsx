"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: service_logistics_&_confirmation — #dab80b, Space Grotesk, #0a0a0a */

export default function ServiceLogisticsPage() {
  const [logistics, setLogistics] = useState<"valet" | "self">("valet");

  return (
    <div
      className="relative flex h-dvh max-w-md mx-auto flex-col overflow-hidden shadow-2xl text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <Link
          href="/service"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-slate-100"
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-[20px]" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold tracking-tight">Service Logistics</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#dab80b] font-medium">
            Step 3 of 4
          </p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a2a] text-slate-100">
          <MaterialIcon name="help_outline" className="text-[20px]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Stepper Progress */}
        <div className="flex w-full items-center justify-center gap-2 py-6">
          <div className="h-1 w-8 rounded-full bg-[#dab80b]" />
          <div className="h-1 w-8 rounded-full bg-[#dab80b]" />
          <div
            className="h-1 w-12 rounded-full bg-[#dab80b]"
            style={{ boxShadow: "0 0 10px rgba(218,184,11,0.5)" }}
          />
          <div className="h-1 w-8 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Logistics Toggle */}
        <div className="mb-8">
          <div className="flex h-12 w-full items-center gap-1 rounded-xl bg-[#161616] p-1 border border-[#2a2a2a]">
            <button
              onClick={() => setLogistics("valet")}
              className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 transition-all text-sm font-semibold tracking-wide ${
                logistics === "valet"
                  ? "bg-[#dab80b] text-[#0a0a0a]"
                  : "text-slate-400"
              }`}
            >
              Valet Pick-up
            </button>
            <button
              onClick={() => setLogistics("self")}
              className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 transition-all text-sm font-semibold tracking-wide ${
                logistics === "self"
                  ? "bg-[#dab80b] text-[#0a0a0a]"
                  : "text-slate-400"
              }`}
            >
              Self Drop-off
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 leading-relaxed italic">
            Our concierge will handle the details of your vehicle recovery.
          </p>
        </div>

        {/* Map Module */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#2a2a2a] aspect-[4/3]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)",
            }}
          />
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div
              className="p-3 rounded-xl flex items-center gap-3"
              style={{
                background: "rgba(22,22,22,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(218,184,11,0.1)",
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dab80b]/20 text-[#dab80b]">
                <MaterialIcon name="home" className="text-[18px]" />
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  Origin
                </p>
                <p className="text-xs font-semibold">
                  124 Golf Course Rd, Gurgaon
                </p>
              </div>
            </div>
          </div>
          <div
            className="absolute bottom-4 left-4 right-4 p-4 rounded-xl"
            style={{
              background: "rgba(22,22,22,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(218,184,11,0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#dab80b] animate-pulse" />
                <span className="text-xs font-medium text-[#dab80b] uppercase tracking-widest">
                  Live Estimate
                </span>
              </div>
              <span className="text-xs font-bold">14 Mins Away</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <MaterialIcon
                  name="precision_manufacturing"
                  className="text-[#dab80b]"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Autovinci South Delhi</h4>
                <p className="text-[11px] text-slate-400">
                  Certified Master Technicians
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Concierge Notes */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Concierge Notes
            </label>
            <MaterialIcon name="edit_note" className="text-[#dab80b] text-[20px]" />
          </div>
          <textarea
            className="w-full h-32 rounded-xl bg-[#161616] border border-[#2a2a2a] p-4 text-sm focus:border-[#dab80b] focus:ring-1 focus:ring-[#dab80b] outline-none transition-all placeholder:text-slate-600 resize-none text-slate-100"
            placeholder="Specify any special requests for our master technicians (e.g., 'Check brake noise', 'Detail interior')..."
          />
        </div>
      </main>

      {/* Bottom Slider Action */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div className="relative flex h-16 w-full items-center overflow-hidden rounded-full bg-[#161616] border border-[#2a2a2a] p-1">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 pl-8">
              Slide to Confirm
            </span>
          </div>
          <div className="relative z-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#dab80b] text-[#0a0a0a] shadow-lg shadow-[#dab80b]/20">
            <MaterialIcon name="keyboard_double_arrow_right" className="font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
