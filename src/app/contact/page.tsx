"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const contactCards = [
  { icon: "mail", label: "Email", value: "hello@autovinci.com" },
  { icon: "phone", label: "Phone", value: "1800-309-AUTO (toll-free)" },
  { icon: "location_on", label: "Address", value: "Sector 44, Gurgaon, Haryana 122003" },
];

const socials = [
  { icon: "photo_camera", label: "Instagram" },
  { icon: "tag", label: "Twitter" },
  { icon: "work", label: "LinkedIn" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0]">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <header className="flex items-center gap-3 py-4">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>
          <h1 className="text-lg font-semibold">Contact Us</h1>
        </header>

        {/* Contact Cards */}
        <div className="mt-4 space-y-3 mb-8">
          {contactCards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-[#1152d4]/10 flex items-center justify-center flex-shrink-0">
                <MaterialIcon name={card.icon} className="text-xl text-[#1152d4]" />
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{card.label}</div>
                <div className="text-sm font-medium mt-0.5">{card.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#1152d4] transition appearance-none"
              >
                <option value="" className="bg-[#080a0f]">Select a subject</option>
                <option value="general" className="bg-[#080a0f]">General Inquiry</option>
                <option value="support" className="bg-[#080a0f]">Support</option>
                <option value="partnership" className="bg-[#080a0f]">Partnership</option>
                <option value="press" className="bg-[#080a0f]">Press</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1152d4] hover:bg-[#1152d4]/90 text-white font-semibold py-3.5 rounded-xl transition"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Office Hours */}
        <section className="mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <MaterialIcon name="schedule" className="text-xl text-[#f59e0b]" />
              <h4 className="font-medium">Office Hours</h4>
            </div>
            <p className="text-sm text-slate-400">Monday - Saturday, 9:00 AM - 7:00 PM IST</p>
          </div>
        </section>

        {/* Social Links */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-3">
            {socials.map((s) => (
              <button
                key={s.label}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition"
              >
                <MaterialIcon name={s.icon} className="text-lg text-slate-400" />
                <span className="text-xs text-slate-400">{s.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
