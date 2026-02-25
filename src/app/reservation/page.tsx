"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, fetchVehicles, adaptVehicle } from "@/lib/api";
import type { DbVehicle } from "@/lib/api";

/* Stitch: secure_luxury_reservation — #f4c025, Manrope + Playfair Display, #0a0a0a */

function ReservationContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const [refundable, setRefundable] = useState(true);

  const fetcher = () =>
    vehicleId ? fetchVehicle(vehicleId) : fetchVehicles({ limit: 1 }).then((r) => ({ vehicle: r.vehicles[0] ?? null }));
  const { data } = useApi(fetcher, [vehicleId ?? ""]);
  const rawVehicle = (data as { vehicle?: DbVehicle })?.vehicle;
  const vehicle = rawVehicle ? adaptVehicle(rawVehicle) : null;

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-pulse text-white/50">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto text-slate-100 antialiased"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]"
        style={{ background: "rgba(22,22,22,0.7)", backdropFilter: "blur(12px)" }}
      >
        <Link
          href={`/showcase/${vehicle.id}`}
          className="flex items-center justify-center p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <MaterialIcon name="arrow_back_ios" className="text-slate-100" />
        </Link>
        <h1
          className="text-xl italic font-medium tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Autovinci
        </h1>
        <div className="w-10 flex justify-end">
          <MaterialIcon name="verified_user" className="text-[#f4c025]" />
        </div>
      </nav>

      <main className="max-w-md mx-auto pb-32 w-full">
        {/* Vehicle Hero Summary */}
        <div className="p-4">
          <div className="relative group overflow-hidden rounded-xl bg-[#161616] border border-[#2a2a2a]">
            <div className="aspect-[16/9] w-full relative">
              <Image
                alt={vehicle.name}
                fill
                sizes="(max-width: 430px) 100vw, 430px"
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                src={vehicle.image}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative -mt-12">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#f4c025] font-bold mb-1 block">
                Selected Inventory
              </span>
              <h2
                className="text-2xl text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {vehicle.year} {vehicle.name}
              </h2>
              <p className="text-slate-400 text-xs font-light tracking-wide">
                {vehicle.engine} • {vehicle.power} • {vehicle.location} • Stock #{vehicle.id.toUpperCase().slice(0, 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Details Section */}
        <section className="px-4 space-y-4 mt-2">
          <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]/50">
            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-500">
              Reservation Summary
            </h3>
            <span className="text-xs text-[#f4c025] bg-[#f4c025]/10 px-2 py-1 rounded">
              Immediate Allocation
            </span>
          </div>

          {/* Deposit Amount */}
          <div className="bg-[#161616] rounded-xl p-6 border border-[#2a2a2a] flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                Deposit Amount
              </p>
              <p className="text-3xl font-light text-white">
                ₹25,000<span className="text-lg opacity-50">.00</span>
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-[#f4c025] mb-1">
                <MaterialIcon name="lock" className="text-sm" />
                <span className="text-[10px] font-bold uppercase">Encrypted</span>
              </div>
              <p className="text-[10px] text-slate-500 max-w-[100px] leading-tight">
                Secures vehicle for 48 hours
              </p>
            </div>
          </div>

          {/* Refundable Toggle */}
          <div className="bg-[#161616] rounded-xl p-5 border border-[#2a2a2a] flex items-center justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white text-sm font-semibold tracking-tight">
                  Refundable Guarantee
                </p>
                <MaterialIcon name="info" className="text-[#f4c025] text-xs" />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Cancel anytime within 48 hours for a full, hassle-free refund to your original payment method.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={refundable}
                onChange={() => setRefundable(!refundable)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f4c025]" />
            </label>
          </div>
        </section>

        {/* Payment Section */}
        <section className="px-4 mt-8 space-y-6">
          <h3 className="text-sm font-medium uppercase tracking-widest text-slate-500 border-b border-[#2a2a2a]/50 pb-2">
            Payment Method
          </h3>

          {/* Apple Pay */}
          <button className="w-full h-14 rounded-xl bg-white text-black flex items-center justify-center gap-2 font-semibold text-lg active:scale-[0.98] transition-transform">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.96.95-2.04 1.72-3.24 2.27-1.32.61-2.73.91-4.22.91-1.3 0-2.52-.24-3.66-.72-1.14-.48-2.12-1.16-2.94-2.04-.82-.88-1.45-1.93-1.89-3.15-.44-1.22-.66-2.58-.66-4.08 0-1.57.26-2.98.78-4.24s1.25-2.32 2.19-3.18c.94-.86 2.05-1.52 3.32-1.98s2.61-.69 4.02-.69c1.45 0 2.76.26 3.93.78s2.14 1.25 2.91 2.19c.14.17.26.35.37.54-.15.09-.29.19-.42.3-.67.57-1.18 1.27-1.53 2.11-.35.84-.53 1.76-.53 2.76 0 1.25.26 2.37.78 3.36s1.26 1.78 2.22 2.37c-.1.35-.23.7-.38 1.05-.15.35-.34.68-.56.99zm-1.87-17.76c0 1.05-.28 2.04-.84 2.97-.56.93-1.34 1.66-2.34 2.19.05-.98.29-1.92.72-2.82.43-.9 1.15-1.63 2.16-2.19.1.58.15 1.14.15 1.72l.15.15z" />
            </svg>
            <span>Pay</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#2a2a2a]" />
            <span className="flex-shrink mx-4 text-xs text-slate-600 uppercase tracking-widest">
              Or credit card
            </span>
            <div className="flex-grow border-t border-[#2a2a2a]" />
          </div>

          {/* Credit Card Form */}
          <div className="space-y-4">
            <div className="group relative">
              <label className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-[10px] text-slate-500 uppercase tracking-widest z-10">
                Cardholder Name
              </label>
              <input
                className="w-full bg-transparent border border-slate-700 focus:border-[#f4c025] focus:ring-0 rounded-lg h-12 text-sm tracking-widest text-white placeholder:text-slate-800 px-3"
                placeholder="FULL NAME"
                type="text"
              />
            </div>
            <div className="group relative">
              <label className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-[10px] text-slate-500 uppercase tracking-widest z-10">
                Card Number
              </label>
              <div className="relative">
                <input
                  className="w-full bg-transparent border border-slate-700 focus:border-[#f4c025] focus:ring-0 rounded-lg h-12 text-sm tracking-widest text-white placeholder:text-slate-800 px-3"
                  placeholder="0000 0000 0000 0000"
                  type="text"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <MaterialIcon name="credit_card" className="text-slate-600" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="group relative">
                <label className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-[10px] text-slate-500 uppercase tracking-widest z-10">
                  Expiry
                </label>
                <input
                  className="w-full bg-transparent border border-slate-700 focus:border-[#f4c025] focus:ring-0 rounded-lg h-12 text-sm tracking-widest text-white placeholder:text-slate-800 px-3"
                  placeholder="MM/YY"
                  type="text"
                />
              </div>
              <div className="group relative">
                <label className="absolute -top-2 left-3 bg-[#0a0a0a] px-1 text-[10px] text-slate-500 uppercase tracking-widest z-10">
                  CVC
                </label>
                <input
                  className="w-full bg-transparent border border-slate-700 focus:border-[#f4c025] focus:ring-0 rounded-lg h-12 text-sm tracking-widest text-white placeholder:text-slate-800 px-3"
                  placeholder="***"
                  type="password"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badge */}
        <div className="mt-12 flex flex-col items-center justify-center space-y-3 px-10 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f4c025]/20 blur-xl rounded-full" />
            <div className="relative border-2 border-[#f4c025]/40 rounded-full p-2">
              <MaterialIcon name="verified" className="text-[#f4c025] text-3xl" />
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest">
              Secure Transaction Guaranteed
            </h4>
            <p className="text-slate-500 text-[10px] mt-1 italic">
              Your data is protected by 256-bit AES encryption and PCI-DSS compliance.
            </p>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-4 border-t border-[#2a2a2a] z-50"
        style={{ background: "rgba(22,22,22,0.7)", backdropFilter: "blur(12px)" }}
      >
        <div className="space-y-3">
          <p className="text-[10px] text-slate-500 text-center">
            By clicking confirm, you agree to our{" "}
            <span className="text-[#f4c025] underline">Terms of Reservation</span>
          </p>
          <Link
            href={vehicle ? `/reservation/commit?vehicleId=${vehicle.id}` : "/reservation/commit"}
            className="w-full h-14 bg-slate-900 border border-[#2a2a2a] text-white rounded-xl font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 group hover:bg-black transition-all"
            style={{ boxShadow: "0 0 15px rgba(244,192,37,0.15)" }}
          >
            Confirm Reservation
            <MaterialIcon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a] text-white"><div className="w-8 h-8 rounded-full border-2 border-[#f4c025] border-t-transparent animate-spin" /></div>}>
      <ReservationContent />
    </Suspense>
  );
}
