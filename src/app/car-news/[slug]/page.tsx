"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function toTitleCase(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const relatedArticles = [
  {
    slug: "tata-curvv-ev-breaks-sales-records",
    title: "Tata Curvv EV Breaks Sales Records in January 2026",
    category: "EV News",
    date: "Feb 20, 2026",
  },
  {
    slug: "maruti-suzuki-hybrid-strategy-2026",
    title: "Maruti Suzuki Doubles Down on Hybrid Strategy for 2026",
    category: "Industry",
    date: "Feb 18, 2026",
  },
  {
    slug: "used-car-market-hits-all-time-high",
    title: "India's Used Car Market Hits All-Time High in Q4 2025",
    category: "Market",
    date: "Feb 15, 2026",
  },
];

export default function CarNewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const title = toTitleCase(slug);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/car-news" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <h1 className="text-lg font-semibold">Car News</h1>
        </div>
      </header>

      {/* Hero Image Placeholder */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 h-52 flex flex-col items-center justify-center gap-3">
          <MaterialIcon name="newspaper" className="text-5xl text-white/10" />
          <span className="text-xs text-white/20">Article Cover Image</span>
        </div>
      </section>

      {/* Category + Title */}
      <section className="px-4 pt-5">
        <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#1152d4]/15 text-[#1152d4] rounded-full px-2.5 py-1 mb-3">
          Industry News
        </span>
        <h2 className="text-2xl font-bold leading-tight mb-3">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span>Autovinci Editorial</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Feb 25, 2026</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>4 min read</span>
        </div>
      </section>

      {/* Article Body */}
      <article className="px-4 pt-6 space-y-4">
        <p className="text-sm text-white/70 leading-relaxed">
          The Indian automotive landscape continues its remarkable transformation in 2026,
          with electric vehicles claiming an unprecedented share of the market. Industry analysts
          note that the convergence of government incentives, expanding charging infrastructure,
          and competitive pricing from domestic manufacturers has created a perfect storm for
          adoption. Major automakers including Tata Motors, Mahindra, and Hyundai have all
          reported record deliveries in the opening months of the year.
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          The used car segment has emerged as a particularly dynamic part of the market,
          with platforms like Autovinci leveraging AI-powered pricing tools and comprehensive
          vehicle history reports to bring transparency to transactions. The pre-owned market
          is projected to reach 8 million units annually by 2027, nearly double the new car
          sales volume. This shift reflects growing consumer confidence in certified pre-owned
          vehicles backed by warranty programs and thorough inspection reports.
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          Looking ahead, industry experts anticipate further consolidation in the marketplace
          segment, with technology-first platforms gaining ground over traditional dealerships.
          The integration of AI-driven valuation, instant financing, and doorstep delivery is
          redefining what consumers expect from the car buying experience. As competition
          intensifies, the winners will be those who can combine scale with trust — offering
          both the convenience of digital transactions and the assurance of physical inspection.
        </p>
      </article>

      {/* Share Buttons */}
      <section className="px-4 pt-8">
        <h3 className="text-sm font-semibold mb-3">Share this article</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-xs font-medium"
          >
            <MaterialIcon name={copied ? "check" : "content_copy"} className="text-base text-white/60" />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(title + " — Read on Autovinci")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition text-xs font-medium text-[#25D366]"
          >
            <MaterialIcon name="chat" className="text-base" />
            WhatsApp
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " — Read on Autovinci")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-xs font-medium"
          >
            <MaterialIcon name="share" className="text-base text-white/60" />
            Twitter
          </a>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-4 pt-8 pb-6">
        <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
        <div className="space-y-3">
          {relatedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/car-news/${article.slug}`}
              className="block bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:bg-white/[0.05] transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MaterialIcon name="article" className="text-xl text-white/10" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1152d4]">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-medium mt-1 leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-white/30 mt-1.5">{article.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
