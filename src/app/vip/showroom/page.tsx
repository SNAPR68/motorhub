"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, SWIFT, NEXON, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: vip_digital_showroom — #dab80b (gold), Space Grotesk, #0a0a0a */

const VEHICLES = [
  { name: "Hyundai Creta SX(O)", tag: "Limited Edition", price: "₹18.5L", year: "2025", image: CRETA, desc: "Turbo Knight Edition • 1 of 500" },
  { name: "Tata Nexon EV Max", tag: "VIP Exclusive", price: "₹21.2L", year: "2025", image: NEXON, desc: "Dark Edition • Long Range • 437km" },
  { name: "Maruti Swift ZXi+", tag: "Pre-Launch", price: "₹9.8L", year: "2026", image: SWIFT, desc: "Next-Gen Hybrid • Carbon Accents" },
];

export default function VIPShowroomPage() {
  return (
    <div
      className="relative h-dvh w-full max-w-md mx-auto overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#dab80b] animate-pulse" />
          <span className="text-[#dab80b] font-bold text-sm tracking-[0.3em] uppercase">VIP Showroom</span>
        </div>
        <Link href="/vip" className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
          <MaterialIcon name="close" />
        </Link>
      </header>

      {/* Snap Scroll Sections */}
      <div className="h-full overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {VEHICLES.map((car, i) => (
          <section key={car.name} className="relative h-dvh w-full snap-start snap-always flex flex-col">
            {/* Full-bleed Image */}
            <div className="absolute inset-0">
              <Image src={car.image} alt={car.name} fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
            </div>

            {/* Vehicle Info */}
            <div className="relative z-10 mt-auto px-6 pb-40">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full mb-4 text-[10px] font-bold uppercase tracking-widest"
                style={{ background: "rgba(218,184,11,0.15)", color: "#dab80b", border: "1px solid rgba(218,184,11,0.3)" }}>
                <MaterialIcon name="diamond" className="text-xs" /> {car.tag}
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">{car.year} {car.name}</h2>
              <p className="text-sm text-slate-400 mt-1">{car.desc}</p>
              <p className="text-2xl font-bold text-[#dab80b] mt-3">{car.price}</p>

              <div className="flex gap-3 mt-6">
                <Link
                  href={`/virtual-tour/vip-${i}`}
                  className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-white"
                  style={{ background: "rgba(218,184,11,0.15)", border: "1px solid rgba(218,184,11,0.3)" }}
                >
                  <MaterialIcon name="360" className="text-[#dab80b]" /> AI Virtual Tour
                </Link>
                <button className="flex-1 bg-[#dab80b] text-[#0a0a0a] py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-[#dab80b]/20">
                  <MaterialIcon name="lock" /> Private Inquiry
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Side Progress Dots */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {VEHICLES.map((_, i) => (
          <div key={i} className={`w-2 rounded-full transition-all ${i === 0 ? "h-6 bg-[#dab80b]" : "h-2 bg-white/30"}`} />
        ))}
      </div>

      {/* Bottom Nav */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 border-t px-6 pb-6 pt-3"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(218,184,11,0.1)" }}>
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="home" />
            <span className="text-[10px] font-bold uppercase">Home</span>
          </Link>
          <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="directions_car" />
            <span className="text-[10px] font-bold uppercase">Cars</span>
          </Link>
          <Link href="/vip/showroom" className="flex flex-col items-center gap-1 text-[#dab80b]">
            <MaterialIcon name="diamond" fill />
            <span className="text-[10px] font-bold uppercase">VIP</span>
          </Link>
          <Link href="/concierge" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="smart_toy" />
            <span className="text-[10px] font-bold uppercase">Concierge</span>
          </Link>
          <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="person" />
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
