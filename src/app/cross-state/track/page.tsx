"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const timelineSteps = [
  {
    status: "completed" as const,
    icon: "upload_file",
    title: "Documents Submitted",
    date: "Feb 22, 2026",
    desc: "All required documents verified and submitted to RTO",
  },
  {
    status: "completed" as const,
    icon: "verified",
    title: "NOC Received",
    date: "Feb 24, 2026",
    desc: "No Objection Certificate issued by Maharashtra RTO",
  },
  {
    status: "completed" as const,
    icon: "local_shipping",
    title: "Vehicle Picked Up",
    date: "Feb 25, 2026",
    desc: "Car loaded on flatbed carrier from Mumbai depot",
  },
  {
    status: "in_progress" as const,
    icon: "route",
    title: "In Transit",
    date: "ETA Feb 27, 2026",
    desc: "Near Ahmedabad, NH-48",
    location: true,
  },
  {
    status: "pending" as const,
    icon: "home",
    title: "Doorstep Delivery",
    date: "Expected Feb 28, 2026",
    desc: "Final delivery and RC handover at your address",
  },
];

const documents = [
  { name: "NOC (No Objection Certificate)", status: "done" as const },
  { name: "Form 29 (Sale Notice)", status: "done" as const },
  { name: "Form 30 (Transfer Intimation)", status: "pending" as const },
  { name: "Road Tax Receipt", status: "pending" as const },
];

export default function CrossStateTrackPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/cross-state" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Track Your Delivery</h1>
            <p className="text-[11px] text-white/40">CrossState Express</p>
          </div>
        </div>
      </header>

      {/* Tracking Card */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          {/* Order Info */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-white/40 mb-0.5">Order Reference</p>
              <p className="text-sm font-semibold text-[#1152d4]">#CSE-2026-1847</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[#1152d4]/15 border border-[#1152d4]/30">
              <span className="text-[11px] font-semibold text-[#1152d4]">In Transit</span>
            </div>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3 mb-4 py-3 border-t border-b border-white/5">
            <div className="flex-1 text-center">
              <p className="text-[10px] text-white/40 mb-0.5">FROM</p>
              <p className="text-sm font-semibold">Mumbai</p>
              <p className="text-[10px] text-white/30">Maharashtra</p>
            </div>
            <div className="flex items-center gap-1 text-[#1152d4]">
              <div className="w-2 h-2 rounded-full bg-[#1152d4]" />
              <div className="w-12 h-px bg-[#1152d4]/40 relative">
                <div className="absolute inset-y-0 left-0 w-[65%] bg-[#1152d4]" />
              </div>
              <MaterialIcon name="local_shipping" className="text-lg" />
              <div className="w-12 h-px bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/20 border border-white/30" />
            </div>
            <div className="flex-1 text-center">
              <p className="text-[10px] text-white/40 mb-0.5">TO</p>
              <p className="text-sm font-semibold">Jaipur</p>
              <p className="text-[10px] text-white/30">Rajasthan</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <MaterialIcon name="directions_car" className="text-2xl text-white/60" />
            </div>
            <div>
              <p className="text-sm font-semibold">2021 Hyundai Creta SX</p>
              <p className="text-xs text-white/40">Petrol &middot; 28,400 km &middot; White</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-white/40">Delivery Progress</span>
              <span className="text-[11px] font-semibold text-[#10b981]">65%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-[#1152d4] to-[#10b981] transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Tracking Timeline */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-5">Live Tracking</h3>
        <div className="relative">
          {timelineSteps.map((step, i) => {
            const isCompleted = step.status === "completed";
            const isInProgress = step.status === "in_progress";
            const isPending = step.status === "pending";

            return (
              <div key={step.title} className="flex gap-4 relative pb-6">
                {/* Timeline line */}
                {i < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 w-px h-[calc(100%-10px)] ${
                      isCompleted
                        ? "bg-[#10b981]/40"
                        : isInProgress
                        ? "bg-gradient-to-b from-[#1152d4]/40 to-white/5"
                        : "bg-white/5"
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? "bg-[#10b981]/15 border border-[#10b981]/30"
                      : isInProgress
                      ? "bg-[#1152d4]/15 border border-[#1152d4]/30 animate-pulse"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {isCompleted ? (
                    <MaterialIcon name="check_circle" className="text-lg text-[#10b981]" />
                  ) : isInProgress ? (
                    <MaterialIcon name={step.icon} className="text-lg text-[#1152d4]" />
                  ) : (
                    <MaterialIcon name={step.icon} className="text-lg text-white/25" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4
                      className={`text-sm font-semibold ${
                        isPending ? "text-white/40" : "text-white"
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isInProgress && (
                      <span className="text-[10px] font-bold text-[#1152d4] bg-[#1152d4]/10 rounded px-1.5 py-0.5">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/30 mb-1">{step.date}</p>
                  <p
                    className={`text-xs leading-relaxed ${
                      isPending ? "text-white/25" : "text-white/50"
                    }`}
                  >
                    {step.desc}
                  </p>
                  {step.location && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-[#1152d4]/10 border border-[#1152d4]/20 rounded-lg px-2.5 py-1.5">
                      <MaterialIcon name="gps_fixed" className="text-sm text-[#1152d4]" />
                      <span className="text-[11px] font-medium text-[#1152d4]">
                        Near Ahmedabad, NH-48
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transport Details */}
      <section className="px-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Transport Details</h3>
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 space-y-3">
          {[
            { icon: "person", label: "Driver", value: "Rajesh Kumar" },
            { icon: "local_shipping", label: "Vehicle Type", value: "Flatbed Carrier" },
            { icon: "verified_user", label: "Insurance Status", value: "Fully Covered" },
            { icon: "speed", label: "Estimated Distance", value: "1,100 km" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MaterialIcon name={item.icon} className="text-base text-white/40" />
                </div>
                <span className="text-xs text-white/50">{item.label}</span>
              </div>
              <span className="text-sm font-medium text-white/80">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Documents Status */}
      <section className="px-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Documents Status</h3>
        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 space-y-3">
          {documents.map((doc) => (
            <div key={doc.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MaterialIcon
                  name={doc.status === "done" ? "check_circle" : "schedule"}
                  className={`text-lg ${
                    doc.status === "done" ? "text-[#10b981]" : "text-[#f59e0b]"
                  }`}
                />
                <span className="text-sm text-white/70">{doc.name}</span>
              </div>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  doc.status === "done"
                    ? "bg-[#10b981]/10 text-[#10b981]"
                    : "bg-[#f59e0b]/10 text-[#f59e0b]"
                }`}
              >
                {doc.status === "done" ? "Completed" : "In Progress"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section className="px-4 pt-6 pb-6">
        <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
          <MaterialIcon name="support_agent" className="text-lg text-[#1152d4]" />
          Contact Support
        </button>
        <p className="text-center text-[11px] text-white/30 mt-2">
          Available 24/7 &middot; Average response time: 2 min
        </p>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
