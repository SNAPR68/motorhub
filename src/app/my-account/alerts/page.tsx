"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchWishlist, type DbVehicle } from "@/lib/api";

type NotifChannel = "Email" | "SMS" | "Push";

const STORAGE_KEY = "carobest_price_alerts";

function getAlertPrefs(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setAlertPref(vehicleId: string, enabled: boolean) {
  const prefs = getAlertPrefs();
  prefs[vehicleId] = enabled;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

function formatPrice(val: number): string {
  if (val >= 100000) {
    const lakhs = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 1);
    return `₹${lakhs}L`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function PriceAlertsPage() {
  const { data, isLoading: loading } = useApi(() => fetchWishlist(), []);

  const vehicles: DbVehicle[] = data?.wishlists?.map((w) => w.vehicle) ?? [];

  // Alert on/off state per vehicle, backed by localStorage
  const [alertOn, setAlertOn] = useState<Record<string, boolean>>({});
  const [channels, setChannels] = useState<Set<NotifChannel>>(new Set(["Push"]));

  // Load prefs from localStorage once vehicles arrive
  useEffect(() => {
    if (vehicles.length > 0) {
      const prefs = getAlertPrefs();
      const initial: Record<string, boolean> = {};
      for (const v of vehicles) {
        initial[v.id] = prefs[v.id] ?? true; // default on for wishlisted cars
      }
      setAlertOn(initial);
    }
  }, [vehicles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAlert = useCallback((id: string) => {
    setAlertOn((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      setAlertPref(id, next[id]);
      return next;
    });
  }, []);

  const toggleChannel = (ch: NotifChannel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  };

  const activeCount = Object.values(alertOn).filter(Boolean).length;

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Price Alerts</h1>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >
              {activeCount} active
            </span>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {loading ? (
          /* Loading skeleton */
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center py-20 text-center">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <MaterialIcon name="notifications_active" className="text-[32px]" style={{ color: "#fbbf24" }} />
            </div>
            <h2 className="text-base font-bold text-white mb-1">No price alerts</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-[260px]">
              Save some cars first to set price alerts. Shortlist cars you like and we will track prices for you.
            </p>
            <Link
              href="/new-cars"
              className="h-11 px-6 rounded-xl flex items-center gap-2 text-sm font-semibold text-white transition-all"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="search" className="text-[18px]" />
              Browse Cars
            </Link>
          </div>
        ) : (
          <>
            {/* Vehicle Alert Cards */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Watchlist
              </h2>

              {vehicles.map((vehicle) => {
                const isOn = alertOn[vehicle.id] ?? true;
                const imageUrl = vehicle.images?.[0];

                return (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-2xl border"
                    style={{
                      background: isOn
                        ? "rgba(17,82,212,0.04)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: isOn
                        ? "rgba(17,82,212,0.15)"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Thumbnail */}
                        <div
                          className="h-12 w-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={vehicle.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MaterialIcon name="directions_car" className="text-[20px] text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">
                            {vehicle.name} {vehicle.year}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center gap-3 mt-1.5">
                            <div>
                              <p className="text-[10px] text-slate-600 uppercase tracking-wider">Price</p>
                              <p className="text-sm font-bold" style={{ color: "#60a5fa" }}>
                                {vehicle.priceDisplay}
                              </p>
                            </div>
                          </div>

                          {/* Spec row */}
                          <div className="flex gap-1.5 mt-1.5">
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                            >
                              {vehicle.fuel}
                            </span>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                            >
                              {vehicle.km}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle alert */}
                      <button
                        onClick={() => toggleAlert(vehicle.id)}
                        className="relative w-11 h-6 rounded-full transition-all shrink-0 mt-1"
                        style={{
                          background: isOn ? "#1152d4" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <div
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                          style={{
                            left: isOn ? "calc(100% - 22px)" : "2px",
                          }}
                        />
                      </button>
                    </div>

                    {isOn && (
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                        <MaterialIcon name="notifications_active" className="text-[12px]" style={{ color: "#60a5fa" }} />
                        <span className="text-[11px] text-slate-500">
                          Alert active -- we will notify you when the price changes
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notification Preferences */}
            <div
              className="p-4 rounded-2xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MaterialIcon name="tune" className="text-[18px] text-slate-400" />
                <h2 className="text-sm font-bold text-white">Notification Preferences</h2>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Choose how you want to be notified when prices change.
              </p>
              <div className="flex gap-2">
                {(["Email", "SMS", "Push"] as NotifChannel[]).map((ch) => {
                  const active = channels.has(ch);
                  const icons: Record<NotifChannel, string> = {
                    Email: "mail",
                    SMS: "sms",
                    Push: "notifications",
                  };
                  return (
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className="flex-1 h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      style={{
                        background: active ? "rgba(17,82,212,0.15)" : "rgba(255,255,255,0.05)",
                        color: active ? "#60a5fa" : "#64748b",
                        border: active ? "1px solid rgba(17,82,212,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <MaterialIcon name={icons[ch]} className="text-[14px]" />
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
