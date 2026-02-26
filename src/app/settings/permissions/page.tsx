"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile } from "@/lib/api";

/* ── design tokens: access_roles_&_permissions ── */
// primary: #f2b90d (gold), font: Manrope, bg: #121210, card: #1c1c18, border: #2d2a1e

const PLAN_TIER_MAP: Record<string, string> = {
  STARTER: "Silver",
  GROWTH: "Gold",
  ENTERPRISE: "Platinum",
};

const ROLES = [
  {
    tier: "Tier 1",
    tierBg: "#f2b90d",
    tierColor: "#121210",
    name: "The Director",
    desc: "Supreme oversight with global administrative control and AI strategy.",
  },
  {
    tier: "Tier 2",
    tierBg: "#334155",
    tierColor: "#e2e8f0",
    name: "The Closer",
    desc: "Optimized for sales conversion, lead management, and negotiation.",
  },
  {
    tier: "Tier 2",
    tierBg: "#334155",
    tierColor: "#e2e8f0",
    name: "The Creative",
    desc: "Content engine focus: marketing assets, listing polish, and ads.",
  },
];

const AI_CAPABILITIES = [
  { icon: "auto_graph", name: "Predictive Inventory Forecasting", desc: "Proprietary AI analyzes market trends to suggest stock buys.", unlocked: true },
  { icon: "monitoring", name: "Financial Oversight & P&L", desc: "Real-time reporting on dealership profitability and margins.", unlocked: false },
  { icon: "neurology", name: "Smart Lead Routing", desc: "Automated distribution of inquiries based on closer performance.", unlocked: false },
];

