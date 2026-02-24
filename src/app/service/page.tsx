"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { MY_CAR } from "@/lib/mock-data";

/* Stitch: luxury_service_selection — #2bdeee, Space Grotesk, #0a0a0a */

const DATES = [
  { day: "Mon", date: 23 },
  { day: "Tue", date: 24, selected: true },
  { day: "Wed", date: 25, disabled: true },
  { day: "Thu", date: 26 },
  { day: "Fri", date: 27 },
  { day: "Sat", date: 28 },
];

const TIME_SLOTS = [
  { time: "09:00 AM" },
  { time: "11:30 AM", selected: true },
  { time: "01:00 PM" },
  { time: "03:30 PM" },
  { time: "05:00 PM" },
  { time: "Booked", disabled: true },
];

const PACKAGES = [
  {
    name: "Standard Maintenance",
    duration: "2 Hours",
    badge: "OEM Parts",
    badgeIcon: "verified",
    price: "₹4,200",
  },
  {
    name: "Performance Tuning",
    duration: "4 Hours",
    badge: "Dyno Test",
    badgeIcon: "speed",
    price: "₹12,000",
    featured: true,
  },
  {
    name: "Professional Detailing",
    duration: "3 Hours",
    badge: "Ceramic Pro",
    badgeIcon: "auto_fix_high",
    price: "₹3,500",
  },
];

