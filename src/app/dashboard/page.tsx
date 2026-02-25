"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, fetchDashboard, fetchDealerProfile, adaptVehicle } from "@/lib/api";

/* Stitch: dealer_executive_dashboard_1
   Tokens: primary=#2badee, font=Inter, bg=#0a1114
   Bottom nav: Dashboard(active), Inventory, Leads, AI Tasks, Account */

const QUICK_ACTIONS = [
  { icon: "analytics", label: "Reports", href: "/reports/monthly" },
  { icon: "mail", label: "Messages", href: "/leads" },
  { icon: "calendar_today", label: "Schedule", href: "/appointments" },
  { icon: "campaign", label: "Market", href: "/marketing" },
  { icon: "insights", label: "Intelligence", href: "/intelligence" },
  { icon: "bar_chart", label: "Analytics", href: "/analytics" },
  { icon: "share", label: "Social Hub", href: "/social-hub" },
];

export default function Dashboard() {
  const { data } = useApi(() => fetchVehicles({ limit: 3 }), []);
  const { data: dashData } = useApi(() => fetchDashboard(), []);
  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const RECENT_LISTINGS = (data?.vehicles ?? []).map(adaptVehicle);

  const dealerName = (profileData?.user as Record<string, unknown>)?.name as string | undefined;
  const dealershipName = (profileData?.profile as Record<string, unknown>)?.dealershipName as string | undefined;
  const logoUrl = (profileData?.user as Record<string, unknown>)?.avatar as string | undefined;
  const initials = dealerName
    ? dealerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "DL";

  const stats = (dashData?.stats ?? {}) as Record<string, unknown>;
  const portfolioValue = typeof stats.revenue === "string" ? stats.revenue : "₹0";
  const activeLeads = typeof stats.activeLeads === "number" ? stats.activeLeads : 0;
  const hotLeads = typeof stats.hotLeads === "number" ? stats.hotLeads : 0;
  const aiReplies = typeof stats.aiRepliesSent === "number" ? stats.aiRepliesSent : 0;
  const totalVehicles = typeof stats.totalVehicles === "number" ? stats.totalVehicles : 0;

  return (
    <div
      className="relative flex min-h-dvh w-full max-w-lg mx-auto flex-col text-slate-100 overflow-hidden"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#0a1114",
      }}
    >
      {/* Header */}
      <header className="pt-12 px-6 pb-4 flex items-center justify-between sticky top-0 bg-[#0a1114]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border border-[#C0C0C0]/30 overflow-hidden bg-slate-700 flex items-center justify-center shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt={dealerName ?? "Dealer"} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <span className="text-[13px] font-bold text-slate-300">{initials}</span>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0]/60 font-semibold">
              {dealershipName ?? "Principal Dealer"}
            </p>
            <h1 className="text-lg font-bold leading-tight text-slate-100">
              {dealerName ?? "Welcome back"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="size-10 flex items-center justify-center rounded-full glass-panel text-[#C0C0C0]"
          >
            <MaterialIcon name="notifications" className="text-[22px]" />
          </button>
          <button
            type="button"
            className="size-10 flex items-center justify-center rounded-full bg-[#2badee] text-white shadow-lg shadow-[#2badee]/20"
          >
            <MaterialIcon name="search" className="text-[22px]" />
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-32">
        {/* AI Insight Banner */}
        <div className="mt-4 mb-8 p-4 rounded-xl border-l-4 border-[#2badee] glass-panel flex items-start gap-4">
          <div className="text-[#2badee] mt-1">
            <MaterialIcon name="auto_awesome" className="text-[20px]" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#2badee] uppercase tracking-wider mb-1">
              AI Priority Insight
            </p>
            <p className="text-sm text-[#C0C0C0]/90 leading-relaxed">
              Inventory demand for <span className="text-white font-semibold">Hyundai Creta</span> is
              up 18% this week. Consider optimizing active listings.
            </p>
          </div>
        </div>

        {/* Executive Metrics Grid */}
        <section className="grid grid-cols-2 gap-4 mb-10">
          {/* Full-width Portfolio Value card */}
          <div className="col-span-2 glass-panel p-5 rounded-xl flex items-center justify-between overflow-hidden relative"
            style={{ border: "1px solid rgba(192, 192, 192, 0.1)" }}
          >
            <div className="relative z-10">
              <p className="text-xs text-[#C0C0C0]/50 font-medium tracking-widest uppercase mb-1">
                Total Portfolio Value
              </p>
              <p className="text-3xl font-bold text-white">{portfolioValue}</p>
              <p className="text-xs text-emerald-400 flex items-center gap-1 mt-2">
                <MaterialIcon name="trending_up" className="text-[14px]" />
                {totalVehicles} vehicles listed
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <MaterialIcon name="account_balance_wallet" className="text-[120px]" />
            </div>
          </div>

          {/* Live Leads */}
          <div className="glass-panel p-4 rounded-xl" style={{ border: "1px solid rgba(192, 192, 192, 0.2)" }}>
            <p className="text-[10px] text-[#C0C0C0]/50 font-bold tracking-widest uppercase mb-2">
              Live Leads
            </p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{activeLeads}</span>
              {hotLeads > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#2badee]/20 text-[#2badee] text-[10px] font-bold">
                  {hotLeads} HOT
                </span>
              )}
            </div>
          </div>

          {/* AI Tasks */}
          <div className="glass-panel p-4 rounded-xl" style={{ border: "1px solid rgba(192, 192, 192, 0.2)" }}>
            <p className="text-[10px] text-[#C0C0C0]/50 font-bold tracking-widest uppercase mb-2">
              AI Tasks
            </p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{String(aiReplies).padStart(2, "0")}</span>
              <MaterialIcon name="checklist" className="text-[20px] text-[#2badee]" />
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Recent Listings</h2>
            <Link
              href="/inventory"
              className="text-[#2badee] text-xs font-semibold flex items-center gap-1 uppercase tracking-widest"
            >
              View All
              <MaterialIcon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            {RECENT_LISTINGS.map((car) => (
              <Link href={`/showcase/${car.id}`} key={car.id} className="min-w-[280px] group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3"
                  style={{ border: "1px solid rgba(192, 192, 192, 0.2)" }}
                >
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    sizes="280px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[#2badee] text-lg font-bold">{car.price}</p>
                    <p className="text-white text-sm font-medium">
                      {car.year} {car.name}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full border border-white/10">
                      {car.status === "available" ? "Active" : "Under Offer"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h3 className="text-[10px] text-[#C0C0C0]/50 font-bold tracking-widest uppercase mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link href={action.href} key={action.label} className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-xl glass-panel flex items-center justify-center text-[#C0C0C0] hover:text-[#2badee] hover:border-[#2badee]/50 transition-colors">
                  <MaterialIcon name={action.icon} className="text-[24px]" />
                </div>
                <span className="text-[10px] font-medium text-[#C0C0C0]/80">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <div className="fixed bottom-28 right-6 z-40">
        <Link
          href="/studio"
          className="h-14 w-14 rounded-full bg-[#2badee] flex items-center justify-center text-white shadow-2xl shadow-[#2badee]/40 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MaterialIcon name="add" className="text-[30px]" />
        </Link>
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#0a1114]/90 backdrop-blur-xl border-t border-[#C0C0C0]/10 px-6 pt-3 pb-8 flex justify-between items-center z-50">
        <Link href="/dashboard" className="flex flex-col items-center gap-1">
          <MaterialIcon name="dashboard" className="text-[24px] text-[#2badee] scale-110" />
          <span className="text-[10px] font-bold text-[#2badee] uppercase tracking-tighter">Dashboard</span>
        </Link>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-[#C0C0C0]/40 hover:text-[#C0C0C0] transition-colors">
          <MaterialIcon name="directions_car" className="text-[24px]" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inventory</span>
        </Link>
        <Link href="/leads" className="flex flex-col items-center gap-1 text-[#C0C0C0]/40 hover:text-[#C0C0C0] transition-colors">
          <MaterialIcon name="group" className="text-[24px]" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Leads</span>
        </Link>
        <Link href="/studio" className="flex flex-col items-center gap-1 text-[#C0C0C0]/40 hover:text-[#C0C0C0] transition-colors">
          <MaterialIcon name="settings_slow_motion" className="text-[24px]" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">AI Tasks</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-[#C0C0C0]/40 hover:text-[#C0C0C0] transition-colors">
          <MaterialIcon name="person" className="text-[24px]" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
        </Link>
      </nav>
    </div>
  );
}