const PERMISSIONS_LIST = [
  { icon: "directions_car", label: "Inventory Management", enabled: true },
  { icon: "payments", label: "Pricing Controls", enabled: true },
  { icon: "campaign", label: "Ad Campaign Creation", enabled: false },
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(0);
  const [perms, setPerms] = useState(PERMISSIONS_LIST.map((p) => p.enabled));

  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const plan = (profileData?.profile as { plan?: string } | undefined)?.plan ?? "STARTER";
  const planTier = PLAN_TIER_MAP[plan] ?? "Silver";
  const dealershipName = (profileData?.profile as { dealershipName?: string } | undefined)?.dealershipName ?? "Your Dealership";

  // ENTERPRISE unlocks all AI capabilities
  const resolvedCapabilities = AI_CAPABILITIES.map((cap, i) => ({
    ...cap,
    unlocked: plan === "ENTERPRISE" ? true : i === 0,
  }));

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-28 overflow-x-hidden"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "#121210",
        color: "#f1f5f9",
        borderLeft: "1px solid rgba(45,42,30,0.5)",
        borderRight: "1px solid rgba(45,42,30,0.5)",
      }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(28,28,24,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(45,42,30,0.5)",
        }}
      >
        <Link href="/settings" className="flex items-center justify-center w-10 h-10 rounded-full">
          <MaterialIcon name="arrow_back_ios_new" className="text-slate-100" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold tracking-tight text-slate-100 uppercase" style={{ letterSpacing: "0.05em" }}>
            Role Configuration
          </h1>
          {dealershipName && (
            <p className="text-[10px] text-slate-500 font-medium">{dealershipName}</p>
          )}
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
          style={{ color: "#f2b90d", border: "1px solid rgba(242,185,13,0.3)", background: "rgba(242,185,13,0.05)" }}
        >
          {planTier}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
        {/* ── Role Carousel ── */}
        <section className="mt-6">
          <div className="px-4 mb-4 flex justify-between items-end">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Select Access Tier
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                color: "#f2b90d",
                border: "1px solid rgba(242,185,13,0.3)",
                background: "rgba(242,185,13,0.05)",
              }}
            >
              {planTier} Suite
            </span>
          </div>

          <div className="flex overflow-x-auto gap-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {ROLES.map((role, i) => (
              <button
                key={role.name}
                onClick={() => setSelectedRole(i)}
                className="snap-center shrink-0 w-72 text-left"
              >
                <div
                  className="relative aspect-[3/4] rounded-xl overflow-hidden p-6 flex flex-col justify-end transition-all"
                  style={{
                    background: "#1c1c18",
                    border: i === selectedRole ? "2px solid #f2b90d" : "1px solid #2d2a1e",
                    boxShadow: i === selectedRole ? "0 0 20px rgba(242,185,13,0.15)" : "none",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, #121210 0%, rgba(18,18,16,0.4) 60%, transparent 100%)",
                    }}
                  />
                  <div className="relative z-10">
                    <span
                      className="px-2 py-1 text-[10px] font-black uppercase rounded mb-2 inline-block"
                      style={{ background: role.tierBg, color: role.tierColor }}
                    >
                      {role.tier}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-100">{role.name}</h3>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── AI-Powered Capabilities ── */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            AI-Powered Capabilities
          </h2>
          <div className="space-y-3">
            {resolvedCapabilities.map((cap) => (
              <div
                key={cap.name}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: cap.unlocked ? "rgba(242,185,13,0.05)" : "#1c1c18",
                  border: cap.unlocked ? "1px solid rgba(242,185,13,0.2)" : "1px solid #2d2a1e",
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cap.unlocked ? "rgba(242,185,13,0.2)" : "#1e293b" }}
                >
                  <MaterialIcon
                    name={cap.icon}
                    className={cap.unlocked ? "text-[#f2b90d]" : "text-slate-400"}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-slate-100 font-bold text-sm">{cap.name}</h4>
                  <p className="text-slate-400 text-xs">{cap.desc}</p>
                </div>
                <MaterialIcon
                  name={cap.unlocked ? "verified" : "lock"}
                  className={cap.unlocked ? "text-[rgba(242,185,13,0.4)]" : "text-slate-600"}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Granular Permissions ── */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            Granular Permissions
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#1c1c18", border: "1px solid #2d2a1e" }}
          >
            {PERMISSIONS_LIST.map((perm, i) => (
              <div
                key={perm.label}
                className="flex items-center justify-between p-4"
                style={{
                  borderTop: i > 0 ? "1px solid #2d2a1e" : "none",
                  opacity: perms[i] ? 1 : 0.5,
                }}
              >
                <div className="flex items-center gap-3">
                  <MaterialIcon name={perm.icon} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-200">{perm.label}</span>
                </div>
                <button
                  onClick={() => {
                    const next = [...perms];
                    next[i] = !next[i];
                    setPerms(next);
                  }}
                  className="w-11 h-6 rounded-full relative transition-colors"
                  style={{ background: perms[i] ? "#f2b90d" : "#334155" }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                    style={{
                      background: "#121210",
                      left: perms[i] ? "22px" : "2px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Invite Member ── */}
        <section className="mt-8 px-4">
          <div
            className="p-4 flex items-center gap-3 rounded-xl"
            style={{ background: "#1c1c18", border: "1px solid #2d2a1e" }}
          >
            <div className="relative flex-1">
              <MaterialIcon
                name="mail"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500"
              />
              <input
                type="email"
                placeholder="Add member by email..."
                className="w-full rounded-lg py-3 pl-10 pr-4 text-slate-100 text-sm focus:outline-none transition-all"
                style={{
                  background: "#121210",
                  border: "1px solid #2d2a1e",
                }}
              />
            </div>
            <button
              className="px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wide"
              style={{ background: "#f2b90d", color: "#121210" }}
            >
              Invite
            </button>
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 flex items-center justify-around px-4 py-3 border-t md:hidden"
        style={{
          background: "rgba(28,28,24,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#2d2a1e",
        }}
      >
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="directions_car" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inventory</span>
        </Link>
        <Link href="/settings/team" className="flex flex-col items-center gap-1" style={{ color: "#f2b90d" }}>
          <MaterialIcon name="group" fill />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Team</span>
        </Link>
        {/* Raised Add Button */}
        <div className="relative -top-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "#f2b90d",
              boxShadow: "0 4px 20px rgba(242,185,13,0.4)",
              border: "4px solid #121210",
            }}
          >
            <MaterialIcon name="add" className="text-3xl font-black text-[#121210]" />
          </div>
        </div>
        <Link href="/analytics" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="analytics" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Insights</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="settings" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Config</span>
        </Link>
      </nav>
    </div>
  );
}
