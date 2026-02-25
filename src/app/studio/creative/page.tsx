"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { CRETA } from "@/lib/car-images";

/* AI Creative Director — Mood boards, style transfer, AI content suggestions */

const MOODS = [
  {
    id: "golden_hour",
    name: "Golden Hour",
    desc: "Warm amber tones, long shadows",
    gradient: "from-amber-500 via-orange-400 to-yellow-300",
    icon: "wb_twilight",
  },
  { id: "midnight", name: "Midnight", desc: "Deep blue, city reflections", gradient: "from-blue-900 via-indigo-800 to-slate-900", icon: "dark_mode" },
  { id: "bloom", name: "Bloom", desc: "Soft pink, ethereal whites", gradient: "from-pink-300 via-rose-200 to-white", icon: "local_florist" },
  { id: "vivid", name: "Vivid", desc: "Punchy colors, high impact", gradient: "from-red-500 via-purple-500 to-blue-500", icon: "auto_awesome" },
  { id: "cinematic", name: "Cinematic", desc: "Teal & orange, film look", gradient: "from-teal-700 via-amber-900 to-slate-800", icon: "movie" },
  { id: "matte", name: "Matte", desc: "Flat, editorial style", gradient: "from-slate-600 via-slate-500 to-slate-400", icon: "blur_on" },
];

const OVERLAYS = [
  { id: "particles", name: "Particles", icon: "blur_on" },
  { id: "lens_flare", name: "Lens Flare", icon: "flare" },
  { id: "rain", name: "Rain", icon: "water_drop" },
  { id: "dust", name: "Dust", icon: "grain" },
];

const FALLBACK_SUGGESTIONS = [
  { title: "Heritage Story", desc: "Highlight the vehicle's lineage and evolution through generations", icon: "auto_stories" },
  { title: "Performance Focus", desc: "Emphasize power, speed, and driving dynamics with action shots", icon: "speed" },
  { title: "Lifestyle Integration", desc: "Show the vehicle in aspirational lifestyle contexts — weekend getaways, city drives", icon: "landscape" },
];

