"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchNotifications, fetchDealerPreferences, updateDealerPreferences } from "@/lib/api";

/* ── design tokens: dealer_notification_settings ── */
// primary: #196ee6, font: Noto Serif (headings) + Noto Sans (body), bg: #0a0a0a

const STORAGE_KEY = "av_notif_prefs";

type ToggleState = { whatsapp: boolean; email: boolean };

const ALERTS: { name: string; desc: string; whatsapp: boolean; email: boolean; highlight: boolean }[] = [
  { name: "New VIP Lead", desc: "High-priority inquiries", whatsapp: true, email: true, highlight: true },
  { name: "Market Price Drop", desc: "Inventory value intelligence", whatsapp: false, email: true, highlight: false },
  { name: "Social Media Sync", desc: "Automated marketing status", whatsapp: false, email: false, highlight: false },
  { name: "Test Drive Booking", desc: "Immediate client scheduling", whatsapp: true, email: true, highlight: true },
];

const DEFAULT_TOGGLES: ToggleState[] = ALERTS.map((a) => ({ whatsapp: a.whatsapp, email: a.email }));

function loadPrefs(): ToggleState[] {
  if (typeof window === "undefined") return DEFAULT_TOGGLES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ToggleState[];
  } catch {}
  return DEFAULT_TOGGLES;
}

