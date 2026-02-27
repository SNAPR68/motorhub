"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

type Tab = "overview" | "inventory" | "reviews" | "offers";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "inventory", label: "Inventory" },
  { id: "reviews", label: "Reviews" },
  { id: "offers", label: "Offers" },
];

const INVENTORY_CARS = [
  {
    name: "Maruti Brezza 2024",
    price: "₹14.5L",
    fuel: "Petrol",
    km: "12,000 km",
  },
  {
    name: "Maruti Swift 2024",
    price: "₹8.1L",
    fuel: "Petrol",
    km: "8,500 km",
  },
  {
    name: "Maruti Baleno 2024",
    price: "₹9.2L",
    fuel: "Petrol",
    km: "15,200 km",
  },
];

const REVIEWS = [
  {
    name: "Rahul Sharma",
    stars: 5,
    date: "Jan 2026",
    text: "Excellent service, the sales team was very helpful and transparent about pricing. Got a great deal on my Brezza.",
  },
  {
    name: "Priya Nair",
    stars: 4,
    date: "Dec 2025",
    text: "Good showroom with a wide selection. Test drive was arranged quickly. Documentation process was smooth.",
  },
  {
    name: "Ankit Verma",
    stars: 4,
    date: "Nov 2025",
    text: "Friendly staff and good after-sales support. Finance team helped me get a better loan rate than I expected.",
  },
];

const OFFERS = [
  {
    title: "Cash Discount on Brezza",
    value: "₹25,000",
    desc: "Limited period offer on 2024 Brezza variants. Applicable on ex-showroom price.",
    expiry: "Valid till Mar 31, 2026",
    icon: "local_offer",
  },
  {
    title: "Free Insurance on Swift",
    value: "1 Year Free",
    desc: "Complimentary comprehensive insurance on all Swift bookings this month.",
    expiry: "Valid till Feb 28, 2026",
    icon: "verified_user",
  },
];

const AMENITIES = [
  { icon: "directions_car", label: "Test Drive" },
  { icon: "account_balance", label: "Finance Help" },
  { icon: "security", label: "Insurance" },
];

const CERTIFICATIONS = [
  { icon: "verified", label: "Authorized Dealer" },
  { icon: "workspace_premium", label: "ISO Certified" },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialIcon
          key={i}
          name="star"
          fill={i <= stars}
          className="text-[14px]"
          style={{ color: i <= stars ? "#f59e0b" : "#374151" }}
        />
      ))}
    </div>
  );
}

