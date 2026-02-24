"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useApi } from "@/lib/hooks/use-api";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { fetchDealerTeam } from "@/lib/api";
import type { DbTeamMember } from "@/lib/api";
import { SkeletonList } from "@/components/ui/Skeleton";

/* ── design tokens: dealer_team_management ── */
// primary: #1754cf, font: Noto Serif (headings) + Noto Sans (body), bg: #111621, card: #1E1E1E, border: silver/20

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  ADMIN: { bg: "rgba(245,158,11,0.1)", color: "rgba(245,158,11,0.9)" },
  MANAGER: { bg: "rgba(23,84,207,0.1)", color: "rgba(23,84,207,0.9)" },
  STANDARD: { bg: "rgba(23,84,207,0.1)", color: "rgba(23,84,207,0.9)" },
  INVITED: { bg: "transparent", color: "#475569" },
};

export default function TeamPage() {
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Sales Executive");

  const { data, isLoading, refetch } = useApi(() => fetchDealerTeam(), []);
  const team: DbTeamMember[] = data?.team ?? [];

  const inviteMember = useApiMutation({
    mutationFn: async (input: { name: string; email: string; role: string }) => {
      const res = await fetch("/api/dealer/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    successMessage: "Team member invited",
    errorMessage: "Failed to invite member",
    onSuccess: () => {
      setInviteName("");
      setInviteEmail("");
      setInviteRole("Sales Executive");
      setInviteOpen(false);
      refetch();
    },
  });

  const removeMember = useApiMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/dealer/team?id=${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    successMessage: "Team member removed",
    errorMessage: "Failed to remove member",
    onSuccess: () => refetch(),
  });

  const handleInvite = () => {
    if (!inviteName.trim() || !inviteEmail.trim() || inviteMember.isSubmitting) return;
    inviteMember.mutate({ name: inviteName.trim(), email: inviteEmail.trim(), role: inviteRole });
  };

  const handleRemove = (memberId: string) => {
    removeMember.mutate(memberId);
  };

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Noto Sans', sans-serif", background: "#111621", color: "#f1f5f9" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(17,22,33,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(23,84,207,0.1)",
        }}
      >
        <Link href="/settings" className="flex items-center justify-center p-2 rounded-full">
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          Team Management
        </h1>
        <button className="flex items-center justify-center p-2 rounded-full">
          <MaterialIcon name="search" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Summary Card */}
        <div
          className="mt-6 mb-8 p-6 rounded-xl relative overflow-hidden"
          style={{
            background: "#1E1E1E",
            border: "1px solid rgba(192,192,192,0.2)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="absolute -right-8 -top-8 w-32 h-32 rounded-full"
            style={{ background: "rgba(23,84,207,0.1)", filter: "blur(24px)" }}
          />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex flex-col">
              <span
                className="text-xs uppercase font-semibold mb-1"
                style={{ letterSpacing: "0.2em", color: "#1754cf" }}
              >
                Dealership Overview
              </span>
              <h2
                className="text-3xl font-bold text-slate-100"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Total Members: {team.length}
              </h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[240px]">
              Manage your dealership workforce and granular access control.
            </p>
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center justify-center gap-2 bg-transparent font-medium py-3 px-6 rounded-lg transition-all active:scale-95"
              style={{ border: "1px solid rgba(192,192,192,0.4)", color: "white" }}
            >
              <MaterialIcon name="person_add" className="text-xl text-[#1754cf]" />
              <span className="text-sm tracking-wide">+ Invite Member</span>
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-bold text-slate-100"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Active Staff
          </h3>
          <span className="text-xs text-slate-500">Role Hierarchy: High</span>
        </div>

        {isLoading && team.length === 0 && (
          <SkeletonList count={3} variant="dark" />
        )}

        {/* Team Members List */}
        <div className="space-y-4">
          {team.map((member, i) => {
            const isPending = member.status === "INVITED";
            const roleStyle = ROLE_STYLES[member.role?.toUpperCase()] || ROLE_STYLES.STANDARD;
            const initials = member.name
              ? member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
              : null;
            const isOnline = member.status === "ACTIVE";

            return (
              <div
                key={member.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "#1E1E1E",
                  border: `1px solid ${i === expandedIdx ? "rgba(23,84,207,0.1)" : "rgba(23,84,207,0.05)"}`,
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {initials ? (
                        <div
                          className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center"
                          style={{
                            border: i === expandedIdx
                              ? "2px solid rgba(23,84,207,0.3)"
                              : "1px solid #334155",
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white">
                            {initials}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ background: "#1e293b", border: "1px solid #334155" }}
                        >
                          <MaterialIcon name="pending" className="text-slate-500" />
                        </div>
                      )}
                      {isOnline && (
                        <div
                          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full"
                          style={{ background: "#10b981", border: "2px solid #1E1E1E" }}
                        />
                      )}
                      {!isOnline && !isPending && (
                        <div
                          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full"
                          style={{ background: "#64748b", border: "2px solid #1E1E1E" }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h4
                        className="text-base font-bold"
                        style={{
                          fontFamily: "'Noto Serif', serif",
                          color: isPending ? "#94a3b8" : "#f1f5f9",
                          fontStyle: isPending ? "italic" : "normal",
                        }}
                      >
                        {isPending ? "Invitation Pending" : member.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        {!isPending && (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded uppercase tracking-wider"
                            style={{ background: roleStyle.bg, color: roleStyle.color }}
                          >
                            {member.role}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {isPending ? member.email : `\u2022 ${member.email}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isPending ? (
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="p-2 rounded-lg transition-colors flex flex-col items-center text-red-400"
                      >
                        <MaterialIcon name="close" />
                        <span className="text-[10px] font-bold uppercase mt-1">Cancel</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedIdx(i === expandedIdx ? -1 : i)}
                        className="p-2 rounded-lg transition-colors flex flex-col items-center"
                        style={{ color: i === expandedIdx ? "#1754cf" : "#64748b" }}
                      >
                        <MaterialIcon name={i === expandedIdx ? "settings_suggest" : "tune"} />
                        <span className="text-[10px] font-bold uppercase mt-1">Perms</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Permission Drawer (static, for now) */}
                {i === expandedIdx && !isPending && (
                  <div
                    className="p-4 space-y-4 border-t"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      borderColor: "rgba(23,84,207,0.05)",
                    }}
                  >
                    {["Manage Inventory", "View Leads", "Edit AI Templates", "Access Financials"].map((perm, pi) => {
                      const enabled = pi < 2 || (member.role === "ADMIN");
                      return (
                        <div
                          key={perm}
                          className="flex items-center justify-between"
                          style={{ opacity: enabled ? 1 : 0.6 }}
                        >
                          <span className="text-sm text-slate-300">{perm}</span>
                          <div
                            className="w-10 h-5 rounded-full relative"
                            style={{ background: enabled ? "#1754cf" : "#334155" }}
                          >
                            <div
                              className="absolute top-1 w-3 h-3 rounded-full"
                              style={{
                                background: enabled ? "white" : "#94a3b8",
                                right: enabled ? "4px" : "auto",
                                left: enabled ? "auto" : "4px",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="w-full mt-2 py-2 rounded-lg text-red-400 text-sm font-medium border border-red-400/20 hover:bg-red-400/10 transition-colors"
                    >
                      Remove Member
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ── Invite Bottom Sheet ── */}
      <BottomSheet open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Team Member">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
              Full Name
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g., Priya Sharma"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#1754cf]/50"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g., priya@dealership.in"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#1754cf]/50"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#1754cf]/50"
            >
              <option value="Sales Executive">Sales Executive</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Inventory Analyst">Inventory Analyst</option>
              <option value="Store Manager">Store Manager</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setInviteOpen(false)}
              className="flex-1 rounded-lg border border-slate-600 py-3 text-sm font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!inviteName.trim() || !inviteEmail.trim() || inviteMember.isSubmitting}
              className="flex-1 rounded-lg bg-[#1754cf] py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {inviteMember.isSubmitting ? "Inviting..." : "Send Invite"}
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-6 pt-2 flex justify-around items-end border-t max-w-md mx-auto"
        style={{
          background: "#111621",
          borderColor: "rgba(23,84,207,0.1)",
        }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "badge", label: "Team", href: "/settings/team", active: true },
          { icon: "analytics", label: "Reports", href: "/reports/monthly" },
          { icon: "settings", label: "Settings", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 py-1 px-3"
            style={{
              color: item.active ? "#1754cf" : "#64748b",
              borderTop: item.active ? "2px solid #1754cf" : "2px solid transparent",
            }}
          >
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className="text-[10px] font-medium leading-normal tracking-wider uppercase">
              {item.label}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
