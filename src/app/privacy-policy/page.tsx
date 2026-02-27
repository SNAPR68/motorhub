"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, such as your name, email, phone number, and vehicle preferences. We also collect usage data including browsing patterns, search queries, and device information to improve our services.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your data helps us match you with the right vehicles, provide personalized recommendations, process transactions, and communicate important updates. We also use aggregated data to improve our AI models and platform experience.",
  },
  {
    title: "Data Sharing",
    content:
      "We share your information only with verified dealers you choose to contact, payment processors for transactions, and service providers who help us operate the platform. We never sell your personal data to third parties.",
  },
  {
    title: "Data Security",
    content:
      "We use industry-standard encryption (AES-256) to protect your data at rest and in transit. Access to personal information is restricted to authorized personnel only, and we conduct regular security audits.",
  },
  {
    title: "Your Rights",
    content:
      "You can access, update, or delete your personal data at any time from your account settings. You may also request a copy of all data we hold about you, or opt out of marketing communications.",
  },
  {
    title: "Contact Us",
    content:
      "For privacy-related questions or concerns, reach out to our Data Protection Officer at privacy@autovinci.com or write to us at Autovinci Technologies Pvt. Ltd., Sector 44, Gurgaon, Haryana 122003.",
  },
];

export default function PrivacyPolicyPage() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0]">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <header className="flex items-center gap-3 py-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>
          <h1 className="text-lg font-semibold">Privacy Policy</h1>
        </header>

        {/* Meta */}
        <div className="mt-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MaterialIcon name="update" className="text-lg" />
            <span>Last updated: February 2026</span>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            At Autovinci, your privacy matters. This policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, i) => (
            <div key={section.title} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1152d4]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#1152d4]">{i + 1}</span>
                  </div>
                  <h3 className="text-sm font-medium">{section.title}</h3>
                </div>
                <MaterialIcon
                  name={expanded === i ? "expand_less" : "expand_more"}
                  className="text-xl text-slate-400"
                />
              </button>
              {expanded === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-slate-400 leading-relaxed pl-11">
                    {section.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            By using Autovinci, you agree to this Privacy Policy.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Questions?{" "}
            <Link href="/contact" className="text-[#1152d4] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
