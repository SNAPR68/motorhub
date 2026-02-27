"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Model Offers Page ─── */

const OFFERS = [
  {
    icon: "payments",
    color: "#10b981",
    title: "Cash Discount",
    subtitle: "Flat discount on ex-showroom price",
    value: "25,000",
    validity: "Valid till 31 Mar 2026",
    terms: "Applicable on base & mid variants only. Cannot be combined with exchange bonus.",
  },
  {
    icon: "swap_horiz",
    color: "#3b82f6",
    title: "Exchange Bonus",
    subtitle: "Extra value on your old car trade-in",
    value: "15,000",
    validity: "Valid till 31 Mar 2026",
    terms: "Old car must be registered in the buyer's name. Subject to evaluation at dealership.",
  },
  {
    icon: "redeem",
    color: "#8b5cf6",
    title: "Free Accessories",
    subtitle: "Complimentary accessories package",
    value: "12,000",
    validity: "Valid till 15 Mar 2026",
    terms: "Includes floor mats, body cover, door visors & seat covers. Non-transferable.",
  },
  {
    icon: "trending_down",
    color: "#f59e0b",
    title: "Low EMI Offer",
    subtitle: "Special financing with reduced EMI",
    value: "8,900/mo",
    validity: "Valid till 31 Mar 2026",
    terms: "Starting EMI for base variant with 30% down payment. 7-year tenure at 7.99% via partner banks.",
  },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function OffersPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/${brand}/${model}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">{displayModel} Offers</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">
        {/* ─── Offers Banner ─── */}
        <div
          className="rounded-2xl p-4 border border-amber-500/20 flex items-center gap-3"
          style={{ background: "rgba(245,158,11,0.06)" }}
        >
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(245,158,11,0.15)" }}
          >
            <MaterialIcon name="local_offer" className="text-[22px] text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Special Offers Available</p>
            <p className="text-xs text-slate-500">Save up to Rs.52,000 on {displayModel}</p>
          </div>
        </div>

        {/* ─── Offer Cards ─── */}
        {OFFERS.map((offer) => (
          <div
            key={offer.title}
            className="rounded-2xl border border-white/5 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${offer.color}18` }}
                >
                  <MaterialIcon name={offer.icon} className="text-[22px]" style={{ color: offer.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">{offer.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{offer.subtitle}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-white leading-tight">
                        {offer.value.startsWith("8") ? "" : ""}
                        {offer.value}
                      </p>
                      {!offer.value.includes("/") && (
                        <p className="text-[9px] text-slate-600">off</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Validity */}
              <div className="mt-3 flex items-center gap-1.5">
                <MaterialIcon name="schedule" className="text-[14px] text-slate-600" />
                <span className="text-[11px] text-slate-500">{offer.validity}</span>
              </div>
            </div>

            {/* T&C */}
            <div className="px-4 py-3 border-t border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-500">T&C: </span>
                {offer.terms}
              </p>
            </div>
          </div>
        ))}

        {/* ─── CTA ─── */}
        <Link
          href={`/${brand}/${model}/price-in-delhi`}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="receipt_long" className="text-[18px]" />
          Check On-Road Price
        </Link>

        {/* Disclaimer */}
        <p className="text-[10px] text-slate-600 text-center px-4 leading-relaxed">
          Offers are subject to change without prior notice. Please confirm availability with
          your nearest authorized dealer.
        </p>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
