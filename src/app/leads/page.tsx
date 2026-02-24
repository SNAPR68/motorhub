"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchLeads, adaptLead } from "@/lib/api";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

/* ── design tokens: ai-powered_lead_crm_1 ── */
// primary: #137fec, font: Inter, bg: #f6f7f8

const FILTERS = ["All", "New", "Follow-up", "Test Drive", "Closed"];

const FILTER_STATUS_MAP: Record<string, string> = {
  "All": "",
  "New": "NEW",
  "Follow-up": "FOLLOW_UP",
  "Test Drive": "TEST_DRIVE",
  "Closed": "CLOSED",
};

const SENTIMENT_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  hot: { bg: "bg-green-100", text: "text-green-600", label: "HOT" },
  warm: { bg: "bg-orange-100", text: "text-orange-600", label: "WARM" },
  cool: { bg: "bg-slate-100", text: "text-slate-500", label: "COOL" },
};

const SOURCE_ICON_MAP: Record<string, string> = {
  Website: "language",
  Facebook: "social_leaderboard",
  Instagram: "photo_camera",
  Whatsapp: "chat",
  Walkin: "storefront",
  Referral: "mail",
  Other: "more_horiz",
};

export default function LeadsPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const statusFilter = FILTER_STATUS_MAP[FILTERS[activeFilter]] || "";
  const { data, isLoading } = useApi(
    () => fetchLeads({ status: statusFilter || undefined, search: searchQuery || undefined, limit: 50 }),
    [statusFilter, searchQuery]
  );
  const leads = (data?.leads ?? []).map(adaptLead);

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 px-4 pt-6"
        style={{ background: "#f6f7f8" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Lead CRM
          </h1>
          <div className="flex gap-2 items-center">
            <button className="p-2 rounded-full hover:bg-slate-200 transition-colors relative">
              <MaterialIcon name="notifications" className="text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "#137fec" }}
            >
              R
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl"
          />
          <input
            type="text"
            placeholder="Search leads or vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border-none rounded-xl text-sm shadow-sm outline-none"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === activeFilter
                  ? "text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
              style={i === activeFilter ? { background: "#137fec" } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* ── Lead Cards ── */}
      <main className="flex-1 overflow-y-auto px-4 py-2 space-y-4 pb-24">
        {isLoading && leads.length === 0 && (
          <SkeletonList count={4} variant="light" />
        )}

        {!isLoading && leads.length === 0 && (
          <EmptyState
            icon="group"
            title="No leads found"
            description="New leads will appear here when they come in"
            variant="light"
          />
        )}

        {leads.map((lead) => {
          const styles = SENTIMENT_STYLES[lead.sentimentLabel] || SENTIMENT_STYLES.cool;
          const sourceIcon = SOURCE_ICON_MAP[lead.source] || "language";

          return (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-4">
                {/* Name + Source + Sentiment */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">
                      {lead.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MaterialIcon
                        name={sourceIcon}
                        className={`!text-[14px] ${
                          sourceIcon === "social_leaderboard"
                            ? "text-[#137fec]"
                            : "text-slate-400"
                        }`}
                      />
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                        {lead.source} Lead
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${styles.bg} ${styles.text} px-2 py-1 rounded-lg text-xs font-bold flex flex-col items-center`}
                  >
                    <span className="text-[10px] uppercase opacity-70">Sentiment</span>
                    <span>
                      {lead.sentiment}% {styles.label}
                    </span>
                  </div>
                </div>

                {/* Car Interest */}
                <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg mb-4">
                  {lead.carImage ? (
                    <Image
                      src={lead.carImage}
                      alt=""
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-md object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-slate-200 flex items-center justify-center">
                      <MaterialIcon name="directions_car" className="text-slate-400" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase leading-none mb-1">
                      Interested In
                    </p>
                    <p className="text-sm font-bold text-slate-700">{lead.car}</p>
                  </div>
                </div>

                {/* Time */}
                <p className="text-xs text-slate-400 mb-3">{lead.time}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold">
                    <MaterialIcon name="call" className="text-lg" /> Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold">
                    <MaterialIcon name="chat_bubble" className="text-lg" /> Text
                  </button>
                </div>
                <button
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-bold"
                  style={{
                    background: "#137fec",
                    boxShadow: "0 4px 12px rgba(19,127,236,0.2)",
                  }}
                >
                  <MaterialIcon name="smart_toy" className="text-lg" /> AI Draft Reply
                </button>
              </div>
            </Link>
          );
        })}
      </main>

      {/* ── FAB ── */}
      <button
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center z-30 active:scale-95 transition-transform"
        style={{ background: "#137fec" }}
      >
        <MaterialIcon name="add" className="text-3xl" />
      </button>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 border-t border-slate-200 px-6 py-3 pb-8"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {[
            { icon: "group", label: "Leads", href: "/leads", active: true },
            { icon: "directions_car", label: "Inventory", href: "/inventory", active: false },
            { icon: "analytics", label: "Analytics", href: "/analytics", active: false },
            { icon: "settings", label: "Settings", href: "/settings", active: false },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-[#137fec]" : "text-slate-400"
              }`}
            >
              <MaterialIcon
                name={item.icon}
                fill={item.active}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
