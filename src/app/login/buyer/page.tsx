"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";
import { useAuthStore } from "@/lib/stores";

/* Stitch: buyer_portal_login — #1754cf, Manrope + Playfair Display, #0a0c10 */

export default function BuyerLoginPage() {
  return (
    <Suspense>
      <BuyerLoginInner />
    </Suspense>
  );
}

function BuyerLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading, error: storeError, isAuthenticated, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [localError, setLocalError] = useState("");

  const error = localError || storeError || "";
  const redirect = searchParams.get("redirect") ?? "/";

  // If already authenticated, redirect
  if (isAuthenticated) {
    router.push(redirect);
  }

  const handleGoogle = () => {
    clearError();
    loginWithGoogle(redirect);
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter your email and password");
      return;
    }
    setLocalError("");
    clearError();

    const success = await login(email.trim(), password.trim(), "buyer");
    if (success) {
      router.push(redirect);
    }
  };

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden text-slate-100 antialiased"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0c10" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full scale-105 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${INTERIOR}")` }}
        />
        <div className="absolute inset-0 bg-[#0a0c10]/60 [background:radial-gradient(circle_at_center,transparent_0%,rgba(10,12,16,0.8)_100%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1754cf]">
            <MaterialIcon name="diamond" className="text-white text-xl" />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            Autovinci
          </span>
        </div>
        <Link
          href="/"
          className="text-white/70 transition-colors hover:text-white"
        >
          <MaterialIcon name="close" />
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-12">
        <div className="mb-10 text-center">
          <h1
            className="mb-2 text-4xl leading-tight text-white italic md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Private Showroom
          </h1>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-slate-400">
            Access Exclusive Inventory
          </p>
        </div>

        {/* Login card */}
        <div
          className="space-y-4 rounded-xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {error && (
            <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-slate-100/10 text-base font-semibold text-white transition-all active:scale-95 hover:bg-slate-100/20 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-4 flex-shrink text-xs font-medium uppercase tracking-widest text-white/30">
              Or
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {!showEmailForm ? (
            <button
              onClick={() => setShowEmailForm(true)}
              disabled={isLoading}
              className="flex h-14 w-full items-center justify-center rounded-lg bg-[#1754cf] text-base font-bold text-white shadow-lg shadow-[#1754cf]/20 transition-all active:scale-95 hover:bg-[#1754cf]/90 disabled:opacity-50"
            >
              Continue with Email
            </button>
          ) : (
            <form onSubmit={handleEmail} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#1754cf]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#1754cf]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-14 w-full items-center justify-center rounded-lg bg-[#1754cf] text-base font-bold text-white shadow-lg shadow-[#1754cf]/20 transition-all active:scale-95 hover:bg-[#1754cf]/90 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 space-y-4 text-center">
          <p className="text-sm font-medium text-slate-400">
            New to Autovinci?{" "}
            <Link
              href="/login/buyer"
              className="ml-1 text-white underline underline-offset-4 transition-colors hover:text-[#1754cf]"
            >
              Become a Member
            </Link>
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <Link
              href="/login/buyer"
              className="text-[10px] uppercase tracking-widest text-white/30 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/login/buyer"
              className="text-[10px] uppercase tracking-widest text-white/30 transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>

      {/* iOS Bottom Indicator Spacer */}
      <div className="h-6 bg-transparent" />
    </div>
  );
}
