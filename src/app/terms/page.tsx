"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using the Autovinci platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. These terms constitute a legally binding agreement between you and Autovinci Technologies Private Limited.",
  },
  {
    title: "Description of Services",
    content:
      "Autovinci provides an AI-powered platform connecting used car buyers and dealers in India. Our services include vehicle listing management, AI-driven lead CRM, appointment scheduling, digital showroom experiences, and dealer analytics tools. We act as a technology facilitator and are not a party to any vehicle transaction.",
  },
  {
    title: "User Accounts",
    content:
      "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials and all activities under your account. Notify us immediately if you suspect unauthorised access. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    title: "Dealer Terms",
    content:
      "Dealers are responsible for the accuracy of all vehicle listings, including pricing, specifications, and images. Dealers must hold valid business licences and comply with applicable Indian motor vehicle regulations. Subscription fees are non-refundable except as required by law. Dealers must respond to buyer enquiries within reasonable timeframes.",
  },
  {
    title: "Buyer Terms",
    content:
      "Vehicle information on the platform is provided by dealers and may vary from the actual vehicle. Buyers should independently verify vehicle condition, history, and documentation before purchase. Autovinci does not guarantee the accuracy of listings or the quality of vehicles. All transactions are directly between buyers and dealers.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content, designs, logos, AI models, and software on the Autovinci platform are our intellectual property or licensed to us. You may not copy, modify, distribute, or create derivative works without written permission. User-submitted content (vehicle images, descriptions) grants us a non-exclusive licence to display and promote the listings.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Autovinci is provided on an \"as is\" basis. We disclaim all warranties to the maximum extent permitted by law. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you have paid us in the preceding 12 months.",
  },
  {
    title: "Governing Law & Disputes",
    content:
      "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka. We encourage resolution through mutual discussion before pursuing legal remedies.",
  },
];

export default function TermsPage() {
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
            Terms of Service
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 pb-20">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#137fec] mb-2">
            Legal
          </p>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
            Terms of Service
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Last updated: February 2026. Please read these terms carefully before using the
            Autovinci platform.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <section
              key={i}
              className="p-5 rounded-xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold text-[#137fec]/60">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
                  {section.title}
                </h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pl-8">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-600">
          <Link href="/privacy" className="text-[#137fec] hover:underline">Privacy Policy</Link>
          {" "}&bull;{" "}
          <Link href="/" className="text-slate-500 hover:text-slate-300">Home</Link>
        </p>
      </main>
    </div>
  );
}
