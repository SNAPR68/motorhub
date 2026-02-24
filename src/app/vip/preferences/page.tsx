"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, SWIFT, NEXON, INTERIOR, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: vip_personalized_preferences — #1754cf, Manrope, #0F0F0F */

const INTERESTS = [
  { label: "Vintage Classics", image: INTERIOR, icon: "auto_awesome" },
  { label: "Modern SUVs", image: CRETA, icon: "directions_car" },
  { label: "Luxury Sedans", image: SWIFT, icon: "diamond" },
  { label: "Electric Vehicles", image: NEXON, icon: "bolt" },
];

const TONES = [
  { label: "Storyteller", desc: "Rich narratives about each vehicle's heritage", icon: "auto_stories" },
  { label: "Formal", desc: "Professional, data-driven communication", icon: "business_center" },
  { label: "Direct", desc: "Concise, to-the-point information", icon: "bolt" },
];

export default function VIPPreferencesPage() {
  const [selected, setSelected] = useState<number[]>([0, 3]);
  const [tone, setTone] = useState("Storyteller");

  const toggleInterest = (i: number) => {
    setSelected((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0F0F0F" }}
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/vip" className="p-2 rounded-full hover:bg-white/5">
            <MaterialIcon name="arrow_back" className="text-slate-400" />
          </Link>
          <div className="flex gap-1.5">
            <div className="w-8 h-1 rounded-full bg-[#1754cf]" />
            <div className="w-8 h-1 rounded-full bg-[#1754cf]" />
            <div className="w-8 h-1 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Step 2 of 3</span>
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight">Curate Your Portfolio</h1>
        <p className="text-sm text-slate-400 mt-2">Select categories that match your automotive interests.</p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Interest Cards Grid */}
        <section className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Interests</h3>
          <div className="grid grid-cols-2 gap-3">
            {INTERESTS.map((item, i) => (
              <button
                key={item.label}
                onClick={() => toggleInterest(i)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                style={{
                  border: selected.includes(i) ? "2px solid #1754cf" : "2px solid rgba(255,255,255,0.05)",
                }}
              >
                <Image src={item.image} alt={item.label} fill className="object-cover brightness-50 group-hover:brightness-60 transition-all" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <MaterialIcon name={item.icon} className={`text-3xl mb-2 ${selected.includes(i) ? "text-[#1754cf]" : "text-white/60"}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.label}</span>
                </div>
                {selected.includes(i) && (
                  <div className="absolute top-2 right-2 z-10 size-6 rounded-full bg-[#1754cf] flex items-center justify-center">
                    <MaterialIcon name="check" className="text-white text-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Concierge Tone */}
        <section className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Concierge Tone</h3>
          <div className="space-y-3">
            {TONES.map((t) => (
              <button
                key={t.label}
                onClick={() => setTone(t.label)}
                className="w-full flex items-center gap-4 p-4 rounded-xl transition-all"
                style={{
                  background: tone === t.label ? "rgba(23,84,207,0.1)" : "rgba(255,255,255,0.03)",
                  border: tone === t.label ? "1px solid rgba(23,84,207,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className={`size-10 rounded-lg flex items-center justify-center ${tone === t.label ? "bg-[#1754cf]/20 text-[#1754cf]" : "bg-white/5 text-slate-500"}`}>
                  <MaterialIcon name={t.icon} />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-bold ${tone === t.label ? "text-white" : "text-slate-400"}`}>{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${tone === t.label ? "border-[#1754cf]" : "border-slate-600"}`}>
                  {tone === t.label && <div className="size-2.5 rounded-full bg-[#1754cf]" />}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 p-6 bg-[#0F0F0F]/95 backdrop-blur-md border-t border-white/5">
        <Link
          href="/vip/confirmation"
          className="w-full bg-[#1754cf] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#1754cf]/30 active:scale-[0.98] transition-transform"
        >
          Continue to Verification
          <MaterialIcon name="arrow_forward" />
        </Link>
      </div>
    </div>
  );
}
