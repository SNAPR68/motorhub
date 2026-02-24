"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

const SECTIONS = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, including your name, email address, phone number, and vehicle preferences when you create an account. For dealers, we additionally collect business details such as dealership name, GSTIN, address, and team member information. We also collect usage data such as pages visited, search queries, and interaction patterns to improve our services.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to provide and improve our services, facilitate vehicle transactions between buyers and dealers, send notifications about leads and appointments, personalise your experience with AI-powered recommendations, and communicate service updates. We do not sell your personal data to third parties.",
  },
  {
    title: "Data Storage & Security",
    content:
      "Your data is stored securely on servers located in India (Mumbai region) using industry-standard encryption. We use Supabase for authentication and database management with row-level security policies. All API communications are encrypted via HTTPS. We retain your data for as long as your account is active or as required by Indian law.",
  },
  {
    title: "Data Sharing",
    content:
      "We share vehicle listing information between buyers and dealers to facilitate transactions. We may share anonymised, aggregated data for analytics purposes. We use third-party services for error tracking (Sentry) and analytics (PostHog) that process limited data. We will share information when required by law or to protect our legal rights.",
  },
  {
    title: "Your Rights",
    content:
      "Under the Digital Personal Data Protection Act, 2023 (DPDP Act), you have the right to access your personal data, request correction of inaccurate data, request deletion of your data, withdraw consent for data processing, and file complaints with the Data Protection Board of India. To exercise these rights, contact us at privacy@autovinci.in.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "We use essential cookies for authentication and session management. We use analytics cookies to understand how you use our platform. You can manage cookie preferences through your browser settings. We do not use third-party advertising cookies.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notification. Continued use of our services after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div
      className="min-h-dvh"
      style={{ background: "#0a0c10", fontFamily: "'Noto Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 px-6 py-4" style={{ background: "rgba(10,12,16,0.85)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            <MaterialIcon name="arrow_back" />
          </Link>
          <h1 className="text-lg font-bold text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 pb-20">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#137fec] mb-2">
            Legal
          </p>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
            Privacy Policy
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Last updated: February 2026. This policy describes how Autovinci collects, uses,
            and protects your personal information in compliance with Indian data protection laws.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <section
              key={i}
              className="p-5 rounded-xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <h3 className="text-base font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
                {section.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-xl border border-[#137fec]/20 bg-[#137fec]/5">
          <h3 className="text-sm font-bold text-white mb-2">Contact Us</h3>
          <p className="text-sm text-slate-400">
            For privacy-related inquiries, reach us at{" "}
            <span className="text-[#137fec]">privacy@autovinci.in</span>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          <Link href="/terms" className="text-[#137fec] hover:underline">Terms of Service</Link>
          {" "}&bull;{" "}
          <Link href="/" className="text-slate-500 hover:text-slate-300">Home</Link>
        </p>
      </main>
    </div>
  );
}
