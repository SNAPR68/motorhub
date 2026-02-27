"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function toTitleCase(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const pros = [
  "Refined ride quality on all surfaces",
  "Feature-rich cabin with premium materials",
  "Strong engine performance with good fuel efficiency",
  "Excellent safety ratings with comprehensive airbag coverage",
];

const cons = [
  "Rear seat space could be more generous",
  "Top variant pricing is steep for the segment",
  "Boot space is average for the class",
];

const scores = [
  { label: "Design", score: 4.0 },
  { label: "Performance", score: 4.5 },
  { label: "Features", score: 4.0 },
  { label: "Comfort", score: 4.5 },
  { label: "Value", score: 4.0 },
];

export default function ExpertReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const modelName = toTitleCase(slug);
  const overallRating = 4.2;

  return (
    <div className="min-h-screen bg-[#080a0f] text-white max-w-lg mx-auto pb-28">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/expert-reviews" className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <MaterialIcon name="arrow_back" className="text-xl text-white/80" />
          </Link>
          <h1 className="text-lg font-semibold">Expert Review</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-5">
        <div className="rounded-2xl bg-gradient-to-br from-[#1152d4]/20 to-white/[0.02] border border-white/5 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1152d4]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-[#1152d4]/15 text-[#1152d4] rounded-full px-2.5 py-1 mb-3">
              Autovinci Expert Review
            </span>
            <h2 className="text-2xl font-bold leading-tight mb-4">{modelName}</h2>
            {/* Star rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialIcon
                    key={star}
                    name="star"
                    fill={star <= Math.floor(overallRating)}
                    className={`text-lg ${
                      star <= Math.floor(overallRating)
                        ? "text-amber-400"
                        : star - 0.5 <= overallRating
                        ? "text-amber-400"
                        : "text-white/15"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{overallRating}</span>
              <span className="text-xs text-white/40">/ 5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verdict */}
      <section className="px-4 pt-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon name="gavel" className="text-lg text-[#1152d4]" />
            <h3 className="text-sm font-semibold">Our Verdict</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            A solid performer in its segment. The {modelName} delivers a well-rounded package
            that balances style, comfort, and practicality. It stands out with its refined
            driving dynamics and feature-rich cabin, making it a strong contender for anyone
            looking for a dependable daily driver with premium appeal.
          </p>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="px-4 pt-6">
        <div className="grid grid-cols-1 gap-4">
          {/* Pros */}
          <div className="bg-[#10b981]/5 border border-[#10b981]/10 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-[#10b981] mb-3">
              <MaterialIcon name="thumb_up" className="text-lg" />
              What We Like
            </h3>
            <div className="space-y-2.5">
              {pros.map((pro) => (
                <div key={pro} className="flex items-start gap-2.5">
                  <MaterialIcon name="check_circle" className="text-base text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/60">{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-3">
              <MaterialIcon name="thumb_down" className="text-lg" />
              What Could Improve
            </h3>
            <div className="space-y-2.5">
              {cons.map((con) => (
                <div key={con} className="flex items-start gap-2.5">
                  <MaterialIcon name="cancel" className="text-base text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/60">{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Score Breakdown */}
      <section className="px-4 pt-6">
        <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-4">
          {scores.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/70">{item.label}</span>
                <span className="text-sm font-semibold">{item.score}<span className="text-white/30 font-normal">/5</span></span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1152d4] to-[#1152d4]/70 transition-all duration-500"
                  style={{ width: `${(item.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Body */}
      <section className="px-4 pt-8 space-y-6">
        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <MaterialIcon name="speed" className="text-lg text-[#1152d4]" />
            Drive Experience
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Behind the wheel, the {modelName} impresses with its composed ride quality and
            well-tuned suspension setup. The steering is precise at highway speeds and light
            enough for city manoeuvring, striking a balance that most competitors in this
            segment struggle to achieve. The engine delivers ample torque in the mid-range,
            making overtaking effortless on the highway. NVH levels are well contained, with
            only a slight wind noise noticeable above 100 km/h. The braking setup inspires
            confidence with consistent pedal feel and short stopping distances.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
            <MaterialIcon name="weekend" className="text-lg text-[#1152d4]" />
            Interior & Features
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Step inside and the cabin quality is immediately apparent — soft-touch materials
            on the dashboard, well-damped switches, and a general sense of solidity. The
            infotainment system is responsive with wireless Android Auto and Apple CarPlay.
            The panoramic sunroof floods the cabin with natural light, enhancing the sense of
            space. Climate control is effective even in peak summer conditions. Safety kit
            includes six airbags, ESC, hill-hold assist, and ADAS features on the top variant.
            The {modelName} offers a cabin experience that punches above its price point.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pt-8 pb-6">
        <Link
          href={`/cars/${slug}`}
          className="w-full py-3.5 rounded-xl bg-[#1152d4] text-white font-semibold text-sm hover:bg-[#0e44b5] transition flex items-center justify-center gap-2"
        >
          <MaterialIcon name="currency_rupee" className="text-lg" />
          View On-Road Price
        </Link>
        <p className="text-center text-[11px] text-white/30 mt-2">
          Get instant on-road price for your city
        </p>
      </section>

      <BuyerBottomNav />
    </div>
  );
}
