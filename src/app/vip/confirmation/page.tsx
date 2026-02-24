"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: vip_membership_confirmation — #f2cc0d, Manrope, #0a0a0a */

const QUICK_MENU = [
  {
    icon: "explore",
    label: "Explore Private Collection",
    href: "/inventory",
    primary: true,
  },
  {
    icon: "smart_toy",
    label: "Meet Your AI Concierge",
    href: "/concierge",
    primary: false,
  },
  {
    icon: "calendar_today",
    label: "Schedule a Consultation",
    href: "/service",
    primary: false,
  },
];

export default function VIPConfirmationPage() {
  return (
    <div
      className="relative flex h-dvh min-h-dvh w-full flex-col overflow-x-hidden max-w-md mx-auto border-x border-white/5 text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <div className="flex items-center p-6 justify-between">
        <Link
          href="/vip"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-100"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <MaterialIcon name="close" className="text-xl" />
        </Link>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#f2cc0d] animate-pulse" />
          <span className="text-[#f2cc0d] text-xs font-bold tracking-[0.2em] uppercase">
            Status: Active
          </span>
        </div>
        <div className="size-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-4">
        <h1 className="text-white tracking-tight text-4xl font-extrabold leading-tight text-center mb-3">
          Welcome to <br />
          the Circle
        </h1>
        <p className="text-slate-400 text-sm font-light leading-relaxed text-center max-w-[280px] mb-10">
          Your exclusive access to the world&apos;s most prestigious automotive
          inventory is now active.
        </p>

        {/* VIP Digital Card */}
        <div className="w-full">
          <div
            className="rounded-xl p-8 border border-[#f2cc0d]/20 aspect-[1.586/1] flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)",
              boxShadow: "0 0 40px -10px rgba(242,204,13,0.3)",
            }}
          >
            {/* Gold shimmer overlay */}
            <div
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none"
              style={{
                background:
                  "linear-gradient(45deg, transparent 0%, rgba(242,204,13,0.05) 45%, rgba(242,204,13,0.1) 50%, rgba(242,204,13,0.05) 55%, transparent 100%)",
                transform: "rotate(30deg)",
              }}
            />
            <div className="flex justify-between items-start relative z-10">
              <div className="flex flex-col">
                <span className="text-[#f2cc0d] text-[10px] font-black tracking-[0.3em] uppercase mb-1">
                  Autovinci
                </span>
                <span className="text-white/40 text-[9px] font-medium tracking-widest uppercase">
                  Member Since 2026
                </span>
              </div>
              <MaterialIcon
                name="verified"
                className="text-[#f2cc0d] text-3xl"
              />
            </div>
            <div className="relative z-10">
              <p className="text-[#f2cc0d] tracking-[0.2em] text-xs font-bold mb-1">
                VIP MEMBER
              </p>
              <h2 className="text-white text-2xl font-bold tracking-tight uppercase">
                Autovinci Buyer
              </h2>
            </div>
            <div className="flex justify-between items-end relative z-10">
              <div
                className="px-3 py-1.5 rounded-lg border-white/10"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-white/80 text-[10px] font-mono tracking-wider">
                  ID: AV-8829-VIP
                </span>
              </div>
              <div className="flex -space-x-2">
                <div className="size-6 rounded-full border border-[#0a0a0a] bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                  V
                </div>
                <div className="size-6 rounded-full border border-[#0a0a0a] bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                  I
                </div>
                <div className="size-6 rounded-full border border-[#0a0a0a] bg-[#f2cc0d] text-[#0a0a0a] flex items-center justify-center text-[8px] font-bold">
                  P
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Menu */}
        <div className="w-full mt-12 space-y-3">
          <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase px-1 mb-4">
            Quick-start menu
          </p>
          {QUICK_MENU.map((item) => (
            <Link
              key={item.icon}
              href={item.href}
              className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all active:scale-[0.98] ${
                item.primary
                  ? "bg-[#f2cc0d] text-[#0a0a0a]"
                  : "text-white font-semibold"
              }`}
              style={
                item.primary
                  ? {}
                  : {
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center ${
                  item.primary ? "bg-[#0a0a0a]/10" : "bg-[#f2cc0d]/10"
                }`}
              >
                <MaterialIcon
                  name={item.icon}
                  className={
                    item.primary ? "text-[#0a0a0a]" : "text-[#f2cc0d]"
                  }
                />
              </div>
              <span className="flex-1 text-left text-sm tracking-tight">
                {item.label}
              </span>
              <MaterialIcon
                name="chevron_right"
                className={`text-sm ${
                  item.primary ? "text-[#0a0a0a]" : "text-slate-500"
                }`}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="p-6 mt-4">
        <Link
          href="/my-cars"
          className="w-full flex flex-col items-center gap-1 group"
        >
          <span className="text-slate-500 text-xs font-medium group-hover:text-[#f2cc0d] transition-colors">
            Go to Dashboard
          </span>
          <div className="h-0.5 w-8 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-0 group-hover:w-full bg-[#f2cc0d] transition-all duration-300" />
          </div>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="flex gap-2 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 pb-8 pt-4">
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-end gap-1 text-[#f2cc0d]"
        >
          <div className="flex h-8 items-center justify-center">
            <MaterialIcon name="home" fill />
          </div>
          <p className="text-[10px] font-bold leading-normal tracking-wider uppercase">
            Home
          </p>
        </Link>
        <Link
          href="/inventory"
          className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500"
        >
          <div className="flex h-8 items-center justify-center">
            <MaterialIcon name="directions_car" />
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wider uppercase">
            Collection
          </p>
        </Link>
        <Link
          href="/concierge"
          className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500"
        >
          <div className="flex h-8 items-center justify-center">
            <MaterialIcon name="smart_toy" />
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wider uppercase">
            Concierge
          </p>
        </Link>
        <Link
          href="/showroom"
          className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500"
        >
          <div className="flex h-8 items-center justify-center">
            <MaterialIcon name="apartment" />
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wider uppercase">
            Showroom
          </p>
        </Link>
        <Link
          href="/login/buyer"
          className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500"
        >
          <div className="flex h-8 items-center justify-center">
            <MaterialIcon name="person" />
          </div>
          <p className="text-[10px] font-medium leading-normal tracking-wider uppercase">
            Profile
          </p>
        </Link>
      </div>
    </div>
  );
}
