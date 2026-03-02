"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile, createPaymentOrder, verifyPayment } from "@/lib/api";
import { PLAN_DISPLAY } from "@/lib/plan-limits";
import type { PlanKey } from "@/lib/plan-limits";

/* -- design tokens: premium_dealer_plans -- */
// primary: #f4c025 (gold), font: Manrope, bg: #221e10

const PLAN_KEY_MAP: Record<string, string> = {
  FREE: "Free",
  STARTER: "Starter",
  GROWTH: "Growth",
  ENTERPRISE: "Enterprise",
};

export default function PlansPage() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [upgraded, setUpgraded] = useState(false);
  const router = useRouter();
  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const currentPlan =
    (profileData?.profile as { plan?: string } | undefined)?.plan ?? "FREE";
  const currentPlanName = PLAN_KEY_MAP[currentPlan] ?? "Free";

  const handleUpgrade = useCallback(
    async (planDbKey: "STARTER" | "GROWTH" | "ENTERPRISE") => {
      setUpgrading(planDbKey);
      try {
        const order = await createPaymentOrder({ plan: planDbKey, billing });

        // Demo mode (no Razorpay keys configured)
        if (order.demo) {
          const result = await verifyPayment({
            razorpay_order_id: order.orderId,
            razorpay_payment_id: `pay_demo_${Date.now()}`,
            razorpay_signature: "demo",
            plan: planDbKey,
            billing,
          });
          if (result.verified) {
            setUpgraded(true);
            setTimeout(() => router.push("/settings"), 2000);
          }
          setUpgrading(null);
          return;
        }

        // Real Razorpay checkout
        const RazorpayCheckout = (
          window as unknown as Record<string, unknown>
        ).Razorpay as
          | (new (opts: Record<string, unknown>) => { open: () => void })
          | undefined;

        if (!RazorpayCheckout) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Razorpay"));
            document.head.appendChild(script);
          });
        }

        const Rp = (window as unknown as Record<string, unknown>).Razorpay as new (
          opts: Record<string, unknown>,
        ) => { open: () => void };

        const rzp = new Rp({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          name: "Autovinci",
          description: `${PLAN_KEY_MAP[planDbKey]} Plan - ${billing}`,
          order_id: order.orderId,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const result = await verifyPayment({
                ...response,
                plan: planDbKey,
                billing,
              });
              if (result.verified) {
                setUpgraded(true);
                setTimeout(() => router.push("/settings"), 2000);
              }
            } catch {
              /* ignore */
            }
            setUpgrading(null);
          },
          modal: {
            ondismiss: () => setUpgrading(null),
          },
          theme: { color: "#f4c025" },
        });
        rzp.open();
      } catch {
        setUpgrading(null);
      }
    },
    [billing, router],
  );

  const planOrder: PlanKey[] = ["FREE", "STARTER", "GROWTH", "ENTERPRISE"];
  const currentIdx = planOrder.indexOf(currentPlan as PlanKey);

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "#221e10",
        color: "#f1f5f9",
      }}
    >
      {/* -- Header -- */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <Link
          href="/settings"
          className="flex w-12 shrink-0 items-center justify-start"
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-2xl" />
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12 text-white">
          Dealer Plans
        </h2>
      </div>

      {/* -- Billing Toggle -- */}
      <div className="px-4 py-6">
        <div
          className="flex h-12 flex-1 items-center justify-center rounded-xl p-1"
          style={{
            background: "rgba(244,192,37,0.05)",
            border: "1px solid rgba(244,192,37,0.2)",
          }}
        >
          <button
            onClick={() => setBilling("monthly")}
            className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all"
            style={
              billing === "monthly"
                ? { background: "#f4c025", color: "#221e10" }
                : { color: "#f4c025" }
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all relative"
            style={
              billing === "annual"
                ? { background: "#f4c025", color: "#221e10" }
                : { color: "#f4c025" }
            }
          >
            Annual
            <span
              className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
              style={{ background: "#f4c025", color: "#221e10" }}
            >
              2 Mo Free
            </span>
          </button>
        </div>
      </div>

      {/* -- Upgrade Success -- */}
      {upgraded && (
        <div
          className="mx-4 mb-2 p-4 rounded-xl flex items-center gap-3"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <MaterialIcon
            name="check_circle"
            className="text-emerald-400 text-2xl"
          />
          <div>
            <p className="text-sm font-bold text-emerald-400">Plan Upgraded</p>
            <p className="text-xs text-slate-400">Redirecting to settings...</p>
          </div>
        </div>
      )}

      {/* -- Plans Content -- */}
      <div className="flex flex-col gap-5 px-4 py-3">
        {PLAN_DISPLAY.map((plan) => {
          const isCurrent = plan.key === currentPlan;
          const isHighlight = plan.popular;
          const canUpgrade =
            plan.key !== "FREE" &&
            planOrder.indexOf(plan.key) > currentIdx;
          const isDowngrade =
            planOrder.indexOf(plan.key) < currentIdx;

          return (
            <div
              key={plan.key}
              className="flex flex-col gap-4 rounded-xl p-5 relative overflow-hidden backdrop-blur-sm"
              style={{
                background: isHighlight
                  ? "rgba(244,192,37,0.05)"
                  : "rgba(255,255,255,0.05)",
                border: isHighlight
                  ? "2px solid #f4c025"
                  : isCurrent
                    ? "1px solid rgba(16,185,129,0.4)"
                    : "1px solid rgba(244,192,37,0.1)",
              }}
            >
              {/* Popular ribbon */}
              {isHighlight && (
                <div className="absolute top-0 right-0">
                  <div
                    className="text-[10px] font-black px-4 py-1 rotate-45 translate-x-3 translate-y-2 w-32 text-center uppercase"
                    style={{ background: "#f4c025", color: "#221e10" }}
                  >
                    Popular
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest leading-tight"
                    style={{
                      color: isHighlight ? "#f4c025" : "#94a3b8",
                    }}
                  >
                    {plan.tagline}
                  </h3>
                  {isCurrent && (
                    <span
                      className="text-[10px] px-2 py-1 rounded font-medium"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        color: "#10b981",
                      }}
                    >
                      Current Plan
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {plan.name}
                  {plan.badge && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        background:
                          plan.badge === "Platinum Dealer"
                            ? "rgba(168,85,247,0.2)"
                            : "rgba(244,192,37,0.2)",
                        color:
                          plan.badge === "Platinum Dealer"
                            ? "#a855f7"
                            : "#f4c025",
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </h1>
                <p className="flex items-baseline gap-1">
                  <span className="text-3xl font-black leading-tight tracking-tight text-white">
                    {plan.key === "FREE" ? (
                      "Free"
                    ) : (
                      <>
                        <span className="text-lg font-medium text-slate-500">
                          INR{" "}
                        </span>
                        {billing === "annual"
                          ? plan.annualPrice
                          : plan.monthlyPrice}
                      </>
                    )}
                  </span>
                  {plan.key !== "FREE" && (
                    <span className="text-sm font-medium text-slate-400">
                      /{billing === "annual" ? "yr" : "mo"}
                    </span>
                  )}
                </p>
                {billing === "annual" && plan.annualSavings && (
                  <p className="text-[11px] font-medium text-emerald-400">
                    Save INR {plan.annualSavings}/year
                  </p>
                )}
              </div>

              <div
                className="flex flex-col gap-2.5 pt-4 border-t"
                style={{
                  borderColor: isHighlight
                    ? "rgba(244,192,37,0.2)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    className="text-[13px] font-normal leading-normal flex gap-2.5 items-start"
                    style={{ color: isHighlight ? "#f1f5f9" : "#94a3b8" }}
                  >
                    <MaterialIcon
                      name={isHighlight ? "verified" : "check_circle"}
                      className="text-base text-[#f4c025] shrink-0 mt-0.5"
                    />
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (canUpgrade) {
                    handleUpgrade(
                      plan.key as "STARTER" | "GROWTH" | "ENTERPRISE",
                    );
                  }
                }}
                className="w-full mt-2 py-3 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                disabled={isCurrent || !canUpgrade || upgrading === plan.key}
                style={{
                  background: isCurrent
                    ? "#1e293b"
                    : isDowngrade
                      ? "#1e293b"
                      : isHighlight
                        ? "#f4c025"
                        : "rgba(244,192,37,0.2)",
                  color: isCurrent
                    ? "#94a3b8"
                    : isDowngrade
                      ? "#64748b"
                      : isHighlight
                        ? "#221e10"
                        : "#f4c025",
                  ...(!canUpgrade
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : {}),
                  ...(isHighlight && canUpgrade
                    ? { boxShadow: "0 4px 16px rgba(244,192,37,0.2)" }
                    : {}),
                }}
              >
                {upgrading === plan.key ? (
                  <div className="h-5 w-5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                ) : null}
                {isCurrent
                  ? "Current Plan"
                  : isDowngrade
                    ? plan.name
                    : upgrading === plan.key
                      ? "Processing..."
                      : plan.key === "FREE"
                        ? "Free Forever"
                        : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* -- Comparison Note -- */}
      <div className="px-4 py-8 text-center">
        <p className="text-xs text-slate-500">
          All prices in INR. GST applicable. Annual plans billed upfront.
        </p>
      </div>

      {/* -- Bottom Nav -- */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t px-4 pb-6 pt-3 backdrop-blur-md max-w-md mx-auto md:hidden"
        style={{
          background: "rgba(34,30,16,0.95)",
          borderColor: "rgba(244,192,37,0.2)",
        }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "star", label: "Plans", href: "/plans", active: true },
          { icon: "bar_chart", label: "Analytics", href: "/analytics" },
          { icon: "account_circle", label: "Profile", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1"
            style={{ color: item.active ? "#f4c025" : "#94a3b8" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className="text-[10px] font-medium leading-normal tracking-wide">
              {item.label}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
