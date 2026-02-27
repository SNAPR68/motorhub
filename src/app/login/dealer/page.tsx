"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useAuthStore } from "@/lib/stores";

/* Stitch: dealer_portal_login — #1d73c9, Manrope + Playfair Display, #0a0d10 */

const BG_SHOWROOM =
  "linear-gradient(to bottom, rgba(10, 13, 16, 0.7), rgba(10, 13, 16, 0.95)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDuaAQIv-Hgd-DL7YwqAczbQx7CyqTxG_IBPA1HPZD2JBYv5Q3MBmYi8VzZXiwDmTvgu4rVIiDabHxdSJwTqZODrEXImVlyhwkVY02KQh5PdNA_ZTzEtmxNfAh0iZHaY4xAMB6co2kfMZlc9py5_Et7Lj66U31ZONLkwCYJ6Hq02k6-0NIglStE9DBy6fkZVc6GKAujuyLP8kbD-iNiL2ss7TBe9KDZJ0N-7g_ICir49cd-UmofEpSwdHzkPrtDHeB7Fze7eVmS80Q)";

export default function DealerLoginPage() {
  return (
    <Suspense>
      <DealerLoginInner />
    </Suspense>
  );
}

function DealerLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading: storeLoading, error: storeError, isAuthenticated, clearError } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [dealerId, setDealerId] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const error = localError || storeError || "";
  const loading = storeLoading;

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerId.trim() || !password.trim()) {
      setLocalError("Please enter your Dealer ID and password");
      return;
    }
    setLocalError("");
    clearError();

    const success = await login(dealerId.trim(), password.trim(), "dealer");
    if (success) {
      const redirect = searchParams.get("redirect") ?? "/dashboard";
      router.push(redirect);
    }
  };

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden text-slate-100 antialiased"
      style={{
        fontFamily: "'Manrope', sans-serif",
        backgroundImage: BG_SHOWROOM,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-20 pb-12">
        <h1 className="text-3xl font-extralight uppercase tracking-[0.3em] text-white">
          Autovinci
        </h1>
        <div className="mt-4 h-[1px] w-12 bg-white/30" />
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col justify-start px-8">
        <div
          className="mx-auto w-full max-w-sm rounded-xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="mb-8">
            <h2 className="text-xl font-light tracking-wide text-white/90">
              Dealer Portal
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                Identity
              </label>
              <input
                type="text"
                value={dealerId}
                onChange={(e) => setDealerId(e.target.value)}
                placeholder="Dealer ID or Email"
                className="w-full border-0 border-b border-white/20 bg-transparent py-3 px-1 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-[#1d73c9] focus:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-end justify-between">
                <label className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  Security
                </label>
                <Link
                  href="/forgot-password"
                  className="pb-1 text-[10px] uppercase tracking-tighter text-white/30 transition-colors hover:text-white"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-0 border-b border-white/20 bg-transparent py-3 px-1 pr-10 text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-[#1d73c9] focus:ring-0"
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
            </div>

            <div className="pt-6 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg border border-white/10 bg-[#1a1c1e] py-4 text-sm font-medium uppercase tracking-widest text-white transition-all active:scale-[0.98] hover:bg-[#25282c] disabled:opacity-50"
                style={{
                  boxShadow:
                    "0 0 15px rgba(255,255,255,0.05), inset 0 0 1px rgba(255,255,255,0.2)",
                }}
              >
                {loading ? "Authenticating..." : "Dealer Sign In"}
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

          {/* Google OAuth */}
          <button
            onClick={() => {
              const redirect = searchParams.get("redirect") ?? "/dashboard";
              loginWithGoogle(redirect);
            }}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-white/80 transition-all active:scale-[0.98] hover:bg-white/10 disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-6 pb-16">
        <Link
          href="/dealer/signup"
          className="group text-sm text-white/60 transition-all hover:text-white"
        >
          New dealer?{" "}
          <span className="font-semibold text-[#1d73c9] group-hover:text-[#4a9ae8]">
            Register here
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
            External Access
          </span>
          <div className="h-[1px] w-8 bg-white/10" />
        </div>
        <Link
          href="/login/buyer"
          className="group text-lg italic text-white/70 transition-all hover:text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Switch to{" "}
          <span className="border-b border-white/20 group-hover:border-white">
            Buyer Portal
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