export default function StudioCreativePage() {
  const [selectedMood, setSelectedMood] = useState("golden_hour");
  const [activeOverlays, setActiveOverlays] = useState<Set<string>>(new Set(["particles"]));
  const [suggestions, setSuggestions] = useState<typeof FALLBACK_SUGGESTIONS>(FALLBACK_SUGGESTIONS);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [sourceImage, setSourceImage] = useState(CRETA);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [loadingMood, setLoadingMood] = useState(false);
  const [moodError, setMoodError] = useState<string | null>(null);

  const toggleOverlay = (id: string) => {
    setActiveOverlays((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchSuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/ai/creative/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleName: "Hyundai Creta SX(O)",
          vehicleType: "SUV",
          price: "₹14.5 Lakh",
          specs: "1.5L Turbo, 7-seat, Sunroof",
        }),
      });
      const json = await res.json();
      if (Array.isArray(json.suggestions) && json.suggestions.length > 0) {
        setSuggestions(json.suggestions);
      }
    } catch {
      // Keep fallback
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const applyMood = useCallback(async () => {
    setLoadingMood(true);
    setMoodError(null);
    try {
      const res = await fetch("/api/ai/photo/apply-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: sourceImage, mood: selectedMood }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setStyledImage(json.url);
    } catch (e) {
      setMoodError(e instanceof Error ? e.message : "Style application failed");
    } finally {
      setLoadingMood(false);
    }
  }, [sourceImage, selectedMood]);

  const displayImage = styledImage ?? sourceImage;

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#1a1008" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(26,16,8,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(249,115,22,0.1)" }}
      >
        <Link href="/studio" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">Creative Director</h1>
        <button className="p-2 text-slate-400">
          <MaterialIcon name="more_vert" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Preview Image with Overlays */}
        <section className="py-6">
          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4">
            <img src={displayImage} alt="Vehicle" className="w-full h-full object-cover" />
            {activeOverlays.has("particles") && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,100,0.15)_0%,transparent_50%)]" />
                <div className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-white/40 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-amber-300/50 animate-pulse delay-300" />
                <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 rounded-full bg-white/30" />
              </div>
            )}
            {activeOverlays.has("lens_flare") && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,200,150,0.15) 0%, transparent 30%)",
                }}
              />
            )}
            {activeOverlays.has("rain") && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-px bg-white/50"
                    style={{
                      left: `${(i * 7) % 100}%`,
                      top: "-10%",
                      height: "20%",
                      animation: `rain 1.5s linear infinite`,
                      animationDelay: `${(i % 10) * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
            {activeOverlays.has("dust") && (
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)" }}
              />
            )}
            <div className="absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest" style={{ background: "rgba(249,115,22,0.8)", backdropFilter: "blur(12px)" }}>
              {styledImage ? selectedMood.replace("_", " ") : "Original"}
            </div>
          </div>

          <style>{`
            @keyframes rain {
              from { transform: translateY(-10%); }
              to { transform: translateY(110%); }
            }
          `}</style>

          {moodError && <p className="text-xs text-red-400 mb-2">{moodError}</p>}
          <button
            onClick={applyMood}
            disabled={loadingMood}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#f97316", color: "white", boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}
          >
            {loadingMood ? (
              <>
                <MaterialIcon name="hourglass_empty" className="animate-spin" />
                Applying mood...
              </>
            ) : (
              <>
                <MaterialIcon name="auto_awesome" />
                Apply {selectedMood.replace("_", " ")} (AI)
              </>
            )}
          </button>
        </section>

        {/* Mood Boards */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="palette" className="text-sm text-[#f97316]" /> Mood Board
          </h3>
          <div className="space-y-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className="w-full rounded-xl overflow-hidden transition-all"
                style={{ border: selectedMood === mood.id ? "2px solid #f97316" : "2px solid rgba(255,255,255,0.05)" }}
              >
                <div className={`h-20 bg-gradient-to-r ${mood.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-between px-5">
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-white">{mood.name}</h4>
                      <p className="text-[10px] text-white/70 mt-0.5">{mood.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialIcon name={mood.icon} className="text-white text-xl" />
                      {selectedMood === mood.id && (
                        <div className="size-5 rounded-full bg-[#f97316] flex items-center justify-center">
                          <MaterialIcon name="check" className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Motion Overlays */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="animation" className="text-sm text-[#f97316]" /> Motion Overlays
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {OVERLAYS.map((o) => (
              <button
                key={o.id}
                onClick={() => toggleOverlay(o.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                style={{
                  background: activeOverlays.has(o.id) ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: activeOverlays.has(o.id) ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <MaterialIcon name={o.icon} className={`text-2xl ${activeOverlays.has(o.id) ? "text-[#f97316]" : "text-slate-500"}`} />
                <span className={`text-[10px] font-bold ${activeOverlays.has(o.id) ? "text-[#f97316]" : "text-slate-500"}`}>{o.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Content Suggestions */}
        <section className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <MaterialIcon name="auto_awesome" className="text-sm text-[#f97316]" /> AI Content Suggestions
            </h3>
            <button
              onClick={fetchSuggestions}
              disabled={loadingSuggestions}
              className="text-[10px] text-[#f97316] font-bold hover:underline disabled:opacity-50"
            >
              {loadingSuggestions ? "Loading..." : "Refresh"}
            </button>
          </div>
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div
                key={s.title}
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}
              >
                <div className="size-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center shrink-0">
                  <MaterialIcon name={s.icon} className="text-[#f97316]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-600 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        <Link
          href="/marketing"
          className="block w-full py-3 rounded-xl border text-center text-sm font-bold"
          style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)", color: "#f97316" }}
        >
          <MaterialIcon name="calendar_month" className="text-sm mr-1 inline" /> Open Campaign Planner
        </Link>
      </main>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-4 pb-6 pt-2 flex justify-around items-center"
        style={{ background: "rgba(26,16,8,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(249,115,22,0.1)" }}
      >
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" />
          <span className="text-[10px] font-bold">Inventory</span>
        </Link>
        <Link href="/marketing" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="campaign" />
          <span className="text-[10px] font-bold">Marketing</span>
        </Link>
        <Link href="/content-studio" className="flex flex-col items-center gap-1 text-[#f97316]">
          <MaterialIcon name="auto_fix_high" fill />
          <span className="text-[10px] font-bold">AI Tools</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" />
          <span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}