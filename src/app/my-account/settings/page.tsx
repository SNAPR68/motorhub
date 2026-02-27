"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

interface ToggleState {
  push: boolean;
  email: boolean;
  sms: boolean;
  priceAlerts: boolean;
  newLaunches: boolean;
  dataSharing: boolean;
  marketing: boolean;
}

const CITIES = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-all shrink-0"
      style={{
        background: on ? "#1152d4" : "rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{
          left: on ? "calc(100% - 22px)" : "2px",
        }}
      />
    </button>
  );
}

export default function AccountSettingsPage() {
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [city, setCity] = useState("Delhi NCR");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const [toggles, setToggles] = useState<ToggleState>({
    push: true,
    email: true,
    sms: false,
    priceAlerts: true,
    newLaunches: true,
    dataSharing: false,
    marketing: false,
  });

  const toggle = (key: keyof ToggleState) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (typeof window !== "undefined") {
      window.alert(
        "Are you sure you want to delete your account? This action is irreversible. Please contact support@autovinci.com to proceed."
      );
    }
  };

  return (
    <div className="min-h-dvh w-full pb-40" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* 1. Profile Section */}
        <div
          className="p-4 rounded-2xl border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="person" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <h2 className="text-sm font-bold text-white">Profile</h2>
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* City */}
            <div>
              <label className="text-[11px] text-slate-500 uppercase tracking-wider mb-1 block">
                City
              </label>
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="w-full h-10 px-3 rounded-xl text-sm text-white flex items-center justify-between outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span>{city}</span>
                <MaterialIcon
                  name={showCityPicker ? "expand_less" : "expand_more"}
                  className="text-[18px] text-slate-500"
                />
              </button>
              {showCityPicker && (
                <div
                  className="mt-1 rounded-xl overflow-hidden border border-white/5 max-h-40 overflow-y-auto"
                  style={{ background: "rgba(15,17,24,0.98)" }}
                >
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCity(c);
                        setShowCityPicker(false);
                      }}
                      className="w-full px-3 py-2.5 text-left text-sm transition-all flex items-center justify-between"
                      style={{
                        color: c === city ? "#60a5fa" : "#94a3b8",
                        background: c === city ? "rgba(17,82,212,0.08)" : "transparent",
                      }}
                    >
                      {c}
                      {c === city && (
                        <MaterialIcon name="check" className="text-[16px]" style={{ color: "#60a5fa" }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Notifications Section */}
        <div
          className="p-4 rounded-2xl border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="notifications" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <h2 className="text-sm font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {([
              { key: "push" as const, label: "Push Notifications", desc: "Get instant alerts on your device" },
              { key: "email" as const, label: "Email Notifications", desc: "Receive updates via email" },
              { key: "sms" as const, label: "SMS Notifications", desc: "Get text message alerts" },
              { key: "priceAlerts" as const, label: "Price Alerts", desc: "Notify when prices drop" },
              { key: "newLaunches" as const, label: "New Launch Updates", desc: "Be first to know about new cars" },
            ]).map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <Toggle on={toggles[item.key]} onToggle={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Privacy Section */}
        <div
          className="p-4 rounded-2xl border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="shield" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <h2 className="text-sm font-bold text-white">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Data Sharing</p>
                <p className="text-[11px] text-slate-500">
                  Share anonymized usage data to improve experience
                </p>
              </div>
              <Toggle on={toggles.dataSharing} onToggle={() => toggle("dataSharing")} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Marketing Opt-in</p>
                <p className="text-[11px] text-slate-500">
                  Receive promotional offers and partner deals
                </p>
              </div>
              <Toggle on={toggles.marketing} onToggle={() => toggle("marketing")} />
            </div>
          </div>
        </div>

        {/* 4. About Section */}
        <div
          className="p-4 rounded-2xl border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="info" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <h2 className="text-sm font-bold text-white">About</h2>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-slate-400">App Version</span>
              <span className="text-sm font-semibold text-white">2.1.0</span>
            </div>
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <button className="w-full flex items-center justify-between py-2.5 group">
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                Rate Us
              </span>
              <MaterialIcon name="star" className="text-[18px] text-slate-600" />
            </button>
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.05)" }}
            />
            <Link
              href="/contact"
              className="w-full flex items-center justify-between py-2.5 group"
            >
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                Help &amp; Support
              </span>
              <MaterialIcon name="chevron_right" className="text-[18px] text-slate-600" />
            </Link>
          </div>
        </div>

        {/* Delete Account */}
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-2xl text-sm font-semibold transition-all border"
          style={{
            background: "rgba(239,68,68,0.05)",
            color: "#ef4444",
            borderColor: "rgba(239,68,68,0.15)",
          }}
        >
          Delete Account
        </button>
      </main>

      {/* Sticky Save Button */}
      <div
        className="fixed bottom-16 left-0 right-0 z-30 border-t border-white/5 md:hidden"
        style={{ background: "rgba(8,10,15,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-3">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: saved ? "#16a34a" : "#1152d4" }}
          >
            {saved ? (
              <>
                <MaterialIcon name="check_circle" className="text-[18px]" />
                Saved!
              </>
            ) : (
              <>
                <MaterialIcon name="save" className="text-[18px]" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
