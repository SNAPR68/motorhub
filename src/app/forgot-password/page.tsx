"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-[#e2e8f0]">
      <div className="max-w-lg mx-auto px-4 pb-32">
        {/* Header */}
        <header className="flex items-center gap-3 py-4">
          <Link href="/login/buyer" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl" />
          </Link>
          <h1 className="text-lg font-semibold">Reset Password</h1>
        </header>

        {!sent ? (
          <>
            {/* Title */}
            <div className="mt-8 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#1152d4]/10 flex items-center justify-center mb-5">
                <MaterialIcon name="lock_reset" className="text-3xl text-[#1152d4]" />
              </div>
              <h2 className="text-2xl font-bold">Forgot Password?</h2>
              <p className="text-slate-400 mt-2 leading-relaxed">
                Enter your registered email and we&apos;ll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <MaterialIcon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1152d4] hover:bg-[#1152d4]/90 text-white font-semibold py-3.5 rounded-xl transition"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              <Link href="/login/buyer" className="text-[#1152d4] font-medium hover:underline">
                Back to Login
              </Link>
            </p>
          </>
        ) : (
          /* Success State */
          <div className="mt-16 text-center">
            <div className="w-20 h-20 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-6">
              <MaterialIcon name="check_circle" className="text-5xl text-[#10b981]" fill />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-slate-400 leading-relaxed mb-8">
              Reset link sent to <span className="text-white font-medium">{email}</span>. Check your inbox and follow the instructions to reset your password.
            </p>
            <Link
              href="/login/buyer"
              className="inline-block bg-[#1152d4] hover:bg-[#1152d4]/90 text-white font-semibold py-3.5 px-8 rounded-xl transition"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
