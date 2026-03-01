"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { submitInquiry } from "@/lib/api";

type InquiryType = "GENERAL" | "TEST_DRIVE" | "CALL_BACK";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName?: string;
  type?: InquiryType;
}

export function InquiryModal({
  open,
  onClose,
  vehicleId,
  vehicleName,
  type = "GENERAL",
}: InquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const title =
    type === "TEST_DRIVE"
      ? "Book Test Drive"
      : type === "CALL_BACK"
        ? "Request Callback"
        : "Contact Dealer";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      await submitInquiry({
        vehicleId,
        buyerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        type,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setSubmitted(false);
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {vehicleName && (
              <p className="text-xs text-slate-400 mt-0.5">{vehicleName}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5"
          >
            <MaterialIcon name="close" className="text-[18px] text-slate-400" />
          </button>
        </div>

        {submitted ? (
          /* Success State */
          <div className="px-5 pb-8 pt-4 text-center">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <MaterialIcon name="check_circle" className="text-[36px] text-emerald-500" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              {type === "TEST_DRIVE" ? "Test Drive Booked" : "Inquiry Submitted"}
            </h4>
            <p className="text-sm text-slate-400 mb-6">
              The dealer will contact you shortly on {phone}.
            </p>
            <button
              onClick={handleClose}
              className="w-full h-12 rounded-xl font-bold text-sm text-white"
              style={{ background: "#1152d4" }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full h-11 rounded-xl px-4 text-sm text-white placeholder:text-slate-500 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                required
                className="w-full h-11 rounded-xl px-4 text-sm text-white placeholder:text-slate-500 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full h-11 rounded-xl px-4 text-sm text-white placeholder:text-slate-500 outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            {type === "GENERAL" && (
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message (optional)"
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !phone.trim()}
              className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              style={{ background: "#1152d4" }}
            >
              {submitting ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  <MaterialIcon name={type === "TEST_DRIVE" ? "directions_car" : type === "CALL_BACK" ? "call" : "send"} className="text-[18px]" />
                  {title}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
