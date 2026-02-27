"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── types ────────────────────────────────────────────────────── */

interface DocItem {
  id: string;
  label: string;
  icon: string;
  status: "uploaded" | "active" | "expiring" | "records" | "loan";
  statusLabel: string;
  statusColor: string;
  extra?: string;
  href?: string;
}

/* ── static data ─────────────────────────────────────────────── */

const CARS = [
  { key: "brezza", label: "Brezza ZXi" },
  { key: "i20", label: "i20 Asta" },
] as const;

const DOCS_MAP: Record<string, DocItem[]> = {
  brezza: [
    {
      id: "rc",
      label: "RC (Registration Certificate)",
      icon: "badge",
      status: "uploaded",
      statusLabel: "Uploaded",
      statusColor: "#10b981",
    },
    {
      id: "insurance",
      label: "Insurance Policy",
      icon: "health_and_safety",
      status: "active",
      statusLabel: "Active until Mar 2027",
      statusColor: "#10b981",
      extra: "Renew",
    },
    {
      id: "puc",
      label: "PUC Certificate",
      icon: "eco",
      status: "expiring",
      statusLabel: "Expires in 15 days",
      statusColor: "#f59e0b",
    },
    {
      id: "service",
      label: "Service Records",
      icon: "build",
      status: "records",
      statusLabel: "4 records",
      statusColor: "#10b981",
      extra: "View All",
    },
    {
      id: "loan",
      label: "Loan Documents",
      icon: "account_balance",
      status: "loan",
      statusLabel: "Active EMI",
      statusColor: "#10b981",
    },
    {
      id: "passport",
      label: "VehiclePassport",
      icon: "verified",
      status: "uploaded",
      statusLabel: "Trust Score 82/100",
      statusColor: "#10b981",
      href: "/vehicle/passport",
    },
  ],
  i20: [
    {
      id: "rc",
      label: "RC (Registration Certificate)",
      icon: "badge",
      status: "uploaded",
      statusLabel: "Uploaded",
      statusColor: "#10b981",
    },
    {
      id: "insurance",
      label: "Insurance Policy",
      icon: "health_and_safety",
      status: "expiring",
      statusLabel: "Expires in 30 days",
      statusColor: "#f59e0b",
      extra: "Renew",
    },
    {
      id: "puc",
      label: "PUC Certificate",
      icon: "eco",
      status: "uploaded",
      statusLabel: "Valid",
      statusColor: "#10b981",
    },
    {
      id: "service",
      label: "Service Records",
      icon: "build",
      status: "records",
      statusLabel: "2 records",
      statusColor: "#10b981",
      extra: "View All",
    },
  ],
};

const ACTIVITY = [
  { label: "PUC Certificate renewed", time: "2 days ago", icon: "eco" },
  {
    label: "Insurance updated",
    time: "1 week ago",
    icon: "health_and_safety",
  },
  { label: "Service record added", time: "2 weeks ago", icon: "build" },
];

/* ── page ─────────────────────────────────────────────────────── */

export default function DocumentVaultPage() {
  const [activeCar, setActiveCar] = useState<string>("brezza");
  const docs = DOCS_MAP[activeCar] ?? [];

  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon
              name="arrow_back"
              className="text-[20px] text-slate-400"
            />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">
            Document Vault
          </h1>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(16,185,129,0.1)" }}
          >
            <MaterialIcon
              name="lock"
              className="text-[14px] text-emerald-400"
            />
            <span className="text-[10px] font-bold text-emerald-400">
              Encrypted
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* ── Car Selector Tabs ──────────────────────────────── */}
        <div
          className="flex rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {CARS.map((car) => (
            <button
              key={car.key}
              onClick={() => setActiveCar(car.key)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={
                activeCar === car.key
                  ? { background: "#1152d4", color: "#fff" }
                  : { color: "#64748b" }
              }
            >
              {car.label}
            </button>
          ))}
        </div>

        {/* ── Documents Grid ─────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-2.5">
          {docs.map((doc) => {
            const isExpiring = doc.status === "expiring";

            const cardClass =
              "rounded-2xl p-3.5 border border-white/5 flex flex-col gap-2";
            const cardStyle = {
              background: isExpiring
                ? "rgba(245,158,11,0.04)"
                : "rgba(255,255,255,0.03)",
              borderColor: isExpiring
                ? "rgba(245,158,11,0.15)"
                : undefined,
            };

            const inner = (
              <>
                {/* Icon + status badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: isExpiring
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <MaterialIcon
                      name={doc.icon}
                      className="text-[18px]"
                      style={{
                        color: isExpiring ? "#f59e0b" : "#94a3b8",
                      }}
                    />
                  </div>
                  {isExpiring ? (
                    <MaterialIcon
                      name="warning"
                      className="text-[14px] text-amber-400"
                    />
                  ) : (
                    <MaterialIcon
                      name="check_circle"
                      fill
                      className="text-[14px] text-emerald-400"
                    />
                  )}
                </div>

                {/* Label */}
                <p className="text-[11px] font-bold text-white leading-tight">
                  {doc.label}
                </p>
                <p
                  className="text-[10px] font-semibold"
                  style={{ color: doc.statusColor }}
                >
                  {doc.statusLabel}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-1.5 mt-auto">
                  <button
                    className="flex-1 h-7 rounded-lg text-[10px] font-bold"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "#94a3b8",
                    }}
                  >
                    View
                  </button>
                  {doc.extra && (
                    <button
                      className="flex-1 h-7 rounded-lg text-[10px] font-bold"
                      style={{
                        background: isExpiring
                          ? "rgba(245,158,11,0.15)"
                          : "rgba(17,82,212,0.15)",
                        color: isExpiring ? "#f59e0b" : "#60a5fa",
                      }}
                    >
                      {doc.extra}
                    </button>
                  )}
                </div>
              </>
            );

            return doc.href ? (
              <Link
                key={doc.id}
                href={doc.href}
                className={cardClass}
                style={cardStyle}
              >
                {inner}
              </Link>
            ) : (
              <div key={doc.id} className={cardClass} style={cardStyle}>
                {inner}
              </div>
            );
          })}
        </section>

        {/* ── Upload Section ─────────────────────────────────── */}
        <section
          className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center gap-2 text-center"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{ background: "rgba(17,82,212,0.1)" }}
          >
            <MaterialIcon
              name="cloud_upload"
              className="text-[24px]"
              style={{ color: "#1152d4" }}
            />
          </div>
          <p className="text-sm font-bold text-white">
            Upload new document
          </p>
          <p className="text-[11px] text-slate-500">
            Drag & drop or tap to browse. PDF, JPG, PNG accepted.
          </p>
          <button
            className="mt-1 h-9 px-5 rounded-xl text-xs font-bold text-white"
            style={{ background: "#1152d4" }}
          >
            Browse Files
          </button>
        </section>

        {/* ── Recent Activity ────────────────────────────────── */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3">
            Recent Activity
          </h3>
          <div className="space-y-1">
            {ACTIVITY.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <MaterialIcon
                    name={a.icon}
                    className="text-[16px] text-slate-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-slate-600">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security Badge ─────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.1)",
          }}
        >
          <MaterialIcon
            name="shield"
            fill
            className="text-[20px] text-emerald-400"
          />
          <div>
            <p className="text-xs font-bold text-emerald-400">
              256-bit Encrypted
            </p>
            <p className="text-[10px] text-slate-500">
              Your documents are secure and accessible only to you.
            </p>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
