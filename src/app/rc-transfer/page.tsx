"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { createServiceBooking } from "@/lib/api";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹2,999",
    duration: "7–15 days",
    scope: "Intra-State",
    features: [
      "RTO documentation handling",
      "Escrow payment protection",
      "Basic seller indemnity",
      "Email & chat support",
    ],
  },
  {
    id: "express",
    name: "Express",
    price: "₹5,999",
    duration: "5–7 days",
    scope: "Intra-State",
    popular: true,
    features: [
      "Priority RTO processing",
      "Escrow payment protection",
      "Full seller indemnity (₹999)",
      "Dedicated transfer agent",
      "Phone & WhatsApp support",
    ],
  },
  {
    id: "interstate",
    name: "Interstate",
    price: "₹8,999",
    duration: "15–30 days",
    scope: "Cross-State",
    features: [
      "NOC from origin state",
      "Re-registration in new state",
      "Escrow payment protection",
      "Full seller indemnity (₹999)",
      "Dedicated transfer agent",
      "Priority phone support",
    ],
  },
];

const steps = [
  {
    icon: "upload_file",
    title: "Submit Documents",
    desc: "Upload RC, insurance, PAN, and address proof for both buyer and seller.",
  },
  {
    icon: "verified_user",
    title: "Verification",
    desc: "Autovinci verifies both parties within 24 hours — no surprises.",
  },
  {
    icon: "account_balance",
    title: "Escrow Payment",
    desc: "Buyer pays to escrow — released to seller only after RC transfer is complete.",
  },
  {
    icon: "description",
    title: "RC Transfer",
    desc: "We handle the entire RTO process. Seller gets ₹999 indemnity insurance free.",
  },
];

const faqs = [
  {
    q: "What documents are needed?",
    a: "Buyer needs: ID proof (Aadhaar/PAN), address proof, passport photos. Seller needs: Original RC, insurance copy, PAN card, Form 29 & 30. We guide you through every step.",
  },
  {
    q: "How long does the transfer take?",
    a: "Intra-state transfers take 7–15 days (5–7 days with Express). Interstate transfers take 15–30 days due to NOC processing. We keep you updated at every step via SMS and app notifications.",
  },
  {
    q: "What if the transfer is rejected by RTO?",
    a: "If rejected due to any reason on our end, you get a 100% refund. If rejected due to document issues, we help you fix them and resubmit at no extra charge.",
  },
  {
    q: "Is my money safe in escrow?",
    a: "Absolutely. Funds are held in an RBI-regulated escrow account. The seller receives payment only after the RC is successfully transferred to the buyer. Both parties are fully protected.",
  },
];

const badges = [
  { icon: "shield", label: "Escrow Protected" },
  { icon: "security", label: "Seller Indemnity" },
  { icon: "local_shipping", label: "RTO Tracked" },
  { icon: "replay", label: "100% Refundable" },
];

export default function RCTransferPage() {
  const [selectedPlan, setSelectedPlan] = useState("express");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    setBooking(true);
    try {
      const plan = plans.find((p) => p.id === selectedPlan);
      await createServiceBooking({
        type: "RC_TRANSFER",
        plan: selectedPlan,
        amount: plan?.price.replace(/[^\d]/g, ""),
        details: { planName: plan?.name, duration: plan?.duration, scope: plan?.scope },
      });
      setBooked(true);
    } catch { /* ignore */ }
    setBooking(false);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <h1 className="text-lg font-semibold">InstantRC™</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-3">
              <MaterialIcon name="bolt" className="text-sm" />
              Premium Service
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2">
              Hassle-Free RC Transfer in 7 Days
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              India&apos;s first escrow-based transfer with seller indemnity
            </p>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "2,400+", label: "Transfers" },
            { value: "7-Day", label: "Average" },
            { value: "₹999", label: "Insurance Incl." },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-lg font-bold text-[#8b5cf6]">{s.value}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-5">How It Works</h3>
        <div className="relative">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-4 relative pb-6">
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-10 w-px h-[calc(100%-10px)] bg-gradient-to-b from-[#8b5cf6]/40 to-transparent" />
              )}
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 flex items-center justify-center">
                <MaterialIcon name={step.icon} className="text-lg text-[#8b5cf6]" />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#8b5cf6] bg-[#8b5cf6]/10 rounded px-1.5 py-0.5">
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

      {/* Pricing */}
      <section className="px-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
        <div className="space-y-3">
          {plans.map((plan) => {
            const selected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  selected
                    ? "border-[#8b5cf6] bg-[#8b5cf6]/10"
                    : "border-white/5 bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      {plan.popular && (
                        <span className="text-[10px] font-bold bg-[#8b5cf6] text-white rounded-full px-2 py-0.5">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">
                      {plan.scope} · {plan.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{plan.price}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <MaterialIcon
                        name="check_circle"
                        className={`text-sm mt-0.5 flex-shrink-0 ${
                          selected ? "text-[#8b5cf6]" : "text-white/20"
                        }`}
                      />
                      <span className="text-xs text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
                {/* Radio indicator */}
                <div className="flex justify-end mt-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      selected ? "border-[#8b5cf6]" : "border-white/20"
                    }`}
                  >
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />}
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
            <p className="text-xs text-slate-400 mt-1">Our team will reach out within 2 hours to collect documents.</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full py-3.5 rounded-xl bg-[#8b5cf6] text-white font-semibold text-sm hover:bg-[#7c3aed] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {booking ? (
                <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <MaterialIcon name="rocket_launch" className="text-lg" />
              )}
              {booking ? "Processing..." : `Start Transfer — ${plans.find((p) => p.id === selectedPlan)?.price}`}
            </button>
            <p className="text-center text-[11px] text-white/30 mt-2">
              No charge until documents are verified
            </p>
          </>
        )}
      </section>

      {/* FAQ */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
              >
                <span className="text-sm font-medium pr-4">{faq.q}</span>
                <MaterialIcon
                  name={openFaq === i ? "expand_less" : "expand_more"}
                  className="text-xl text-white/40 flex-shrink-0"
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pt-8 pb-6">
        <div className="grid grid-cols-2 gap-2">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2.5 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-3"
            >
              <MaterialIcon name={b.icon} className="text-lg text-[#8b5cf6]" />
              <span className="text-xs font-medium text-white/70">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
