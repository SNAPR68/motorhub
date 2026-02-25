"use client";

import {
  useState,
  use,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";

/* ── Virtual Tour 360° ──────────────────────────────────────────
   Real drag-to-pan panorama using pointer/touch events + CSS transform.
   The vehicle's images array is laid side-by-side at 300vw total width,
   giving a genuine "look around" feel without any external library.
   Tokens: #1773cf / Manrope / #111921
──────────────────────────────────────────────────────────────── */

// Hotspot definitions per image index (0-based)
const HOTSPOT_MAP: Record<number, Array<{ label: string; category: string; desc: string; x: number; y: number }>> = {
  0: [
    { label: "Front Fascia", category: "EXTERIOR", desc: "Aggressive grille with chrome surround and integrated DRLs.", x: 50, y: 42 },
    { label: "Alloy Wheels", category: "DESIGN", desc: "17-inch diamond-cut alloys with dark inserts.", x: 20, y: 68 },
  ],
  1: [
    { label: "Infotainment", category: "TECHNOLOGY", desc: "10.25-inch touchscreen with wireless Android Auto & CarPlay.", x: 48, y: 40 },
    { label: "Ambient Lighting", category: "INTERIOR", desc: "64-colour ambient lighting system with music sync.", x: 75, y: 55 },
    { label: "Leather Upholstery", category: "CRAFTSMANSHIP", desc: "Perforated leather seats with ventilation in front row.", x: 28, y: 62 },
  ],
  2: [
    { label: "Panoramic Sunroof", category: "COMFORT", desc: "1-touch electric sunroof with UV protection glass.", x: 50, y: 28 },
    { label: "Rear Camera", category: "SAFETY", desc: "360° surround-view camera system with dynamic guidelines.", x: 72, y: 50 },
  ],
};

const SCAN_LINES_COUNT = 8;

function usePanorama(totalImages: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const dragStartX = useRef(0);
  const startOffsetX = useRef(0);
  const velocityRef = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number | null>(null);

  const STRIP_MULTIPLIER = 3; // 300vw
  const getMaxOffset = useCallback(() => {
    if (!containerRef.current) return 0;
    const vw = containerRef.current.offsetWidth;
    return -(vw * STRIP_MULTIPLIER - vw);
  }, []);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(max, Math.max(min, val));

  // Update active image index based on scroll position
  const updateActiveIdx = useCallback((offset: number) => {
    if (!containerRef.current) return;
    const vw = containerRef.current.offsetWidth;
    const segmentWidth = (vw * STRIP_MULTIPLIER) / totalImages;
    const scrolled = -offset;
    const idx = clamp(Math.floor(scrolled / segmentWidth), 0, totalImages - 1);
    setActiveImageIdx(idx);
  }, [totalImages]);

  const applyInertia = useCallback(() => {
    velocityRef.current *= 0.92; // friction
    if (Math.abs(velocityRef.current) < 0.5) {
      velocityRef.current = 0;
      return;
    }
    setOffsetX((prev) => {
      const next = clamp(prev + velocityRef.current, getMaxOffset(), 0);
      updateActiveIdx(next);
      return next;
    });
    rafRef.current = requestAnimationFrame(applyInertia);
  }, [getMaxOffset, updateActiveIdx]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsDragging(true);
    dragStartX.current = e.clientX;
    startOffsetX.current = offsetX;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [offsetX]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocityRef.current = ((e.clientX - lastX.current) / dt) * 16;
    lastX.current = e.clientX;
    lastTime.current = now;
    if (!hasDragged && Math.abs(dx) > 8) setHasDragged(true);
    const next = clamp(startOffsetX.current + dx, getMaxOffset(), 0);
    setOffsetX(next);
    updateActiveIdx(next);
  }, [isDragging, hasDragged, getMaxOffset, updateActiveIdx]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    rafRef.current = requestAnimationFrame(applyInertia);
  }, [applyInertia]);

  // Scroll to a specific image
  const scrollToImage = useCallback((idx: number) => {
    if (!containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const vw = containerRef.current.offsetWidth;
    const segmentWidth = (vw * STRIP_MULTIPLIER) / totalImages;
    const target = clamp(-(segmentWidth * idx), getMaxOffset(), 0);
    // Animate to target
    const current = offsetX;
    const diff = target - current;
    let frame = 0;
    const FRAMES = 20;
    const animate = () => {
      frame++;
      const t = frame / FRAMES;
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const next = current + diff * ease;
      setOffsetX(next);
      setActiveImageIdx(idx);
      if (frame < FRAMES) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [offsetX, totalImages, getMaxOffset]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return { containerRef, offsetX, isDragging, hasDragged, activeImageIdx, onPointerDown, onPointerMove, onPointerUp, scrollToImage };
}

// ── Loading skeleton ────────────────────────────────────────────
function TourSkeleton() {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center gap-6 bg-[#111921]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-[#1773cf]/20 border-t-[#1773cf] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MaterialIcon name="360" className="text-[#1773cf] text-xl" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-white/50 text-xs font-bold uppercase tracking-[0.3em]">Loading Tour</span>
        <div className="flex gap-1 mt-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1773cf]/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function VirtualTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [showScanLines, setShowScanLines] = useState(true);

  // Dismiss scan lines after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowScanLines(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // Use raw DbVehicle for extra fields (panoramaImageIdx) not present on adapted type
  const rawVehicle = data?.vehicle ?? null;
  const images = vehicle?.gallery?.length ? vehicle.gallery : (vehicle?.image ? [vehicle.image] : []);
  const totalImages = Math.max(images.length, 1);
  const pan = usePanorama(totalImages);

  // Auto-scroll to the dealer-marked panoramic image on first load
  useEffect(() => {
    const idx = rawVehicle?.panoramaImageIdx;
    if (idx != null && idx > 0 && images.length > idx) {
      // Small delay so the panorama hook has time to measure the container
      const t = setTimeout(() => pan.scrollToImage(idx), 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawVehicle?.panoramaImageIdx, images.length]);

  if (isLoading) return <TourSkeleton />;
  if (!vehicle) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-4 bg-[#111921] text-white">
        <MaterialIcon name="360" className="text-4xl text-white/20" />
        <p className="text-white/40 text-sm">Vehicle not found</p>
        <Link href="/inventory" className="text-[#1773cf] text-sm font-bold">← Back to Inventory</Link>
      </div>
    );
  }

  const currentHotspots = HOTSPOT_MAP[pan.activeImageIdx] ?? HOTSPOT_MAP[0] ?? [];
  const STRIP_MULTIPLIER = 3;

  return (
    <div
      className="relative h-dvh w-full overflow-hidden select-none"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0e14" }}
    >
      {/* ── Panorama Canvas ─────────────────────────────────── */}
      <div
        ref={pan.containerRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        onPointerDown={pan.onPointerDown}
        onPointerMove={pan.onPointerMove}
        onPointerUp={pan.onPointerUp}
        onPointerLeave={pan.onPointerUp}
      >
        {/* Wide image strip: STRIP_MULTIPLIER × viewport width */}
        <div
          className="flex h-full"
          style={{
            width: `${STRIP_MULTIPLIER * 100}vw`,
            transform: `translateX(${pan.offsetX}px)`,
            transition: pan.isDragging ? "none" : "transform 0.05s linear",
            willChange: "transform",
          }}
        >
          {images.length > 0 ? (
            images.map((src: string, i: number) => (
              <div
                key={i}
                className="relative h-full shrink-0"
                style={{ width: `${(STRIP_MULTIPLIER * 100) / images.length}vw` }}
              >
                <Image
                  src={src}
                  alt={`${vehicle.name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            ))
          ) : (
            // No images fallback: dark gradient panorama
            <div
              className="h-full shrink-0 flex items-center justify-center"
              style={{
                width: `${STRIP_MULTIPLIER * 100}vw`,
                background: "linear-gradient(135deg, #0d1117 0%, #111921 30%, #151e28 60%, #0d1117 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-4 text-white/20">
                <MaterialIcon name="directions_car" className="text-8xl" />
                <span className="text-sm font-bold uppercase tracking-widest">No images uploaded</span>
              </div>
            </div>
          )}
        </div>

        {/* Gradient vignette — top & bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(10,14,20,0.7) 0%, transparent 25%, transparent 65%, rgba(10,14,20,0.85) 100%)",
          }}
        />

        {/* Side fade edges — left & right */}
        <div className="absolute inset-y-0 left-0 w-16 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(10,14,20,0.5), transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-16 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(10,14,20,0.5), transparent)" }} />

        {/* CRT scan lines — appear on load, then fade */}
        {showScanLines && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
            style={{ opacity: showScanLines ? 0.08 : 0 }}
          >
            {Array.from({ length: SCAN_LINES_COUNT }).map((_, i) => (
              <div key={i} className="absolute w-full" style={{ top: `${(i / SCAN_LINES_COUNT) * 100}%`, height: "1px", background: "rgba(23,115,207,0.8)" }} />
            ))}
          </div>
        )}

        {/* Hotspots — positioned over the viewport (not the strip) */}
        {currentHotspots.map((h, i) => (
          <div
            key={`${pan.activeImageIdx}-${i}`}
            className="absolute z-10"
            style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <button
              onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
              className="relative flex items-center justify-center"
            >
              {/* Pulse rings */}
              {activeHotspot !== i && (
                <>
                  <span className="absolute w-10 h-10 rounded-full animate-ping opacity-30" style={{ background: "rgba(23,115,207,0.5)", animationDuration: "2s" }} />
                  <span className="absolute w-7 h-7 rounded-full animate-ping opacity-20" style={{ background: "rgba(23,115,207,0.4)", animationDuration: "2s", animationDelay: "0.5s" }} />
                </>
              )}
              {/* Dot */}
              <span
                className="relative flex w-5 h-5 rounded-full items-center justify-center transition-all duration-200"
                style={{
                  background: activeHotspot === i ? "#1773cf" : "rgba(23,115,207,0.85)",
                  boxShadow: activeHotspot === i ? "0 0 0 3px rgba(23,115,207,0.4)" : "0 0 0 2px rgba(255,255,255,0.3)",
                  transform: activeHotspot === i ? "scale(1.3)" : "scale(1)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </button>

            {/* Tooltip */}
            {activeHotspot === i && (
              <div
                className="absolute z-30 w-52 rounded-xl p-3.5 pointer-events-none"
                style={{
                  bottom: "calc(100% + 12px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(10,14,20,0.88)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(23,115,207,0.35)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(23,115,207,0.1)",
                }}
              >
                {/* Connector arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                  style={{ background: "rgba(10,14,20,0.88)", borderRight: "1px solid rgba(23,115,207,0.35)", borderBottom: "1px solid rgba(23,115,207,0.35)" }} />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1773cf] mb-1.5">{h.category}</p>
                <h3 className="text-sm font-bold text-white leading-tight mb-1">{h.label}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{h.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── HUD: Top Bar ────────────────────────────────────── */}
      <header className="absolute top-0 left-0 w-full z-30 px-4 pt-10 pb-4">
        <div
          className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "rgba(10,14,20,0.65)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          <Link
            href={`/showcase/${vehicle.id}`}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-white/10"
          >
            <MaterialIcon name="arrow_back_ios_new" className="text-slate-200 text-[18px]" />
          </Link>

          <div className="flex flex-col items-center flex-1 min-w-0">
            <h1 className="text-sm font-extrabold text-white tracking-tight truncate max-w-full">{vehicle.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#1773cf]">360° VIEW</span>
              {/* Progress bar showing pan position */}
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: "100%",
                    background: "#1773cf",
                    transform: `scaleX(${Math.abs(pan.offsetX) > 0 ? (1 - Math.abs(pan.offsetX) / (window?.innerWidth ? window.innerWidth * (STRIP_MULTIPLIER - 1) : 1)) : 1})`,
                    transformOrigin: pan.offsetX <= 0 ? "left" : "right",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Gyro toggle */}
            <button
              onClick={() => setGyroEnabled(!gyroEnabled)}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
              style={{ background: gyroEnabled ? "rgba(23,115,207,0.2)" : "transparent" }}
            >
              <MaterialIcon
                name="screen_rotation"
                className="text-[18px] transition-colors"
                style={{ color: gyroEnabled ? "#1773cf" : "#64748b" }}
              />
            </button>
            {/* Photo counter */}
            <div
              className="px-2.5 py-1 rounded-lg flex items-center gap-1"
              style={{ background: "rgba(23,115,207,0.15)", border: "1px solid rgba(23,115,207,0.25)" }}
            >
              <span className="text-[11px] font-black text-white">{pan.activeImageIdx + 1}</span>
              <span className="text-[11px] text-white/30">/</span>
              <span className="text-[11px] font-medium text-white/50">{totalImages}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HUD: Drag Hint ───────────────────────────────────── */}
      <div
        className="absolute z-20 left-1/2 -translate-x-1/2 transition-all duration-700 pointer-events-none"
        style={{
          bottom: "180px",
          opacity: pan.hasDragged ? 0 : 1,
          transform: `translateX(-50%) translateY(${pan.hasDragged ? "10px" : "0"})`,
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{
            background: "rgba(10,14,20,0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(23,115,207,0.3)",
          }}
        >
          {/* Animated hand icon */}
          <div className="animate-bounce">
            <MaterialIcon name="swipe" className="text-sm text-[#1773cf]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Drag to explore</span>
        </div>
      </div>

      {/* ── HUD: Side Compass Ring ───────────────────────────── */}
      <div className="absolute z-20 right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {images.map((_: string, i: number) => (
          <button
            key={i}
            onClick={() => { pan.scrollToImage(i); setActiveHotspot(null); }}
            className="transition-all duration-200"
            style={{
              width: pan.activeImageIdx === i ? "6px" : "4px",
              height: pan.activeImageIdx === i ? "24px" : "8px",
              borderRadius: "99px",
              background: pan.activeImageIdx === i ? "#1773cf" : "rgba(255,255,255,0.25)",
              boxShadow: pan.activeImageIdx === i ? "0 0 8px rgba(23,115,207,0.6)" : "none",
            }}
          />
        ))}
      </div>

      {/* ── HUD: AI Concierge FAB ────────────────────────────── */}
      <div className="absolute z-30 left-4 bottom-36">
        <Link
          href="/concierge"
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1773cf 0%, #0d5aad 100%)",
            boxShadow: "0 8px 24px rgba(23,115,207,0.4)",
          }}
        >
          <MaterialIcon name="smart_toy" className="text-xl" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-white opacity-60" />
            <span className="relative flex h-3.5 w-3.5 rounded-full bg-white" />
          </span>
        </Link>
        <span className="block text-center text-[8px] font-bold text-[#1773cf] uppercase tracking-wider mt-1">Ask AI</span>
      </div>

      {/* ── Bottom: Image Thumbnail Strip + Actions ──────────── */}
      <div className="absolute bottom-0 left-0 w-full z-30">
        {/* Thumbnail row */}
        {images.length > 1 && (
          <div
            className="px-4 py-3 flex gap-2.5 overflow-x-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {images.map((src: string, i: number) => (
              <button
                key={i}
                onClick={() => { pan.scrollToImage(i); setActiveHotspot(null); }}
                className="relative shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  width: "64px",
                  height: "44px",
                  border: pan.activeImageIdx === i ? "2px solid #1773cf" : "2px solid rgba(255,255,255,0.1)",
                  boxShadow: pan.activeImageIdx === i ? "0 0 12px rgba(23,115,207,0.5)" : "none",
                  transform: pan.activeImageIdx === i ? "scale(1.05)" : "scale(1)",
                }}
              >
                <Image src={src} alt="" fill className="object-cover" />
                {pan.activeImageIdx === i && (
                  <div className="absolute inset-0" style={{ background: "rgba(23,115,207,0.2)" }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="px-4 pb-3 flex gap-3">
          <Link
            href={`/showcase/${vehicle.id}`}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-white text-sm font-bold transition-colors hover:bg-white/10"
            style={{
              background: "rgba(10,14,20,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <MaterialIcon name="info_outline" className="text-lg" />
            Full Specs
          </Link>
          <Link
            href={`/appointments?vehicleId=${vehicle.id}`}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 text-white text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #1773cf 0%, #0d5aad 100%)",
              boxShadow: "0 4px 16px rgba(23,115,207,0.4)",
            }}
          >
            <MaterialIcon name="calendar_month" className="text-lg" />
            Book Visit
          </Link>
        </div>

        {/* Bottom Nav */}
        <nav
          className="flex gap-2 border-t px-4 pb-8 pt-2.5"
          style={{
            background: "rgba(10,14,20,0.92)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {[
            { icon: "directions_car", label: "Showroom", href: "/showroom" },
            { icon: "auto_videocam", label: "Tour", href: "#", active: true },
            { icon: "search", label: "Search", href: "/inventory" },
            { icon: "favorite", label: "Saved", href: "/wishlist" },
            { icon: "account_circle", label: "Profile", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1"
              style={{ color: item.active ? "#1773cf" : "#475569" }}
            >
              <MaterialIcon name={item.icon} fill={item.active} className="text-[22px]" />
              <span className="text-[9px] font-bold uppercase tracking-wide">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Hotspot dismissal overlay ──────────────────────────── */}
      {activeHotspot !== null && (
        <div
          className="absolute inset-0 z-5"
          onClick={() => setActiveHotspot(null)}
        />
      )}
    </div>
  );
}
