"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { createServiceBooking } from "@/lib/api";

const states = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Telangana",
  "Kerala",
  "West Bengal",
];

// Approximate distances between states for transport cost estimation (in km)
const distanceMatrix: Record<string, Record<string, number>> = {
  Maharashtra: { Delhi: 1400, Karnataka: 640, "Tamil Nadu": 1200, Gujarat: 520, Rajasthan: 1100, "Uttar Pradesh": 1350, Telangana: 700, Kerala: 1000, "West Bengal": 1850 },
  Delhi: { Maharashtra: 1400, Karnataka: 2050, "Tamil Nadu": 2200, Gujarat: 950, Rajasthan: 280, "Uttar Pradesh": 200, Telangana: 1500, Kerala: 2600, "West Bengal": 1500 },
  Karnataka: { Maharashtra: 640, Delhi: 2050, "Tamil Nadu": 350, Gujarat: 1200, Rajasthan: 1750, "Uttar Pradesh": 1900, Telangana: 550, Kerala: 360, "West Bengal": 1850 },
  "Tamil Nadu": { Maharashtra: 1200, Delhi: 2200, Karnataka: 350, Gujarat: 1600, Rajasthan: 2100, "Uttar Pradesh": 2100, Telangana: 700, Kerala: 250, "West Bengal": 1700 },
  Gujarat: { Maharashtra: 520, Delhi: 950, Karnataka: 1200, "Tamil Nadu": 1600, Rajasthan: 600, "Uttar Pradesh": 1100, Telangana: 1100, Kerala: 1550, "West Bengal": 2000 },
  Rajasthan: { Maharashtra: 1100, Delhi: 280, Karnataka: 1750, "Tamil Nadu": 2100, Gujarat: 600, "Uttar Pradesh": 500, Telangana: 1350, Kerala: 2300, "West Bengal": 1700 },
  "Uttar Pradesh": { Maharashtra: 1350, Delhi: 200, Karnataka: 1900, "Tamil Nadu": 2100, Gujarat: 1100, Rajasthan: 500, Telangana: 1400, Kerala: 2500, "West Bengal": 800 },
  Telangana: { Maharashtra: 700, Delhi: 1500, Karnataka: 550, "Tamil Nadu": 700, Gujarat: 1100, Rajasthan: 1350, "Uttar Pradesh": 1400, Kerala: 700, "West Bengal": 1500 },
  Kerala: { Maharashtra: 1000, Delhi: 2600, Karnataka: 360, "Tamil Nadu": 250, Gujarat: 1550, Rajasthan: 2300, "Uttar Pradesh": 2500, Telangana: 700, "West Bengal": 2100 },
  "West Bengal": { Maharashtra: 1850, Delhi: 1500, Karnataka: 1850, "Tamil Nadu": 1700, Gujarat: 2000, Rajasthan: 1700, "Uttar Pradesh": 800, Telangana: 1500, Kerala: 2100 },
};

function getTransportCost(from: string, to: string): number {
  if (from === to) return 0;
  const dist = distanceMatrix[from]?.[to] ?? 1200;
  // Base: 8000 for < 500km, scales up to 15000 for 2500km+
  if (dist < 500) return 8000;
  if (dist < 1000) return 10000;
  if (dist < 1500) return 12000;
  if (dist < 2000) return 13500;
  return 15000;
}

const howItWorks = [
  { icon: "travel_explore", title: "Browse Pan-India Inventory", desc: "Access thousands of verified cars from 50+ cities across India." },
  { icon: "calculate", title: "Get Total Landed Cost", desc: "Instant breakdown of all charges including road tax, NOC, and transport." },
  { icon: "description", title: "Document Autopilot", desc: "We handle NOC, Form 29/30, and all interstate paperwork for you." },
  { icon: "local_shipping", title: "GPS-Tracked Transport", desc: "Your car travels on a flatbed carrier with real-time GPS tracking." },
  { icon: "home", title: "Doorstep Delivery + RC Transfer", desc: "Car delivered to your door with RC transfer completed in your name." },
];

