"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchStore } from "@/lib/api";

/* ── design tokens: store_detail (matches multi-store_global_overview) ── */
// primary: #0df2f2 (cyan), font: Manrope, bg: #0a0f0f, card: rgba(34,73,73,0.2), border: rgba(13,242,242,0.1)

interface StoreVehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  priceDisplay: string;
  km: string;
  status: string;
  images: string[];
}

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useApi(() => fetchStore(id), [id]);
  const store = data?.store ?? null;

  if (isLoading || !store) {
    return (
      <div
        className="min-h-screen max-w-md mx-auto flex items-center justify-center"
        style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0f0f", color: "#f5f8f8" }}
      >
        <div className="animate-pulse text-slate-400 text-sm">Loading store...</div>
      </div>
    );
  }

  const storeAny = store as unknown as Record<string, unknown>;
  const vehicles: StoreVehicle[] = (storeAny.vehicles as StoreVehicle[]) ?? [];
  const vehicleCount = storeAny._count as Record<string, number> | undefined;

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0f0f", color: "#f5f8f8" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b"
        style={{
          background: "rgba(10,15,15,0.85)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(13,242,242,0.1)",
        }}
      >
        <Link href="/stores" className="flex items-center gap-2" style={{ color: "#0df2f2" }}>
          <MaterialIcon name="arrow_back_ios_new" className="!text-[18px]" />
          <span className="text-sm font-semibold">Stores</span>
        </Link>
        <h1 className="text-base font-bold text-white absolute left-1/2 -translate-x-1/2">
          Store Details
        </h1>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full border"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(13,242,242,0.2)" }}
        >
          <span style={{ color: "#0df2f2" }}>
            <MaterialIcon name="more_horiz" className="!text-[20px]" />
          </span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* ── Store Hero ── */}
        <section className="px-5 pt-6 pb-4">
          <div
            className="p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(34,73,73,0.2)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(13,242,242,0.15)",
              borderLeft: "4px solid #0df2f2",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
              style={{ background: "rgba(13,242,242,0.08)", filter: "blur(40px)" }}
            />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">{store.name}</h2>
                  <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "rgba(203,213,225,0.5)" }}>
                    <MaterialIcon name="location_on" className="!text-[14px]" />
                    {store.address}, {store.city}
                  </p>
                </div>
                <div
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{ background: "rgba(13,242,242,0.1)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0df2f2" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "#0df2f2" }}
                  >
                    {store.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {[
                  { icon: "person", value: store.manager || "No manager" },
                  { icon: "call", value: store.phone || "No phone" },
                ].map((info) => (
                  <div key={info.icon} className="flex items-center gap-3">
                    <span style={{ color: "rgba(13,242,242,0.5)" }}>
                      <MaterialIcon name={info.icon} className="!text-[16px]" />
                    </span>
                    <span className="text-sm text-slate-300">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Metrics Grid ── */}
        <section className="px-5 pb-6">
          <h3
            className="text-[10px] font-bold uppercase mb-3"
            style={{ letterSpacing: "0.2em", color: "rgba(203,213,225,0.4)" }}
          >
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Vehicles", value: String(vehicleCount?.vehicles ?? vehicles.length), icon: "directions_car", color: "#0df2f2" },
              { label: "Status", value: store.status, icon: "auto_awesome", color: "#f59e0b" },
            ].map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(34,73,73,0.15)",
                  border: "1px solid rgba(13,242,242,0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ color: m.color }}>
                    <MaterialIcon name={m.icon} className="!text-[20px]" />
                  </span>
                </div>
                <p className="text-lg font-extrabold text-white">{m.value}</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "rgba(203,213,225,0.5)" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Inventory ── */}
        {vehicles.length > 0 && (
          <section className="px-5 pb-6">
            <div className="flex justify-between items-center mb-3">
              <h3
                className="text-[10px] font-bold uppercase"
                style={{ letterSpacing: "0.2em", color: "rgba(203,213,225,0.4)" }}
              >
                Store Inventory
              </h3>
              <Link href="/inventory" className="text-[10px] font-bold flex items-center gap-1" style={{ color: "#0df2f2" }}>
                VIEW ALL <MaterialIcon name="arrow_forward" className="!text-[12px]" />
              </Link>
            </div>
            <div className="space-y-3">
              {vehicles.slice(0, 4).map((car) => {
                const statusColor = car.status === "RESERVED" ? "#f59e0b" : car.status === "SOLD" ? "#64748b" : "#0df2f2";
                const statusBg = car.status === "RESERVED" ? "rgba(245,158,11,0.1)" : car.status === "SOLD" ? "rgba(100,116,139,0.1)" : "rgba(13,242,242,0.1)";

                return (
                  <div
                    key={car.id}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "rgba(34,73,73,0.15)",
                      border: "1px solid rgba(13,242,242,0.08)",
                    }}
                  >
                    <div
                      className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border"
                      style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
                    >
                      {car.images?.[0] ? (
                        <Image src={car.images[0]} alt={car.name} width={64} height={48} className="object-cover w-full h-full" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MaterialIcon name="directions_car" className="text-slate-500 !text-[16px]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{car.name}</p>
                      <p className="text-[10px]" style={{ color: "rgba(203,213,225,0.5)" }}>
                        {car.year} &bull; {car.km}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold" style={{ color: "#0df2f2" }}>{car.priceDisplay}</p>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ background: statusBg, color: statusColor }}
                      >
                        {car.status.toLowerCase().replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Quick Actions ── */}
        <section className="px-5 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/analytics"
              className="flex items-center gap-2 p-4 rounded-xl active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(13,242,242,0.08)",
                border: "1px solid rgba(13,242,242,0.15)",
              }}
            >
              <span style={{ color: "#0df2f2" }}>
                <MaterialIcon name="analytics" />
              </span>
              <span className="text-sm font-bold text-white">Analytics</span>
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-2 p-4 rounded-xl active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.15)",
              }}
            >
              <span style={{ color: "#34d399" }}>
                <MaterialIcon name="inventory_2" />
              </span>
              <span className="text-sm font-bold text-white">Inventory</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 px-6 pt-3 pb-8 flex justify-between items-center border-t max-w-md mx-auto"
        style={{
          background: "rgba(10,15,15,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {[
          { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
          { icon: "directions_car", label: "Fleet", href: "/inventory" },
          { icon: "apartment", label: "Stores", href: "/stores", active: true },
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
