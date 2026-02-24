"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { sendConciergeMessage } from "@/lib/api";
import type { ConciergeVehicle } from "@/lib/api";

/* Stitch: elite_ai_concierge_chat_1 — #1773cf, Newsreader, #111921 */

type Message = {
  id: number;
  role: "ai" | "user";
  text: string;
  vehicles?: ConciergeVehicle[];
};

const QUICK_ACTIONS = [
  "Show me SUVs under 15 lakh",
  "Compare popular sedans",
  "Find electric cars",
];

const WELCOME_MESSAGE: Message = {
  id: 1,
  role: "ai",
  text: "Welcome to Autovinci Concierge. I\u2019m your AI-powered car buying assistant. I can help you find cars by brand, budget, or type — compare vehicles side by side — check availability and pricing. What are you looking for today?",
};

export default function ConciergePage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const data = await sendConciergeMessage(text.trim());
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: data.response.text,
        vehicles: data.response.vehicles,
      };
      setMessages((m) => [...m, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "I'm having trouble connecting right now. Please try again in a moment.",
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      className="relative flex h-dvh w-full max-w-[450px] mx-auto flex-col overflow-hidden border-x border-slate-800 text-slate-100"
      style={{ fontFamily: "'Newsreader', serif", background: "#111921" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#111921]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-full bg-slate-800 overflow-hidden border border-[#1773cf]/20 flex items-center justify-center">
              <MaterialIcon
                name="smart_toy"
                className="text-[#1773cf] text-xl"
              />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#111921]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              Autovinci Concierge
            </h1>
            <p className="text-[11px] uppercase tracking-widest text-[#1773cf] font-medium mt-1">
              Active Now
            </p>
          </div>
        </div>
        <Link href="/" className="text-slate-400">
          <MaterialIcon name="close" />
        </Link>
      </header>

      {/* Chat Area */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "ai" ? (
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 items-start max-w-[85%]">
                  <div className="rounded-xl px-4 py-3 bg-slate-800 text-slate-200 text-base leading-relaxed">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 ml-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-3">
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <div className="rounded-xl px-4 py-3 border border-slate-600 bg-transparent text-slate-100 text-base leading-relaxed">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mr-1 italic">
                    Delivered
                  </span>
                </div>
              </div>
            )}

            {/* Vehicle Cards from API */}
            {msg.vehicles && msg.vehicles.length > 0 && (
              <div className="mt-3 space-y-3">
                {msg.vehicles.map((car) => (
                  <Link
                    key={car.id}
                    href={`/vehicle/${car.id}`}
                    className="block"
                  >
                    <div className="flex flex-col rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 shadow-xl">
                      {car.image && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden">
                          <Image
                            src={car.image}
                            alt={car.name}
                            fill
                            sizes="(max-width: 450px) 100vw, 450px"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-[#1773cf] px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-tighter">
                              Available Now
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{car.name}</h3>
                            <p className="text-slate-400 text-xs mt-0.5">
                              {car.year} &bull; {car.fuel} &bull; {car.km} km
                            </p>
                          </div>
                          <span className="text-base font-semibold text-[#1773cf]">
                            {car.price}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-2 w-full bg-[#1773cf] hover:bg-[#1773cf]/90 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                          <span>View Details</span>
                          <MaterialIcon
                            name="arrow_forward"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex items-start gap-3 opacity-60">
            <div className="flex gap-1 py-2 px-4 bg-slate-800 rounded-full">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer — Quick Actions + Input + Nav */}
      <footer className="p-4 bg-[#111921] border-t border-slate-800 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
          {QUICK_ACTIONS.map((label) => (
            <button
              key={label}
              onClick={() => sendMessage(label)}
              disabled={typing}
              className="whitespace-nowrap px-4 py-2 rounded-full border border-slate-700 bg-slate-800/40 text-xs font-medium hover:border-[#1773cf] transition-colors disabled:opacity-40"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center justify-center size-10 rounded-full bg-[#1773cf]/10 text-[#1773cf] hover:bg-[#1773cf]/20 transition-colors"
          >
            <MaterialIcon name="magic_button" className="text-xl" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-900 border-none rounded-full px-5 py-3 text-sm focus:ring-1 focus:ring-[#1773cf] placeholder:text-slate-500 text-white"
              placeholder="Ask about cars, budget, specs..."
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex items-center justify-center size-10 rounded-full bg-[#1773cf] text-white shadow-lg shadow-[#1773cf]/20 disabled:opacity-30 transition-opacity"
          >
            <MaterialIcon name="send" className="text-xl" />
          </button>
        </form>

        {/* Bottom Nav */}
        <div className="flex gap-2 border-t border-slate-800 pt-3 pb-2 -mx-4 -mb-4 px-4">
          <Link
            href="/"
            className="flex flex-1 flex-col items-center justify-center text-slate-400"
          >
            <MaterialIcon name="home" />
          </Link>
          <Link
            href="/showroom"
            className="flex flex-1 flex-col items-center justify-center text-slate-400"
          >
            <MaterialIcon name="search" />
          </Link>
          <Link
            href="/concierge"
            className="flex flex-1 flex-col items-center justify-center text-[#1773cf]"
          >
            <MaterialIcon name="chat_bubble" fill />
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-1 flex-col items-center justify-center text-slate-400"
          >
            <MaterialIcon name="favorite" />
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-1 flex-col items-center justify-center text-slate-400"
          >
            <MaterialIcon name="person" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
