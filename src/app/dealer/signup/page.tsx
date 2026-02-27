"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: dealer_signup — #1d73c9, Manrope + Playfair Display, #0a0d10 */

const BG_SHOWROOM =
  "linear-gradient(to bottom, rgba(10, 13, 16, 0.7), rgba(10, 13, 16, 0.95)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDuaAQIv-Hgd-DL7YwqAczbQx7CyqTxG_IBPA1HPZD2JBYv5Q3MBmYi8VzZXiwDmTvgu4rVIiDabHxdSJwTqZODrEXImVlyhwkVY02KQh5PdNA_ZTzEtmxNfAh0iZHaY4xAMB6co2kfMZlc9py5_Et7Lj66U31ZONLkwCYJ6Hq02k6-0NIglStE9DBy6fkZVc6GKAujuyLP8kbD-iNiL2ss7TBe9KDZJ0N-7g_ICir49cd-UmofEpSwdHzkPrtDHeB7Fze7eVmS80Q)";

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Telangana",
  "Kerala",
  "West Bengal",
] as const;

const BUSINESS_TYPES = [
  "Individual",
  "Partnership",
  "Pvt Ltd",
  "LLP",
] as const;

type Plan = "STARTER" | "GROWTH" | "ENTERPRISE";

const PLANS: {
  key: Plan;
  name: string;
  price: string;
  features: string;
  popular?: boolean;
}[] = [
  {
    key: "STARTER",
    name: "Starter",
    price: "Free",
    features: "Up to 10 listings, Basic analytics",
  },
  {
    key: "GROWTH",
    name: "Growth",
    price: "\u20B92,999/mo",
    features: "50 listings, AI pricing, Lead scoring",
    popular: true,
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    price: "\u20B99,999/mo",
    features: "Unlimited, Full AI suite, Priority support",
  },
];