export default function ServicePage() {
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedTime, setSelectedTime] = useState("11:30 AM");

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a" }}
    >
      {/* Top App Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md px-4 py-4 border-b border-[#2bdeee]/10">
        <div className="flex items-center justify-between">
          <Link
            href="/my-cars"
            className="w-10 h-10 flex items-center justify-start"
          >
            <MaterialIcon name="arrow_back_ios" />
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold tracking-tight uppercase">
              Service Booking
            </h1>
            <p className="text-[10px] text-[#2bdeee] font-medium tracking-widest uppercase">
              {MY_CAR.name.split(" ").slice(1).join(" ")}
            </p>
          </div>
          <button className="w-10 h-10 flex items-center justify-end">
            <MaterialIcon name="more_horiz" />
          </button>
        </div>
      </div>

      <main className="pb-32">
        {/* Calendar Section */}
        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#c0c0c0] text-sm font-semibold tracking-widest uppercase">
              Select Date
            </h2>
            <span className="text-xs text-[#2bdeee] font-medium">
              February 2026
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {DATES.map((d) => (
              <button
                key={d.date}
                onClick={() => !d.disabled && setSelectedDate(d.date)}
                className={`flex-shrink-0 w-14 h-20 rounded-xl flex flex-col items-center justify-center border ${
                  d.date === selectedDate
                    ? "border-[#2bdeee]/40 bg-[#2bdeee]/10"
                    : "border-white/5 bg-[#121212]"
                } ${d.disabled ? "opacity-50" : ""}`}
                style={
                  d.date === selectedDate
                    ? { boxShadow: "0 0 15px rgba(43,222,238,0.3)" }
                    : {}
                }
              >
                <span
                  className={`text-[10px] uppercase mb-1 ${
                    d.date === selectedDate
                      ? "text-[#2bdeee] font-bold"
                      : "text-[#c0c0c0]"
                  }`}
                >
                  {d.day}
                </span>
                <span
                  className={`text-lg font-bold ${
                    d.date === selectedDate ? "text-[#2bdeee]" : ""
                  }`}
                >
                  {d.date}
                </span>
                {d.date === selectedDate && (
                  <div className="w-1 h-1 bg-[#2bdeee] rounded-full mt-1" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Time Slots */}
        <section className="mt-6 px-4">
          <h2 className="text-[#c0c0c0] text-sm font-semibold tracking-widest uppercase mb-4">
            Available Slots
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((s) => (
              <button
                key={s.time}
                onClick={() => !s.disabled && setSelectedTime(s.time)}
                disabled={s.disabled}
                className={`py-3 rounded-lg border text-xs font-medium transition-colors ${
                  s.disabled
                    ? "border-white/5 bg-white/5 text-white/20 cursor-not-allowed"
                    : s.time === selectedTime
                    ? "border-[#2bdeee]/50 bg-[#2bdeee]/5 font-bold text-[#2bdeee]"
                    : "border-white/10 bg-[#121212] hover:border-[#2bdeee]/50"
                }`}
                style={
                  s.time === selectedTime
                    ? { boxShadow: "0 0 15px rgba(43,222,238,0.3)" }
                    : {}
                }
              >
                {s.time}
              </button>
            ))}
          </div>
        </section>

        {/* AI Diagnostic Summary */}
        <section className="mt-8 px-4">
          <div
            className="rounded-xl p-5 border-l-4 border-l-[#2bdeee] relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderLeft: "4px solid #2bdeee",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <MaterialIcon name="psychology" className="text-[#2bdeee] text-xl" />
              <h2 className="text-[#2bdeee] text-sm font-bold tracking-tight uppercase">
                AI Diagnostic Summary
              </h2>
            </div>
            <p className="text-[#c0c0c0] text-sm leading-relaxed mb-4">
              Telemetry analysis indicates your{" "}
              <span className="text-white font-medium">{MY_CAR.name.split(" ").slice(1).join(" ")}</span>{" "}
              (VIN: ...{MY_CAR.vin.slice(-5)}) requires a{" "}
              <span className="text-white font-medium">brake fluid flush</span> and a{" "}
              <span className="text-white font-medium">
                cooling system inspection
              </span>{" "}
              within the next 3,000 km to maintain optimal performance.
            </p>
            <div className="flex items-center justify-between text-[11px] text-[#c0c0c0]/60 pt-3 border-t border-white/5">
              <span className="flex items-center gap-1">
                <MaterialIcon name="history" className="text-xs" /> Last service: 45
                days ago
              </span>
              <button className="text-[#2bdeee] font-bold uppercase tracking-tighter">
                View Detailed Telematics
              </button>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#2bdeee]/5 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Service Packages */}
        <section className="mt-8 px-4 pb-10">
          <h2 className="text-[#c0c0c0] text-sm font-semibold tracking-widest uppercase mb-4">
            Service Packages
          </h2>
          <div className="space-y-4">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`group relative bg-[#121212] rounded-xl p-4 transition-all duration-300 active:scale-[0.98] ${
                  pkg.featured
                    ? "border-2 border-[#2bdeee]/50"
                    : "border border-white/5 hover:border-[#2bdeee]/30"
                }`}
                style={
                  pkg.featured
                    ? { boxShadow: "0 0 15px rgba(43,222,238,0.3)" }
                    : {}
                }
              >
                {pkg.featured && (
                  <div className="absolute -top-3 left-4 bg-[#2bdeee] text-[#0a0a0a] text-[10px] font-black uppercase px-2 py-0.5 rounded-sm">
                    Recommended
                  </div>
                )}
                <div
                  className={`flex justify-between items-start mb-2 ${
                    pkg.featured ? "pt-1" : ""
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg font-bold ${
                        pkg.featured
                          ? "text-[#2bdeee]"
                          : "text-white group-hover:text-[#2bdeee]"
                      } transition-colors`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-[#c0c0c0] uppercase">
                        <MaterialIcon name="schedule" className="text-[14px]" />{" "}
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#c0c0c0] uppercase">
                        <MaterialIcon
                          name={pkg.badgeIcon}
                          className="text-[14px]"
                        />{" "}
                        {pkg.badge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-white">{pkg.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 p-4 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#c0c0c0] uppercase font-bold tracking-widest">
              Est. Total
            </span>
            <span className="text-2xl font-bold text-white leading-none">
              ₹12,000
            </span>
          </div>
          <Link
            href="/service/logistics"
            className="flex-1 bg-[#2bdeee] text-[#0a0a0a] font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#2bdeee]/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            Continue
            <MaterialIcon name="arrow_forward" className="font-bold" />
          </Link>
        </div>
      </div>
    </div>
  );
}
