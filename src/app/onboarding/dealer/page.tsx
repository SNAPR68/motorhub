"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: dealer_onboarding — #1d73c9, Manrope, #0a0d10, card: #161b26 */

const STEP_LABELS = ["Setup", "Inventory", "Social", "AI Tools", "Go Live"];

/* ── Toggle Switch ── */
function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-12 h-7 rounded-full relative transition-colors shrink-0"
      style={{ background: on ? "#1d73c9" : "#334155" }}
    >
      <div
        className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full transition-all shadow-sm"
        style={{ left: on ? "24px" : "3px" }}
      />
    </button>
  );
}

/* ════════════════════════════════════════════════════
   Step 1 — Store Setup
   ════════════════════════════════════════════════════ */
function StepSetup() {
  const [storeName, setStoreName] = useState("Premium Motors");
  const [whatsapp, setWhatsapp] = useState("");
  const [hoursOn, setHoursOn] = useState(true);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Set Up Your Digital Storefront
        </h1>
        <p className="text-sm text-slate-400">
          Your customers will find you here
        </p>
      </div>

      {/* Store Display Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Store Display Name
        </label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#1d73c9]/50 transition"
          style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Logo Upload Area */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Store Logo
        </label>
        <div
          className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#1d73c9]/40 transition"
          style={{
            background: "#161b26",
            border: "2px dashed rgba(255,255,255,0.1)",
          }}
        >
          <MaterialIcon name="add_photo_alternate" className="text-3xl text-slate-500" />
          <span className="text-xs text-slate-500">Tap to upload logo</span>
        </div>
      </div>

      {/* Operating Hours */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div>
          <h3 className="text-sm font-semibold text-white">Operating Hours</h3>
          <p className="text-xs text-slate-400 mt-0.5">Mon-Sat, 9:00 AM - 7:00 PM</p>
        </div>
        <Toggle on={hoursOn} onToggle={() => setHoursOn(!hoursOn)} />
      </div>

      {/* WhatsApp Number */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Contact WhatsApp Number
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <MaterialIcon name="chat" className="text-lg text-slate-500" />
          </div>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#1d73c9]/50 transition"
            style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Step 2 — Add First Inventory
   ════════════════════════════════════════════════════ */
function StepInventory({
  onNext,
}: {
  onNext: () => void;
}) {
  const options = [
    {
      icon: "photo_camera",
      title: "Add from Photos",
      desc: "Take photos, AI fills the rest",
      accent: "#1d73c9",
    },
    {
      icon: "edit",
      title: "Add Manually",
      desc: "Enter details yourself",
      accent: "#10b981",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Add Your First Car
        </h1>
        <p className="text-sm text-slate-400">
          List your best car to get started
        </p>
      </div>

      {/* Illustration */}
      <div
        className="w-full py-10 rounded-xl flex flex-col items-center gap-3"
        style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(29,115,201,0.1)" }}
        >
          <MaterialIcon name="photo_camera" className="text-4xl text-[#1d73c9]" />
        </div>
        <p className="text-xs text-slate-400 text-center max-w-[200px]">
          Snap photos &rarr; AI generates listing
        </p>
      </div>

      {/* Option Cards */}
      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.title}
            onClick={onNext}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-left hover:ring-2 hover:ring-[#1d73c9]/30 transition active:scale-[0.98]"
            style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${opt.accent}15` }}
            >
              <MaterialIcon name={opt.icon} className="text-2xl" style={{ color: opt.accent }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{opt.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-600 ml-auto" />
          </button>
        ))}
      </div>

      {/* Skip */}
      <button
        onClick={onNext}
        className="w-full text-center text-xs text-slate-500 py-2 hover:text-slate-300 transition"
      >
        I&rsquo;ll add inventory later
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Step 3 — Connect Social Media
   ════════════════════════════════════════════════════ */
function StepSocial() {
  const platforms = [
    {
      name: "Instagram",
      icon: "photo_camera",
      desc: "Auto-post car photos",
      gradient: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    },
    {
      name: "Facebook",
      icon: "groups",
      desc: "Share to Marketplace",
      gradient: "#1877F2",
    },
    {
      name: "WhatsApp Business",
      icon: "chat",
      desc: "Auto-reply to leads",
      gradient: "#25D366",
    },
    {
      name: "YouTube",
      icon: "play_circle",
      desc: "Share video walkarounds",
      gradient: "#FF0000",
    },
  ];

  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setConnected((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Connect Your Social Channels
        </h1>
        <p className="text-sm text-slate-400">
          Auto-post listings to reach more buyers
        </p>
      </div>

      {/* Platform Cards */}
      <div className="space-y-3">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: p.gradient }}
            >
              <MaterialIcon name={p.icon} className="text-white text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
            </div>
            <button
              onClick={() => toggle(p.name)}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition shrink-0"
              style={
                connected[p.name]
                  ? { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }
                  : { background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }
              }
            >
              {connected[p.name] ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {/* Skip */}
      <div className="text-center">
        <span className="text-xs text-slate-500">
          Skip for now &mdash; you can connect later in Settings
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Step 4 — AI Tools Setup
   ════════════════════════════════════════════════════ */
function StepAITools() {
  const tools = [
    {
      icon: "smart_toy",
      title: "Auto-reply to Leads",
      desc: "AI responds to inquiries within 60 seconds",
      iconColor: "#1d73c9",
      iconBg: "rgba(29,115,201,0.1)",
    },
    {
      icon: "trending_up",
      title: "Smart Pricing Alerts",
      desc: "Get notified when your pricing is off-market",
      iconColor: "#f59e0b",
      iconBg: "rgba(245,158,11,0.1)",
    },
    {
      icon: "schedule",
      title: "Inventory Aging Alerts",
      desc: "Alerts when cars sit too long",
      iconColor: "#ef4444",
      iconBg: "rgba(239,68,68,0.1)",
    },
  ];

  const [toggles, setToggles] = useState([true, true, true]);

  const flip = (i: number) =>
    setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          Configure Your AI Assistant
        </h1>
        <p className="text-sm text-slate-400">
          Let AI handle the heavy lifting
        </p>
      </div>

      {/* Tool Cards */}
      <div className="space-y-3">
        {tools.map((t, i) => (
          <div
            key={t.title}
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: t.iconBg }}
            >
              <MaterialIcon name={t.icon} className="text-2xl" style={{ color: t.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{t.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
            </div>
            <Toggle on={toggles[i]} onToggle={() => flip(i)} />
          </div>
        ))}
      </div>

      {/* AI info */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl"
        style={{ background: "rgba(29,115,201,0.05)", border: "1px solid rgba(29,115,201,0.1)" }}
      >
        <MaterialIcon name="info" className="text-[#1d73c9] text-xl shrink-0" />
        <p className="text-xs text-slate-400">
          You can adjust all AI settings later from{" "}
          <span className="text-white font-medium">Settings &gt; AI Permissions</span>
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Step 5 — Welcome / Go Live
   ════════════════════════════════════════════════════ */
function StepGoLive() {
  const nextSteps = [
    {
      icon: "add_circle",
      title: "Add Inventory",
      desc: "List your cars to start getting leads",
      href: "/inventory",
      accent: "#1d73c9",
    },
    {
      icon: "dashboard",
      title: "View Dashboard",
      desc: "Monitor your dealership performance",
      href: "/dashboard",
      accent: "#10b981",
    },
    {
      icon: "auto_awesome",
      title: "Explore AI Studio",
      desc: "AI-powered tools for your business",
      href: "/studio",
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center pt-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(29,115,201,0.1)" }}
        >
          <MaterialIcon
            name="check_circle"
            fill
            className="text-5xl text-[#1d73c9]"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          You&rsquo;re All Set!
        </h1>
        <p className="text-sm text-slate-400 max-w-[260px] mx-auto">
          Your dealer account is live. Here&rsquo;s what&rsquo;s next:
        </p>
      </div>

      {/* Next-step cards */}
      <div className="space-y-3">
        {nextSteps.map((ns) => (
          <Link
            key={ns.title}
            href={ns.href}
            className="flex items-center gap-4 p-4 rounded-xl hover:ring-2 hover:ring-[#1d73c9]/30 transition active:scale-[0.98]"
            style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${ns.accent}15` }}
            >
              <MaterialIcon name={ns.icon} className="text-2xl" style={{ color: ns.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{ns.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{ns.desc}</p>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-600" />
          </Link>
        ))}
      </div>

      {/* Stats teaser */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          Join <span className="text-white font-semibold">2,400+</span> dealers already on Autovinci
        </p>
      </div>

      {/* Go to Dashboard CTA */}
      <Link href="/dashboard" className="block">
        <button
          className="w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          style={{
            background: "#1d73c9",
            boxShadow: "0 10px 30px -10px rgba(29,115,201,0.5)",
          }}
        >
          <MaterialIcon name="dashboard" className="text-lg" />
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Main Onboarding Page
   ════════════════════════════════════════════════════ */
export default function DealerOnboardingPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0d10" }}
    >
      {/* ── Header ── */}
      <header className="px-6 pt-12 pb-6">
        {/* Top row — back button + step counter */}
        <div className="flex items-center justify-between mb-5">
          {step > 1 ? (
            <button
              onClick={back}
              className="p-2 -ml-2 rounded-full hover:bg-white/5 transition"
            >
              <MaterialIcon name="arrow_back" className="text-slate-400" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <span className="text-xs text-slate-500 font-medium tabular-nums">
            Step {step} of 5
          </span>
        </div>

        {/* Step labels */}
        <div className="flex items-center gap-1 mb-3">
          {STEP_LABELS.map((label, i) => {
            const idx = i + 1;
            const isActive = idx === step;
            const isComplete = idx < step;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full h-1 rounded-full transition-colors"
                  style={{
                    background: isComplete
                      ? "#10b981"
                      : isActive
                        ? "#1d73c9"
                        : "rgba(255,255,255,0.07)",
                  }}
                />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider transition-colors"
                  style={{
                    color: isComplete
                      ? "#10b981"
                      : isActive
                        ? "#1d73c9"
                        : "rgba(148,163,184,0.4)",
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {step === 1 && <StepSetup />}
        {step === 2 && <StepInventory onNext={next} />}
        {step === 3 && <StepSocial />}
        {step === 4 && <StepAITools />}
        {step === 5 && <StepGoLive />}
      </main>

      {/* ── Bottom Action Bar (hidden on Step 5 — it has its own CTA) ── */}
      {step < 5 && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 px-6 pb-8 pt-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #0a0d10 0%, #0a0d10 40%, transparent 100%)",
          }}
        >
          <button
            onClick={next}
            className="pointer-events-auto w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            style={{
              background: "#1d73c9",
              boxShadow: "0 10px 30px -10px rgba(29,115,201,0.5)",
            }}
          >
            Next
            <MaterialIcon name="arrow_forward" className="text-lg" />
          </button>
        </div>
      )}

      {/* ── Ambient decoration ── */}
      <div
        className="fixed -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(29,115,201,0.06)", filter: "blur(120px)" }}
      />
      <div
        className="fixed top-1/3 -right-20 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(29,115,201,0.04)", filter: "blur(100px)" }}
      />
    </div>
  );
}
