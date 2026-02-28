"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchServiceBookings } from "@/lib/api";

type OrderFilter = "All" | "Active" | "Completed" | "Cancelled";
type OrderStatus = "BOOKING_CONFIRMED" | "COMPLETED" | "CANCELLED" | "IN_TRANSIT";

interface Order {
  id: string;
  name: string;
  type: "vehicle" | "service";
  date: string;
  status: OrderStatus;
  amount: string;
  icon: string;
}

const TYPE_LABELS: Record<string, string> = {
  RC_TRANSFER: "RC Transfer",
  INSPECTION: "Vehicle Inspection",
  SWAP: "SwapDirect Exchange",
  CROSS_STATE: "Cross-State Transfer",
};

const TYPE_ICONS: Record<string, string> = {
  RC_TRANSFER: "description",
  INSPECTION: "search",
  SWAP: "swap_horiz",
  CROSS_STATE: "local_shipping",
};

const STATUS_MAP: Record<string, OrderStatus> = {
  PENDING: "BOOKING_CONFIRMED",
  CONFIRMED: "BOOKING_CONFIRMED",
  IN_PROGRESS: "IN_TRANSIT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

const STATUS_CONFIG: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  BOOKING_CONFIRMED: { bg: "rgba(17,82,212,0.12)", color: "#60a5fa", label: "Booking Confirmed" },
  COMPLETED: { bg: "rgba(16,185,129,0.12)", color: "#34d399", label: "Completed" },
  CANCELLED: { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "Cancelled" },
  IN_TRANSIT: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", label: "In Transit" },
};

const STATUS_FILTER_MAP: Record<OrderStatus, OrderFilter> = {
  BOOKING_CONFIRMED: "Active",
  IN_TRANSIT: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const FILTERS: OrderFilter[] = ["All", "Active", "Completed", "Cancelled"];

export default function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("All");
  const { data } = useApi(() => fetchServiceBookings(), []);

  // Map DB bookings to Order interface
  const ORDERS: Order[] = (data?.bookings ?? []).map((b) => {
    const details = (b.details ?? {}) as Record<string, unknown>;
    return {
      id: `ORD-${b.id.slice(0, 8).toUpperCase()}`,
      name: details.plan
        ? `${TYPE_LABELS[b.type] ?? b.type} — ${String(details.plan)}`
        : TYPE_LABELS[b.type] ?? b.type,
      type: "service" as const,
      date: new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: STATUS_MAP[b.status] ?? "BOOKING_CONFIRMED",
      amount: b.amount ? `₹${b.amount.toLocaleString("en-IN")}` : "—",
      icon: TYPE_ICONS[b.type] ?? "receipt_long",
    };
  });

  const filtered = ORDERS.filter(
    (o) => activeFilter === "All" || STATUS_FILTER_MAP[o.status] === activeFilter
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
          <h1 className="text-base font-bold text-white flex-1">My Orders</h1>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            {ORDERS.length} total
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            const count =
              filter === "All"
                ? ORDERS.length
                : ORDERS.filter((o) => STATUS_FILTER_MAP[o.status] === filter).length;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "#94a3b8",
                  border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {filter}
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

        {/* Order Cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <MaterialIcon name="receipt_long" className="text-[28px] text-slate-600" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No orders in this category</p>
              <p className="text-xs text-slate-600 mt-1">Try selecting a different filter above.</p>
            </div>
          ) : (
            filtered.map((order) => {
              const statusStyle = STATUS_CONFIG[order.status];
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-white/5"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {/* Order ID row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-semibold text-slate-500">
                      {order.id}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <MaterialIcon name={order.icon} className="text-[22px] text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white leading-snug">{order.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1">
                          <MaterialIcon name="calendar_today" className="text-[12px] text-slate-600" />
                          <span className="text-[11px] text-slate-500">{order.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MaterialIcon name="payments" className="text-[12px] text-slate-600" />
                          <span className="text-[11px] text-slate-500">
                            {order.type === "vehicle" ? `Deposit ${order.amount}` : order.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    {order.status === "BOOKING_CONFIRMED" && (
                      <>
                        <button
                          className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          style={{
                            background: "rgba(17,82,212,0.12)",
                            color: "#60a5fa",
                            border: "1px solid rgba(17,82,212,0.2)",
                          }}
                        >
                          <MaterialIcon name="local_shipping" className="text-[14px]" />
                          Track Order
                        </button>
                        <button
                          className="h-9 px-4 rounded-xl text-xs font-semibold transition-all"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#94a3b8",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          Details
                        </button>
                      </>
                    )}
                    {order.status === "COMPLETED" && (
                      <>
                        <button
                          className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#94a3b8",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <MaterialIcon name="receipt" className="text-[14px]" />
                          View Invoice
                        </button>
                        <button
                          className="h-9 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                          style={{
                            background: "rgba(16,185,129,0.1)",
                            color: "#34d399",
                            border: "1px solid rgba(16,185,129,0.2)",
                          }}
                        >
                          <MaterialIcon name="star" className="text-[14px]" />
                          Rate
                        </button>
                      </>
                    )}
                    {order.status === "CANCELLED" && (
                      <button
                        className="flex-1 h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: "rgba(17,82,212,0.12)",
                          color: "#60a5fa",
                          border: "1px solid rgba(17,82,212,0.2)",
                        }}
                      >
                        <MaterialIcon name="refresh" className="text-[14px]" />
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
