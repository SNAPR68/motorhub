"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: digital_handover_experience_1 — #ecc813, Manrope + Playfair Display, #0a0a0a */

const ACTION_CARDS = [
  {
    icon: "calendar_month",
    iconBg: "bg-[#ecc813]/10",
    iconColor: "text-[#ecc813]",
    title: "Schedule Delivery",
    desc: "Choose your preferred arrival window",
    trailing: "chevron_right",
    trailingHover: "group-hover:text-[#ecc813]",
  },
  {
    icon: "description",
    iconBg: "bg-slate-100/10",
    iconColor: "text-slate-300",
    title: "Download Documentation",
    desc: "Legal titles and insurance (PDF, 2.4MB)",
    trailing: "download",
    trailingHover: "group-hover:text-white",
  },
  {
    icon: "support_agent",
    iconBg: "bg-[#ecc813]/10",
    iconColor: "text-[#ecc813]",
    title: "Meet Your Concierge",
    desc: "Personalized assistance for your new drive",
    trailing: "contact_support",
    trailingHover: "group-hover:text-[#ecc813]",
    shimmer: true,
  },
];

export default function HandoverPage() {
  const { data } = useApi(() => fetchVehicles({ limit: 1 }), []);
  const vehicle = data?.vehicles?.[0] ? adaptVehicle(data.vehicles[0]) : null;

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto text-slate-100 antialiased overflow-x-hidden"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[#ecc813] font-bold tracking-widest text-xs uppercase">
            Autovinci
          </span>
        </div>
        <button className="text-slate-100 opacity-60 hover:opacity-100 transition-opacity">
          <MaterialIcon name="more_vert" />
        </button>
      </header>

      {/* Cinematic Video Hero */}
      <section className="relative w-full aspect-[9/12] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${INTERIOR}')` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 text-center">
            <h1
              className="italic text-4xl text-white mb-4 drop-shadow-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome to the Journey
            </h1>
            <p className="text-slate-300 text-sm tracking-[0.2em] uppercase font-light">
              Edition 01 / {vehicle.year}
            </p>
          </div>
        </div>
      </section>

      {/* Digital Ownership Certificate */}
      <section className="px-6 -mt-32 relative z-30">
        <div
          className="rounded-xl p-[1px] shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #ecc813 0%, #fff 50%, #ecc813 100%)",
          }}
        >
          <div className="bg-[#141414] rounded-[11px] p-6 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#ecc813]/10 flex items-center justify-center text-[#ecc813] border border-[#ecc813]/20">
              <MaterialIcon name="verified_user" className="text-4xl" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[#ecc813] tracking-widest text-xs uppercase font-semibold">
                Ownership Certificate
              </h2>
              <h3
                className="text-2xl text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {vehicle.year} {vehicle.name}
              </h3>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#ecc813]/30 to-transparent" />
            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Acquisition Date
                </p>
                <p className="text-sm font-medium text-slate-200">Feb 20, 2026</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Status
                </p>
                <p className="text-sm font-medium text-[#ecc813] flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[#ecc813] animate-pulse" />
                  Secured
                </p>
              </div>
            </div>
            <div className="w-full bg-black/40 rounded p-3 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 text-left">
                Vehicle Identification Number
              </p>
              <p className="text-xs font-mono text-slate-300 tracking-widest">
                MALA51CF1KH000001
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 italic">
              <MaterialIcon name="shield" className="text-xs" />
              Digitally Encrypted & Verified by Autovinci
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="px-6 pt-10 pb-24 space-y-3">
        <h4 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-4 px-1">
          Your Next Steps
        </h4>
        {ACTION_CARDS.map((card) => (
          <button
            key={card.icon}
            className="w-full hover:bg-white/10 transition-all rounded-xl p-4 flex items-center justify-between group"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className={`size-10 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center relative overflow-hidden`}
              >
                {card.shimmer && (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(236,200,19,0.1), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                )}
                <MaterialIcon name={card.icon} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{card.title}</p>
                <p className="text-xs text-slate-500">{card.desc}</p>
              </div>
            </div>
            <MaterialIcon
              name={card.trailing}
              className={`text-slate-600 ${card.trailingHover} transition-colors`}
            />
          </button>
        ))}
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <div className="flex gap-2 border-t border-white/5 bg-[#141414]/95 backdrop-blur-xl px-6 pb-6 pt-3">
          <Link
            href="/"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="home" className="text-2xl" />
            <p className="text-[10px] font-medium uppercase tracking-wider">Home</p>
          </Link>
          <Link
            href="/showroom"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="directions_car" className="text-2xl" />
            <p className="text-[10px] font-medium uppercase tracking-wider">
              Showroom
            </p>
          </Link>
          <Link
            href="/my-cars"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-[#ecc813]"
          >
            <MaterialIcon name="stars" fill className="text-2xl" />
            <p className="text-[10px] font-medium uppercase tracking-wider">Garage</p>
          </Link>
          <Link
            href="/concierge"
            className="flex flex-1 flex-col items-center justify-center gap-1 text-slate-500"
          >
            <MaterialIcon name="chat_bubble" className="text-2xl" />
            <p className="text-[10px] font-medium uppercase tracking-wider">
              Concierge
            </p>
          </Link>
        </div>
      </nav>
    </div>
  );
}
