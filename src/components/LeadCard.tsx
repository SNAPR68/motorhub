"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { SENTIMENT_DISPLAY } from "@/lib/constants";
import type { Lead } from "@/lib/types";

interface LeadCardProps {
  lead: Lead;
  className?: string;
}

export function LeadCard({ lead, className }: LeadCardProps) {
  const sentiment = SENTIMENT_DISPLAY[lead.sentimentLabel];

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <Link href={`/leads/${lead.id}`}>
            <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors">
              {lead.name}
            </h3>
          </Link>
          <Badge
            variant="source"
            label={lead.source}
            color={lead.sourceColor}
            className="mt-1"
          />
        </div>

        <div
          className={cn(
            "flex flex-col items-center rounded-lg px-2 py-1 text-xs font-bold",
            sentiment.bg,
            sentiment.color
          )}
        >
          <span className="text-[10px] uppercase opacity-70">Sentiment</span>
          <span>
            {lead.sentiment}% {sentiment.label}
          </span>
        </div>
      </div>

      {/* Car Thumbnail */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-50 p-2">
        <Image
          src={lead.carImage}
          alt={lead.car}
          width={48}
          height={48}
          className="rounded-md object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div>
          <p className="text-[10px] text-slate-400 font-medium uppercase leading-none mb-1">
            Interested In
          </p>
          <p className="text-sm font-bold text-slate-700">{lead.car}</p>
        </div>
      </div>

      {/* Message Preview */}
      <p className="mb-4 text-sm text-slate-500 line-clamp-2">
        &ldquo;{lead.message}&rdquo;
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200"
        >
          <MaterialIcon name="call" className="text-[18px]" /> Call
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200"
        >
          <MaterialIcon name="chat" className="text-[18px]" /> Text
        </button>
      </div>
      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20"
      >
        <MaterialIcon name="auto_awesome" className="text-[18px]" /> AI Draft Reply
      </button>
    </div>
  );
}
