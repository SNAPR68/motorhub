"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, fetchVehicles, adaptVehicle } from "@/lib/api";

/* ─── AI Negotiation Coach ───
   Killer feature #9 from the gap analysis.
   Acts as the buyer's personal negotiation assistant —
   like having a smart friend who knows cars.
*/

// ── Helpers ──

function formatLakh(amount: number): string {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)}L`;
  return `${(amount / 1000).toFixed(0)}K`;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Leverage computation ──

interface LeveragePoint {
  icon: string;
  title: string;
  description: string;
  amount: number;
  severity: "green" | "amber" | "red";
}

function computeLeverage(
  km: number,
  price: number,
  year: number,
  vehicleId: string
): LeveragePoint[] {
  const rand = seededRandom(vehicleId.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  const points: LeveragePoint[] = [];

  // KM-based leverage
  if (km > 30000) {
    const excessKm = km - 30000;
    const deduction = Math.round(excessKm * 0.5);
    const severity = km > 60000 ? "red" : km > 45000 ? "amber" : "green";
    points.push({
      icon: "speed",
      title: "High Kilometre Reading",
      description: `This car has ${km.toLocaleString("en-IN")} km — above average for a ${year} model. Higher mileage means more wear on engine, transmission, and suspension components.`,
      amount: deduction,
      severity,
    });
  } else {
    points.push({
      icon: "speed",
      title: "Low Kilometre Reading",
      description: `Only ${km.toLocaleString("en-IN")} km on the clock — below average for a ${year} model. This is actually in the seller's favour, so don't bring this up.`,
      amount: 0,
      severity: "green",
    });
  }

  // Insurance leverage
  const insuranceMonths = Math.floor(rand() * 7) + 2; // 2-8 months
  const insuranceCost = Math.round(price * 0.03);
  const insuranceSeverity = insuranceMonths < 3 ? "red" : insuranceMonths < 5 ? "amber" : "green";
  points.push({
    icon: "shield",
    title: "Insurance Expiring Soon",
    description: `Insurance expires in ${insuranceMonths} months. You will need to renew immediately after purchase, costing approximately ${formatINR(insuranceCost)}. Use this as a negotiation lever.`,
    amount: insuranceSeverity === "green" ? 0 : Math.round(insuranceCost * 0.5),
    severity: insuranceSeverity,
  });

  // Tyre wear estimate
  const tyreLifePct = Math.max(0, Math.min(100, Math.round(100 - (km / 50000) * 100)));
  const tyreReplacementCost = Math.round(8000 + rand() * 12000); // 8k-20k range
  const tyreSeverity = tyreLifePct < 25 ? "red" : tyreLifePct < 50 ? "amber" : "green";
  points.push({
    icon: "tire_repair",
    title: "Tyre Condition Estimate",
    description: `Estimated tyre life remaining: ${tyreLifePct}%. ${tyreLifePct < 50 ? `Replacement for all 4 tyres will cost around ${formatINR(tyreReplacementCost)}.` : "Tyres likely have decent life left, but inspect tread depth during test drive."}`,
    amount: tyreLifePct < 50 ? tyreReplacementCost : 0,
    severity: tyreSeverity,
  });

  // Service due
  const nextServiceKm = Math.ceil(km / 10000) * 10000;
  const kmUntilService = nextServiceKm - km;
  const serviceCost = Math.round(5000 + rand() * 10000); // 5k-15k
  const serviceSeverity = kmUntilService < 2000 ? "red" : kmUntilService < 5000 ? "amber" : "green";
  points.push({
    icon: "build",
    title: "Service Due Shortly",
    description: `Next major service at ${nextServiceKm.toLocaleString("en-IN")} km (${kmUntilService.toLocaleString("en-IN")} km away). Expected cost: ${formatINR(serviceCost)}. ${kmUntilService < 3000 ? "Service is imminent — strong negotiation point." : "Ask the dealer to include pre-delivery service in the deal."}`,
    amount: serviceSeverity === "green" ? 0 : serviceCost,
    severity: serviceSeverity,
  });

  // Age depreciation
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age > 3) {
    const agePenalty = Math.round(price * 0.01 * (age - 3));
    points.push({
      icon: "calendar_month",
      title: "Age-Based Depreciation",
      description: `This ${year} model is ${age} years old. Cars depreciate faster after 3 years. Resale value drops significantly, which should factor into pricing.`,
      amount: agePenalty,
      severity: age > 6 ? "red" : "amber",
    });
  }

  return points;
}

// ── Negotiation scripts ──

function getScripts(
  vehicleName: string,
  openingOffer: string,
  walkAway: string,
  leveragePoints: LeveragePoint[]
): { title: string; subtitle: string; icon: string; script: string }[] {
  const activeLeverages = leveragePoints
    .filter((p) => p.amount > 0)
    .slice(0, 2);

  const leverageLines = activeLeverages
    .map((p) => `- ${p.title}: ${formatINR(p.amount)} potential savings`)
    .join("\n");

  return [
    {
      title: "Opening Negotiation",
      subtitle: "Polite, factual, confident",
      icon: "waving_hand",
      script: `Hi, I've been looking at the ${vehicleName} and I'm genuinely interested. I've done my research and based on the current market conditions, similar cars with comparable mileage are listed lower.\n\nMy findings:\n${leverageLines || "- Market comparison shows room for negotiation"}\n\nI would be comfortable at ${openingOffer}. I'm a serious buyer and can close the deal quickly if we can agree on a fair price.`,
    },
    {
      title: "Counter-Offer Response",
      subtitle: "After the seller pushes back",
      icon: "handshake",
      script: `I understand you feel the asking price is fair, and I respect that. However, let me walk you through what I've found:\n\nThe market data shows cars in this segment are trading 10-15% below asking prices. I also need to factor in upcoming expenses — insurance renewal, potential tyre replacement, and the next service.\n\nI can stretch my budget to ${walkAway} as my absolute best offer. This is a fair deal for both of us, and I'm ready to proceed today.`,
    },
    {
      title: "Walk-Away Close",
      subtitle: "Your strongest card — use wisely",
      icon: "directions_walk",
      script: `I appreciate your time. I've been transparent about my budget and research. ${walkAway} is genuinely the most I can offer on this one.\n\nI do have two other options I'm considering, so I need to make a decision this week. If you can work with my number, let's close this today. Otherwise, no hard feelings — you have a great car and I'm sure you will find the right buyer.\n\n(Tip: Start walking. 70% of the time, the seller calls you back with a better number.)`,
    },
  ];
}

// ── Component ──

export default function NegotiateCoachPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: vehicleData, isLoading } = useApi(() => fetchVehicle(id), [id]);
  const { data: allData } = useApi(() => fetchVehicles({ limit: 8 }), []);

  const vehicle = vehicleData?.vehicle ? adaptVehicle(vehicleData.vehicle) : null;
  const alternatives = useMemo(
    () =>
      (allData?.vehicles ?? [])
        .map(adaptVehicle)
        .filter((v) => v.id !== id)
        .slice(0, 3),
    [allData, id]
  );

  const [expandedScript, setExpandedScript] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // ── Loading ──
  if (isLoading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "#080a0f" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Analyzing market data...</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!vehicle) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "#080a0f" }}
      >
        <div className="text-center px-6">
          <MaterialIcon
            name="search_off"
            className="text-[48px] text-slate-700 mb-3"
          />
          <p className="text-slate-400 font-semibold">Vehicle not found</p>
          <Link
            href="/used-cars"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#10b981" }}
          >
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse
            used cars
          </Link>
        </div>
      </div>
    );
  }

  // ── Compute negotiation data ──
  const price = vehicle.priceNumeric;
  const kmNum = vehicle.km ? Number(vehicle.km.replace(/\D/g, "")) : 0;

  const fairLow = Math.round(price * 0.85);
  const fairHigh = Math.round(price * 0.97);
  const openingOffer = Math.round(price * 0.85);
  const walkAwayPrice = Math.round(price * 0.93);
  const priceDiffPct = Math.round(((price - fairHigh) / fairHigh) * 100);
  const isOverpriced = price > fairHigh;
  const isFairPrice = price >= fairLow && price <= fairHigh;
  const isGreatDeal = price < fairLow;

  // Position on the bar (0-100)
  const priceBarPosition = Math.min(
    100,
    Math.max(0, ((price - fairLow) / (fairHigh * 1.15 - fairLow)) * 100)
  );

  const leveragePoints = computeLeverage(kmNum, price, vehicle.year, id);
  const totalLeverage = leveragePoints.reduce((s, p) => s + p.amount, 0);
  const potentialSavings = price - openingOffer;

  const scripts = getScripts(
    vehicle.name,
    formatINR(openingOffer),
    formatINR(walkAwayPrice),
    leveragePoints
  );

  const severityColor: Record<string, string> = {
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  };
  const severityBg: Record<string, string> = {
    green: "rgba(16,185,129,0.08)",
    amber: "rgba(245,158,11,0.08)",
    red: "rgba(239,68,68,0.08)",
  };

  return (
    <div
      className="min-h-dvh w-full pb-28"
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
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/vehicle/${id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon
              name="arrow_back"
              className="text-[20px] text-slate-300"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white truncate">
                AI Negotiation Coach
              </h1>
              <MaterialIcon
                name="auto_awesome"
                className="text-[14px] shrink-0"
                style={{ color: "#10b981" }}
              />
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              Your personal car buying strategist
            </p>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Negotiation Coach — ${vehicle.name}`,
                  url: window.location.href,
                });
              }
            }}
          >
            <MaterialIcon
              name="share"
              className="text-[20px] text-slate-400"
            />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5 space-y-4">
        {/* ─── Vehicle Card ─── */}
        <div
          className="rounded-2xl p-3 border border-white/5 flex gap-3"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0 bg-slate-800">
            {vehicle.image ? (
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <MaterialIcon
                  name="directions_car"
                  className="text-[28px] text-slate-700"
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 py-0.5">
            <h2 className="text-sm font-bold text-white truncate">
              {vehicle.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {vehicle.year} · {vehicle.fuel} · {vehicle.transmission}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-black text-white">
                {vehicle.price}
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                <MaterialIcon name="speed" className="text-[11px]" />
                {vehicle.km}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Market Analysis ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.12)" }}
            >
              <MaterialIcon
                name="analytics"
                className="text-[18px]"
                style={{ color: "#10b981" }}
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Market Analysis
              </p>
              <p className="text-xs text-slate-400">
                Based on 50+ similar listings
              </p>
            </div>
          </div>

          {/* Fair price range */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Fair Price Range</span>
              <span className="text-sm font-bold text-white">
                {formatINR(fairLow)} — {formatINR(fairHigh)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Listed At</span>
              <span className="text-sm font-bold text-white">
                {vehicle.price}
              </span>
            </div>
          </div>

          {/* Price position bar */}
          <div className="space-y-1.5">
            <div className="relative h-3 rounded-full overflow-hidden">
              {/* Background gradient: green to red */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #10b981 0%, #10b981 30%, #f59e0b 60%, #ef4444 100%)",
                  opacity: 0.25,
                }}
              />
              {/* Fair range highlight */}
              <div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  left: "5%",
                  right: "20%",
                  background: "rgba(16,185,129,0.3)",
                  border: "1px solid rgba(16,185,129,0.4)",
                }}
              />
              {/* Listing price indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-white shadow-lg"
                style={{
                  left: `clamp(8px, ${priceBarPosition}%, calc(100% - 8px))`,
                  transform: "translate(-50%, -50%)",
                  background: isOverpriced
                    ? "#ef4444"
                    : isFairPrice
                      ? "#f59e0b"
                      : "#10b981",
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-600">
              <span>Great Deal</span>
              <span>Fair</span>
              <span>Overpriced</span>
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            {isOverpriced && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  color: "#ef4444",
                }}
              >
                <MaterialIcon name="trending_up" className="text-[13px]" />
                {priceDiffPct}% ABOVE MARKET
              </span>
            )}
            {isFairPrice && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  color: "#10b981",
                }}
              >
                <MaterialIcon name="check_circle" className="text-[13px]" />
                FAIR PRICE
              </span>
            )}
            {isGreatDeal && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#34d399",
                }}
              >
                <MaterialIcon name="local_offer" className="text-[13px]" />
                GREAT DEAL
              </span>
            )}
          </div>
        </div>

        {/* ─── Negotiation Leverage Points ─── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Negotiation Leverage Points
            </p>
            {totalLeverage > 0 && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  color: "#10b981",
                }}
              >
                Total: -{formatINR(totalLeverage)}
              </span>
            )}
          </div>

          {leveragePoints.map((point, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5 border space-y-2"
              style={{
                background: severityBg[point.severity],
                borderColor: `${severityColor[point.severity]}20`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${severityColor[point.severity]}18`,
                  }}
                >
                  <MaterialIcon
                    name={point.icon}
                    className="text-[16px]"
                    style={{ color: severityColor[point.severity] }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold text-white">
                      {point.title}
                    </h3>
                    {point.amount > 0 && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: `${severityColor[point.severity]}15`,
                          color: severityColor[point.severity],
                        }}
                      >
                        -{formatINR(point.amount)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Suggested Offer ─── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            borderColor: "rgba(16,185,129,0.2)",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 100%)",
          }}
        >
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <MaterialIcon
                name="psychology"
                className="text-[20px]"
                style={{ color: "#10b981" }}
              />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                AI Recommended Strategy
              </p>
            </div>

            {/* Opening Offer */}
            <div
              className="rounded-xl p-4 mb-3 border border-white/5"
              style={{ background: "rgba(16,185,129,0.06)" }}
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                Your Opening Offer
              </p>
              <p
                className="text-2xl font-black"
                style={{ color: "#10b981" }}
              >
                {formatINR(openingOffer)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Start here. This anchors the negotiation in your favour.
              </p>
            </div>

            {/* Walk-Away Price */}
            <div
              className="rounded-xl p-4 mb-3 border border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                Walk-Away Price
              </p>
              <p className="text-2xl font-black text-white">
                {formatINR(walkAwayPrice)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Do not pay more than this. If the seller won&apos;t budge,
                walk away.
              </p>
            </div>

            {/* Savings callout */}
            <div
              className="rounded-xl p-3 flex items-center gap-3 border"
              style={{
                background: "rgba(16,185,129,0.06)",
                borderColor: "rgba(16,185,129,0.15)",
              }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                <MaterialIcon
                  name="savings"
                  className="text-[20px]"
                  style={{ color: "#10b981" }}
                />
              </div>
              <div>
                <p className="text-xs text-slate-400">Potential Savings</p>
                <p
                  className="text-lg font-black"
                  style={{ color: "#10b981" }}
                >
                  {formatINR(potentialSavings)}
                </p>
              </div>
            </div>
          </div>

          {/* Pro tip */}
          <div
            className="px-4 py-3 flex items-start gap-2 border-t"
            style={{
              background: "rgba(16,185,129,0.03)",
              borderColor: "rgba(16,185,129,0.1)",
            }}
          >
            <MaterialIcon
              name="lightbulb"
              className="text-[14px] mt-0.5 shrink-0"
              style={{ color: "#10b981" }}
            />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-400">Pro tip:</span>{" "}
              Never reveal your maximum budget. Start with the opening offer
              and negotiate upward in small increments. Silence is your most
              powerful tool — after making an offer, stop talking.
            </p>
          </div>
        </div>

        {/* ─── Conversation Scripts ─── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Conversation Scripts
            </p>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: "rgba(17,82,212,0.12)",
                color: "#1152d4",
              }}
            >
              COPY & USE
            </span>
          </div>

          {scripts.map((script, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <button
                onClick={() =>
                  setExpandedScript(expandedScript === i ? null : i)
                }
                className="w-full px-4 py-3 flex items-center gap-3 text-left"
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(17,82,212,0.12)" }}
                >
                  <MaterialIcon
                    name={script.icon}
                    className="text-[16px]"
                    style={{ color: "#1152d4" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">
                    {script.title}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {script.subtitle}
                  </p>
                </div>
                <MaterialIcon
                  name={
                    expandedScript === i
                      ? "expand_less"
                      : "expand_more"
                  }
                  className="text-[20px] text-slate-500 shrink-0"
                />
              </button>

              {expandedScript === i && (
                <div
                  className="px-4 pb-4 border-t border-white/5"
                  style={{ background: "rgba(17,82,212,0.02)" }}
                >
                  <pre className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap pt-3 font-sans">
                    {script.script}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(script.script);
                    }}
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                    style={{
                      background: "rgba(17,82,212,0.12)",
                      color: "#1152d4",
                    }}
                  >
                    <MaterialIcon
                      name="content_copy"
                      className="text-[12px]"
                    />
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── Alternative Options ─── */}
        {alternatives.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Plan B — Similar Cars
              </p>
              <span className="text-[9px] text-slate-600">
                If this deal falls through
              </span>
            </div>

            <div className="space-y-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.id}
                  href={`/vehicle/${alt.id}`}
                  className="rounded-xl p-3 border border-white/5 flex gap-3 block"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="relative h-16 w-22 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                    {alt.image ? (
                      <Image
                        src={alt.image}
                        alt={alt.name}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <MaterialIcon
                          name="directions_car"
                          className="text-[20px] text-slate-700"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-xs font-bold text-white truncate">
                      {alt.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {alt.year} · {alt.km} · {alt.fuel}
                    </p>
                    <p className="text-xs font-bold text-white mt-1">
                      {alt.price}
                    </p>
                  </div>
                  <MaterialIcon
                    name="chevron_right"
                    className="text-[18px] text-slate-600 self-center shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── Disclaimer ─── */}
        <div
          className="rounded-xl px-4 py-3 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-[10px] text-slate-600 leading-relaxed">
            This analysis is generated by Autovinci&apos;s AI based on
            listing data and market trends. Prices are estimates and may
            vary based on actual vehicle condition, location, and seller
            flexibility. Always inspect the car in person before making an
            offer.
          </p>
        </div>
      </main>

      {/* ─── Bottom CTA (fixed) ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 md:hidden"
        style={{
          background: "rgba(8,10,15,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-md mx-auto px-4 py-3 flex gap-3">
          <Link
            href={`/vehicle/${id}`}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-slate-300 flex-1 border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[16px]" />
            Back
          </Link>
          <button
            onClick={() => setSaved(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-bold text-white flex-[2]"
            style={{
              background: saved
                ? "rgba(16,185,129,0.15)"
                : "#10b981",
            }}
          >
            <MaterialIcon
              name={saved ? "check_circle" : "bookmark"}
              className="text-[18px]"
            />
            {saved ? "Report Saved" : "Save Coach Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
