"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_automation_&_scheduling ── */
// primary: #137fec, font: Inter, bg: #101922 (dark), light card: #0f172a

const STORAGE_KEY = "av_automation_prefs";

const RULES = [
  {
    icon: "auto_fix_high",
    iconBg: "rgba(19,127,236,0.1)",
    iconColor: "#137fec",
    name: "Auto-Enhance Photos",
    trigger: "Trigger: On upload",
    setting: "Processing delay:",
    value: "Instant",
    btn: "Adjust Delay",
  },
  {
    icon: "share",
    iconBg: "rgba(37,99,235,0.1)",
    iconColor: "#2563eb",
    name: "Auto-Post to Facebook",
    trigger: "Trigger: After AI enhancement",
    setting: "Schedule:",
    value: "Smart Optimization",
    btn: "Set Time",
  },
  {
    icon: "bolt",
    iconBg: "rgba(22,163,74,0.1)",
    iconColor: "#16a34a",
    name: "Instant AI Lead Reply",
    trigger: "Trigger: New inquiry",
    setting: "Reply within:",
    value: "5 mins",
    btn: "Edit Delay",
  },
];

const DEFAULT_TOGGLES = [true, true, false];

const DAYS = [
  { day: "Mon", hasPost: true, scheduled: true },
  { day: "Tue", hasPost: false, scheduled: false },
  { day: "Wed", hasPost: true, scheduled: false, active: true },
  { day: "Thu", hasPost: false, scheduled: false },
  { day: "Fri", hasPost: true, scheduled: false },
  { day: "Sat", hasPost: false, scheduled: false },
  { day: "Sun", hasPost: false, scheduled: false },
];

function loadPrefs(): boolean[] {
  if (typeof window === "undefined") return DEFAULT_TOGGLES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as boolean[];
  } catch {}
  return DEFAULT_TOGGLES;
}

export default function AutomationPage() {
  const [toggles, setToggles] = useState<boolean[]>(DEFAULT_TOGGLES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setToggles(loadPrefs());
  }, []);

  const handleSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Inter', sans-serif", background: "#101922", color: "#f1f5f9" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "rgba(16,25,34,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#1e293b",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/settings" className="flex items-center" style={{ color: "#137fec" }}>
            <MaterialIcon name="arrow_back_ios_new" className="text-[28px]" />
            <span className="text-lg">Settings</span>
          </Link>
          <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2 text-white">
            AI Automation
          </h1>
          <button onClick={handleSave} className="font-medium transition-colors" style={{ color: saved ? "#16a34a" : "#137fec" }}>
            {saved ? "Saved ✓" : "Save"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {/* Automation Triggers */}
        <div className="px-4 py-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Automation Triggers
          </h2>
          <div className="space-y-4">
            {RULES.map((rule, i) => (
              <div
                key={rule.name}
                className="rounded-xl p-4"
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: rule.iconBg }}
                    >
                      <span style={{ color: rule.iconColor }}>
                        <MaterialIcon name={rule.icon} />
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{rule.name}</h3>
                      <p className="text-sm text-slate-500">{rule.trigger}</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => {
                      const next = [...toggles];
                      next[i] = !next[i];
                      setToggles(next);
                    }}
                    className="w-11 h-6 rounded-full relative transition-colors"
                    style={{ background: toggles[i] ? "#137fec" : "#334155" }}
                  >
                    <div
                      className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                      style={{ left: toggles[i] ? "22px" : "2px" }}
                    />
                  </button>
                </div>
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: "#1e293b" }}
                >
                  <span className="text-sm font-medium">
                    {rule.setting}{" "}
                    <span style={{ color: "#137fec" }}>{rule.value}</span>
                  </span>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "#1e293b" }}
                  >
                    {rule.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Social Media Calendar */}
        <div className="px-4 py-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Weekly Social Media Calendar
          </h2>
          <div
            className="rounded-xl p-5"
            style={{ background: "#0f172a", border: "1px solid #1e293b" }}
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm font-medium text-slate-400">
                Scheduled Posts for Feb 24 - Mar 2
              </p>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: "#137fec" }} />
                <span className="w-2 h-2 rounded-full" style={{ background: "rgba(19,127,236,0.3)" }} />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                  <div
                    className="w-full aspect-square rounded-lg flex items-center justify-center relative"
                    style={{
                      background: "#1e293b",
                      border: d.active ? "2px solid #137fec" : "none",
                    }}
                  >
                    {d.hasPost ? (
                      <MaterialIcon name="social_leaderboard" className="text-lg text-[#2563eb]" />
                    ) : (
                      <MaterialIcon name="add" className="text-lg text-slate-600" />
                    )}
                    {d.scheduled && (
                      <div
                        className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                        style={{ background: "#137fec", border: "2px solid #0f172a" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 flex items-center gap-3 p-3 rounded-lg"
              style={{
                background: "rgba(19,127,236,0.05)",
                border: "1px solid rgba(19,127,236,0.1)",
              }}
            >
              <MaterialIcon name="info" className="text-xl text-[#137fec]" />
              <p className="text-xs leading-tight" style={{ color: "#137fec" }}>
                AI has scheduled 3 posts this week based on peak engagement times for car buyers in
                your area.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t max-w-md mx-auto md:hidden"
        style={{
          background: "rgba(16,25,34,0.9)",
          backdropFilter: "blur(12px)",
          borderColor: "#1e293b",
        }}
      >
        <div className="flex justify-around items-center px-2 py-2">
          {[
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "campaign", label: "Marketing", href: "/marketing" },
            { icon: "smart_toy", label: "AI Rules", href: "/settings/automation", active: true },
            { icon: "chat_bubble", label: "Leads", href: "/leads" },
            { icon: "settings", label: "Settings", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3"
              style={{ color: item.active ? "#137fec" : "#94a3b8" }}
            >
              <MaterialIcon name={item.icon} fill={item.active} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="h-6 w-full" />
      </nav>
    </div>
  );
}
