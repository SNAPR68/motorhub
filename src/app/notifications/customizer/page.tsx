"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_notification_customizer — #f97316, Manrope, #1a1008 */

const VOICES = [
  { name: "Sophisticated", desc: "Elegant, refined communication", icon: "diamond" },
  { name: "Minimalist", desc: "Clean, concise messaging", icon: "minimize" },
  { name: "High-Energy", desc: "Bold, action-driven tone", icon: "bolt" },
];

export default function NotificationCustomizerPage() {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [selectedVoice, setSelectedVoice] = useState("Sophisticated");
  const [message, setMessage] = useState("Hi {name}, a stunning 2023 Hyundai Creta SX(O) just arrived at our showroom. With only 32,000 km and priced at ₹14.5L, this won't last long. Book your viewing today!");
  const [enhancing, setEnhancing] = useState(false);

  const handleEnhance = useCallback(async () => {
    setEnhancing(true);
    try {
      const res = await fetch("/api/ai/notification-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, voice: selectedVoice, channel }),
      });
      const data = await res.json();
      if (data.enhanced) setMessage(data.enhanced);
    } catch {
      // Keep original on error
    } finally {
      setEnhancing(false);
    }
  }, [message, selectedVoice, channel]);

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#1a1008" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(26,16,8,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/notifications/history" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">AI Customizer</h1>
        <button
          onClick={() => {}}
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#f97316] text-white hover:opacity-90"
        >
          Save
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Channel Selector */}
        <section className="py-6">
          <div className="flex gap-2 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.03)" }}>
            <button
              onClick={() => setChannel("whatsapp")}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              style={{ background: channel === "whatsapp" ? "#25d366" : "transparent", color: channel === "whatsapp" ? "white" : "#94a3b8" }}
            >
              <MaterialIcon name="chat" className="text-sm" /> WhatsApp
            </button>
            <button
              onClick={() => setChannel("email")}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              style={{ background: channel === "email" ? "#3b82f6" : "transparent", color: channel === "email" ? "white" : "#94a3b8" }}
            >
              <MaterialIcon name="mail" className="text-sm" /> Email
            </button>
          </div>
        </section>

        {/* Live Preview */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Live Preview</h3>
          <div className="rounded-xl overflow-hidden"
            style={{ background: channel === "whatsapp" ? "#1a2e1a" : "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <Image src={CRETA} alt="" width={48} height={48} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">New Listing Alert</p>
                  <p className="text-[10px] text-slate-400">Sterling Motors</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{message.replace("{name}", "Rajesh")}</p>
              <div className="mt-3">
                <button className="w-full py-2 rounded-lg text-xs font-bold text-white" style={{ background: channel === "whatsapp" ? "#25d366" : "#3b82f6" }}>
                  Book Viewing →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Voice */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Brand Voice</h3>
          <div className="grid grid-cols-3 gap-3">
            {VOICES.map((v) => (
              <button
                key={v.name}
                onClick={() => setSelectedVoice(v.name)}
                className="rounded-xl p-3 text-center transition-all"
                style={{
                  background: selectedVoice === v.name ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: selectedVoice === v.name ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <MaterialIcon name={v.icon} className={`text-2xl mb-1 ${selectedVoice === v.name ? "text-[#f97316]" : "text-slate-500"}`} />
                <p className={`text-[10px] font-bold ${selectedVoice === v.name ? "text-[#f97316]" : "text-slate-500"}`}>{v.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* AI Rewrite */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">AI Rewrite</h3>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full bg-transparent text-xs text-slate-300 leading-relaxed resize-none focus:outline-none placeholder:text-slate-600"
              placeholder="Type your notification message..."
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="text-[10px] text-slate-500">{message.length} characters</span>
              <button
                onClick={handleEnhance}
                disabled={enhancing}
                className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50"
                style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}
              >
                {enhancing ? <MaterialIcon name="hourglass_empty" className="text-sm animate-spin" /> : <MaterialIcon name="auto_awesome" className="text-sm" />}
                {enhancing ? "Enhancing..." : "Enhance"}
              </button>
            </div>
          </div>
        </section>

        {/* Reset */}
        <button className="w-full text-center text-xs text-slate-500 hover:text-[#f97316] transition-colors font-bold uppercase tracking-wider">
          Reset to base template
        </button>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-4 pb-6 pt-2 flex justify-around items-center"
        style={{ background: "rgba(26,16,8,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" /><span className="text-[10px] font-bold">Inventory</span>
        </Link>
        <Link href="/marketing" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="campaign" /><span className="text-[10px] font-bold">Marketing</span>
        </Link>
        <Link href="/content-studio" className="flex flex-col items-center gap-1 text-[#f97316]">
          <MaterialIcon name="auto_fix_high" fill /><span className="text-[10px] font-bold">AI Tools</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" /><span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