const packages = [
  {
    id: "basic",
    name: "Basic",
    price: "4,999",
    color: "#e2e8f0",
    features: [
      "NOC processing",
      "Form 29 & 30 filing",
      "Re-registration assistance",
      "Email support",
    ],
  },
  {
    id: "express",
    name: "Express",
    price: "9,999",
    popular: true,
    color: "#1152d4",
    features: [
      "Everything in Basic",
      "Flatbed car transport",
      "Real-time GPS tracking",
      "Dedicated agent",
      "Phone & WhatsApp support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "14,999",
    color: "#10b981",
    features: [
      "Everything in Express",
      "Doorstep delivery",
      "Transit insurance coverage",
      "7-day satisfaction guarantee",
      "Priority 24/7 support",
    ],
  },
];

const trustItems = [
  { icon: "verified_user", label: "Seller Indemnity Insurance", desc: "Full protection against ownership disputes" },
  { icon: "gps_fixed", label: "GPS Tracked Transport", desc: "Real-time location of your vehicle in transit" },
  { icon: "account_balance", label: "Escrow Payment", desc: "Money released only after successful delivery" },
];

export default function CrossStateExpressPage() {
  const [carPrice, setCarPrice] = useState("");
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [costBreakdown, setCostBreakdown] = useState<{
    carPrice: number;
    roadTax: number;
    noc: number;
    reRegistration: number;
    transport: number;
    total: number;
  } | null>(null);
  const [selectedPkg, setSelectedPkg] = useState("express");
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  function calculateCost() {
    const price = parseInt(carPrice.replace(/,/g, ""), 10);
    if (!price || !fromState || !toState) return;

    const roadTax = Math.round(price * 0.07);
    const noc = 2000;
    const reRegistration = 5000;
    const transport = fromState === toState ? 0 : getTransportCost(fromState, toState);
    const total = price + roadTax + noc + reRegistration + transport;

    setCostBreakdown({ carPrice: price, roadTax, noc, reRegistration, transport, total });
  }

  const handleBook = async () => {
    setBooking(true);
    try {
      const pkg = packages.find((p) => p.id === selectedPkg);
      await createServiceBooking({
        type: "CROSS_STATE",
        plan: selectedPkg,
        amount: pkg?.price.replace(/,/g, ""),
        details: {
          packageName: pkg?.name,
          fromState,
          toState,
          carPrice: carPrice ? parseInt(carPrice.replace(/,/g, ""), 10) : undefined,
          costBreakdown: costBreakdown ?? undefined,
        },
      });
      setBooked(true);
    } catch { /* ignore */ }
    setBooking(false);
  };

  function formatCurrency(n: number) {
    return n.toLocaleString("en-IN");
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">CrossState Express</h1>
            <p className="text-[11px] text-white/40">Interstate Purchase Made Simple</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#1152d4] to-[#0a3a9e] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-3">
              <MaterialIcon name="public" className="text-sm" />
              Pan-India Service
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2">
              Buy Any Car, From Any State
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Pan-India inventory, delivered to your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "50+", label: "Cities Covered" },
            { value: "2,400+", label: "Interstate Transfers" },
            { value: "4.7/5", label: "Customer Rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-lg font-bold text-[#1152d4]">{s.value}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Total Landed Cost Calculator */}
      <section className="px-4 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/15 flex items-center justify-center">
            <MaterialIcon name="calculate" className="text-lg text-[#10b981]" />
          </div>
          <h3 className="text-lg font-semibold">Total Landed Cost Calculator</h3>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 space-y-4">
          {/* Car Price */}
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Car Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/40">&#8377;</span>
              <input
                type="text"
                placeholder="e.g. 8,50,000"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value.replace(/[^0-9,]/g, ""))}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-7 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#1152d4]/50 focus:ring-1 focus:ring-[#1152d4]/30 transition"
              />
            </div>
          </div>

          {/* From State */}
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">From State</label>
            <select
              value={fromState}
              onChange={(e) => setFromState(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1152d4]/50 focus:ring-1 focus:ring-[#1152d4]/30 transition appearance-none"
            >
              <option value="" className="bg-[#0c0f16]">Select state</option>
              {states.map((s) => (
                <option key={s} value={s} className="bg-[#0c0f16]">{s}</option>
              ))}
            </select>
          </div>

          {/* To State */}
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">To State</label>
            <select
              value={toState}
              onChange={(e) => setToState(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1152d4]/50 focus:ring-1 focus:ring-[#1152d4]/30 transition appearance-none"
            >
              <option value="" className="bg-[#0c0f16]">Select state</option>
              {states.map((s) => (
                <option key={s} value={s} className="bg-[#0c0f16]">{s}</option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <button
            onClick={calculateCost}
            disabled={!carPrice || !fromState || !toState}
            className="w-full py-3 rounded-xl bg-[#1152d4] text-white font-semibold text-sm hover:bg-[#0e47b5] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <MaterialIcon name="calculate" className="text-lg" />
            Calculate Total Cost
          </button>

          {/* Results */}
          {costBreakdown && (
            <div className="mt-2 pt-4 border-t border-white/5 space-y-2.5">
              <h4 className="text-sm font-semibold text-white/80 mb-3">Cost Breakdown</h4>
              {[
                { label: "Car Price", value: costBreakdown.carPrice, icon: "directions_car" },
                { label: "Road Tax (7%)", value: costBreakdown.roadTax, icon: "receipt_long" },
                { label: "NOC Charges", value: costBreakdown.noc, icon: "description" },
                { label: "Re-registration", value: costBreakdown.reRegistration, icon: "how_to_reg" },
                { label: "Transport", value: costBreakdown.transport, icon: "local_shipping" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MaterialIcon name={item.icon} className="text-sm text-white/30" />
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                  <span className="text-sm text-white/80 font-medium">
                    &#8377;{formatCurrency(item.value)}
                  </span>
                </div>
              ))}
              <div className="pt-2.5 mt-2.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#10b981]">Total Landed Cost</span>
                <span className="text-lg font-bold text-[#10b981]">
                  &#8377;{formatCurrency(costBreakdown.total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How CrossState Express Works */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-5">How CrossState Express Works</h3>
        <div className="relative">
          {howItWorks.map((step, i) => (
            <div key={step.title} className="flex gap-4 relative pb-6">
              {i < howItWorks.length - 1 && (
                <div className="absolute left-5 top-10 w-px h-[calc(100%-10px)] bg-gradient-to-b from-[#1152d4]/40 to-transparent" />
              )}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1152d4]/15 border border-[#1152d4]/30 flex items-center justify-center">
                <MaterialIcon name={step.icon} className="text-lg text-[#1152d4]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#1152d4] bg-[#1152d4]/10 rounded px-1.5 py-0.5">
                    STEP {i + 1}
                  </span>
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Packages */}
      <section className="px-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Service Packages</h3>
        <div className="space-y-3">
          {packages.map((pkg) => {
            const selected = selectedPkg === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  selected
                    ? `border-[${pkg.color}] bg-[${pkg.color}]/10`
                    : "border-white/5 bg-white/[0.03] hover:border-white/10"
                }`}
                style={selected ? { borderColor: pkg.color, backgroundColor: `${pkg.color}12` } : undefined}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {pkg.popular && (
                        <span className="text-[10px] font-bold bg-[#1152d4] text-white rounded-full px-2 py-0.5">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">&#8377;{pkg.price}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <MaterialIcon
                        name="check_circle"
                        className="text-sm mt-0.5 flex-shrink-0"
                        style={{ color: selected ? pkg.color : "rgba(255,255,255,0.2)" }}
                      />
                      <span className="text-xs text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition"
                    style={{ borderColor: selected ? pkg.color : "rgba(255,255,255,0.2)" }}
                  >
                    {selected && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pkg.color }} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pt-6">
        {booked ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
            <MaterialIcon name="check_circle" className="text-3xl text-emerald-400" />
            <p className="text-sm font-bold text-white mt-2">Booking Confirmed</p>
            <p className="text-xs text-slate-400 mt-1">Our CrossState agent will contact you within 2 hours to begin the process.</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full py-3.5 rounded-xl bg-[#1152d4] text-white font-semibold text-sm hover:bg-[#0e47b5] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {booking ? (
                <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <MaterialIcon name="rocket_launch" className="text-lg" />
              )}
              {booking ? "Processing..." : `Get Started \u2014 \u20B9${packages.find((p) => p.id === selectedPkg)?.price}`}
            </button>
            <p className="text-center text-[11px] text-white/30 mt-2">
              No payment until your car is picked up
            </p>
          </>
        )}
      </section>

      {/* Trust Section */}
      <section className="px-4 pt-8 pb-6">
        <h3 className="text-lg font-semibold mb-4">Why Trust CrossState Express</h3>
        <div className="space-y-3">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#10b981]/15 flex items-center justify-center">
                <MaterialIcon name={item.icon} className="text-lg text-[#10b981]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold mb-0.5">{item.label}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
