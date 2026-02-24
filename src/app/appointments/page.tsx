"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAppointments } from "@/lib/api";
import type { DbAppointment } from "@/lib/api";
import { SkeletonList } from "@/components/ui/Skeleton";

/* ── design tokens: ai_appointment_automation ── */
// primary: #137fec, font: Inter, bg: #f6f7f8

const DATES = [
  { day: "Mon", date: "24" },
  { day: "Tue", date: "25" },
  { day: "Wed", date: "26" },
  { day: "Thu", date: "27" },
  { day: "Fri", date: "28" },
  { day: "Sat", date: "01" },
];

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"];

const AI_TRIGGERS = [
  {
    icon: "chat_bubble",
    iconBg: "rgba(19,127,236,0.1)",
    iconColor: "#137fec",
    title: "Smart Auto-Suggest",
    subtitle: "Suggest drive after 3 messages",
    enabled: true,
  },
  {
    icon: "notifications_active",
    iconBg: "rgba(245,158,11,0.1)",
    iconColor: "#f59e0b",
    title: "SMS Reminders",
    subtitle: "Send 1 hour before appointment",
    enabled: true,
  },
];

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  SCHEDULED: { bg: "rgba(19,127,236,0.1)", color: "#137fec" },
  CONFIRMED: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
  COMPLETED: { bg: "rgba(100,116,139,0.1)", color: "#64748b" },
  CANCELLED: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  NO_SHOW: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(3);
  const [selectedSlot, setSelectedSlot] = useState(0);

  const { data, isLoading } = useApi(() => fetchAppointments(), []);
  const appointments: DbAppointment[] = data?.appointments ?? [];

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-24"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 border-b border-slate-200"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/leads/1" className="w-10 h-10 flex items-center justify-center rounded-full">
            <MaterialIcon name="arrow_back_ios_new" className="text-slate-900" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Test Drive Scheduling
          </h1>
          <Link href="/settings" className="w-10 h-10 flex items-center justify-center rounded-full">
            <MaterialIcon name="settings" className="text-slate-900" />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {/* ── Calendar Section ── */}
        <section className="p-4">
          <div className="bg-white rounded-xl p-4 mb-6" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Select Date</h2>
              <div className="flex gap-2 items-center">
                <button className="p-1 rounded-lg hover:bg-slate-100">
                  <MaterialIcon name="chevron_left" className="text-sm" />
                </button>
                <span className="text-sm font-semibold text-slate-900">February 2026</span>
                <button className="p-1 rounded-lg hover:bg-slate-100">
                  <MaterialIcon name="chevron_right" className="text-sm" />
                </button>
              </div>
            </div>

            {/* Date Scroller */}
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {DATES.map((d, i) => (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(i)}
                  className={`flex-shrink-0 w-12 h-20 flex flex-col items-center justify-center rounded-xl ${
                    i === selectedDate ? "text-white" : "bg-slate-50 text-slate-900"
                  }`}
                  style={i === selectedDate ? { background: "#137fec" } : {}}
                >
                  <span
                    className={`text-[10px] uppercase font-bold ${
                      i === selectedDate ? "opacity-80" : "text-slate-400"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span className="text-lg font-bold">{d.date}</span>
                </button>
              ))}
            </div>

            {/* Available Slots */}
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3 flex items-center gap-1 text-slate-900">
                Available Slots{" "}
                <MaterialIcon name="bolt" className="text-xs text-[#137fec]" />
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => setSelectedSlot(i)}
                    className={`py-2 text-xs font-medium rounded-lg border ${
                      i === selectedSlot
                        ? "border-[#137fec]/20"
                        : "bg-slate-50 border-transparent text-slate-700"
                    }`}
                    style={
                      i === selectedSlot
                        ? { background: "rgba(19,127,236,0.1)", color: "#137fec", borderColor: "rgba(19,127,236,0.2)" }
                        : {}
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Appointment Triggers ── */}
        <section className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-slate-900">AI Appointment Triggers</h3>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(19,127,236,0.1)", color: "#137fec" }}
            >
              AI Active
            </span>
          </div>
          <div className="space-y-3">
            {AI_TRIGGERS.map((trigger) => (
              <div
                key={trigger.title}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
              >
                <div className="flex gap-3 items-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: trigger.iconBg }}
                  >
                    <span style={{ color: trigger.iconColor }}>
                      <MaterialIcon name={trigger.icon} />
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-1 text-slate-900">
                      {trigger.title}
                    </p>
                    <p className="text-xs text-slate-500">{trigger.subtitle}</p>
                  </div>
                </div>
                <div className="relative inline-flex items-center">
                  <div className="w-11 h-6 rounded-full" style={{ background: "#137fec" }} />
                  <div className="absolute left-6 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Upcoming Appointments ── */}
        <section className="px-4 mb-20">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-slate-900">Upcoming Appointments</h3>
            <button className="text-xs font-semibold" style={{ color: "#137fec" }}>
              View All
            </button>
          </div>

          {isLoading && appointments.length === 0 && (
            <SkeletonList count={3} variant="light" />
          )}

          <div className="space-y-3">
            {appointments.map((appt) => {
              const initials = appt.buyerName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const statusStyle = STATUS_STYLE[appt.status] || STATUS_STYLE.SCHEDULED;
              const statusLabel = appt.status.replace(/_/g, " ");

              return (
                <div
                  key={appt.id}
                  className="bg-white p-4 rounded-xl border border-slate-100"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "#137fec" }}
                      >
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{appt.buyerName}</h4>
                        <p className="text-xs text-slate-500 mb-2">
                          {appt.vehicle?.name || "No vehicle"}
                        </p>
                        <div className="flex gap-2">
                          <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                            {formatTime(appt.scheduledAt)}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-1 rounded-md capitalize"
                            style={{ background: statusStyle.bg, color: statusStyle.color }}
                          >
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-400">
                      <MaterialIcon name="more_horiz" />
                    </button>
                  </div>
                </div>
              );
            })}

            {!isLoading && appointments.length === 0 && (
              <div className="py-8 text-center">
                <MaterialIcon name="calendar_month" className="text-3xl text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No appointments yet</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── FAB ── */}
      <button
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
        style={{ background: "#137fec", boxShadow: "0 4px 16px rgba(19,127,236,0.4)" }}
      >
        <MaterialIcon name="add" className="text-2xl" />
      </button>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t border-slate-200"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(16px)" }}
      >
        <div className="max-w-md mx-auto flex justify-between items-center px-6 py-3">
          {[
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "group", label: "Leads", href: "/leads" },
            { icon: "calendar_month", label: "Schedule", href: "/appointments", active: true },
            { icon: "memory", label: "AI Rules", href: "/settings/automation" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-[#137fec]" : "text-slate-400"
              }`}
            >
              <MaterialIcon name={item.icon} fill={item.active} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="h-6 flex justify-center items-end pb-1">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </nav>
    </div>
  );
}
