"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── Offer data ─────────────────────────────────── */
type Category = "New Cars" | "Used Cars" | "Service" | "Insurance" | "Finance";

interface Offer {
  id: number;
  title: string;
  detail: string;
  category: Category;
  badge: string;
  badgeColor: string;
  validTill: string;
  icon: string;
}

const OFFERS: Offer[] = [
  {
    id: 1,
    title: "Maruti Brezza",
    detail: "Cash discount ₹25,000 + Free accessories worth ₹15,000",
    category: "New Cars",
    badge: "Maruti",
    badgeColor: "#1a73e8",
    validTill: "2026-03-31",
    icon: "directions_car",
  },
  {
    id: 2,
    title: "Hyundai Creta",
    detail: "Exchange bonus ₹30,000 on your old car",
    category: "New Cars",
    badge: "Hyundai",
    badgeColor: "#003580",
    validTill: "2026-02-28",
    icon: "directions_car",
  },
  {
    id: 3,
    title: "Tata Nexon EV",
    detail: "₹1.5 Lakh discount on EV — Go green, save big",
    category: "New Cars",
    badge: "Tata",
    badgeColor: "#004b8d",
    validTill: "2026-03-15",
    icon: "electric_car",
  },
  {
    id: 4,
    title: "Free First Service",
    detail: "Free first service on any car purchased through Autovinci",
    category: "Service",
    badge: "Service",
    badgeColor: "#059669",
    validTill: "2026-12-31",
    icon: "build",
  },
  {
    id: 5,
    title: "HDFC Ergo Insurance",
    detail: "10% off on comprehensive car insurance via Autovinci",
    category: "Insurance",
    badge: "Insurance",
    badgeColor: "#7c3aed",
    validTill: "2026-03-31",
    icon: "shield",
  },
  {
    id: 6,
    title: "SBI Zero Processing Fee",
    detail: "Zero processing fee on SBI car loans — save up to ₹10,000",
    category: "Finance",
    badge: "Finance",
    badgeColor: "#d97706",
    validTill: "2026-02-28",
    icon: "account_balance",
  },
];

const FILTERS = ["All", "New Cars", "Used Cars", "Service", "Insurance"] as const;

/* ── Urgency color based on days left ── */
function urgencyColor(validTill: string): { color: string; label: string } {
  const now = new Date();
  const end = new Date(validTill);
  const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { color: "#64748b", label: "Expired" };
  if (days <= 7) return { color: "#ef4444", label: `${days}d left` };
  if (days <= 30) return { color: "#f59e0b", label: `${days}d left` };
  return { color: "#10b981", label: `Valid till ${formatDate(validTill)}` };
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function OffersPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [claimed, setClaimed] = useState<Set<number>>(new Set());

  const filtered = filter === "All" ? OFFERS : OFFERS.filter((o) => o.category === filter);

  const handleClaim = (id: number) => {
    setClaimed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-dvh pb-36" style={{ background: "#080a0f", color: "#f1f5f9" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Current Offers</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* City selector */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <MaterialIcon name="location_on" className="text-[16px]" style={{ color: "#1152d4" }} />
            <span className="text-white text-xs font-semibold">Bengaluru</span>
            <MaterialIcon name="expand_more" className="text-[16px] text-slate-400" />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors"
              style={{
                background: filter === f ? "#1152d4" : "rgba(255,255,255,0.06)",
                color: filter === f ? "#fff" : "#94a3b8",
                border: filter === f ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Offers count */}
        <p className="text-slate-400 text-xs">
          Showing <span className="text-white font-semibold">{filtered.length}</span> offers
        </p>

        {/* Offer cards */}
        <div className="space-y-4">
          {filtered.map((offer) => {
            const urg = urgencyColor(offer.validTill);
            const isClaimed = claimed.has(offer.id);

            return (
              <div
                key={offer.id}
                className="rounded-2xl overflow-hidden border border-white/10"
                style={{ background: "#111827" }}
              >
                {/* Top accent bar */}
                <div className="h-1" style={{ background: offer.badgeColor }} />

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${offer.badgeColor}15` }}
                    >
                      <MaterialIcon
                        name={offer.icon}
                        className="text-[24px]"
                        style={{ color: offer.badgeColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                          style={{ background: `${offer.badgeColor}20`, color: offer.badgeColor }}
                        >
                          {offer.badge}
                        </span>
                      </div>
                      <h3 className="text-white font-bold text-base">{offer.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-4">{offer.detail}</p>

                  {/* Validity & CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MaterialIcon name="schedule" className="text-[14px]" style={{ color: urg.color }} />
                      <span className="text-xs font-semibold" style={{ color: urg.color }}>
                        {urg.label}
                      </span>
                    </div>

                    {isClaimed ? (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10">
                        <MaterialIcon name="check_circle" className="text-[16px] text-emerald-400" fill />
                        <span className="text-emerald-400 text-xs font-bold">Claimed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(offer.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                        style={{ background: "#1152d4" }}
                      >
                        Claim Offer
                        <MaterialIcon name="arrow_forward" className="text-[14px]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <MaterialIcon name="local_offer" className="text-[48px] text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No offers in this category</p>
          </div>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
