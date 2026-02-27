"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR, CRETA } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCurrentUser } from "@/lib/api";

/* Stitch: vip_rewards_&_referral_circle — #f2b90d, Manrope, #12110a */

const REWARDS = [
  {
    image: CRETA,
    badge: "Available",
    badgeStyle: "bg-[#f2b90d]/90 text-[#12110a]",
    category: "Platinum Event",
    title: "Private Track Day: BIC",
    meta: [
      { icon: "calendar_today", text: "Mar 14-16" },
      { icon: "location_on", text: "Greater Noida" },
    ],
    locked: false,
  },
  {
    image: "",
    badge: "",
    badgeStyle: "",
    category: "",
    title: "Early Access: Project Nebula",
    meta: [],
    locked: true,
  },
  {
    image: INTERIOR,
    badge: "Coming Soon",
    badgeStyle:
      "bg-white/20 backdrop-blur-md text-white border border-white/10",
    category: "Lifestyle Perks",
    title: "Bespoke Concierge Service",
    meta: [],
    locked: false,
  },
];

export default function VIPRewardsPage() {
  const [copied, setCopied] = useState(false);

  const { data: meData } = useApi(() => fetchCurrentUser(), []);
  const user = meData?.user;

  // Derive display name and initials from real user data
  const displayName = user?.name ?? "VIP Member";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();
  // Generate a stable referral code from the user id or name
  const referralCode = user?.id
    ? `AV-${user.id.slice(0, 4).toUpperCase()}-VIP`
    : "AV-VIP-XXXX";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#12110a" }}
    >
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#12110a]/80 backdrop-blur-md border-b border-[#f2b90d]/10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto w-full">
          <Link href="/vip" className="text-slate-100">
            <MaterialIcon name="arrow_back_ios_new" className="text-[28px]" />
          </Link>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[#f2b90d]">
            VIP Circle
          </h1>
          <button className="text-slate-100 relative">
            <MaterialIcon name="notifications" className="text-[24px]" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#f2b90d] ring-2 ring-[#12110a]" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24 overflow-y-auto">
        {/* Profile & Status Card */}
        <section className="p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="size-24 rounded-full border-2 border-[#f2b90d] p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-2xl font-bold text-[#f2b90d]">
                  {initials}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#f2b90d] text-[#12110a] size-7 rounded-full flex items-center justify-center border-2 border-[#12110a]">
                <MaterialIcon
                  name="verified"
                  className="text-[16px] font-bold"
                />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              {displayName}
            </h2>
            <p className="text-[#f2b90d] text-xs font-semibold tracking-widest uppercase mt-1">
              Platinum Member
            </p>
          </div>

          {/* Digital Black Card */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2a2614] to-[#1c1a0e] border border-[#f2b90d]/30 p-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <MaterialIcon
                name="workspace_premium"
                className="text-[80px]"
              />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2b90d]/70 mb-1">
                    Status
                  </p>
                  <p className="text-xl font-bold italic tracking-wider">
                    PLATINUM
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2b90d]/70 mb-1">
                    Points
                  </p>
                  <p className="text-xl font-bold tracking-tight">12,500</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-xs text-slate-400">
                    Progress to Diamond Elite
                  </p>
                  <p className="text-xs font-bold text-[#f2b90d]">83%</p>
                </div>
                <div className="h-[3px] w-full bg-[#f2b90d]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f2b90d] rounded-full"
                    style={{
                      width: "83%",
                      boxShadow: "0 0 8px rgba(242,185,13,0.6)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-[#f2b90d]/60 uppercase tracking-widest">
                  2,500 pts remaining
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Refer a Peer Section */}
        <section className="px-6 py-4">
          <div className="bg-[#1c1a0e] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MaterialIcon name="group_add" className="text-[#f2b90d]" />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Refer a Peer
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Extend the circle. Invite a fellow collector to Autovinci and both
              receive 1,000 bonus points upon their first acquisition.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black/40 border border-[#f2b90d]/20 rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-[#f2b90d] font-bold tracking-[0.3em]">
                  {referralCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-[#f2b90d]/60 hover:text-[#f2b90d] transition-colors"
                >
                  <MaterialIcon
                    name={copied ? "check" : "content_copy"}
                    className="text-[20px]"
                  />
                </button>
              </div>
              <button className="bg-[#f2b90d] text-[#12110a] font-bold px-4 py-3 rounded-lg flex items-center justify-center">
                <MaterialIcon name="share" />
              </button>
            </div>
          </div>
        </section>

        {/* Exclusive Rewards Section */}
        <section className="px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest">
              Exclusive Rewards
            </h3>
            <button className="text-[#f2b90d] text-[10px] font-bold uppercase tracking-widest border-b border-[#f2b90d]/30 pb-0.5">
              View All
            </button>
          </div>
          <div className="grid gap-6">
            {REWARDS.map((reward, i) =>
              reward.locked ? (
                /* Locked Reward */
                <div
                  key={i}
                  className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl grayscale-[0.5] opacity-80"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${CRETA}')` }}
                  />
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <MaterialIcon
                      name="lock"
                      className="text-[#f2b90d] text-[32px] mb-2"
                    />
                    <h4 className="text-lg font-bold mb-1">{reward.title}</h4>
                    <p className="text-xs text-[#f2b90d]/80 tracking-widest uppercase">
                      Unlocks at Diamond Tier
                    </p>
                  </div>
                </div>
              ) : (
                /* Available Reward */
                <div
                  key={i}
                  className="group relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${reward.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  {reward.badge && (
                    <div
                      className={`absolute top-4 right-4 text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase ${reward.badgeStyle}`}
                    >
                      {reward.badge}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 p-5">
                    {reward.category && (
                      <p className="text-[10px] font-bold text-[#f2b90d] uppercase tracking-[0.2em] mb-1">
                        {reward.category}
                      </p>
                    )}
                    <h4 className="text-lg font-bold leading-tight mb-2">
                      {reward.title}
                    </h4>
                    {reward.meta.length > 0 && (
                      <div className="flex items-center gap-4">
                        {reward.meta.map((m) => (
                          <div
                            key={m.icon}
                            className="flex items-center gap-1 text-[10px] text-slate-300"
                          >
                            <MaterialIcon
                              name={m.icon}
                              className="text-[14px]"
                            />
                            {m.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-[#12110a]/95 backdrop-blur-xl border-t border-[#f2b90d]/10 px-4 pb-8 pt-3">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <Link
            href="/inventory"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <MaterialIcon name="garage" className="text-[24px]" />
            <span className="text-[10px] font-medium tracking-tight">
              Inventory
            </span>
          </Link>
          <Link
            href="/showroom"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <MaterialIcon name="storefront" className="text-[24px]" />
            <span className="text-[10px] font-medium tracking-tight">
              Showroom
            </span>
          </Link>
          <Link
            href="/vip/rewards"
            className="flex flex-col items-center gap-1 text-[#f2b90d]"
          >
            <div className="relative">
              <MaterialIcon
                name="workspace_premium"
                fill
                className="text-[28px]"
              />
              <div className="absolute -top-1 -right-1 size-2 bg-[#f2b90d] rounded-full" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">VIP</span>
          </Link>
          <Link
            href="/concierge"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <MaterialIcon name="chat_bubble_outline" className="text-[24px]" />
            <span className="text-[10px] font-medium tracking-tight">
              Messages
            </span>
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <MaterialIcon name="account_circle" className="text-[24px]" />
            <span className="text-[10px] font-medium tracking-tight">
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
