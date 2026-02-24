"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";

/* Stitch: vip_membership_invitation — #1754cf, Newsreader, #111621 */

const VALUE_PROPS = [
  { icon: "priority_high", text: "Early access to rare inventory" },
  { icon: "support_agent", text: "Bespoke concierge services" },
  { icon: "visibility_off", text: "Private off-market viewings" },
];

export default function VIPMembershipPage() {
  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden max-w-md mx-auto"
      style={{ fontFamily: "'Newsreader', serif" }}
    >
      {/* Background Cinematic Image */}
      <div
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${INTERIOR}')` }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,22,33,0.4) 0%, rgba(17,22,33,0.8) 60%, rgba(17,22,33,1) 100%)",
          }}
        />
      </div>

      {/* Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <span
            className="text-[#1754cf] font-bold text-xl tracking-tighter uppercase"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            Autovinci
          </span>
        </div>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
        >
          <MaterialIcon name="close" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-end px-8 pb-16">
        <div className="max-w-md mx-auto w-full">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center rounded-full bg-[#1754cf]/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#1754cf] ring-1 ring-inset ring-[#1754cf]/30">
            Exclusive Invitation
          </div>

          {/* Main Title */}
          <h1 className="text-5xl font-medium leading-[1.1] text-white mb-6 italic">
            Apply for VIP Membership
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-lg leading-relaxed mb-10 font-light">
            Experience the pinnacle of automotive acquisition. Early access,
            bespoke concierge, and private viewings for the discerning collector.
          </p>

          {/* Value Props List */}
          <div className="space-y-4 mb-12">
            {VALUE_PROPS.map((prop) => (
              <div key={prop.icon} className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1754cf]/50 text-[#1754cf]">
                  <MaterialIcon name={prop.icon} className="text-[16px]" />
                </div>
                <p className="text-sm font-medium tracking-wide text-slate-200">
                  {prop.text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/vip/confirmation"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-[#1754cf] px-8 py-5 text-lg font-bold text-white shadow-2xl transition-all active:scale-[0.98]"
          >
            <span className="relative z-10">Begin Application</span>
            <MaterialIcon
              name="arrow_forward"
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <Link
              href="/vip/rewards"
              className="text-slate-500 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
            >
              Learn more about tiers
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-[#1754cf]/50 to-transparent opacity-30 z-10" />
    </div>
  );
}
