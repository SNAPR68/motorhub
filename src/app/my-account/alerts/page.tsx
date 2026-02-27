"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

interface PriceAlert {
  id: number;
  carName: string;
  targetPrice: number;
  currentPrice: number;
  trend: "up" | "down";
  trendNote: string;
}

const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 1,
    carName: "Maruti Swift 2024",
    targetPrice: 650000,
    currentPrice: 689000,
    trend: "down",
    trendNote: "Price dropped ₹10K this week",
  },
  {
    id: 2,
    carName: "Hyundai Venue 2024",
    targetPrice: 800000,
    currentPrice: 794000,
    trend: "down",
    trendNote: "Target reached!",
  },
];

type NotifChannel = "Email" | "SMS" | "Push";

function formatPrice(val: number): string {
  if (val >= 100000) {
    const lakhs = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 1);
    return `₹${lakhs}L`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>(INITIAL_ALERTS);
  const [carName, setCarName] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [channels, setChannels] = useState<Set<NotifChannel>>(new Set(["Push"]));

  const toggleChannel = (ch: NotifChannel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  };

  const addAlert = () => {
    if (!carName.trim() || !targetPrice.trim()) return;
    const price = parseInt(targetPrice.replace(/[^0-9]/g, ""), 10);
    if (isNaN(price) || price <= 0) return;

    const newAlert: PriceAlert = {
      id: Date.now(),
      carName: carName.trim(),
      targetPrice: price,
      currentPrice: Math.round(price * (1 + (Math.random() * 0.1 - 0.03))),
      trend: Math.random() > 0.5 ? "down" : "up",
      trendNote: "Tracking started",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setCarName("");
    setTargetPrice("");
  };

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

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
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            {alerts.length} active
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Create Alert Section */}
        <div
          className="p-4 rounded-2xl border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon name="add_alert" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <h2 className="text-sm font-bold text-white">Create Alert</h2>
          </div>

          <div className="space-y-2.5">
            <input
              type="text"
              placeholder="Car name (e.g. Maruti Swift 2024)"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            <input
              type="text"
              placeholder="Target price (₹)"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
            <button
              onClick={addAlert}
              className="w-full h-10 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="notifications_active" className="text-[16px]" />
              Set Alert
            </button>
          </div>
        </div>

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Alerts
            </h2>

            {alerts.map((alert) => {
              const belowTarget = alert.currentPrice <= alert.targetPrice;
              const diff = alert.currentPrice - alert.targetPrice;
              const diffStr = diff > 0 ? `₹${(diff / 1000).toFixed(0)}K above` : "Target reached!";

              return (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl border"
                  style={{
                    background: belowTarget
                      ? "rgba(16,185,129,0.04)"
                      : "rgba(255,255,255,0.03)",
                    borderColor: belowTarget
                      ? "rgba(16,185,129,0.2)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{alert.carName}</h3>
                        {belowTarget && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}
                          >
                            Goal!
                          </span>
                        )}
                      </div>

                      {/* Prices */}
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Target</p>
                          <p className="text-sm font-bold text-white">{formatPrice(alert.targetPrice)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Current</p>
                          <p
                            className="text-sm font-bold"
                            style={{ color: belowTarget ? "#34d399" : "#fbbf24" }}
                          >
                            {formatPrice(alert.currentPrice)}
                          </p>
                        </div>
                      </div>

                      {/* Trend */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <MaterialIcon
                          name={alert.trend === "down" ? "trending_down" : "trending_up"}
                          className="text-[14px]"
                          style={{ color: alert.trend === "down" ? "#34d399" : "#f87171" }}
                        />
                        <span className="text-[11px] text-slate-500">{alert.trendNote}</span>
                        {!belowTarget && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-auto"
                            style={{ background: "rgba(245,158,11,0.1)", color: "#fbbf24" }}
                          >
                            {diffStr}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 transition-all"
                      style={{ background: "rgba(239,68,68,0.08)" }}
                    >
                      <MaterialIcon name="delete" className="text-[16px]" style={{ color: "#f87171" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
      </main>

      <BuyerBottomNav />
    </div>
  );
}
