"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

const NAV_ITEMS = [
  { href: "/admin", icon: "dashboard", label: "Overview" },
  { href: "/admin/analytics", icon: "trending_up", label: "Analytics" },
  { href: "/admin/dealers", icon: "storefront", label: "Dealers" },
  { href: "/admin/vehicles", icon: "directions_car", label: "Vehicles" },
  { href: "/admin/users", icon: "group", label: "Users" },
  { href: "/admin/quality", icon: "psychology", label: "AI Quality" },
  { href: "/admin/controls", icon: "tune", label: "Controls" },
  { href: "/admin/alerts", icon: "notifications_active", label: "Alerts" },
  { href: "/admin/subscriptions", icon: "payments", label: "Subscriptions" },
  { href: "/admin/services", icon: "build", label: "Services" },
];

const MOBILE_PRIMARY = NAV_ITEMS.slice(0, 4); // Overview, Analytics, Dealers, Vehicles
const MOBILE_OVERFLOW = NAV_ITEMS.slice(4);    // Users, AI Quality, Controls, Alerts, Subscriptions, Services

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  // Check if current page is in the overflow menu
  const overflowActive = MOBILE_OVERFLOW.some((item) => isActive(item.href));

  return (
    <div className="min-h-screen flex" style={{ background: "#0a1114", fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 shrink-0 border-r border-white/[0.06] sticky top-0 h-screen overflow-y-auto" style={{ background: "#0c0e14" }}>
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#2badee" }}>
              <MaterialIcon name="admin_panel_settings" className="text-white text-[18px]" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-tight text-white leading-none">Autovinci</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] uppercase leading-none mt-0.5" style={{ color: "rgba(43,173,238,0.7)" }}>Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(43,173,238,0.1)" : "transparent",
                  color: active ? "#2badee" : "#94a3b8",
                }}
              >
                <MaterialIcon name={item.icon} fill={active} className="text-[20px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <MaterialIcon name="arrow_back" className="text-[20px]" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 border-t md:hidden z-40"
        style={{ background: "rgba(12,14,20,0.95)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="flex justify-around items-center px-2 py-2">
          {MOBILE_PRIMARY.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1"
                style={{ color: active ? "#2badee" : "#64748b" }}
              >
                <MaterialIcon name={item.icon} fill={active} className="text-[22px]" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex flex-col items-center gap-1 px-3 py-1"
            style={{ color: overflowActive ? "#2badee" : "#64748b" }}
          >
            <MaterialIcon name="more_horiz" fill={moreOpen} className="text-[22px]" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
        <div className="h-6" />
      </nav>

      {/* Mobile overflow menu */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMoreOpen(false)} />
          <div
            className="fixed bottom-[76px] left-3 right-3 rounded-2xl border z-50 md:hidden overflow-hidden"
            style={{ background: "#0c0e14", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="grid grid-cols-3 gap-1 p-3">
              {MOBILE_OVERFLOW.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
                    style={{
                      background: active ? "rgba(43,173,238,0.1)" : "transparent",
                      color: active ? "#2badee" : "#94a3b8",
                    }}
                  >
                    <MaterialIcon name={item.icon} fill={active} className="text-[22px]" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
