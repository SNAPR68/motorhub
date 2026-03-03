"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { BUYER_NAV_ITEMS } from "@/lib/constants";

/* Sidebar-only nav (desktop) — extended from BUYER_NAV_ITEMS */
const SIDEBAR_NAV = [
  ...BUYER_NAV_ITEMS,
  { icon: "favorite", label: "Wishlist", href: "/wishlist" },
  { icon: "workspace_premium", label: "VIP", href: "/vip" },
];

const SIDEBAR_SECONDARY = [
  { icon: "sell", label: "Sell My Car", href: "/used-cars/sell" },
  { icon: "help", label: "Help & Support", href: "/help" },
];

export function BuyerAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0c10] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border-r border-white/[0.06] bg-[#0c0e14] sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <MaterialIcon name="diamond" className="text-white text-[18px]" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-tight text-white leading-none">CaroBest</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-primary/70 leading-none mt-0.5">Marketplace</p>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 py-3 border-b border-white/[0.06]">
          <Link
            href="/showroom"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl bg-white/[0.04] text-slate-400 text-sm hover:bg-white/[0.08] transition-colors"
          >
            <MaterialIcon name="search" className="text-[20px]" />
            Search cars...
          </Link>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {SIDEBAR_NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
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

        {/* Secondary Nav */}
        <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5">
          {SIDEBAR_SECONDARY.map((item) => {
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
        {/* Mobile: constrained width + bottom nav */}
        <div className="md:hidden">
          <div className="max-w-lg mx-auto relative pb-24">
            {children}
          </div>
          <BuyerBottomNav />
        </div>

        {/* Desktop: contained width content */}
        <div className="hidden md:block min-h-screen max-w-5xl mx-auto px-6 lg:px-10 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
