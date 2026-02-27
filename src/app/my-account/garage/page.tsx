"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

interface GarageCar {
  id: number;
  name: string;
  year: number;
  reg: string;
  fuel: string;
  odometer: number;
  lastServiceDays: number;
  lastServiceLabel: string;
  healthScore: number;
  insuranceDaysLeft: number;
  serviceOverdue: boolean;
}

const INITIAL_CARS: GarageCar[] = [
  {
    id: 1,
    name: "Maruti Brezza",
    year: 2022,
    reg: "KA01AB1234",
    fuel: "Petrol",
    odometer: 34500,
    lastServiceDays: 45,
    lastServiceLabel: "45 days ago",
    healthScore: 85,
    insuranceDaysLeft: 180,
    serviceOverdue: false,
  },
  {
    id: 2,
    name: "Hyundai i20",
    year: 2020,
    reg: "KA05XY5678",
    fuel: "Petrol",
    odometer: 67200,
    lastServiceDays: 240,
    lastServiceLabel: "8 months ago",
    healthScore: 62,
    insuranceDaysLeft: 60,
    serviceOverdue: true,
  },
];

const HEALTH_COLOR = (score: number) => {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
};

export default function MyGaragePage() {
  const [cars] = useState<GarageCar[]>(INITIAL_CARS);

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
          <h1 className="text-base font-bold text-white flex-1">My Garage</h1>
          <button
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold text-white"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="add" className="text-[16px]" />
            Add Car
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {cars.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="h-20 w-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <MaterialIcon name="garage" className="text-[40px] text-slate-700" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Your garage is empty</h3>
            <p className="text-sm text-slate-500 mb-6">Add your car to track service, insurance, and resale value.</p>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="add" className="text-[18px]" />
              Add your first car
            </button>
          </div>
        ) : (
          cars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl overflow-hidden border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Car header */}
              <div
                className="h-28 relative flex items-center px-4"
                style={{
                  background: "linear-gradient(135deg, rgba(17,82,212,0.1) 0%, rgba(99,102,241,0.06) 100%)",
                }}
              >
                <MaterialIcon name="directions_car" className="text-[64px] text-white/8 absolute right-4" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-black text-white">
                      {car.name} {car.year}
                    </h3>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}
                    >
                      {car.fuel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{car.reg}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Alerts */}
                {car.serviceOverdue && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    <MaterialIcon name="warning" className="text-[16px] text-amber-400" />
                    <span className="text-xs font-semibold text-amber-400">Service overdue — last serviced {car.lastServiceLabel}</span>
                  </div>
                )}
                {car.insuranceDaysLeft <= 60 && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    <MaterialIcon name="shield" className="text-[16px] text-red-400" />
                    <span className="text-xs font-semibold text-red-400">Insurance renews in {car.insuranceDaysLeft} days</span>
                  </div>
                )}

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <MaterialIcon name="speed" className="text-[18px] text-slate-500 mb-1" />
                    <p className="text-sm font-bold text-white">{car.odometer.toLocaleString("en-IN")} km</p>
                    <p className="text-[10px] text-slate-600">Odometer</p>
                  </div>
                  <div
                    className="p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <MaterialIcon name="build" className="text-[18px] text-slate-500 mb-1" />
                    <p className="text-sm font-bold text-white">{car.lastServiceLabel}</p>
                    <p className="text-[10px] text-slate-600">Last Service</p>
                  </div>
                </div>

                {/* Health score */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-slate-500">Health Score</span>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: HEALTH_COLOR(car.healthScore) }}
                    >
                      {car.healthScore}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${car.healthScore}%`,
                        background: HEALTH_COLOR(car.healthScore),
                      }}
                    />
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "build", label: "Service", href: "/service" },
                    { icon: "shield", label: "Insurance", href: "/car-insurance" },
                    { icon: "article", label: "Passport", href: `/vehicle/passport/${car.id}` },
                    { icon: "sell", label: "Resale", href: "/used-cars/sell" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <MaterialIcon name={action.icon} className="text-[18px] text-slate-400" />
                      <span className="text-[9px] font-semibold text-slate-500">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
