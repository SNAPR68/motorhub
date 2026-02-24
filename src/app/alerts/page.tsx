"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: buyer_alert_preferences — #dab80b, Manrope, #0a0a0a */

const EMAIL_PREFS = [
  {
    key: "new_arrivals",
    label: "New Arrivals in My Collection",
    desc: "Immediate notifications for bookmarked marques.",
    on: true,
  },
  {
    key: "price_change",
    label: "Price Change Alerts",
    desc: "Instant updates on value shifts for watchlisted vehicles.",
    on: false,
  },
];

const WA_PREFS = [
  {
    key: "concierge",
    label: "Concierge Personal Responses",
    desc: "Direct 1-on-1 access to our procurement team.",
    on: true,
    live: true,
  },
  {
    key: "urgent",
    label: "Urgent Inventory Alerts",
    desc: "Exclusive early-access to off-market listings.",
    on: true,
  },
];

export default function AlertsPage() {
  const [emailPrefs, setEmailPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(EMAIL_PREFS.map((p) => [p.key, p.on]))
  );
  const [waPrefs, setWaPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WA_PREFS.map((p) => [p.key, p.on]))
  );
  const [frequency, setFrequency] = useState("daily");

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-x-hidden max-w-[430px] mx-auto shadow-2xl text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-4 border-b border-[#2a2a2a]">
        <Link
          href="/my-cars"
          className="flex items-center justify-center size-10 rounded-full hover:bg-[#161616] transition-colors"
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-widest">
          VIP Alert Settings
        </h1>
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-[#161616] transition-colors">
          <MaterialIcon name="verified_user" className="text-[#dab80b]" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Hero Description */}
        <div className="px-6 pt-8 pb-4">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Tailored Intelligence
          </h2>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            Customize your concierge experience. Get real-time updates on rare
            inventory and market movements.
          </p>
        </div>

        {/* Email Briefings */}
        <section className="mt-6 px-4">
          <div className="flex items-center gap-2 px-2 mb-4">
            <MaterialIcon name="mail" className="text-[#dab80b] text-xl" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Email Briefings
            </h3>
          </div>
          <div className="space-y-3">
            {EMAIL_PREFS.map((p) => (
              <div
                key={p.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#161616] border border-[#2a2a2a] transition-all"
              >
                <div className="flex flex-col gap-1 pr-4">
                  <span className="text-sm font-semibold">{p.label}</span>
                  <span className="text-xs text-slate-400">{p.desc}</span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={emailPrefs[p.key]}
                    onChange={() =>
                      setEmailPrefs((s) => ({ ...s, [p.key]: !s[p.key] }))
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#dab80b] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>
            ))}

            {/* Frequency Selector */}
            <div className="p-4 rounded-2xl bg-[#161616] border border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">
                    Delivery Frequency
                  </span>
                  <span className="text-xs text-slate-400">
                    How often should we reach out?
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="appearance-none bg-[#2a2a2a] text-xs font-bold text-[#dab80b] px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#dab80b] border-none"
                  >
                    <option value="instant">Instant</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Report</option>
                  </select>
                  <MaterialIcon
                    name="expand_more"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs pointer-events-none text-[#dab80b]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Concierge */}
        <section className="mt-10 px-4">
          <div className="flex items-center gap-2 px-2 mb-4">
            <MaterialIcon name="chat" className="text-green-500 text-xl" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              WhatsApp Concierge
            </h3>
          </div>
          <div className="space-y-3">
            {WA_PREFS.map((p) => (
              <div
                key={p.key}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#161616] border border-[#2a2a2a] transition-all"
              >
                <div className="flex flex-col gap-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{p.label}</span>
                    {p.live && (
                      <span className="flex size-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{p.desc}</span>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={waPrefs[p.key]}
                    onChange={() =>
                      setWaPrefs((s) => ({ ...s, [p.key]: !s[p.key] }))
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-800 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#dab80b] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                </label>
              </div>
            ))}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#dab80b]/10 border border-[#dab80b]/20">
              <MaterialIcon name="phone_iphone" className="text-[#dab80b]" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#dab80b] tracking-wider">
                  Connected Account
                </span>
                <span className="text-sm font-medium text-slate-300">
                  +91 98765 ●●●● 10
                </span>
              </div>
              <button className="ml-auto text-xs font-bold text-[#dab80b] hover:underline">
                Edit
              </button>
            </div>
          </div>
        </section>

        {/* Global Settings */}
        <section className="mt-10 px-4 mb-10">
          <div className="flex items-center gap-2 px-2 mb-4">
            <MaterialIcon name="settings" className="text-slate-400 text-xl" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Preferences
            </h3>
          </div>
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#161616] transition-colors">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">Quiet Hours</span>
                <span className="text-xs text-slate-500">
                  Currently: 22:00 — 07:00
                </span>
              </div>
              <MaterialIcon name="chevron_right" className="text-slate-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-[#161616] transition-colors">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold">Timezone</span>
                <span className="text-xs text-slate-500">
                  India Standard Time (GMT+5:30)
                </span>
              </div>
              <MaterialIcon name="chevron_right" className="text-slate-400" />
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Save Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent backdrop-blur-sm">
        <button className="w-full bg-[#dab80b] hover:bg-[#dab80b]/90 text-[#0a0a0a] font-bold py-4 rounded-2xl shadow-lg shadow-[#dab80b]/20 transition-all active:scale-[0.98]">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
