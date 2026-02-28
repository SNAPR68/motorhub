"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { createServiceBooking } from "@/lib/api";

const packages = [
  {
    id: "basic",
    name: "Basic",
    price: "₹999",
    delivery: "24h delivery",
    features: ["150-point check", "Photo report", "Digital certificate"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹1,499",
    delivery: "12h delivery",
    popular: true,
    features: [
      "250-point check",
      "Video walkthrough",
      "Expert call (15 min)",
      "Digital certificate",
    ],
  },
  {
    id: "live",
    name: "Live",
    price: "₹1,999",
    delivery: "Instant report",
    features: [
      "Everything in Pro",
      "Live video inspection",
      "Real-time expert Q&A",
      "Instant digital report",
    ],
  },
];

function getNextDays(count: number) {
  const days: { label: string; date: string; day: string }[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    days.push({
      label: `${d.getDate()} ${months[d.getMonth()]}`,
      date: d.toISOString().split("T")[0],
      day: i === 0 ? "Tomorrow" : dayNames[d.getDay()],
    });
  }
  return days;
}

const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"];

const checkSections = [
  { icon: "settings", title: "Engine & Transmission", points: "42 checks" },
  { icon: "directions_car", title: "Body & Paint", points: "38 checks" },
  { icon: "electrical_services", title: "Electrical & Electronics", points: "35 checks" },
  { icon: "tire_repair", title: "Suspension & Brakes", points: "30 checks" },
  { icon: "weekend", title: "Interior & Comfort", points: "28 checks" },
  { icon: "description", title: "Documents & RC", points: "12 checks" },
];

const badges = [
  { icon: "workspace_premium", label: "Certified Inspectors" },
  { icon: "balance", label: "Unbiased Report" },
  { icon: "monetization_on", label: "Money-Back Guarantee" },
];

export default function InspectionPage() {
  const [selectedPkg, setSelectedPkg] = useState("pro");
  const [regNumber, setRegNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [city, setCity] = useState("");
  const days = getNextDays(5);
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const [selectedTime, setSelectedTime] = useState("9:00 AM");
  const [expandedCheck, setExpandedCheck] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [booked, setBooked] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [error, setError] = useState("");

  const handleBook = async () => {
    setBookingInProgress(true);
    setError("");
    try {
      const pkg = packages.find((p) => p.id === selectedPkg);
      await createServiceBooking({
        type: "INSPECTION",
        plan: selectedPkg,
        amount: pkg?.price.replace(/[^\d]/g, ""),
        details: { packageName: pkg?.name, regNumber, vehicleName, inspector: "Vikram Singh" },
        scheduledAt: `${selectedDate}T${selectedTime.includes("PM") ? (parseInt(selectedTime) + 12).toString().padStart(2, "0") : selectedTime.split(":")[0].padStart(2, "0")}:00:00`,
        city,
        phone: phone || undefined,
      });
      setBooked(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBookingInProgress(false);
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
        <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => setBooked(false)} className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
            </button>
            <h1 className="text-lg font-semibold">Booking Confirmed</h1>
          </div>
        </header>

        <div className="px-4 pt-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center mx-auto mb-5">
            <MaterialIcon name="check_circle" className="text-4xl text-[#10b981]" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Inspection Booked!</h2>
          <p className="text-sm text-white/50 mb-8">Your inspection has been scheduled successfully</p>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 text-left space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Booking Ref</span>
              <span className="font-mono font-semibold text-[#10b981]">AV-INS-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Package</span>
              <span className="font-medium">{packages.find((p) => p.id === selectedPkg)?.name} — {packages.find((p) => p.id === selectedPkg)?.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Vehicle</span>
              <span className="font-medium">{regNumber || "Not specified"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Date & Time</span>
              <span className="font-medium">{days.find((d) => d.date === selectedDate)?.label} · {selectedTime}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/15 flex items-center justify-center text-sm font-bold text-[#10b981]">
                VS
              </div>
              <div>
                <p className="text-sm font-semibold">Vikram Singh</p>
                <p className="text-xs text-white/40">Senior Inspector · 4.9★</p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#10b981] text-white font-semibold text-sm hover:bg-[#059669] transition"
          >
            <MaterialIcon name="home" className="text-lg" />
            Back to Home
          </Link>
        </div>

        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <h1 className="text-lg font-semibold">LiveCondition™</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-medium mb-3">
              <MaterialIcon name="verified" className="text-sm" />
              Certified Service
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2">
              Independent Vehicle Inspection
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              250-point certified inspection at your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "4,800+", label: "Inspections" },
            { value: "98%", label: "Accuracy" },
            { value: "45 min", label: "Average" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <p className="text-lg font-bold text-[#10b981]">{s.value}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">Inspection Packages</h3>
        <div className="space-y-3">
          {packages.map((pkg) => {
            const selected = selectedPkg === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className={`w-full text-left rounded-2xl p-4 border transition-all ${
                  selected
                    ? "border-[#10b981] bg-[#10b981]/10"
                    : "border-white/5 bg-white/[0.03] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{pkg.name}</h4>
                      {pkg.popular && (
                        <span className="text-[10px] font-bold bg-[#10b981] text-white rounded-full px-2 py-0.5">
                          MOST POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{pkg.delivery}</p>
                  </div>
                  <p className="text-xl font-bold">{pkg.price}</p>
                </div>
                <div className="space-y-1.5">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <MaterialIcon
                        name="check_circle"
                        className={`text-sm mt-0.5 flex-shrink-0 ${
                          selected ? "text-[#10b981]" : "text-white/20"
                        }`}
                      />
                      <span className="text-xs text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      selected ? "border-[#10b981]" : "border-white/20"
                    }`}
                  >
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Vehicle Details */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Registration Number</label>
            <input
              type="text"
              placeholder="e.g. MH 02 AB 1234"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#10b981]/50 transition"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Vehicle Name / Model</label>
            <input
              type="text"
              placeholder="e.g. Hyundai Creta 2023"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#10b981]/50 transition"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">City</label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#10b981]/50 transition"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Phone Number (optional)</label>
            <input
              type="tel"
              placeholder="e.g. 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#10b981]/50 transition"
            />
          </div>
        </div>
      </section>

      {/* Date/Time Picker */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">Select Date & Time</h3>
        {/* Date pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          {days.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex-shrink-0 rounded-xl px-4 py-2.5 border text-center transition ${
                selectedDate === d.date
                  ? "border-[#10b981] bg-[#10b981]/10"
                  : "border-white/5 bg-white/[0.03] hover:border-white/10"
              }`}
            >
              <p className="text-xs text-white/40">{d.day}</p>
              <p className="text-sm font-semibold mt-0.5">{d.label}</p>
            </button>
          ))}
        </div>
        {/* Time slots */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {timeSlots.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`rounded-xl py-2.5 text-xs font-medium border transition ${
                selectedTime === t
                  ? "border-[#10b981] bg-[#10b981]/10 text-[#10b981]"
                  : "border-white/5 bg-white/[0.03] text-white/50 hover:border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Inspector Preview */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">Assigned Inspector</h3>
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-lg font-bold text-[#10b981] flex-shrink-0">
            VS
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Vikram Singh</p>
            <p className="text-xs text-white/40 mt-0.5">Senior Inspector</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <MaterialIcon name="star" className="text-sm" fill />
                4.9
              </span>
              <span className="text-xs text-white/30">680+ inspections</span>
            </div>
          </div>
          <MaterialIcon name="verified" className="text-2xl text-[#10b981]" />
        </div>
      </section>

      {/* What We Check */}
      <section className="px-4 pt-8">
        <h3 className="text-lg font-semibold mb-4">What We Check</h3>
        <div className="space-y-2">
          {checkSections.map((sec, i) => (
            <div key={sec.title} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setExpandedCheck(expandedCheck === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <MaterialIcon name={sec.icon} className="text-lg text-[#10b981]" />
                <span className="flex-1 text-sm font-medium">{sec.title}</span>
                <span className="text-[11px] text-white/30 mr-2">{sec.points}</span>
                <MaterialIcon
                  name={expandedCheck === i ? "expand_less" : "expand_more"}
                  className="text-xl text-white/30"
                />
              </button>
              {expandedCheck === i && (
                <div className="px-4 pb-4 pl-12">
                  <p className="text-xs text-white/40 leading-relaxed">
                    Our certified inspectors perform a thorough {sec.points.replace(" checks", "-point")} assessment
                    of the {sec.title.toLowerCase()} system. Each checkpoint is photographed, graded, and documented
                    in your digital report with clear pass/fail indicators and repair cost estimates.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pt-8">
        {error && (
          <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 flex items-center gap-2">
            <MaterialIcon name="error" className="text-lg text-red-400" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
        <button
          onClick={handleBook}
          disabled={bookingInProgress}
          className="w-full py-3.5 rounded-xl bg-[#10b981] text-white font-semibold text-sm hover:bg-[#059669] transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {bookingInProgress ? (
            <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <MaterialIcon name="event_available" className="text-lg" />
          )}
          {bookingInProgress ? "Booking..." : `Book Inspection — ${packages.find((p) => p.id === selectedPkg)?.price}`}
        </button>
        <p className="text-center text-[11px] text-white/30 mt-2">
          Free cancellation up to 2 hours before inspection
        </p>
      </section>

      {/* Trust Badges */}
      <section className="px-4 pt-8 pb-6">
        <div className="grid grid-cols-3 gap-2">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-xl px-2 py-3 text-center"
            >
              <MaterialIcon name={b.icon} className="text-xl text-[#10b981]" />
              <span className="text-[10px] font-medium text-white/60 leading-tight">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
