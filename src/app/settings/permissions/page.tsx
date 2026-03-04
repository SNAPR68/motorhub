"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile } from "@/lib/api";
import {
  getFeatures,
  getLimits,
  minimumPlanFor,
  type PlanKey,
  type PlanFeatures,
} from "@/lib/plan-limits";

/* ── design tokens: access_roles_&_permissions ── */
// primary: #E5C158 (gold), font: Manrope, bg: #121210, card: #1c1c18, border: #2d2a1e

const PLAN_TIER_MAP: Record<string, string> = {
  FREE: "Free",
  STARTER: "Starter",
  GROWTH: "Growth",
  ENTERPRISE: "Enterprise",
};

const ROLES = [
  {
    tier: "Tier 1",
    tierBg: "#E5C158",
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

/* ── AI capabilities mapped to plan feature flags ── */
interface AICapability {
  icon: string;
  name: string;
  desc: string;
  featureKey: keyof PlanFeatures;
}

const AI_CAPABILITIES: AICapability[] = [
  {
    icon: "auto_fix_high",
    name: "AI Descriptions & Drafts",
    desc: "Auto-generate vehicle listings and quick content drafts.",
    featureKey: "aiDescriptions",
  },
  {
    icon: "psychology",
    name: "Lead Sentiment Analysis",
    desc: "AI classifies leads as Hot, Warm, or Cool based on messages.",
    featureKey: "aiSentiment",
  },
  {
    icon: "smart_toy",
    name: "Smart Reply & Auto-Reply",
    desc: "AI-powered responses to lead inquiries, fully automated.",
    featureKey: "aiAutoReply",
  },
  {
    icon: "auto_graph",
    name: "Predictive Inventory Forecasting",
    desc: "AI analyzes market trends to suggest optimal stock buys.",
    featureKey: "intelligenceBasic",
  },
  {
    icon: "monitoring",
    name: "Benchmarks & Health Score",
    desc: "Cross-dealer comparison and public dealership trust score.",
    featureKey: "benchmarks",
  },
  {
    icon: "neurology",
    name: "Full DemandPulse Intelligence",
    desc: "Depreciation forecasting, acquisition signals, market pricing.",
    featureKey: "intelligenceFull",
  },
];

/* ── Granular permissions mapped to plan feature flags ── */
interface Permission {
  icon: string;
  label: string;
  featureKey: keyof PlanFeatures;
}

const PERMISSIONS_LIST: Permission[] = [
  { icon: "directions_car", label: "Inventory Management", featureKey: "aiDescriptions" },
  { icon: "payments", label: "Pricing Controls", featureKey: "aiDescriptions" },
  { icon: "campaign", label: "Ad Campaign Creation", featureKey: "campaignTools" },
  { icon: "photo_camera", label: "Photo Studio", featureKey: "photoBackgroundRemoval" },
  { icon: "videocam", label: "Video & Reel Tools", featureKey: "reelScriptGeneration" },
  { icon: "chat", label: "WhatsApp Integration", featureKey: "whatsappIntegration" },
  { icon: "hub", label: "Social Hub & Marketing", featureKey: "socialHub" },
  { icon: "store", label: "Multi-Store Management", featureKey: "multiStore" },
  { icon: "api", label: "API Access", featureKey: "apiAccess" },
  { icon: "download", label: "Data Export (CSV/PDF)", featureKey: "dataExport" },
];

export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(0);

  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const plan = ((profileData?.profile as { plan?: string } | undefined)?.plan ?? "FREE") as PlanKey;
  const planTier = PLAN_TIER_MAP[plan] ?? "Free";
  const dealershipName = (profileData?.profile as { dealershipName?: string } | undefined)?.dealershipName ?? "Your Dealership";

  const features = getFeatures(plan);
  const limits = getLimits(plan);

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
          style={{ color: "#E5C158", border: "1px solid rgba(242,185,13,0.3)", background: "rgba(242,185,13,0.05)" }}
        >
          {planTier}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
        {/* ── Plan Quotas ── */}
        <section className="mt-6 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            Plan Quotas
          </h2>
          <div
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: "Vehicles", value: limits.vehicles === -1 ? "Unlimited" : String(limits.vehicles), icon: "directions_car" },
              { label: "Leads/mo", value: limits.leadsPerMonth === -1 ? "Unlimited" : String(limits.leadsPerMonth), icon: "people" },
              { label: "AI Calls/mo", value: limits.aiCallsPerMonth === -1 ? "Unlimited" : String(limits.aiCallsPerMonth), icon: "auto_awesome" },
              { label: "Photo Edits/mo", value: limits.photoEditsPerMonth === -1 ? "Unlimited" : limits.photoEditsPerMonth === 0 ? "N/A" : String(limits.photoEditsPerMonth), icon: "photo_camera" },
              { label: "Team Members", value: limits.teamMembers === -1 ? "Unlimited" : String(limits.teamMembers), icon: "group" },
              { label: "Analytics", value: limits.analyticsRetentionDays === -1 ? "Unlimited" : `${limits.analyticsRetentionDays}d`, icon: "analytics" },
            ].map((q) => (
              <div
                key={q.label}
                className="flex flex-col items-center gap-1 p-3 rounded-xl"
                style={{ background: "#1c1c18", border: "1px solid #2d2a1e" }}
              >
                <MaterialIcon name={q.icon} className="text-[#E5C158] text-lg" />
                <span className="text-lg font-black text-slate-100">{q.value}</span>
                <span className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{q.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Role Carousel ── */}
        <section className="mt-8">
          <div className="px-4 mb-4 flex justify-between items-end">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Select Access Tier
            </h2>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                color: "#E5C158",
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
                    border: i === selectedRole ? "2px solid #E5C158" : "1px solid #2d2a1e",
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
            {AI_CAPABILITIES.map((cap) => {
              const unlocked = features[cap.featureKey] === true;
              const requiredPlan = !unlocked ? PLAN_TIER_MAP[minimumPlanFor(cap.featureKey)] : null;

              return (
                <div
                  key={cap.name}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    background: unlocked ? "rgba(242,185,13,0.05)" : "#1c1c18",
                    border: unlocked ? "1px solid rgba(242,185,13,0.2)" : "1px solid #2d2a1e",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: unlocked ? "rgba(242,185,13,0.2)" : "#1e293b" }}
                  >
                    <MaterialIcon
                      name={cap.icon}
                      className={unlocked ? "text-[#E5C158]" : "text-slate-400"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-100 font-bold text-sm">{cap.name}</h4>
                    <p className="text-slate-400 text-xs">{cap.desc}</p>
                    {!unlocked && requiredPlan && (
                      <p className="text-[10px] mt-1 font-bold uppercase tracking-wider" style={{ color: "#E5C158" }}>
                        Requires {requiredPlan}
                      </p>
                    )}
                  </div>
                  <MaterialIcon
                    name={unlocked ? "verified" : "lock"}
                    className={unlocked ? "text-[rgba(242,185,13,0.4)]" : "text-slate-600"}
                  />
                </div>
              );
            })}
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
            {PERMISSIONS_LIST.map((perm, i) => {
              const enabled = features[perm.featureKey] === true;
              const requiredPlan = !enabled ? PLAN_TIER_MAP[minimumPlanFor(perm.featureKey)] : null;

              return (
                <div
                  key={perm.label}
                  className="flex items-center justify-between p-4"
                  style={{
                    borderTop: i > 0 ? "1px solid #2d2a1e" : "none",
                    opacity: enabled ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MaterialIcon name={perm.icon} className={enabled ? "text-[#E5C158]" : "text-slate-500"} />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-slate-200 block">{perm.label}</span>
                      {!enabled && requiredPlan && (
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#E5C158" }}>
                          {requiredPlan}+
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-11 h-6 rounded-full relative shrink-0"
                    style={{ background: enabled ? "#E5C158" : "#334155" }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full"
                      style={{
                        background: "#121210",
                        left: enabled ? "22px" : "2px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Upgrade CTA ── */}
        {plan !== "ENTERPRISE" && (
          <section className="mt-8 px-4">
            <Link
              href="/plans"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all"
              style={{
                background: "#E5C158",
                color: "#121210",
                boxShadow: "0 4px 16px rgba(242,185,13,0.2)",
              }}
            >
              <MaterialIcon name="rocket_launch" className="text-lg" />
              Unlock More with Upgrade
            </Link>
          </section>
        )}

        {/* ── Invite Member ── */}
        <section className="mt-8 px-4">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-4">
            Invite Team Member
          </h2>
          <div
            className="p-4 flex flex-col gap-3 rounded-xl"
            style={{ background: "#1c1c18", border: "1px solid #2d2a1e" }}
          >
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MaterialIcon name="group" className="text-sm" />
              <span>
                {limits.teamMembers === -1
                  ? "Unlimited team members"
                  : `Up to ${limits.teamMembers} member${limits.teamMembers > 1 ? "s" : ""} on ${planTier}`}
              </span>
            </div>
            <div className="flex items-center gap-3">
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
                style={{ background: "#E5C158", color: "#121210" }}
              >
                Invite
              </button>
            </div>
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
        <Link href="/settings/team" className="flex flex-col items-center gap-1" style={{ color: "#E5C158" }}>
          <MaterialIcon name="group" fill />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Team</span>
        </Link>
        {/* Raised Add Button */}
        <div className="relative -top-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "#E5C158",
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
