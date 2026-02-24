"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: notification_history_log — #135bec, Inter + Newsreader, #0a0c10/#101622 */

const ENTRIES = [
  {
    name: "Amit Verma",
    car: "2023 Hyundai Creta SX(O)",
    time: "2m ago",
    status: "Replied",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
    dotColor: "bg-[#135bec] shadow-[0_0_10px_#135bec]",
    expanded: true,
    message:
      '"Hello Amit, we just received the allocation for the Creta SX(O) in Titan Grey. Are you still interested?"',
    channel: "chat_bubble",
  },
  {
    name: "Neha Gupta",
    car: "2022 Maruti Swift ZXi+",
    time: "14:30 PM",
    status: "Read",
    statusIcon: "done_all",
    dotColor: "bg-slate-700",
  },
  {
    name: "Ravi Malhotra",
    car: "2021 Tata Nexon XZA+",
    time: "11:15 AM",
    status: "Delivered",
    statusColor: "bg-slate-800 text-slate-400 border-white/5",
    dotColor: "bg-slate-700",
  },
  {
    name: "System Alert",
    car: "Inventory Sync Completed",
    time: "09:00 AM",
    statusIcon: "settings_suggest",
    dotColor: "bg-slate-700",
  },
  {
    name: "Priya Sharma",
    car: "2023 Honda City ZX CVT",
    time: "Yesterday",
    status: "Bounced",
    statusColor: "text-red-400",
    dotColor: "bg-red-500/50",
    borderColor: "border-red-500/20",
  },
];

export default function NotificationHistoryPage() {
  const [activeChannel, setActiveChannel] = useState("whatsapp");
  const [activeType, setActiveType] = useState("lead");

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-md mx-auto overflow-x-hidden shadow-2xl"
      style={{ fontFamily: "'Inter', sans-serif", background: "#0a0c10" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center p-4 pb-2 justify-between">
          <Link
            href="/"
            className="flex size-10 shrink-0 items-center justify-center cursor-pointer text-slate-300"
          >
            <MaterialIcon name="arrow_back_ios" />
          </Link>
          <h2
            className="text-white text-xl font-semibold leading-tight tracking-tight flex-1 text-center"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            History Log
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button className="text-slate-300">
              <MaterialIcon name="more_vert" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex w-full items-stretch rounded-lg h-11 bg-slate-900/50 border border-white/10 overflow-hidden">
            <div className="text-slate-400 flex items-center justify-center pl-4">
              <MaterialIcon name="search" className="text-xl" />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 text-slate-100 placeholder:text-slate-500 text-sm px-3"
              placeholder="Search recipient or car model..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Filter Channel
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Filter Type
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveChannel("whatsapp")}
                className={`flex h-8 items-center justify-center gap-2 rounded-full px-3 transition-all cursor-pointer ${
                  activeChannel === "whatsapp"
                    ? "bg-[#135bec]/10 border border-[#135bec]/30"
                    : "bg-slate-800/50 border border-white/5 opacity-60"
                }`}
              >
                <MaterialIcon
                  name="chat_bubble"
                  className={`text-sm ${
                    activeChannel === "whatsapp" ? "text-[#135bec]" : "text-white"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    activeChannel === "whatsapp" ? "text-[#135bec]" : "text-white"
                  }`}
                >
                  WhatsApp
                </p>
              </button>
              <button
                onClick={() => setActiveChannel("email")}
                className={`flex h-8 items-center justify-center gap-2 rounded-full px-3 transition-all cursor-pointer ${
                  activeChannel === "email"
                    ? "bg-[#135bec]/10 border border-[#135bec]/30"
                    : "bg-slate-800/50 border border-white/5 opacity-60"
                }`}
              >
                <MaterialIcon
                  name="mail"
                  className={`text-sm ${
                    activeChannel === "email" ? "text-[#135bec]" : "text-white"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    activeChannel === "email" ? "text-[#135bec]" : "text-white"
                  }`}
                >
                  Email
                </p>
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveType("lead")}
                className={`flex h-8 items-center justify-center rounded-full px-3 cursor-pointer ${
                  activeType === "lead"
                    ? "bg-[#135bec]/20 border border-[#135bec]/50"
                    : "bg-slate-800/50 border border-white/5 opacity-60"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    activeType === "lead" ? "text-[#135bec]" : "text-white"
                  }`}
                >
                  Lead
                </p>
              </button>
              <button
                onClick={() => setActiveType("system")}
                className={`flex h-8 items-center justify-center rounded-full px-3 cursor-pointer ${
                  activeType === "system"
                    ? "bg-[#135bec]/20 border border-[#135bec]/50"
                    : "bg-slate-800/50 border border-white/5 opacity-60"
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    activeType === "system" ? "text-[#135bec]" : "text-white"
                  }`}
                >
                  System
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative flex-1 px-4 py-6">
        {/* Timeline vertical line */}
        <div
          className="absolute left-[20px] top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #232f48 10%, #232f48 90%, transparent)",
          }}
        />

        {ENTRIES.map((entry, i) => (
          <div key={i} className="relative pl-10 mb-8">
            {/* Timeline Dot */}
            <div
              className={`absolute left-[13px] top-1 size-4 rounded-full ${entry.dotColor} border-4 border-[#0a0c10] z-10`}
            />

            <div
              className={`rounded-xl p-4 shadow-xl ${
                !entry.expanded && i > 0 ? "opacity-80" : ""
              }`}
              style={{
                background:
                  "linear-gradient(145deg, rgba(25,34,51,0.8) 0%, rgba(16,22,34,0.9) 100%)",
                border: entry.borderColor
                  ? "1px solid rgba(239,68,68,0.2)"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3
                    className="text-slate-100 text-lg font-bold"
                    style={{ fontFamily: "'Newsreader', serif" }}
                  >
                    {entry.name}
                  </h3>
                  <p className="text-slate-400 text-xs">{entry.car}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-slate-500 text-[10px]">{entry.time}</span>
                  {entry.status && entry.statusColor && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${entry.statusColor}`}
                    >
                      {entry.status}
                    </span>
                  )}
                  {entry.statusIcon === "done_all" && (
                    <div className="flex items-center gap-1">
                      <MaterialIcon
                        name="done_all"
                        className="text-[14px] text-[#135bec]"
                      />
                      <span className="text-slate-400 text-[10px] font-bold uppercase">
                        Read
                      </span>
                    </div>
                  )}
                  {entry.statusIcon === "settings_suggest" && (
                    <MaterialIcon
                      name="settings_suggest"
                      className="text-sm text-slate-500"
                    />
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {entry.expanded && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="size-8 rounded-full bg-[#135bec]/20 flex items-center justify-center">
                      <MaterialIcon
                        name={entry.channel || "chat_bubble"}
                        className="text-[#135bec] text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm leading-relaxed italic">
                        {entry.message}
                      </p>
                    </div>
                  </div>
                  <button className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                    View Lead Profile
                    <MaterialIcon name="open_in_new" className="text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll padding */}
      <div className="h-24" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <div className="flex gap-2 border-t border-white/5 bg-[#0a0c10]/95 backdrop-blur-xl px-4 pb-8 pt-3 shadow-2xl">
          <Link
            href="/inventory"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white"
          >
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="directions_car" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">
              Inventory
            </p>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white"
          >
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="group" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Leads</p>
          </Link>
          <Link
            href="/notifications/history"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-[#135bec]"
          >
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="history" fill />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">History</p>
          </Link>
          <Link
            href="/inventory"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white"
          >
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="campaign" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Market</p>
          </Link>
          <Link
            href="/alerts"
            className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white"
          >
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="settings" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">
              Settings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
