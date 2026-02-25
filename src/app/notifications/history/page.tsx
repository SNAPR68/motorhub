"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchNotifications } from "@/lib/api";
import type { DbNotification } from "@/lib/api";

/* Stitch: notification_history_log — #135bec, Inter + Newsreader, #0a0c10/#101622 */

const TYPE_ICON: Record<string, string> = {
  LEAD: "chat_bubble",
  SYSTEM: "settings_suggest",
  ALERT: "notifications_active",
  APPOINTMENT: "calendar_month",
  AI: "auto_awesome",
};

const TYPE_DOT: Record<string, string> = {
  LEAD: "bg-[#135bec] shadow-[0_0_10px_#135bec]",
  SYSTEM: "bg-slate-700",
  ALERT: "bg-amber-500",
  APPOINTMENT: "bg-emerald-500",
  AI: "bg-purple-500",
};

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationHistoryPage() {
  const [activeChannel, setActiveChannel] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useApi(() => fetchNotifications(), []);
  const allNotifications: DbNotification[] = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  // Filter by type + search
  const filtered = allNotifications.filter((n) => {
    const matchSearch = search
      ? n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchChannel =
      activeChannel === "all" ? true : n.type === activeChannel.toUpperCase();
    return matchSearch && matchChannel;
  });

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
          <div className="flex w-10 items-center justify-end gap-1">
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-[#135bec] text-white rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
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
              placeholder="Search title or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {["all", "lead", "system", "alert", "appointment"].map((ch) => (
              <button
                key={ch}
                onClick={() => setActiveChannel(ch)}
                className={`flex-shrink-0 flex h-8 items-center justify-center gap-1.5 rounded-full px-3 transition-all cursor-pointer capitalize text-xs font-medium ${
                  activeChannel === ch
                    ? "bg-[#135bec]/10 border border-[#135bec]/30 text-[#135bec]"
                    : "bg-slate-800/50 border border-white/5 text-white opacity-60"
                }`}
              >
                {ch !== "all" && (
                  <MaterialIcon name={TYPE_ICON[ch.toUpperCase()] || "notifications"} className="text-[13px]" />
                )}
                {ch === "all" ? "All" : ch.charAt(0).toUpperCase() + ch.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative flex-1 px-4 py-6">
        {/* Timeline vertical line */}
        <div
          className="absolute left-[20px] top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, #232f48 10%, #232f48 90%, transparent)" }}
        />

        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-10 animate-pulse">
                <div className="absolute left-[13px] top-1 size-4 rounded-full bg-slate-800 border-4 border-[#0a0c10]" />
                <div className="rounded-xl p-4" style={{ background: "rgba(25,34,51,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="h-4 bg-slate-800 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <MaterialIcon name="notifications_off" className="text-4xl text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm">No notifications yet</p>
          </div>
        )}

        {filtered.map((notif, i) => {
          const dotClass = TYPE_DOT[notif.type] || "bg-slate-700";
          const icon = TYPE_ICON[notif.type] || "notifications";
          const isFirst = i === 0;

          return (
            <div key={notif.id} className="relative pl-10 mb-8">
              {/* Timeline Dot */}
              <div className={`absolute left-[13px] top-1 size-4 rounded-full ${dotClass} border-4 border-[#0a0c10] z-10`} />

              <div
                className={`rounded-xl p-4 shadow-xl ${!isFirst ? "opacity-90" : ""}`}
                style={{
                  background: "linear-gradient(145deg, rgba(25,34,51,0.8) 0%, rgba(16,22,34,0.9) 100%)",
                  border: notif.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(19,91,236,0.2)",
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3
                      className="text-slate-100 text-base font-bold truncate"
                      style={{ fontFamily: "'Newsreader', serif" }}
                    >
                      {notif.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-slate-500 text-[10px]">{timeAgo(notif.createdAt)}</span>
                    {!notif.read && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter border bg-[#135bec]/10 text-[#135bec] border-[#135bec]/20">
                        New
                      </span>
                    )}
                    {notif.read && (
                      <div className="flex items-center gap-1">
                        <MaterialIcon name="done_all" className="text-[14px] text-[#135bec]" />
                        <span className="text-slate-400 text-[10px] font-bold uppercase">Read</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded — always show for first unread */}
                {isFirst && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-8 rounded-full bg-[#135bec]/20 flex items-center justify-center">
                        <MaterialIcon name={icon} className="text-[#135bec] text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-300 text-sm leading-relaxed italic">
                          &ldquo;{notif.message}&rdquo;
                        </p>
                      </div>
                    </div>
                    {notif.type === "LEAD" && (
                      <Link
                        href="/leads"
                        className="w-full bg-[#135bec] text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        View Lead Profile
                        <MaterialIcon name="open_in_new" className="text-sm" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll padding */}
      <div className="h-24" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <div className="flex gap-2 border-t border-white/5 bg-[#0a0c10]/95 backdrop-blur-xl px-4 pb-8 pt-3 shadow-2xl">
          <Link href="/inventory" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white">
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="directions_car" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Inventory</p>
          </Link>
          <Link href="/leads" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white">
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="group" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Leads</p>
          </Link>
          <Link href="/notifications/history" className="flex flex-1 flex-col items-center justify-end gap-1 text-[#135bec]">
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="history" fill />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">History</p>
          </Link>
          <Link href="/performance" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white">
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="campaign" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Market</p>
          </Link>
          <Link href="/alerts" className="flex flex-1 flex-col items-center justify-end gap-1 text-slate-500 transition-colors hover:text-white">
            <div className="flex h-8 items-center justify-center">
              <MaterialIcon name="settings" />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
