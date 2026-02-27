"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const stats = [
  { value: "12,400+", label: "Cars Sold" },
  { value: "2,400+", label: "Dealers" },
  { value: "50+", label: "Cities" },
  { value: "4.8/5", label: "Rating" },
];

const team = [
  { name: "Arjun Mehta", role: "CEO & Co-Founder", icon: "person" },
  { name: "Priya Sharma", role: "CTO & Co-Founder", icon: "code" },
  { name: "Vikram Patel", role: "COO", icon: "trending_up" },
];

const values = [
  { icon: "visibility", title: "Transparency", desc: "Every car comes with a full history and AI-verified inspection report." },
  { icon: "smart_toy", title: "Technology", desc: "AI-powered pricing, matching, and negotiation tools for smarter decisions." },
  { icon: "verified_user", title: "Trust", desc: "Verified dealers, secure transactions, and buyer protection on every purchase." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0]">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <header className="flex items-center gap-3 py-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>
          <h1 className="text-lg font-semibold">About Autovinci</h1>
        </header>

        {/* Hero */}
        <div className="mt-6 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1152d4]/10 flex items-center justify-center mb-4">
            <MaterialIcon name="auto_awesome" className="text-3xl text-[#1152d4]" />
          </div>
          <h2 className="text-2xl font-bold leading-tight">
            India&apos;s AI-Powered<br />Used Car Marketplace
          </h2>
          <p className="text-slate-400 mt-3 leading-relaxed">
            Reimagining how India buys and sells pre-owned cars with artificial intelligence and trust.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Our Story</h3>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-sm text-slate-300 leading-relaxed">
              Founded in 2024, Autovinci was born from a simple frustration: buying a used car in India shouldn&apos;t feel like a gamble. We set out to build a marketplace where AI does the heavy lifting -- verifying cars, predicting fair prices, and matching buyers with the right vehicle -- so you can buy with confidence.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-[#1152d4]">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Leadership Team</h3>
          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.name} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-full bg-[#1152d4]/10 flex items-center justify-center flex-shrink-0">
                  <MaterialIcon name={member.icon} className="text-xl text-[#1152d4]" />
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-slate-400">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Our Values</h3>
          <div className="space-y-3">
            {values.map((v) => (
              <div key={v.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                    <MaterialIcon name={v.icon} className="text-lg text-[#10b981]" />
                  </div>
                  <h4 className="font-medium">{v.title}</h4>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
