"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: alert_delivery_insights — #7311d4, Plus Jakarta Sans, #101622 */

const CHANNELS = [
  { name: "WhatsApp", rate: 98.1, sent: "2.1K", icon: "chat", color: "#25d366" },
  { name: "Email", rate: 87.3, sent: "1.4K", icon: "mail", color: "#3b82f6" },
  { name: "SMS", rate: 91.6, sent: "890", icon: "sms", color: "#f97316" },
];

const CAMPAIGNS = [
  { name: "New Listing Alert", sent: 1240, opened: 89, clicked: 34, status: "Active" },
  { name: "Price Drop Notification", sent: 856, opened: 76, clicked: 28, status: "Active" },
  { name: "Test Drive Reminder", sent: 420, opened: 92, clicked: 45, status: "Paused" },
];

export default function NotificationDeliveryPage() {
  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#101622" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(16,22,34,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/notifications/history" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em]">Delivery Insights</h1>
        <button className="p-2 text-slate-400"><MaterialIcon name="calendar_today" /></button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Overall Delivery Rate */}
        <section className="py-6 flex flex-col items-center">
          <div className="relative size-40 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="80" cy="80" r="70" fill="transparent" stroke="#7311d4" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 70 * 0.942} ${2 * Math.PI * 70}`}
                strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(115,17,212,0.4))" }} />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-bold text-white">94.2</span>
              <span className="text-lg text-[#7311d4]">%</span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Overall Delivery</p>
            </div>
          </div>
        </section>

        {/* Channel Breakdown */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Channel Performance</h2>
          <div className="space-y-3">
            {CHANNELS.map((ch) => (
              <div key={ch.name} className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="size-12 rounded-xl flex items-center justify-center" style={{ background: `${ch.color}15` }}>
                  <MaterialIcon name={ch.icon} style={{ color: ch.color }} className="text-2xl" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                    <span className="text-lg font-bold" style={{ color: ch.color }}>{ch.rate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${ch.rate}%`, background: ch.color }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{ch.sent} sent this month</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bounce Tracking */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Bounce Rate Trend</h2>
          <div className="rounded-xl p-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-end justify-between h-20 gap-1">
              {[8, 12, 6, 15, 9, 7, 5, 10, 8, 6, 4, 3].map((h, i) => (
                <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h * 5}%`, background: h > 10 ? "#ef4444" : "rgba(115,17,212,0.3)" }} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-slate-500">Jan</span>
              <span className="text-[10px] text-slate-500">Dec</span>
            </div>
          </div>
        </section>

        {/* Campaign Performance */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Campaign Performance</h2>
          <div className="space-y-3">
            {CAMPAIGNS.map((c) => (
              <div key={c.name} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${c.status === "Active" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-slate-500/15 text-slate-400"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Sent</p>
                    <p className="text-sm font-bold text-white">{c.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Open %</p>
                    <p className="text-sm font-bold text-[#7311d4]">{c.opened}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Click %</p>
                    <p className="text-sm font-bold text-[#0dccf2]">{c.clicked}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-6 pb-6 pt-3 flex justify-between items-center"
        style={{ background: "rgba(16,22,34,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="dashboard" />
          <span className="text-[10px] font-bold uppercase">Dashboard</span>
        </Link>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" />
          <span className="text-[10px] font-bold uppercase">Inventory</span>
        </Link>
        <Link href="/studio" className="relative -top-4">
          <div className="size-14 rounded-full bg-[#7311d4] flex items-center justify-center shadow-lg shadow-[#7311d4]/30 border-4 border-[#101622]">
            <MaterialIcon name="auto_awesome" className="text-white text-2xl" />
          </div>
        </Link>
        <Link href="/leads" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="group" />
          <span className="text-[10px] font-bold uppercase">Leads</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" />
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
