"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCurrentUser } from "@/lib/api";
import { useAuthStore } from "@/lib/stores";

/* ─── My Account — Buyer Dashboard ─── */

const MENU_SECTIONS = [
  {
    title: "My Activity",
    items: [
      { icon: "directions_car", label: "My Cars", sub: "Owned & watchlisted", href: "/my-cars" },
      { icon: "favorite", label: "Saved Cars", sub: "Your shortlisted cars", href: "/wishlist" },
      { icon: "compare_arrows", label: "Compare", sub: "Side-by-side comparison", href: "/compare" },
      { icon: "calendar_month", label: "Bookings", sub: "Service & test drives", href: "/my-account/bookings" },
      { icon: "notifications", label: "Price Alerts", sub: "Get notified on drops", href: "/alerts" },
    ],
  },
  {
    title: "My Garage",
    items: [
      { icon: "garage", label: "Garage", sub: "Your registered vehicles", href: "/my-account/garage" },
      { icon: "verified_user", label: "Warranty", sub: "Extended warranty plans", href: "/my-account/warranty" },
      { icon: "description", label: "Documents", sub: "RC, insurance & more", href: "/my-account/documents" },
      { icon: "sell", label: "Resale Value", sub: "Track depreciation", href: "/my-account/resale" },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: "calculate", label: "EMI Calculator", sub: "Plan your loan", href: "/car-loan/emi-calculator" },
      { icon: "account_balance", label: "Loan Offers", sub: "Pre-approved offers", href: "/car-loan" },
      { icon: "shield", label: "Insurance", sub: "Compare & buy", href: "/car-insurance" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "person", label: "My Profile", sub: "Edit personal details", href: "/my-account" },
      { icon: "sell", label: "Sell My Car", sub: "Get instant valuation", href: "/sell-car" },
      { icon: "support_agent", label: "Help & Support", sub: "Chat with us", href: "/contact" },
    ],
  },
];

export default function MyAccountPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { data, isLoading: loading } = useApi(() => fetchCurrentUser(), []);
  const user = data?.user;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-bold text-white">My Account</h1>
          <Link href="/alerts" className="relative flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="notifications" className="text-[20px] text-slate-400" />
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ─── Profile card ─── */}
        {loading ? (
          <div className="rounded-2xl p-5 border border-white/5 flex items-center gap-4 animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="h-16 w-16 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          </div>
        ) : user ? (
          <div className="rounded-2xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-black text-white shrink-0" style={{ background: "linear-gradient(135deg, #1152d4, #4f8ef7)" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-white truncate">{user.name}</h2>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(17,82,212,0.15)", color: "#60a5fa" }}>
                    Buyer
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
                    Verified
                  </span>
                </div>
              </div>
              <Link href="#" className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <MaterialIcon name="edit" className="text-[16px] text-slate-400" />
              </Link>
            </div>
          </div>
        ) : (
          /* Not logged in */
          <div className="rounded-2xl p-6 border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
              <MaterialIcon name="person" className="text-[32px] text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Sign in to your account</p>
            <p className="text-xs text-slate-500 mb-4">Access your saved cars, alerts and more</p>
            <Link
              href="/login/buyer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#1152d4" }}
            >
              Sign In / Register
            </Link>
          </div>
        )}

        {/* ─── Quick stats ─── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: "favorite", label: "Saved", val: "—", href: "/wishlist" },
            { icon: "compare_arrows", label: "Compared", val: "—", href: "/compare" },
            { icon: "notifications", label: "Alerts", val: "—", href: "/alerts" },
          ].map(({ icon, label, val, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-2xl p-3 text-center border border-white/5 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <MaterialIcon name={icon} className="text-[22px] text-slate-500 mb-1" />
              <p className="text-base font-black text-white">{val}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </Link>
          ))}
        </div>

        {/* ─── Menu sections ─── */}
        {MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">{section.title}</p>
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              {section.items.map((item, i) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-all active:bg-white/5 ${i > 0 ? "border-t border-white/5" : ""}`}
                >
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <MaterialIcon name={item.icon} className="text-[18px] text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-500">{item.sub}</p>
                  </div>
                  <MaterialIcon name="chevron_right" className="text-[18px] text-slate-700 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* ─── Dealer promo ─── */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl p-4 border border-blue-500/15 transition-all active:scale-[0.99]"
          style={{ background: "rgba(17,82,212,0.06)" }}
        >
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.15)" }}>
            <MaterialIcon name="store" className="text-[20px] text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Are you a dealer?</p>
            <p className="text-[11px] text-slate-500">Access your dealer dashboard</p>
          </div>
          <MaterialIcon name="arrow_forward" className="text-[18px] text-blue-500" />
        </Link>

        {/* Sign out */}
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl text-sm font-semibold border border-red-500/15 transition-all active:scale-95"
            style={{ background: "rgba(239,68,68,0.04)", color: "#f87171" }}
          >
            <MaterialIcon name="logout" className="text-[18px]" />
            Sign Out
          </button>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
