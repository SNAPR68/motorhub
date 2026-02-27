"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const stats = [
  { value: "150+", label: "Team Members" },
  { value: "4", label: "Offices" },
  { value: "12", label: "Open Roles" },
];

const positions = [
  { title: "Senior Frontend Engineer", location: "Gurgaon", type: "Full-time", team: "Engineering" },
  { title: "Product Designer", location: "Bangalore", type: "Full-time", team: "Design" },
  { title: "Growth Marketing Manager", location: "Mumbai", type: "Full-time", team: "Marketing" },
  { title: "Data Scientist", location: "Remote", type: "Full-time", team: "AI/ML" },
];

const benefits = [
  { icon: "health_and_safety", title: "Health Insurance", desc: "Comprehensive coverage for you and family" },
  { icon: "schedule", title: "Flexible Hours", desc: "Work when you're most productive" },
  { icon: "school", title: "Learning Budget", desc: "Annual allowance for courses and conferences" },
  { icon: "trending_up", title: "Stock Options", desc: "Ownership in the company you build" },
  { icon: "groups", title: "Team Outings", desc: "Quarterly offsites and team bonding" },
  { icon: "home", title: "Remote-First", desc: "Work from anywhere in India" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0]">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <header className="flex items-center gap-3 py-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>
          <h1 className="text-lg font-semibold">Careers</h1>
        </header>

        {/* Hero */}
        <div className="mt-6 mb-8">
          <h2 className="text-2xl font-bold leading-tight">Join Autovinci</h2>
          <p className="text-slate-400 mt-2 leading-relaxed">
            Build the future of car buying in India. We&apos;re looking for passionate people who want to solve real problems with technology.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl font-bold text-[#1152d4]">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{pos.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <MaterialIcon name="location_on" className="text-sm" />
                        {pos.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <MaterialIcon name="work" className="text-sm" />
                        {pos.type}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <MaterialIcon name="group" className="text-sm" />
                        {pos.team}
                      </span>
                    </div>
                  </div>
                  <button className="flex-shrink-0 bg-[#1152d4] hover:bg-[#1152d4]/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Why Autovinci?</h3>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-9 h-9 rounded-lg bg-[#10b981]/10 flex items-center justify-center mb-3">
                  <MaterialIcon name={b.icon} className="text-lg text-[#10b981]" />
                </div>
                <h4 className="text-sm font-medium mb-1">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Culture Quote */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#1152d4]/10 to-[#10b981]/10 border border-white/10 rounded-2xl p-5">
            <MaterialIcon name="format_quote" className="text-3xl text-[#1152d4] mb-2" />
            <p className="text-sm text-slate-300 leading-relaxed italic">
              &quot;At Autovinci, we believe the best products come from diverse teams who care deeply about the problem they&apos;re solving. Every voice matters, every idea gets heard.&quot;
            </p>
            <div className="mt-3 text-xs text-slate-400">-- Arjun Mehta, CEO</div>
          </div>
        </section>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