export default function NotificationsPage() {
  const [toggles, setToggles] = useState<ToggleState[]>(DEFAULT_TOGGLES);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { data: notifData } = useApi(() => fetchNotifications(), []);
  const { data: prefsData } = useApi(() => fetchDealerPreferences(), []);
  const unreadCount = (notifData as { unreadCount?: number } | undefined)?.unreadCount ?? 0;

  // Load persisted prefs — API first, localStorage fallback
  useEffect(() => {
    const apiNotifs = prefsData?.notifications;
    if (apiNotifs && typeof apiNotifs === "object" && Object.keys(apiNotifs).length > 0) {
      const loaded = ALERTS.map((a, i) => ({
        whatsapp: (apiNotifs as Record<string, boolean>)[`${i}_whatsapp`] ?? a.whatsapp,
        email: (apiNotifs as Record<string, boolean>)[`${i}_email`] ?? a.email,
      }));
      setToggles(loaded);
    } else {
      setToggles(loadPrefs());
    }
  }, [prefsData]);

  const toggle = (idx: number, channel: "whatsapp" | "email") => {
    const next = [...toggles];
    next[idx] = { ...next[idx], [channel]: !next[idx][channel] };
    setToggles(next);
  };

  const handleSave = async () => {
    setSaving(true);
    // Build flat map for API persistence
    const notifMap: Record<string, boolean> = {};
    toggles.forEach((t, i) => {
      notifMap[`${i}_whatsapp`] = t.whatsapp;
      notifMap[`${i}_email`] = t.email;
    });
    try {
      await updateDealerPreferences({ notifications: notifMap });
    } catch {
      // Fallback to localStorage
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles)); } catch {}
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24 overflow-x-hidden"
      style={{
        fontFamily: "'Noto Sans', sans-serif",
        background: "#0a0a0a",
        color: "#f1f5f9",
        borderLeft: "1px solid rgba(192,192,192,0.1)",
        borderRight: "1px solid rgba(192,192,192,0.1)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 pt-12 pb-6 px-6 border-b"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(192,192,192,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/settings" className="flex items-center text-slate-400">
            <MaterialIcon name="chevron_left" className="text-[28px]" />
          </Link>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(25,110,230,0.15)", color: "#196ee6" }}>
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={handleSave}
              className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ background: saved ? "rgba(34,197,94,0.15)" : "rgba(25,110,230,0.1)", color: saved ? "#22c55e" : "#196ee6" }}
            >
              {saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            fontFamily: "'Noto Serif', serif",
            background: "linear-gradient(to right, #ffffff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Intelligence Alerts
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Configure your premium notification channels
        </p>
      </header>

      {/* ── Column Headers ── */}
      <div
        className="grid grid-cols-12 px-6 pt-8 pb-3 sticky top-[156px] z-[5]"
        style={{
          background: "#0a0a0a",
          borderBottom: "0.5px solid rgba(192,192,192,0.15)",
        }}
      >
        <div className="col-span-6">
          <span className="text-[10px] uppercase font-bold text-slate-500" style={{ letterSpacing: "0.2em" }}>
            Alert Type
          </span>
        </div>
        <div className="col-span-3 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500" style={{ letterSpacing: "0.2em" }}>
            WhatsApp
          </span>
        </div>
        <div className="col-span-3 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500" style={{ letterSpacing: "0.2em" }}>
            Email
          </span>
        </div>
      </div>

      {/* ── Notification List ── */}
      <main className="flex-1 pb-8">
        {ALERTS.map((alert, i) => (
          <div
            key={alert.name}
            className="grid grid-cols-12 items-center px-6 py-7"
            style={{ borderBottom: "0.5px solid rgba(192,192,192,0.15)" }}
          >
            <div className="col-span-6 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-base font-semibold text-slate-100"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  {alert.name}
                </span>
                <MaterialIcon
                  name="info"
                  className="text-[14px]"
                  // Use inline wrapper for dynamic color
                />
              </div>
              <p className="text-xs text-slate-500">{alert.desc}</p>
            </div>
            <div className="col-span-3 flex justify-center">
              <button
                onClick={() => toggle(i, "whatsapp")}
                className="w-11 h-6 rounded-full relative transition-colors"
                style={{
                  background: toggles[i].whatsapp ? "#196ee6" : "#1e293b",
                  boxShadow: toggles[i].whatsapp ? "0 0 12px 2px rgba(25,110,230,0.4)" : "none",
                }}
              >
                <div
                  className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all"
                  style={{ left: toggles[i].whatsapp ? "22px" : "2px" }}
                />
              </button>
            </div>
            <div className="col-span-3 flex justify-center">
              <button
                onClick={() => toggle(i, "email")}
                className="w-11 h-6 rounded-full relative transition-colors"
                style={{
                  background: toggles[i].email ? "#196ee6" : "#1e293b",
                  boxShadow: toggles[i].email ? "0 0 12px 2px rgba(25,110,230,0.4)" : "none",
                }}
              >
                <div
                  className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all"
                  style={{ left: toggles[i].email ? "22px" : "2px" }}
                />
              </button>
            </div>
          </div>
        ))}

        {/* Advanced Preferences */}
        <div className="px-6 py-8">
          <button
            className="w-full py-4 rounded-lg flex items-center justify-between px-4 active:scale-[0.98] transition-all"
            style={{ border: "1px solid rgba(192,192,192,0.1)" }}
          >
            <div className="flex items-center gap-3">
              <MaterialIcon name="tune" className="text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Advanced Delivery Timing</span>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-500" />
          </button>
        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 border-t md:hidden"
        style={{
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(192,192,192,0.1)",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          {[
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "group", label: "Leads", href: "/leads" },
            { icon: "notifications", label: "Alerts", href: "/settings/notifications", active: true },
            { icon: "account_circle", label: "Profile", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-1"
              style={{ color: item.active ? "#196ee6" : "#64748b" }}
            >
              <div className="relative">
                <MaterialIcon name={item.icon} fill={item.active} className="text-2xl" />
                {item.active && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{
                      background: "#196ee6",
                      boxShadow: "0 0 8px rgba(25,110,230,0.8)",
                    }}
                  />
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-normal">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      </nav>

      {/* Decorative Blur */}
      <div
        className="fixed top-0 right-0 w-64 h-64 rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"
        style={{ background: "rgba(25,110,230,0.05)", filter: "blur(120px)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"
        style={{ background: "rgba(25,110,230,0.05)", filter: "blur(100px)" }}
      />
    </div>
  );
}
