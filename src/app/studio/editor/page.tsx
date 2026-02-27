"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: ai_studio_content_editor — AI Script, TTS narrator, timeline */

const TOOLS = [
  { name: "ColorGrade", icon: "palette", active: true },
  { name: "MotionBlur", icon: "blur_on", active: false },
  { name: "PrecisionBG", icon: "background_replace", active: false },
];

const TIMELINE_CLIPS = [
  { color: "#f97316", width: "30%", label: "Exterior" },
  { color: "#3b82f6", width: "25%", label: "Interior" },
  { color: "#10b981", width: "20%", label: "Details" },
  { color: "#8b5cf6", width: "25%", label: "Drive" },
];

const VOICE_MAP = { Male: "onyx", Female: "nova" };

export default function StudioEditorPage() {
  const [activeTool, setActiveTool] = useState("ColorGrade");
  const [voice, setVoice] = useState<"Male" | "Female">("Male");
  const [script, setScript] = useState("");
  const [scriptLoading, setScriptLoading] = useState(true);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: vehiclesData } = useApi(() => fetchVehicles({ limit: 10 }), []);
  const vehicles = (vehiclesData?.vehicles ?? []).map(adaptVehicle);
  const vehicle = vehicles[0];

  const generateScript = useCallback(async () => {
    setScriptLoading(true);
    try {
      const res = await fetch("/api/ai/reel/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle?.id,
          vehicleName: vehicle ? `${vehicle.year} ${vehicle.name}` : undefined,
          specs: vehicle ? `${vehicle.engine} • ${vehicle.fuel} • ${vehicle.km} km` : undefined,
          tone: "luxury",
        }),
      });
      const json = await res.json();
      if (json.script) setScript(json.script);
    } catch {
      setScript("Introducing the 2023 Hyundai Creta SX(O) — where power meets elegance. With a 1.5L turbocharged engine delivering 138 BHP, this SUV redefines city driving.");
    } finally {
      setScriptLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    generateScript();
  }, [generateScript]);

  const generateTts = useCallback(async () => {
    if (!script.trim()) return;
    setTtsLoading(true);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/ai/reel/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script, voice: VOICE_MAP[voice] }),
      });
      const json = await res.json();
      if (json.audio) setAudioUrl(json.audio);
    } catch {
      // TTS failed
    } finally {
      setTtsLoading(false);
    }
  }, [script, voice]);

  const handleExport = useCallback(() => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `autovinci-narration-${Date.now()}.mp3`;
      a.click();
    }
  }, [audioUrl]);

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#1a1008" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(26,16,8,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/studio" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">Video Editor</h1>
        <button
          onClick={handleExport}
          disabled={!audioUrl}
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#f97316] text-white disabled:opacity-50"
        >
          Export
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {/* Video Preview */}
        <div className="relative w-full aspect-video mx-auto my-4 px-4">
          <div className="w-full h-full rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(145deg, #2a1a0a, #1a1008)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-14 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg shadow-[#f97316]/30">
                <MaterialIcon name="play_arrow" className="text-white text-3xl" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">00:12 / 00:30</span>
              <div className="w-1/2 h-1 rounded-full bg-white/10">
                <div className="w-[40%] h-full rounded-full bg-[#f97316]" />
              </div>
            </div>
          </div>
        </div>

        {/* Script Generation */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">AI Script Generator</h3>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            {scriptLoading ? (
              <div className="h-16 flex items-center justify-center text-slate-500 text-xs">Generating script...</div>
            ) : (
              <>
                <p className="text-xs text-slate-400 leading-relaxed italic mb-3">
                  &ldquo;{script || "Click Regenerate to create a script."}&rdquo;
                </p>
                <button
                  onClick={generateScript}
                  disabled={scriptLoading}
                  className="w-full py-2.5 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold text-[#f97316] disabled:opacity-50"
                  style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)" }}
                >
                  <MaterialIcon name="auto_awesome" className="text-sm" /> Regenerate Script
                </button>
              </>
            )}
          </div>
        </section>

        {/* Tool Tabs */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Editing Tools</h3>
          <div className="flex gap-2 mb-4">
            {TOOLS.map((t) => (
              <button
                key={t.name}
                onClick={() => setActiveTool(t.name)}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                style={{
                  background: activeTool === t.name ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: activeTool === t.name ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  color: activeTool === t.name ? "#f97316" : "#94a3b8",
                }}
              >
                <MaterialIcon name={t.icon} className="text-lg" /> {t.name}
              </button>
            ))}
          </div>
        </section>

        {/* Audio Narrator */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">AI Narrator</h3>
          <div className="flex gap-3 mb-3">
            {(["Male", "Female"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: voice === v ? "#f97316" : "rgba(255,255,255,0.03)",
                  color: voice === v ? "white" : "#94a3b8",
                  border: voice === v ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {v} Voice
              </button>
            ))}
          </div>
          <button
            onClick={generateTts}
            disabled={ttsLoading || !script.trim()}
            className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-50"
            style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}
          >
            {ttsLoading ? <MaterialIcon name="hourglass_empty" className="text-sm animate-spin" /> : <MaterialIcon name="play_circle" className="text-sm" />}
            {ttsLoading ? "Generating..." : "Preview Narration"}
          </button>
          {audioUrl && (
            <audio ref={audioRef} src={audioUrl} controls className="w-full mt-2 h-10" />
          )}
        </section>

        {/* Timeline */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Timeline</h3>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            {/* Video Track */}
            <p className="text-[10px] text-slate-500 uppercase mb-2">Video</p>
            <div className="flex gap-1 h-8 mb-4">
              {TIMELINE_CLIPS.map((clip) => (
                <div key={clip.label} className="rounded h-full flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ width: clip.width, background: clip.color + "40", borderLeft: `2px solid ${clip.color}` }}>
                  {clip.label}
                </div>
              ))}
            </div>
            {/* Audio Waveform */}
            <p className="text-[10px] text-slate-500 uppercase mb-2">Audio</p>
            <div className="flex items-center h-6 gap-px">
              {Array.from({ length: 60 }, (_, i) => (
                <div key={i} className="flex-1 rounded-full" style={{
                  height: `${20 + Math.random() * 80}%`,
                  background: `rgba(249,115,22,${0.2 + Math.random() * 0.4})`,
                }} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-4 pb-6 pt-2 flex justify-around items-center md:hidden"
        style={{ background: "rgba(26,16,8,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" /><span className="text-[10px] font-bold">Inventory</span>
        </Link>
        <Link href="/marketing" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="campaign" /><span className="text-[10px] font-bold">Marketing</span>
        </Link>
        <Link href="/studio" className="flex flex-col items-center gap-1 text-[#f97316]">
          <MaterialIcon name="auto_fix_high" fill /><span className="text-[10px] font-bold">AI Tools</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" /><span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
