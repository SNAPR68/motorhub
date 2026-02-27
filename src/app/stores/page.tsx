"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchStores } from "@/lib/api";
import type { DbStore } from "@/lib/api";
import { SkeletonList } from "@/components/ui/Skeleton";

/* ── design tokens: multi-store_global_overview ── */
// primary: #0df2f2 (cyan), font: Manrope, bg: #0a0f0f (matte-black), silver: #cbd5e1

const STATUS_STYLES: Record<string, { borderColor: string; statusBg: string; statusColor: string; dotColor: string }> = {
  ACTIVE: { borderColor: "#0df2f2", statusBg: "rgba(13,242,242,0.1)", statusColor: "#0df2f2", dotColor: "#0df2f2" },
  INACTIVE: { borderColor: "rgba(203,213,225,0.4)", statusBg: "rgba(203,213,225,0.1)", statusColor: "rgba(203,213,225,0.6)", dotColor: "rgba(203,213,225,0.6)" },
};

export default function MultiStorePage() {
  const { data, isLoading } = useApi(() => fetchStores(), []);
  const stores: DbStore[] = data?.stores ?? [];

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col overflow-x-hidden pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0f0f", color: "#f5f8f8" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "rgba(34,73,73,0.2)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(13,242,242,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full p-[2px]"
            style={{ background: "linear-gradient(to top right, #0df2f2, #34d399)" }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-sm font-extrabold"
              style={{ background: "#0a0f0f", color: "#0df2f2" }}
            >
              R
            </div>
          </div>
          <div>
            <p
              className="text-[10px] uppercase font-bold leading-none"
              style={{ letterSpacing: "0.2em", color: "rgba(203,213,225,0.6)" }}
            >
              Autovinci
            </p>
            <h1 className="font-extrabold text-sm tracking-tight">Executive Portal</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(13,242,242,0.2)", color: "#0df2f2" }}
          >
            <MaterialIcon name="notifications" className="!text-[20px]" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full border"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(13,242,242,0.2)", color: "#0df2f2" }}
          >
            <MaterialIcon name="add_business" className="!text-[20px]" />
          </button>
        </div>
      </header>

      {/* ── Search ── */}
      <div className="px-6 py-4">
        <label className="relative flex items-center w-full">
          <div className="absolute left-4" style={{ color: "rgba(13,242,242,0.6)" }}>
            <MaterialIcon name="search" />
          </div>
          <input
            type="text"
            placeholder="Search vehicles in inventory..."
            className="w-full h-14 pl-12 pr-4 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f5f8f8",
            }}
          />
        </label>
      </div>

      {/* ── Map Section ── */}
      <section className="px-4 mb-6">
        <div
          className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 40% 50%, rgba(13,242,242,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(52,211,153,0.1) 0%, transparent 40%), #0a0f0f",
            }}
          />
          {/* Dynamic Map Pins */}
          {stores.slice(0, 3).map((store, i) => {
            const positions = [
              { top: "30%", left: "55%" },
              { top: "45%", left: "65%" },
              { top: "40%", left: "42%" },
            ];
            const pos = positions[i] || positions[0];
            return (
              <div
                key={store.id}
                className="absolute flex flex-col items-center gap-1"
                style={{ top: pos.top, left: pos.left }}
              >
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: "#0df2f2", filter: "drop-shadow(0 0 8px rgba(13,242,242,0.6))" }}
                />
                <div
                  className="px-2 py-1 rounded text-[10px] text-white border"
                  style={{ background: "rgba(10,15,15,0.8)", borderColor: "rgba(13,242,242,0.3)" }}
                >
                  {store.city}
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-bold border"
              style={{
                background: "rgba(13,242,242,0.2)",
                borderColor: "rgba(13,242,242,0.4)",
                color: "#0df2f2",
                backdropFilter: "blur(8px)",
              }}
            >
              LIVE NETWORK
            </span>
          </div>
        </div>
      </section>

      {/* ── Showroom Performance ── */}
      <div className="px-6 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-white text-xl font-bold tracking-tight">Showroom Performance</h2>
          <p className="text-xs" style={{ color: "rgba(203,213,225,0.5)" }}>
            Real-time data from {stores.length} location{stores.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="text-xs font-bold flex items-center gap-1" style={{ color: "#0df2f2" }}>
          VIEW ALL <MaterialIcon name="arrow_forward" className="text-sm" />
        </button>
      </div>

      {/* ── Store Cards ── */}
      <main className="flex-1 px-6 pb-4 space-y-4">
        {isLoading && stores.length === 0 && (
          <SkeletonList count={3} variant="dark" />
        )}

        {stores.map((store) => {
          const styles = store.status === "ACTIVE" ? STATUS_STYLES.ACTIVE : STATUS_STYLES.INACTIVE;
          const vehicleCount = store.vehicleCount ?? store._count?.vehicles ?? 0;

          return (
            <Link
              key={store.id}
              href={`/stores/${store.id}`}
              className="block p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(34,73,73,0.2)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(13,242,242,0.1)",
                borderLeft: `4px solid ${styles.borderColor}`,
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{store.name}</h3>
                  <p className="text-xs flex items-center gap-1" style={{ color: "rgba(203,213,225,0.5)" }}>
                    <MaterialIcon name="location_on" className="!text-[14px]" /> {store.city}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ background: styles.statusBg }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: styles.dotColor }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: styles.statusColor }}
                  >
                    {store.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase" style={{ color: "rgba(203,213,225,0.4)" }}>
                    Vehicles
                  </p>
                  <p className="text-white font-extrabold text-sm">{vehicleCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase" style={{ color: "rgba(203,213,225,0.4)" }}>
                    Manager
                  </p>
                  <p className="text-white font-extrabold text-sm truncate">
                    {store.manager || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase" style={{ color: "rgba(203,213,225,0.4)" }}>
                    Phone
                  </p>
                  <p className="text-white font-extrabold text-sm truncate">
                    {store.phone || "—"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {!isLoading && stores.length === 0 && (
          <div className="py-12 text-center">
            <MaterialIcon name="apartment" className="text-4xl text-slate-500 mb-2" />
            <p className="text-slate-400 text-sm">No stores yet</p>
          </div>
        )}
      </main>

      {/* ── FAB ── */}
      <button
        className="fixed right-6 bottom-28 w-14 h-14 rounded-full flex items-center justify-center z-40 active:scale-95 transition-transform"
        style={{
          background: "#0df2f2",
          color: "#0a0f0f",
          boxShadow: "0 4px 16px rgba(13,242,242,0.2)",
        }}
      >
        <MaterialIcon name="add" className="!text-[32px] font-bold" />
      </button>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 px-6 pt-3 pb-8 flex justify-between items-center border-t max-w-md mx-auto md:hidden"
        style={{
          background: "rgba(10,15,15,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {[
          { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: true },
          { icon: "directions_car", label: "Fleet", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "analytics", label: "AI Insights", href: "/analytics" },
          { icon: "settings", label: "Config", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ color: item.active ? "#0df2f2" : "rgba(203,213,225,0.4)" }}
          >
            <MaterialIcon
              name={item.icon}
              fill={item.active}
              className="!text-[28px]"
            />
            <p className="text-[10px] font-bold tracking-wider">{item.label.toUpperCase()}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
