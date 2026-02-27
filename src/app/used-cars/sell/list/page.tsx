"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatLakhs(n: number): string {
  if (n >= 100000) {
    return "₹" + (n / 100000).toFixed(1) + "L";
  }
  return "₹" + (n / 1000).toFixed(0) + "K";
}

function computePrice(year: string): number {
  const y = parseInt(year, 10);
  if (isNaN(y)) return 400000;
  return (y - 2010) * 40000 + 200000;
}

const SELL_BENEFITS = [
  { icon: "payments", label: "Instant payment within 24 hours" },
  { icon: "description", label: "RC transfer & all paperwork handled" },
  { icon: "home_pin", label: "Free doorstep pickup anywhere in India" },
  { icon: "verified", label: "No negotiation — guaranteed price locked" },
  { icon: "support_agent", label: "Dedicated relationship manager assigned" },
];

const EXCHANGE_STEPS = [
  { icon: "directions_car", title: "Browse our inventory", desc: "Pick any car you love from 2,400+ listings." },
  { icon: "swap_horiz", title: "We value your car", desc: "Instant AI valuation deducted from new car price." },
  { icon: "local_offer", title: "Pay only the difference", desc: "Exchange + top-up. No loans, no hassle." },
];

function ListPageInner() {
  const params = useSearchParams();
  const year = params.get("year") ?? "";
  const brand = params.get("brand") ?? "Your Car";
  const variant = params.get("variant") ?? "";
  const fuel = params.get("fuel") ?? "";
  const km = params.get("km") ?? "";
  const city = params.get("city") ?? "";

  const basePrice = computePrice(year);
  const low = Math.round(basePrice * 0.9);
  const high = Math.round(basePrice * 1.05);
  const autovinciOffer = Math.round(basePrice * 0.97);

  const [activeTab, setActiveTab] = useState<"sell" | "marketplace" | "exchange">("sell");
  const [description, setDescription] = useState("");
  const [askingPrice, setAskingPrice] = useState(
    String(Math.round(basePrice / 1000) * 1000)
  );

  const carLabel = [brand, year, variant, fuel].filter(Boolean).join(" · ");
  const kmLabel = km ? `${Number(km).toLocaleString("en-IN")} km` : "";

  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/used-cars/sell/evaluate"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Step 2 of 4
            </p>
            <h1 className="text-[16px] font-bold text-white leading-tight">
              Your Valuation
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(17,82,212,0.12)",
              border: "1px solid rgba(17,82,212,0.2)",
            }}
          >
            <MaterialIcon name="auto_awesome" className="text-[13px]" style={{ color: "#1152d4" }} />
            <span className="text-[10px] font-bold" style={{ color: "#1152d4" }}>
              AI Priced
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── CAR IDENTITY ─── */}
        {(brand || year || fuel) && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="directions_car" className="text-[20px] text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{carLabel}</p>
              {(kmLabel || city) && (
                <p className="text-[11px] text-slate-500">
                  {[kmLabel, city].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── VALUATION CARD ─── */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 border"
          style={{
            background: "linear-gradient(135deg, rgba(17,82,212,0.12) 0%, rgba(59,130,246,0.08) 100%)",
            borderColor: "rgba(17,82,212,0.2)",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Your Car&apos;s Estimated Value
          </p>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-[32px] font-black text-white leading-none">
              {formatLakhs(low)}
            </p>
            <p className="text-[20px] font-bold text-slate-400 leading-none mb-0.5">
              –
            </p>
            <p className="text-[32px] font-black text-white leading-none">
              {formatLakhs(high)}
            </p>
          </div>
          <p className="text-[12px] text-slate-400 mt-1">
            Based on {year} model · Live market data · {fuel || "Petrol"}
          </p>

          <div
            className="h-px my-4"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />

          {/* Autovinci offer highlight */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: "rgba(17,82,212,0.15)",
              border: "1px solid rgba(17,82,212,0.3)",
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MaterialIcon
                  name="verified"
                  className="text-[14px]"
                  fill
                  style={{ color: "#1152d4" }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wide text-blue-400">
                  Autovinci Guaranteed Offer
                </span>
              </div>
              <p className="text-[26px] font-black text-white leading-none">
                {formatLakhs(autovinciOffer)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Instant · No negotiation · Today&apos;s price
              </p>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full shrink-0"
              style={{ background: "rgba(17,82,212,0.2)" }}
            >
              <MaterialIcon
                name="local_offer"
                className="text-[22px]"
                fill
                style={{ color: "#60a5fa" }}
              />
            </div>
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div
          className="flex rounded-xl overflow-hidden border p-1 gap-1"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {(
            [
              { key: "sell", label: "Sell Now", icon: "sell" },
              { key: "marketplace", label: "List It", icon: "storefront" },
              { key: "exchange", label: "Exchange", icon: "swap_horiz" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-bold transition-all"
              style={{
                background:
                  activeTab === tab.key
                    ? "rgba(17,82,212,0.2)"
                    : "transparent",
                color: activeTab === tab.key ? "#fff" : "#64748b",
                border:
                  activeTab === tab.key
                    ? "1px solid rgba(17,82,212,0.4)"
                    : "1px solid transparent",
              }}
            >
              <MaterialIcon name={tab.icon} className="text-[15px]" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB: Sell to Autovinci ─── */}
        {activeTab === "sell" && (
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(17,82,212,0.1)",
                border: "1px solid rgba(17,82,212,0.2)",
              }}
            >
              <MaterialIcon name="thumb_up" className="text-[13px]" style={{ color: "#60a5fa" }} fill />
              <span className="text-[11px] font-bold text-blue-400">
                Recommended — highest value, fastest payout
              </span>
            </div>

            <div className="space-y-3">
              {SELL_BENEFITS.map((b) => (
                <div key={b.label} className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
                    style={{ background: "rgba(16,185,129,0.1)" }}
                  >
                    <MaterialIcon
                      name={b.icon}
                      className="text-[16px]"
                      style={{ color: "#10b981" }}
                    />
                  </div>
                  <p className="text-[13px] text-slate-300">{b.label}</p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 border"
              style={{
                background: "rgba(16,185,129,0.05)",
                borderColor: "rgba(16,185,129,0.15)",
              }}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-[28px] font-black text-white">
                  {formatLakhs(autovinciOffer)}
                </p>
                <p className="text-[13px] text-emerald-400 font-semibold">
                  Locked price
                </p>
              </div>
              <p className="text-[12px] text-slate-400">
                Valid for 72 hours · No obligation to sell
              </p>
            </div>

            <Link
              href="/used-cars/sell/schedule"
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
                boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
              }}
            >
              <MaterialIcon name="check_circle" className="text-[20px]" />
              Accept Offer — Schedule Inspection
            </Link>

            <p className="text-center text-[11px] text-slate-600">
              Accepting doesn&apos;t commit you to sell. You&apos;ll confirm after inspection.
            </p>
          </div>
        )}

        {/* ─── TAB: List on Marketplace ─── */}
        {activeTab === "marketplace" && (
          <div className="space-y-4">
            <p className="text-[13px] text-slate-400 leading-relaxed">
              List your car directly on the Autovinci marketplace and reach 3.2M+ active buyers. Set your own price.
            </p>

            {/* Asking price */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Asking Price
              </p>
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3.5 border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(17,82,212,0.3)",
                }}
              >
                <span className="text-[15px] font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="flex-1 bg-transparent text-[15px] font-bold text-white outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 pl-1">
                Market range:{" "}
                <span className="text-slate-300">
                  {formatLakhs(low)} – {formatLakhs(high)}
                </span>
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Description
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your car's condition, features, reason for selling..."
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-[13px] text-white outline-none resize-none border placeholder:text-slate-600 leading-relaxed"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              />
              <p className="text-right text-[10px] text-slate-600 mt-1">
                {description.length}/500
              </p>
            </div>

            {/* Photo upload placeholder */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Photos
              </p>
              <div
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <MaterialIcon name="add_photo_alternate" className="text-[36px] text-slate-600" />
                <p className="text-[13px] font-semibold text-slate-400">
                  Tap to upload photos
                </p>
                <p className="text-[11px] text-slate-600">
                  Up to 15 photos · JPG, PNG, HEIC
                </p>
                <button
                  className="mt-2 px-4 py-2 rounded-xl text-[12px] font-bold border"
                  style={{
                    background: "rgba(17,82,212,0.1)",
                    borderColor: "rgba(17,82,212,0.3)",
                    color: "#60a5fa",
                  }}
                >
                  Choose Photos
                </button>
              </div>
            </div>

            <button
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #1152d4 0%, #1d4ed8 100%)",
                boxShadow: "0 8px 24px rgba(17,82,212,0.35)",
              }}
            >
              <MaterialIcon name="publish" className="text-[20px]" />
              Publish Listing
            </button>

            <p className="text-center text-[11px] text-slate-600">
              Listing goes live instantly. Free for first 30 days.
            </p>
          </div>
        )}

        {/* ─── TAB: Exchange ─── */}
        {activeTab === "exchange" && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-4 border"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.05) 100%)",
                borderColor: "rgba(245,158,11,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MaterialIcon
                  name="swap_horiz"
                  className="text-[20px]"
                  style={{ color: "#f59e0b" }}
                />
                <p className="text-[14px] font-bold text-white">
                  Upgrade. Swap. Save.
                </p>
              </div>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Exchange your current car for any vehicle in our inventory. We deduct your car&apos;s value from the new car&apos;s price — you pay only the difference.
              </p>
            </div>

            <div className="space-y-3">
              {EXCHANGE_STEPS.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                    style={{ background: "rgba(245,158,11,0.1)" }}
                  >
                    <MaterialIcon
                      name={s.icon}
                      className="text-[18px]"
                      style={{ color: "#f59e0b" }}
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-white">{s.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-between rounded-xl px-4 py-3 border"
              style={{
                background: "rgba(245,158,11,0.06)",
                borderColor: "rgba(245,158,11,0.15)",
              }}
            >
              <div>
                <p className="text-[11px] text-slate-500">Your car&apos;s exchange value</p>
                <p className="text-[22px] font-black text-white">
                  {formatLakhs(Math.round(autovinciOffer * 0.95))}
                </p>
              </div>
              <MaterialIcon
                name="arrow_forward"
                className="text-[20px] text-slate-600"
              />
              <div className="text-right">
                <p className="text-[11px] text-slate-500">Deducted from next car</p>
                <p className="text-[13px] font-bold text-amber-400">
                  Browse 2,400+ cars
                </p>
              </div>
            </div>

            <Link
              href="/used-cars"
              className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
                boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
              }}
            >
              <MaterialIcon name="search" className="text-[20px]" />
              Browse Cars to Exchange
            </Link>
          </div>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-dvh flex items-center justify-center"
          style={{ background: "#080a0f" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: "#1152d4" }}
            />
            <p className="text-[13px] text-slate-500">Calculating valuation…</p>
          </div>
        </div>
      }
    >
      <ListPageInner />
    </Suspense>
  );
}
