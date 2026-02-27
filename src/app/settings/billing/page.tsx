"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile, fetchDashboard } from "@/lib/api";

/* ── design tokens: ai_enhancements_&_billing ── */
// primary: #1754cf, font: Manrope, bg: #111621, card: #1a2232, border: #243047

const ADDONS = [
  {
    icon: "view_in_ar",
    name: "Extra 360\u00b0 Slots",
    desc: "Add 10 additional high-resolution rendering slots to your monthly inventory limit.",
    price: "\u20b93,999",
    period: "/mo",
    ctaBg: "#1754cf",
    ctaColor: "white",
  },
  {
    icon: "bolt",
    name: "Priority AI Response",
    desc: "Bypass the queue during peak hours. Instant generation for backgrounds and descriptions.",
    price: "\u20b91,999",
    period: "/mo",
    ctaBg: "#f1f5f9",
    ctaColor: "#0f172a",
  },
  {
    icon: "psychology",
    name: "Custom Brand Voice",
    desc: "Train our AI on your past marketing copy to perfectly match your dealership\u2019s unique tone.",
    price: "\u20b97,999",
    period: "one-time",
    ctaBg: "#f1f5f9",
    ctaColor: "#0f172a",
  },
];

export default function BillingPage() {
  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const { data: dashData } = useApi(() => fetchDashboard(), []);

  const profile = profileData?.profile as Record<string, unknown> | undefined;
  const stats = dashData?.stats as Record<string, unknown> | undefined;
  const totalVehicles = (stats?.totalVehicles as number) ?? 0;

  // Subscription info from profile
  const subscriptions = (profile?.subscriptions as Array<Record<string, unknown>> | undefined) ?? [];
  const activeSub = subscriptions[0];
  const planTier = activeSub?.plan
    ? String(activeSub.plan).replace(/_/g, " ")
    : "Pro Dealer Tier";
  const nextBilling = activeSub?.currentPeriodEnd
    ? new Date(activeSub.currentPeriodEnd as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Mar 15, 2026";
  const billingCycle = activeSub?.interval ? String(activeSub.interval) : "Annual";

  // Slot usage from total vehicles
  const slotLimit = 20;
  const slotUsed = Math.min(totalVehicles, slotLimit);
  const slotPct = Math.round((slotUsed / slotLimit) * 100);

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#111621", color: "#f1f5f9" }}
    >
      {/* ── Status Bar Spacer ── */}
      <div className="h-12 w-full" style={{ background: "#111621" }} />

      {/* ── Header ── */}
      <header
        className="sticky top-12 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(17,22,33,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#243047",
        }}
      >
        <Link href="/settings" className="flex items-center justify-center p-2 rounded-full">
          <MaterialIcon name="arrow_back_ios_new" className="text-slate-400" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight">AI Enhancements</h1>
        <div className="w-10" />
      </header>

      <main className="pb-8">
        {/* ── Current Plan Summary ── */}
        <section className="p-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#94a3b8" }}
          >
            Current Plan
          </h2>
          <div
            className="rounded-xl p-5"
            style={{
              background: "#1a2232",
              border: "1px solid #243047",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold mb-1 tracking-wide" style={{ color: "#1754cf" }}>
                  ACTIVE
                </p>
                <h3 className="text-xl font-extrabold text-white capitalize">{planTier}</h3>
                <p className="text-sm mt-1 text-slate-400">Next billing: {nextBilling}</p>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                style={{ background: "rgba(23,84,207,0.1)", color: "#1754cf" }}
              >
                {billingCycle}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">360&deg; Rendering Slots</span>
                  <span className="font-bold text-white">{slotUsed} / {slotLimit}</span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: "#243047" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${slotPct}%`, background: "#1754cf" }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic">{slotPct}% capacity reached</p>
              </div>
            </div>

            <button
              className="w-full mt-6 py-3 rounded-lg text-sm font-semibold transition-colors"
              style={{ border: "1px solid #243047", color: "#e2e8f0" }}
            >
              Manage Subscription
            </button>
          </div>
        </section>

        {/* ── Premium AI Add-ons ── */}
        <section className="px-6 py-2">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: "#94a3b8" }}
          >
            Premium AI Add-ons
          </h2>
          <div className="space-y-4">
            {ADDONS.map((addon) => (
              <div
                key={addon.name}
                className="rounded-xl p-5 flex flex-col gap-4"
                style={{
                  background: "rgba(26,34,50,0.4)",
                  border: "1px solid #243047",
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MaterialIcon name={addon.icon} className="text-xl text-[#1754cf]" />
                      <h3 className="font-bold text-base text-white">{addon.name}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{addon.desc}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg text-white">{addon.price}</p>
                    <p className="text-[10px] text-slate-400">{addon.period}</p>
                  </div>
                </div>
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-all"
                  style={{
                    background: addon.ctaBg,
                    color: addon.ctaColor,
                    ...(addon.ctaBg === "#1754cf"
                      ? { boxShadow: "0 4px 16px rgba(23,84,207,0.2)" }
                      : {}),
                  }}
                >
                  Add to Plan
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Link */}
        <footer className="mt-12 mb-8 text-center px-6">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 py-2 text-sm font-medium text-slate-400"
          >
            <span
              className="border-b border-transparent"
              style={{ borderBottomColor: "transparent" }}
            >
              View Billing History &amp; Invoices
            </span>
            <MaterialIcon name="receipt_long" className="text-sm" />
          </Link>
        </footer>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 pb-8 pt-3 px-6 border-t max-w-md mx-auto md:hidden"
        style={{
          background: "rgba(17,22,33,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#243047",
        }}
      >
        <div className="max-w-md mx-auto flex justify-between items-center">
          {[
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "campaign", label: "Marketing", href: "/marketing" },
            { icon: "auto_awesome", label: "AI Tools", href: "/settings/billing", active: true },
            { icon: "account_circle", label: "Account", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1"
              style={{ color: item.active ? "#1754cf" : "#64748b" }}
            >
              <MaterialIcon name={item.icon} fill={item.active} />
              <span className="text-[10px] font-medium uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Background Decorations */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30 overflow-hidden">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full"
          style={{ background: "rgba(23,84,207,0.2)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full"
          style={{ background: "rgba(23,84,207,0.1)", filter: "blur(120px)" }}
        />
      </div>
    </div>
  );
}
