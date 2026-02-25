"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile } from "@/lib/api";

/* ── design tokens: settings hub (matches billing stitch tokens) ── */
// primary: #1754cf, font: Manrope, bg: #111621, card: #1a2232, border: #243047

const SECTIONS = [
  {
    title: "AI & Automation",
    items: [
      { icon: "shield", label: "AI Permissions", desc: "Smart posting, media sync, engagement toggles", href: "/settings/ai-permissions" },
      { icon: "auto_awesome", label: "AI Automation Settings", desc: "Auto-enhance, scheduling, smart replies", href: "/settings/automation" },
      { icon: "image", label: "AI Asset & Media", desc: "Resolution, watermark, export format", href: "/settings/assets" },
      { icon: "palette", label: "AI Brand Voice", desc: "Tone, style, and content preferences", href: "/settings/brand-voice" },
      { icon: "notifications", label: "Notification Preferences", desc: "Push, email, and WhatsApp alerts", href: "/settings/notifications" },
      { icon: "history", label: "Notification History", desc: "Past alerts and activity log", href: "/notifications/history" },
      { icon: "language", label: "Social Onboarding", desc: "Connect Instagram, Facebook", href: "/onboarding/social" },
    ],
  },
  {
    title: "Account & Team",
    items: [
      { icon: "group", label: "Team Management", desc: "Invite members, assign roles", href: "/settings/team" },
      { icon: "admin_panel_settings", label: "Roles & Permissions", desc: "Access control for team members", href: "/settings/permissions" },
      { icon: "store", label: "Dealer Profile", desc: "Business info, address, GST", href: "/settings" },
    ],
  },
  {
    title: "Billing & Support",
    items: [
      { icon: "credit_card", label: "Plan & Billing", desc: "Premium plan \u2014 renews Mar 15", href: "/plans", badge: "PRO" },
      { icon: "bolt", label: "Enhancements & Billing", desc: "Usage, credits, invoices", href: "/settings/billing" },
      { icon: "help", label: "Help & Support", desc: "FAQs, contact support team", href: "/settings" },
      { icon: "apartment", label: "Multi-Store", desc: "Manage outlets & locations", href: "/stores" },
      { icon: "hub", label: "Social Hub", desc: "Connected platforms & content", href: "/social-hub" },
    ],
  },
];

export default function SettingsPage() {
  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const dealerName = (profileData?.user as Record<string, unknown>)?.name as string | undefined;
  const profile = (profileData?.profile ?? {}) as Record<string, unknown>;
  const dealershipName = profile.dealershipName as string | undefined;
  const city = profile.city as string | undefined;
  const initials = dealerName
    ? dealerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DL";

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#111621", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-4 border-b"
        style={{
          background: "rgba(17,22,33,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#243047",
        }}
      >
        <h1 className="text-xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-xs font-medium text-slate-400">Manage your dealership</p>
      </header>

      <main className="p-4 space-y-6">
        {/* Dealer Card */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "#1a2232", border: "1px solid #243047" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ background: "#1754cf" }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base text-white">{dealerName ?? "Dealer"}</h2>
            <p className="text-xs text-slate-400">{dealershipName ?? "Your Dealership"}{city ? ` \u2022 ${city}` : ""}</p>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: "rgba(23,84,207,0.15)", color: "#1754cf" }}
            >
              PREMIUM DEALER
            </span>
          </div>
          <MaterialIcon name="chevron_right" className="text-slate-500" />
        </div>

        {/* Setting Sections */}
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-3 px-1"
              style={{ color: "#64748b" }}
            >
              {section.title}
            </h3>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#1a2232", border: "1px solid #243047" }}
            >
              {section.items.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="p-4 flex items-center gap-3 active:bg-white/5 transition-colors"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(36,48,71,0.7)" : "none",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(23,84,207,0.1)" }}
                  >
                    <MaterialIcon name={item.icon} className="text-xl text-[#1754cf]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      {item.badge && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(23,84,207,0.15)", color: "#1754cf" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <MaterialIcon name="chevron_right" className="text-sm text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Sign Out */}
        <button
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm"
          style={{ background: "#1a2232", border: "1px solid #243047", color: "#ef4444" }}
        >
          <MaterialIcon name="logout" className="text-xl" />
          Sign Out
        </button>

        <p className="text-center text-[10px] text-slate-500">
          Autovinci v2.1.0 &bull; Made with AI in India
        </p>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 pb-6 pt-3 px-6 flex justify-between items-center border-t max-w-md mx-auto"
        style={{
          background: "rgba(17,22,33,0.9)",
          backdropFilter: "blur(12px)",
          borderColor: "#243047",
        }}
      >
        {[
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "analytics", label: "Analytics", href: "/analytics" },
          { icon: "settings", label: "Settings", href: "/settings", active: true },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ color: item.active ? "#1754cf" : "#64748b" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} className="text-2xl" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
