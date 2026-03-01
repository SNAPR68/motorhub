"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { createServiceBooking } from "@/lib/api";

/* Stitch: service_logistics_&_confirmation — #dab80b, Space Grotesk, #0a0a0a */

function ServiceLogisticsInner() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const dateStr = searchParams.get("date") ?? "2026-02-24";
  const timeStr = searchParams.get("time") ?? "11:30 AM";
  const packageName = searchParams.get("pkg") ?? "Standard Maintenance";

  const [logistics, setLogistics] = useState<"valet" | "self">("valet");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Slide-to-confirm drag state
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  function onPointerDown(e: React.PointerEvent) {
    if (submitting || confirmed) return;
    isDragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;
    const sliderW = sliderRef.current?.offsetWidth ?? 300;
    const thumbW = 56;
    const max = sliderW - thumbW - 8;
    const delta = Math.max(0, Math.min(max, e.clientX - startX.current));
    if (thumbRef.current) thumbRef.current.style.transform = `translateX(${delta}px)`;
    if (delta >= max * 0.85) {
      isDragging.current = false;
      handleConfirm();
    }
  }

  function onPointerUp() {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (thumbRef.current) thumbRef.current.style.transform = "translateX(0px)";
  }

  async function handleConfirm() {
    if (submitting || confirmed) return;
    setSubmitting(true);
    setError(null);

    // Build scheduledAt from date + time strings
    const [y, m, d] = dateStr.split("-").map(Number);
    const cleanTime = timeStr.replace(" AM", "").replace(" PM", "");
    const [hh, mm] = cleanTime.split(":").map(Number);
    const isPm = timeStr.includes("PM") && hh !== 12;
    const hour = isPm ? hh + 12 : hh;
    const scheduledAt = new Date(y, m - 1, d, hour, mm).toISOString();

    try {
      const result = await createServiceBooking({
        type: "INSPECTION",
        plan: packageName,
        amount: undefined,
        details: {
          vehicleId: vehicleId ?? undefined,
          scheduledAt,
          packageName,
          logistics,
          notes: notes || undefined,
        },
      });
      setAppointmentId(result?.id ?? null);
      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      if (thumbRef.current) thumbRef.current.style.transform = "translateX(0px)";
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto" style={{ background: "#0a0a0a", fontFamily: "'Space Grotesk', sans-serif" }}>
        <div className="h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ background: "rgba(218,184,11,0.15)" }}>
          <MaterialIcon name="check_circle" className="text-[48px]" style={{ color: "#dab80b" }} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Booking Confirmed</h2>
        <p className="text-sm text-slate-400 mb-1">{packageName}</p>
        <p className="text-sm text-slate-400 mb-6">{dateStr} · {timeStr} · {logistics === "valet" ? "Valet Pick-up" : "Self Drop-off"}</p>
        {appointmentId && (
          <p className="text-xs font-mono text-slate-600 mb-8">Ref: {appointmentId.slice(0, 8).toUpperCase()}</p>
        )}
        <div className="flex flex-col gap-3 w-full">
          <Link href="/my-cars" className="flex items-center justify-center h-12 rounded-xl text-sm font-bold text-black w-full" style={{ background: "#dab80b" }}>
            Back to My Cars
          </Link>
          <Link href="/service" className="flex items-center justify-center h-12 rounded-xl text-sm font-semibold border border-white/10 w-full text-slate-300">
            Book Another Service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex h-dvh max-w-md mx-auto flex-col overflow-hidden shadow-2xl text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <Link
          href={`/service${vehicleId ? `?vehicleId=${vehicleId}` : ""}`}
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
          <div className="h-1 w-12 rounded-full bg-[#dab80b]" style={{ boxShadow: "0 0 10px rgba(218,184,11,0.5)" }} />
          <div className="h-1 w-8 rounded-full bg-[#2a2a2a]" />
        </div>

        {/* Booking summary */}
        <div className="mb-6 rounded-xl p-4 border border-[#dab80b]/20" style={{ background: "rgba(218,184,11,0.05)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#dab80b] mb-2">Booking Summary</p>
          <div className="space-y-1.5">
            {[
              { label: "Package", val: packageName },
              { label: "Date", val: dateStr },
              { label: "Time", val: timeStr },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logistics Toggle */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">Pickup Option</p>
          <div className="flex h-12 w-full items-center gap-1 rounded-xl bg-[#161616] p-1 border border-[#2a2a2a]">
            {(["valet", "self"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setLogistics(opt)}
                className={`flex h-full flex-1 items-center justify-center rounded-lg px-2 transition-all text-sm font-semibold tracking-wide ${logistics === opt ? "bg-[#dab80b] text-[#0a0a0a]" : "text-slate-400"}`}
              >
                {opt === "valet" ? "Valet Pick-up" : "Self Drop-off"}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400 leading-relaxed italic">
            {logistics === "valet"
              ? "Our concierge will pick up and return your vehicle."
              : "Drop off your vehicle at our service center."}
          </p>
        </div>

        {/* Map Module */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[#2a2a2a] aspect-[4/3]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.8) 100%)" }} />
          <div className="absolute top-4 left-4 right-4">
            <div className="p-3 rounded-xl flex items-center gap-3 w-fit" style={{ background: "rgba(22,22,22,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(218,184,11,0.1)" }}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dab80b]/20 text-[#dab80b]">
                <MaterialIcon name="home" className="text-[18px]" />
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Origin</p>
                <p className="text-xs font-semibold">124 Golf Course Rd, Gurgaon</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl" style={{ background: "rgba(22,22,22,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(218,184,11,0.1)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#dab80b] animate-pulse" />
                <span className="text-xs font-medium text-[#dab80b] uppercase tracking-widest">Live Estimate</span>
              </div>
              <span className="text-xs font-bold">14 Mins Away</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <MaterialIcon name="precision_manufacturing" className="text-[#dab80b]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Autovinci South Delhi</h4>
                <p className="text-[11px] text-slate-400">Certified Master Technicians</p>
              </div>
            </div>
          </div>
        </div>

        {/* Concierge Notes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="text-sm font-bold uppercase tracking-widest text-slate-400">Concierge Notes</label>
            <MaterialIcon name="edit_note" className="text-[#dab80b] text-[20px]" />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 rounded-xl bg-[#161616] border border-[#2a2a2a] p-4 text-sm focus:border-[#dab80b] outline-none transition-all placeholder:text-slate-600 resize-none text-slate-100"
            placeholder="Specify any special requests for our master technicians (e.g., 'Check brake noise', 'Detail interior')..."
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl px-4 py-3 border border-red-500/20" style={{ background: "rgba(239,68,68,0.06)" }}>
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </main>

      {/* Bottom Slide-to-Confirm */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
        <div
          ref={sliderRef}
          className="relative flex h-16 w-full items-center overflow-hidden rounded-full bg-[#161616] border border-[#2a2a2a] p-1"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 pl-8">
              {submitting ? "Booking..." : "Slide to Confirm"}
            </span>
          </div>
          <div
            ref={thumbRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="relative z-10 flex h-14 w-14 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-[#dab80b] text-[#0a0a0a] shadow-lg shadow-[#dab80b]/20 select-none"
            style={{ touchAction: "none" }}
          >
            {submitting
              ? <div className="h-5 w-5 rounded-full border-2 border-[#0a0a0a] border-t-transparent animate-spin" />
              : <MaterialIcon name="keyboard_double_arrow_right" className="font-bold" />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceLogisticsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-[#dab80b] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ServiceLogisticsInner />
    </Suspense>
  );
}