export default function DealerSignupPage() {
  const router = useRouter();

  // Business Details
  const [dealershipName, setDealershipName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Owner Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Plan
  const [selectedPlan, setSelectedPlan] = useState<Plan>("GROWTH");

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!dealershipName.trim()) e.dealershipName = "Dealership name is required";
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address";
    if (!phone.trim()) e.phone = "Phone number is required";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/onboarding/dealer");
  };

  const inputClass =
    "w-full border-0 border-b border-white/20 bg-transparent py-3 px-1 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-[#1d73c9] focus:ring-0";

  const selectClass =
    "w-full appearance-none border-0 border-b border-white/20 bg-transparent py-3 px-1 text-white outline-none transition-all duration-300 focus:border-[#1d73c9] focus:ring-0 cursor-pointer";

  const labelClass =
    "ml-1 text-[10px] font-semibold uppercase tracking-widest text-white/50";

  const errorClass = "mt-1 text-[10px] text-red-400";

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col text-slate-100 antialiased"
      style={{
        fontFamily: "'Manrope', sans-serif",
        backgroundImage: BG_SHOWROOM,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <h1 className="text-3xl font-extralight uppercase tracking-[0.3em] text-white">
          Autovinci
        </h1>
        <div className="mt-4 h-[1px] w-12 bg-white/30" />
        <p
          className="mt-4 text-lg italic text-white/60"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Join India&apos;s Smartest Dealer Network
        </p>
      </div>

      {/* Form Card */}
      <div className="flex flex-1 flex-col items-center px-6 pb-16">
        <div
          className="mx-auto w-full max-w-md rounded-xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-light tracking-wide text-white/90">
              Dealer Registration
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
              Start your free 14-day trial
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ── Section 1: Business Details ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name="storefront"
                  className="text-base text-[#1d73c9]/70"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Business Details
                </span>
                <div className="flex-1 border-t border-white/5" />
              </div>

              {/* Dealership Name */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Dealership Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={dealershipName}
                  onChange={(e) => setDealershipName(e.target.value)}
                  placeholder="e.g. AutoHub Motors"
                  className={inputClass}
                />
                {errors.dealershipName && (
                  <p className={errorClass}>{errors.dealershipName}</p>
                )}
              </div>

              {/* GST Number */}
              <div className="space-y-1.5">
                <label className={labelClass}>GST Number</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  className={inputClass}
                />
              </div>

              {/* Business Type */}
              <div className="space-y-1.5">
                <label className={labelClass}>Business Type</label>
                <div className="relative">
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled className="bg-[#0a0d10]">
                      Select type
                    </option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#0a0d10]">
                        {t}
                      </option>
                    ))}
                  </select>
                  <MaterialIcon
                    name="expand_more"
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-lg text-white/30"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={inputClass}
                />
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className={labelClass}>State</label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled className="bg-[#0a0d10]">
                      Select state
                    </option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#0a0d10]">
                        {s}
                      </option>
                    ))}
                  </select>
                  <MaterialIcon
                    name="expand_more"
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-lg text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Owner Details ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name="person"
                  className="text-base text-[#1d73c9]/70"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Owner Details
                </span>
                <div className="flex-1 border-t border-white/5" />
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className={inputClass}
                />
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dealer@example.com"
                  className={inputClass}
                />
                {errors.email && (
                  <p className={errorClass}>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
                {errors.phone && (
                  <p className={errorClass}>{errors.phone}</p>
                )}
              </div>
            </div>

            {/* ── Section 3: Security ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name="lock"
                  className="text-base text-[#1d73c9]/70"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Security
                </span>
                <div className="flex-1 border-t border-white/5" />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className={labelClass}>
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-2 cursor-pointer text-white/30 transition-colors hover:text-white/60"
                  >
                    <MaterialIcon
                      name={showPw ? "visibility_off" : "visibility"}
                      className="text-lg"
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className={errorClass}>{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-2 cursor-pointer text-white/30 transition-colors hover:text-white/60"
                  >
                    <MaterialIcon
                      name={showConfirmPw ? "visibility_off" : "visibility"}
                      className="text-lg"
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className={errorClass}>{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* ── Section 4: Plan Selection ── */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MaterialIcon
                  name="workspace_premium"
                  className="text-base text-[#1d73c9]/70"
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Select Plan
                </span>
                <div className="flex-1 border-t border-white/5" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlan === plan.key;
                  return (
                    <button
                      key={plan.key}
                      type="button"
                      onClick={() => setSelectedPlan(plan.key)}
                      className={`relative flex flex-col items-center rounded-lg p-4 text-center transition-all duration-300 ${
                        isSelected
                          ? "border border-[#1d73c9]/60 bg-[#1d73c9]/10"
                          : "border border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#1d73c9] px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white">
                          Popular
                        </span>
                      )}

                      {/* Radio indicator */}
                      <div
                        className={`mb-3 flex h-4 w-4 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#1d73c9] bg-[#1d73c9]"
                            : "border-white/30"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        {plan.name}
                      </span>
                      <span
                        className={`mt-1 text-sm font-semibold ${
                          isSelected ? "text-[#1d73c9]" : "text-white/60"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span className="mt-2 text-[9px] leading-relaxed text-white/30">
                        {plan.features}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg border border-white/10 bg-[#1a1c1e] py-4 text-sm font-medium uppercase tracking-widest text-white transition-all active:scale-[0.98] hover:bg-[#25282c] disabled:opacity-50"
                style={{
                  boxShadow:
                    "0 0 15px rgba(255,255,255,0.05), inset 0 0 1px rgba(255,255,255,0.2)",
                }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <MaterialIcon
                      name="progress_activity"
                      className="animate-spin text-base"
                    />
                    Creating Account...
                  </span>
                ) : (
                  "Create Dealer Account"
                )}
              </button>
            </div>
          </form>

          {/* OAuth Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-4 text-[10px] uppercase tracking-widest text-white/25">
              Or
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Google Signup */}
          <button
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/80 transition-all active:scale-[0.98] hover:bg-white/10 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Terms */}
          <p className="mt-4 text-center text-[10px] text-white/25">
            By signing up, you agree to our{" "}
            <span className="cursor-pointer text-white/40 underline underline-offset-2 transition-colors hover:text-white/60">
              Terms of Service
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-6 pb-16">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            Existing Dealer
          </span>
          <div className="h-[1px] w-8 bg-white/10" />
        </div>
        <Link
          href="/login/dealer"
          className="group text-lg italic text-white/70 transition-all hover:text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Already have an account?{" "}
          <span className="border-b border-white/20 group-hover:border-white">
            Sign In
          </span>
        </Link>
      </div>

      {/* Decorative blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#1d73c9]/5 blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-white/5 blur-[100px]" />
      </div>
    </div>
  );
}
