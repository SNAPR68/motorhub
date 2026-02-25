"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";
import { VehicleJsonLd } from "@/components/VehicleJsonLd";

/* Stitch: premium_vehicle_showcase
   Tokens: primary=#eebd2b, font=Newsreader, bg=#121212
   Bottom actions: PROMOTE WITH AI + CONTACT LEAD */

// ── AI Description Sheet ────────────────────────────────────────
function AiDescriptionSheet({
  vehicleId,
  vehicleName,
  onClose,
}: {
  vehicleId: string;
  vehicleName: string;
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<"premium" | "concise" | "urgent">("premium");

  const generate = useCallback(async () => {
    setLoading(true);
    setDescription("");
    setGenerated(false);
    try {
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, tone }),
      });
      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
        setGenerated(data.generated ?? true);
      }
    } catch {
      setDescription("Unable to generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [vehicleId, tone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(description).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TONES = [
    { key: "premium" as const, label: "Premium", icon: "diamond", desc: "Luxury, detailed & aspirational" },
    { key: "concise" as const, label: "Concise", icon: "bolt", desc: "Short & punchy, listing-ready" },
    { key: "urgent" as const, label: "Urgent", icon: "local_fire_department", desc: "FOMO-driven, act-now energy" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-w-lg mx-auto overflow-hidden"
        style={{
          background: "#0f1218",
          border: "1px solid rgba(238,189,43,0.15)",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.6)",
          maxHeight: "90dvh",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(90dvh - 20px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(238,189,43,0.12)", border: "1px solid rgba(238,189,43,0.2)" }}
              >
                <MaterialIcon name="auto_awesome" className="text-[#eebd2b] text-lg" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base leading-tight">AI Description</h2>
                <p className="text-slate-500 text-[11px] truncate max-w-[180px]">{vehicleName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MaterialIcon name="close" className="text-lg" />
            </button>
          </div>

          <div className="px-6 pb-8 space-y-5">
            {/* Tone selector */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Tone</p>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTone(t.key)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all text-center"
                    style={{
                      background: tone === t.key ? "rgba(238,189,43,0.1)" : "rgba(255,255,255,0.04)",
                      borderColor: tone === t.key ? "rgba(238,189,43,0.4)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <MaterialIcon
                      name={t.icon}
                      className="text-lg"
                      style={{ color: tone === t.key ? "#eebd2b" : "#64748b" }}
                    />
                    <span className="text-[11px] font-bold text-white">{t.label}</span>
                    <span className="text-[9px] text-slate-500 leading-tight">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: loading
                  ? "rgba(238,189,43,0.15)"
                  : "linear-gradient(135deg, #eebd2b 0%, #d4a420 100%)",
                color: loading ? "#eebd2b" : "#0f1218",
                boxShadow: loading ? "none" : "0 4px 20px rgba(238,189,43,0.3)",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-[#eebd2b]/30 border-t-[#eebd2b] animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <MaterialIcon name="auto_awesome" className="text-lg" />
                  {description ? "Regenerate" : "Generate Description"}
                </>
              )}
            </button>

            {/* Output area */}
            {description && (
              <div
                className="rounded-xl p-4 relative"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* AI badge */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#eebd2b] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#eebd2b]">
                    {generated ? "AI Generated" : "Smart Fallback"}
                  </span>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed" style={{ fontFamily: "'Newsreader', serif" }}>
                  {description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
                    style={{
                      background: copied ? "rgba(22,163,74,0.15)" : "rgba(255,255,255,0.08)",
                      color: copied ? "#4ade80" : "#e2e8f0",
                      border: copied ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <MaterialIcon name={copied ? "check" : "content_copy"} className="text-sm" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <Link
                    href={`/quick-draft?vehicleId=${vehicleId}&prefill=${encodeURIComponent(description.slice(0, 100))}`}
                    className="flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold"
                    style={{ background: "rgba(238,189,43,0.1)", color: "#eebd2b", border: "1px solid rgba(238,189,43,0.2)" }}
                  >
                    <MaterialIcon name="send" className="text-sm" />
                    Send as Draft
                  </Link>
                </div>
              </div>
            )}

            {/* Usage tips */}
            {!description && !loading && (
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: "rgba(238,189,43,0.05)", border: "1px solid rgba(238,189,43,0.1)" }}
              >
                <MaterialIcon name="lightbulb" className="text-[#eebd2b] text-lg mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#eebd2b] mb-1">How it works</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    AI reads this vehicle&apos;s specs, km, price, and features from the database to write a premium marketing description. Use it for listings, WhatsApp, or social media.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ShowcasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;
  const [showDescriptionSheet, setShowDescriptionSheet] = useState(false);

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#121212] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <VehicleJsonLd vehicle={vehicle} />
      <div
        className="min-h-dvh w-full text-slate-100 antialiased overflow-x-hidden"
        style={{
          fontFamily: "'Newsreader', serif",
          background: "#121212",
        }}
      >
        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
          <Link
            href="/inventory"
            className="flex items-center justify-center size-10 rounded-full glass-effect text-white"
          >
            <MaterialIcon name="arrow_back_ios_new" className="text-[24px]" />
          </Link>
          <div className="flex gap-4">
            <button
              type="button"
              className="flex items-center justify-center size-10 rounded-full glass-effect text-white"
            >
              <MaterialIcon name="favorite" className="text-[24px]" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center size-10 rounded-full glass-effect text-white"
            >
              <MaterialIcon name="share" className="text-[24px]" />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pb-32">
          {/* Hero Section — 60vh */}
          <section className="relative h-[60vh] w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${vehicle.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
            </div>

            {/* 360° View Button */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
              <Link
                href={`/virtual-tour/${vehicle.id}`}
                className="flex items-center gap-2 px-6 py-2 rounded-full glass-effect border-[#eebd2b]/30 text-white hover:bg-white/10 transition-all"
              >
                <MaterialIcon name="360" className="text-[24px] text-[#eebd2b]" />
                <span className="text-sm font-medium tracking-widest uppercase">360° View</span>
              </Link>
            </div>

            {/* Image Pagination Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
              <div className="h-1 w-8 rounded-full bg-[#eebd2b]" />
              <div className="h-1 w-2 rounded-full bg-white/30" />
              <div className="h-1 w-2 rounded-full bg-white/30" />
              <div className="h-1 w-2 rounded-full bg-white/30" />
            </div>
          </section>

          {/* Vehicle Details Header */}
          <section className="px-6 pt-8">
            <div className="flex flex-col gap-1">
              <span className="text-[#eebd2b] uppercase tracking-[0.2em] text-xs font-semibold">
                {vehicle.status === "available" ? "Available Now" : "Limited Availability"}
              </span>
              <h1 className="text-5xl leading-tight tracking-tight text-slate-100">
                {vehicle.year} {vehicle.name}
              </h1>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-3xl text-[#eebd2b]">{vehicle.price}</p>
                <p className="text-slate-400 text-sm italic">
                  {vehicle.km} km &bull; {vehicle.fuel}
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="px-6 py-8">
            <hr className="border-white/10" />
          </div>

          {/* Technical Specs Grid */}
          <section className="px-6 grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-2">
              <MaterialIcon name="speed" className="text-[30px] text-[#eebd2b]/80 font-light" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400">Kilometers</p>
                <p className="text-lg font-medium">{vehicle.km}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MaterialIcon name="bolt" className="text-[30px] text-[#eebd2b]/80 font-light" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400">Power</p>
                <p className="text-lg font-medium">{vehicle.power}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MaterialIcon name="settings_input_component" className="text-[30px] text-[#eebd2b]/80 font-light" />
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400">Engine</p>
                <p className="text-lg font-medium">{vehicle.engine}</p>
              </div>
            </div>
          </section>

          {/* AI Insights Section */}
          <section className="mt-12 px-6">
            <div className="rounded-xl p-6 bg-[#eebd2b]/5 border border-[#eebd2b]/20 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 size-24 bg-[#eebd2b]/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <MaterialIcon name="auto_awesome" className="text-[20px] text-[#eebd2b]" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#eebd2b]">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg italic mb-1">Market Performance</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Currently valued 4% below local market average. High demand for {vehicle.name} in {vehicle.location}.
                    </p>
                  </div>
                  <div className="border-t border-[#eebd2b]/10 pt-4">
                    <h4 className="text-lg italic mb-1">Condition Report</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#eebd2b] rounded-full"
                          style={{ width: `${vehicle.aiScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#eebd2b]">{vehicle.aiScore}/100</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Pristine exterior with zero reported incidents. All service records verified through AI inspection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Highlights */}
          <section className="mt-12 px-6">
            <h3 className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-6">Gallery Highlights</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {vehicle.gallery.map((img, i) => (
                <div
                  key={i}
                  className="shrink-0 w-48 h-32 rounded-lg bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url('${img}')` }}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Sticky Bottom Action Bar — PROMOTE WITH AI + CONTACT LEAD */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-6 bg-gradient-to-t from-[#121212] via-[#121212]/95 to-transparent max-w-lg mx-auto">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              type="button"
              onClick={() => setShowDescriptionSheet(true)}
              className="flex-1 h-14 rounded-xl border border-[#eebd2b]/40 flex items-center justify-center gap-2 text-[#eebd2b] font-bold tracking-wide glass-effect active:scale-95 transition-transform"
            >
              <MaterialIcon name="auto_awesome" className="text-[20px]" />
              AI DESCRIBE
            </button>
            <Link
              href={`/smart-reply?vehicleId=${vehicle.id}`}
              className="flex-[1.2] h-14 rounded-xl bg-[#eebd2b] text-[#121212] font-extrabold tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_8px_30px_rgb(238,189,43,0.3)]"
            >
              <MaterialIcon name="chat_bubble" className="text-[20px]" />
              CONTACT LEAD
            </Link>
          </div>
          <div className="h-4" />
        </div>
      </div>

      {/* AI Description Sheet */}
      {showDescriptionSheet && (
        <AiDescriptionSheet
          vehicleId={vehicle.id}
          vehicleName={`${vehicle.year} ${vehicle.name}`}
          onClose={() => setShowDescriptionSheet(false)}
        />
      )}
    </>
  );
}
