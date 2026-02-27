"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

type CarYear = "2025" | "2026" | "2027";

const UPCOMING: Record<CarYear, { id: number; name: string; expectedDate: string; priceRange: string; bodyType: string; gradient: string }[]> = {
  "2025": [
    { id: 1, name: "Maruti Dzire 2025", expectedDate: "Aug 2025", priceRange: "₹8–12L", bodyType: "Sedan", gradient: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(59,130,246,0.15))" },
    { id: 2, name: "Hyundai Creta EV 2025", expectedDate: "Jun 2025", priceRange: "₹18–23L", bodyType: "EV SUV", gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.15))" },
    { id: 3, name: "Tata Curvv", expectedDate: "Sep 2025", priceRange: "₹10–18L", bodyType: "Coupe SUV", gradient: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(217,119,6,0.12))" },
    { id: 4, name: "Kia Syros", expectedDate: "Mar 2025", priceRange: "₹9–15L", bodyType: "SUV", gradient: "linear-gradient(135deg, rgba(17,82,212,0.2), rgba(99,102,241,0.15))" },
  ],
  "2026": [
    { id: 5, name: "Mahindra XEV 7e", expectedDate: "Q1 2026", priceRange: "₹25–35L", bodyType: "EV SUV", gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(17,82,212,0.15))" },
    { id: 6, name: "Volkswagen Tiguan 2026", expectedDate: "Q2 2026", priceRange: "₹32–42L", bodyType: "SUV", gradient: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))" },
    { id: 7, name: "Mercedes EQB", expectedDate: "Q3 2026", priceRange: "₹68–75L", bodyType: "EV SUV", gradient: "linear-gradient(135deg, rgba(148,163,184,0.15), rgba(71,85,105,0.1))" },
  ],
  "2027": [
    { id: 8, name: "Tata Sierra EV", expectedDate: "2027", priceRange: "₹20–30L", bodyType: "EV SUV", gradient: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,95,70,0.12))" },
    { id: 9, name: "Maruti Alto EV", expectedDate: "2027", priceRange: "₹6–9L", bodyType: "EV Hatchback", gradient: "linear-gradient(135deg, rgba(17,82,212,0.2), rgba(59,130,246,0.12))" },
  ],
};

const YEARS: CarYear[] = ["2025", "2026", "2027"];

export default function UpcomingCarsPage() {
  const [activeYear, setActiveYear] = useState<CarYear>("2025");
  const [alerts, setAlerts] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleAlert = (id: number) => {
    setAlerts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Upcoming Cars</h1>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            {Object.values(UPCOMING).flat().length} cars
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Year Tabs */}
        <div
          className="flex gap-1 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: activeYear === year ? "#1152d4" : "transparent",
                color: activeYear === year ? "#fff" : "#64748b",
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Car Cards */}
        <div className="space-y-3">
          {UPCOMING[activeYear].map((car) => (
            <div
              key={car.id}
              className="rounded-2xl overflow-hidden border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Teaser image */}
              <div
                className="h-36 relative flex items-center justify-center"
                style={{ background: car.gradient }}
              >
                <MaterialIcon name="directions_car" className="text-[56px] text-white/10" />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.1)" }}
                >
                  <MaterialIcon name="directions_car" className="text-[64px] text-white/15" />
                </div>
                <span
                  className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(245,158,11,0.2)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.25)" }}
                >
                  <MaterialIcon name="schedule" className="text-[11px]" />
                  {car.expectedDate}
                </span>
                <span
                  className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#cbd5e1" }}
                >
                  {car.bodyType}
                </span>
              </div>

              <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{car.name}</h3>
                  <p className="text-base font-black text-white mt-0.5">{car.priceRange}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Expected {car.expectedDate}</p>
                </div>
                <button
                  onClick={() => toggleAlert(car.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
                  style={
                    alerts.includes(car.id)
                      ? { background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }
                      : { background: "rgba(17,82,212,0.15)", color: "#60a5fa", border: "1px solid rgba(17,82,212,0.25)" }
                  }
                >
                  <MaterialIcon
                    name={alerts.includes(car.id) ? "check_circle" : "notifications_none"}
                    className="text-[15px]"
                  />
                  {alerts.includes(car.id) ? "Alert Set" : "Set Alert"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(17,82,212,0.06)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon name="campaign" className="text-[20px] text-blue-400" />
            <p className="text-sm font-bold text-white">Get launch alerts</p>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Be the first to know when these cars launch — pricing, specs, and booking dates.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 py-2">
              <MaterialIcon name="check_circle" className="text-[18px] text-emerald-400" fill />
              <span className="text-sm font-semibold text-emerald-400">You&apos;re subscribed!</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 h-10 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#e2e8f0",
                }}
              />
              <button
                onClick={() => email && setSubscribed(true)}
                className="h-10 px-4 rounded-xl text-sm font-bold text-white shrink-0"
                style={{ background: "#1152d4" }}
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
