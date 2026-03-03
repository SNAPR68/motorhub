"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchServiceBookings, fetchAppointments } from "@/lib/api";

type BookingTab = "All" | "Test Drives" | "Service" | "Reservations";
type BookingStatus = "CONFIRMED" | "SCHEDULED" | "COMPLETED" | "PENDING";
type BookingType = "test_drive" | "service" | "reservation";

interface Booking {
  id: string;
  type: BookingType;
  car: string;
  dealer: string;
  dateTime: string;
  status: BookingStatus;
  amount?: string;
}

const STATUS_STYLES: Record<BookingStatus, { bg: string; color: string; label: string }> = {
  CONFIRMED: { bg: "rgba(16,185,129,0.12)", color: "#34d399", label: "Confirmed" },
  SCHEDULED: { bg: "rgba(17,82,212,0.12)", color: "#60a5fa", label: "Scheduled" },
  COMPLETED: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", label: "Completed" },
  PENDING: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", label: "Pending" },
};

const TYPE_ICON: Record<BookingType, string> = {
  test_drive: "directions_car",
  service: "build",
  reservation: "bookmark",
};

const TYPE_TAB: Record<BookingType, BookingTab> = {
  test_drive: "Test Drives",
  service: "Service",
  reservation: "Reservations",
};

const TABS: BookingTab[] = ["All", "Test Drives", "Service", "Reservations"];

const ACTION_LABELS: Record<BookingStatus, string> = {
  CONFIRMED: "Reschedule",
  SCHEDULED: "Reschedule",
  COMPLETED: "View",
  PENDING: "View",
};

function mapServiceType(type: string): BookingType {
  const t = type.toUpperCase();
  if (t === "INSPECTION" || t === "RC_TRANSFER" || t === "CROSS_STATE") return "service";
  if (t === "SWAP") return "reservation";
  return "service";
}

function mapStatus(status: string): BookingStatus {
  const s = status.toUpperCase();
  if (s === "CONFIRMED") return "CONFIRMED";
  if (s === "SCHEDULED" || s === "ACTIVE") return "SCHEDULED";
  if (s === "COMPLETED" || s === "DONE") return "COMPLETED";
  return "PENDING";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Date TBD";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatServiceLabel(type: string): string {
  const labels: Record<string, string> = {
    RC_TRANSFER: "RC Transfer",
    INSPECTION: "Inspection",
    SWAP: "Car Swap",
    CROSS_STATE: "Cross-State Transfer",
  };
  return labels[type.toUpperCase()] || type;
}

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("All");

  const { data: serviceData, isLoading: loadingServices } = useApi(
    () => fetchServiceBookings(),
    []
  );
  const { data: appointmentData, isLoading: loadingAppointments } = useApi(
    () => fetchAppointments(),
    []
  );

  const loading = loadingServices || loadingAppointments;

  // Merge service bookings + appointments into unified booking list
  const bookings: Booking[] = [];

  if (serviceData?.bookings) {
    for (const b of serviceData.bookings) {
      bookings.push({
        id: b.id,
        type: mapServiceType(b.type),
        car: formatServiceLabel(b.type),
        dealer: b.city || "Autovinci Service",
        dateTime: formatDate(b.scheduledAt),
        status: mapStatus(b.status),
        amount: b.amount ? `₹${b.amount.toLocaleString("en-IN")}` : undefined,
      });
    }
  }

  if (appointmentData?.appointments) {
    for (const a of appointmentData.appointments) {
      bookings.push({
        id: a.id,
        type: "test_drive",
        car: a.vehicle?.name || "Test Drive",
        dealer: a.location || a.buyerName || "Showroom Visit",
        dateTime: formatDate(a.scheduledAt),
        status: mapStatus(a.status),
      });
    }
  }

  const filtered = bookings.filter(
    (b) => activeTab === "All" || TYPE_TAB[b.type] === activeTab
  );

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">My Bookings</h1>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
            >
              {bookings.length} total
            </span>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Tab pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            const count = tab === "All" ? bookings.length : bookings.filter((b) => TYPE_TAB[b.type] === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#94a3b8",
                  border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {tab}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                    color: active ? "#fff" : "#64748b",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
        ) : (
          /* Booking cards */
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <MaterialIcon name="calendar_today" className="text-[40px] text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-slate-500">No bookings yet</p>
                <p className="text-xs text-slate-600 mt-1 max-w-[240px]">
                  Book a test drive, inspection, or service to see them here.
                </p>
              </div>
            ) : (
              filtered.map((booking) => {
                const statusStyle = STATUS_STYLES[booking.status];
                const icon = TYPE_ICON[booking.type];
                const actionLabel = ACTION_LABELS[booking.status];

                return (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl border border-white/5"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <MaterialIcon name={icon} className="text-[20px] text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-white truncate">{booking.car}</h3>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: statusStyle.bg, color: statusStyle.color }}
                          >
                            {statusStyle.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{booking.dealer}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <MaterialIcon name="calendar_today" className="text-[12px] text-slate-600" />
                          <span className="text-[11px] text-slate-500">{booking.dateTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {booking.status !== "COMPLETED" && booking.status !== "PENDING" && (
                        <button
                          className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: "rgba(17,82,212,0.12)", color: "#60a5fa", border: "1px solid rgba(17,82,212,0.2)" }}
                      >
                        {actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