export default function DealerProfilePage({
  params,
}: {
  params: Promise<{ dealerId: string }>;
}) {
  const { dealerId } = use(params);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Derive a display name from the ID
  const displayName = dealerId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Fake open/closed based on current hour
  const hour = new Date().getHours();
  const isOpen = hour >= 9 && hour < 20;

  return (
    <div
      className="min-h-dvh pb-40"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/dealers"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Dealer Profile</h1>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Hero section */}
        <div
          className="px-4 py-5 border-b border-white/10"
          style={{ background: "#0d1117" }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ background: "#1152d4" }}
            >
              {displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-lg leading-tight">{displayName}</h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 mt-1"
                style={{ background: "#1152d420", color: "#4d80f0" }}>
                <MaterialIcon name="verified" fill className="text-[12px]" />
                Maruti Authorized
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5">
              <MaterialIcon name="star" fill className="text-[16px] text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">4.5</span>
              <span className="text-slate-500 text-xs">342 reviews</span>
            </div>
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: isOpen ? "#052e16" : "#1c0505",
                color: isOpen ? "#4ade80" : "#f87171",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: isOpen ? "#4ade80" : "#f87171" }} />
              {isOpen ? "Open" : "Closed"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <MaterialIcon name="location_on" className="text-[14px]" />
            <span>Indiranagar, Bengaluru — 3.2 km away</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <MaterialIcon name="schedule" className="text-[14px]" />
            <span>8AM – 8PM · Mon–Sun</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 px-4 py-4 border-b border-white/10">
          <a
            href="tel:+918001234567"
            className="flex flex-col items-center gap-2 rounded-2xl p-3 border border-white/10"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <MaterialIcon name="call" className="text-[20px] text-emerald-400" />
            </div>
            <span className="text-white text-xs font-semibold">Call Now</span>
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(displayName + " Bengaluru")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl p-3 border border-white/10"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MaterialIcon name="directions" className="text-[20px] text-blue-400" />
            </div>
            <span className="text-white text-xs font-semibold">Directions</span>
          </a>
          <a
            href="https://wa.me/918001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl p-3 border border-white/10"
            style={{ background: "#111827" }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <MaterialIcon name="chat" fill className="text-[20px] text-green-400" />
            </div>
            <span className="text-white text-xs font-semibold">WhatsApp</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-3 border-b border-white/10 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all"
              style={{
                background: activeTab === tab.id ? "#1152d4" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#64748b",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-4 py-5 space-y-5">
          {/* Overview */}
          {activeTab === "overview" && (
            <>
              <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
                <p className="text-white font-semibold text-sm">About</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {displayName} is one of Bengaluru&apos;s premier Maruti Suzuki authorized
                  dealerships with over 15 years of service. We offer a wide range of new and
                  certified pre-owned vehicles, with best-in-class after-sales support and
                  transparent pricing.
                </p>
              </div>

              <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
                <p className="text-white font-semibold text-sm">Certifications</p>
                <div className="flex gap-3 flex-wrap">
                  {CERTIFICATIONS.map((c) => (
                    <div
                      key={c.label}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-white/10"
                      style={{ background: "#1a2235" }}
                    >
                      <MaterialIcon name={c.icon} fill className="text-[14px] text-blue-400" />
                      <span className="text-slate-300 text-xs font-medium">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-5 space-y-3" style={{ background: "#111827" }}>
                <p className="text-white font-semibold text-sm">Amenities</p>
                <div className="flex gap-3 flex-wrap">
                  {AMENITIES.map((a) => (
                    <div
                      key={a.label}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-white/10"
                      style={{ background: "#1a2235" }}
                    >
                      <MaterialIcon name={a.icon} className="text-[14px] text-slate-400" />
                      <span className="text-slate-300 text-xs font-medium">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div
                className="relative rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"
                style={{ height: 160, background: "#111827" }}
              >
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, #1152d430 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1152d430 0px, transparent 1px, transparent 40px)",
                  }}
                />
                <div className="flex flex-col items-center gap-2 z-10">
                  <MaterialIcon name="location_on" fill className="text-[40px] text-blue-500" />
                  <p className="text-slate-500 text-xs">Indiranagar, Bengaluru</p>
                </div>
              </div>
            </>
          )}

          {/* Inventory */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              {INVENTORY_CARS.map((car) => (
                <div
                  key={car.name}
                  className="rounded-2xl p-4 border border-white/10 flex items-center justify-between"
                  style={{ background: "#111827" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "#1152d420" }}
                    >
                      <MaterialIcon name="directions_car" fill className="text-[24px] text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{car.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {car.fuel} · {car.km}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <p className="text-white font-bold text-sm">{car.price}</p>
                    <button
                      className="mt-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                      style={{ background: "#1152d4" }}
                    >
                      Test Drive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {REVIEWS.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl p-4 border border-white/10"
                  style={{ background: "#111827" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "#1152d4" }}
                      >
                        {r.name[0]}
                      </div>
                      <p className="text-white font-semibold text-sm">{r.name}</p>
                    </div>
                    <span className="text-slate-500 text-xs">{r.date}</span>
                  </div>
                  <StarRating stars={r.stars} />
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Offers */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              {OFFERS.map((offer) => (
                <div
                  key={offer.title}
                  className="rounded-2xl p-5 border border-blue-500/20"
                  style={{ background: "#0d1f47" }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#1152d430" }}
                    >
                      <MaterialIcon name={offer.icon} fill className="text-[20px] text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-base">{offer.value}</p>
                      <p className="text-blue-300 font-semibold text-sm">{offer.title}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{offer.desc}</p>
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-amber-500/10 inline-flex w-fit">
                    <MaterialIcon name="schedule" className="text-[13px] text-amber-400" />
                    <span className="text-amber-400 text-xs font-semibold">{offer.expiry}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Book Test Drive */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-4 pb-24 pt-3 md:hidden"
        style={{ background: "linear-gradient(to top, #080a0f 60%, transparent)" }}
      >
        <button
          className="w-full rounded-2xl py-4 text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-2xl"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="directions_car" fill className="text-[20px]" />
          Book Test Drive
        </button>
      </div>

      <BuyerBottomNav className="md:hidden" />
    </div>
  );
}
