"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/inventory", icon: "inventory_2", label: "Inventory" },
  { href: "/leads", icon: "group", label: "Leads" },
  { href: "/analytics", icon: "bar_chart", label: "Analytics" },
  { href: "/intelligence", icon: "query_stats", label: "Intelligence" },
  { href: "/reports/monthly", icon: "description", label: "Reports" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

const BOTTOM_NAV = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/inventory", icon: "inventory_2", label: "Inventory" },
  { href: "/studio", icon: "auto_awesome", label: "Studio", isFab: true },
  { href: "/leads", icon: "group", label: "Leads" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function DealerAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0c10] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border-r border-white/[0.06] bg-[#0c0e14] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <MaterialIcon name="directions_car" className="text-white text-[18px]" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-tight text-white leading-none">Autovinci</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-primary/70 leading-none mt-0.5">Dealer Suite</p>
            </div>
          </Link>
        </div>

        {/* Studio CTA */}
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <Link
            href="/studio"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
          >
            <MaterialIcon name="auto_awesome" className="text-[20px]" />
            AI Studio
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <MaterialIcon name={item.icon} fill={active} className="text-[20px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5">
          {[
            { href: "/plans", icon: "workspace_premium", label: "Upgrade Plan" },
            { href: "/social-hub", icon: "share", label: "Social Hub" },
          ].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <MaterialIcon name={item.icon} fill={active} className="text-[20px] shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile: constrained width + bottom nav padding */}
        {/* Desktop: full width, no bottom nav */}
        <div className="md:hidden">
          {/* Mobile shell: constrain + bottom nav */}
          <div className="max-w-lg mx-auto relative pb-24">
            {children}
          </div>

          {/* Mobile Bottom Nav */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-[#101622]/95 backdrop-blur-xl border-t border-white/10 px-4 pb-8 pt-2">
            <div className="flex items-center justify-around relative">
              {BOTTOM_NAV.map((item, i) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/studio" && pathname.startsWith(item.href));
                if (item.isFab) {
                  return (
                    <div key={item.href} className="relative flex flex-col items-center">
                      <Link
                        href={item.href}
                        className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-90"
                      >
                        <MaterialIcon name="add" className="text-[28px]" />
                      </Link>
                      <span className="mt-8 text-[9px] font-bold uppercase tracking-tight text-primary">
                        {item.label}
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 py-1 transition-colors ${active ? "text-primary" : "text-slate-400"}`}
                  >
                    <MaterialIcon name={item.icon} fill={active} className="text-[24px]" />
                    <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Desktop: full width content */}
        <div className="hidden md:block min-h-screen dealer-desktop">
          {children}
        </div>
      </div>
    </div>
  );
}
