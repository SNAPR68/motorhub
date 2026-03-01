/* Autovinci — Platform Event Emission Layer
 * Append-only event log powering: benchmarks, agent triggers, audit trail, network effects.
 * Fire-and-forget: never blocks the calling API route.
 */

import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { processEvent } from "@/lib/agents/event-processor";

export type EventType =
  | "LEAD_CREATED"
  | "LEAD_STATUS_CHANGED"
  | "SENTIMENT_ANALYZED"
  | "DESCRIPTION_GENERATED"
  | "VEHICLE_WISHLISTED"
  | "VEHICLE_MODERATED"
  | "SUBSCRIPTION_ACTIVATED"
  | "AUTO_REPLY_SENT"
  | "VEHICLE_SCORED"
  | "TRENDING_BADGE_SET";

interface EmitEventParams {
  type: EventType;
  entityType: string;
  entityId: string;
  dealerProfileId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/** Fire-and-forget event emission + agent trigger. Never throws, never blocks. */
export function emitEvent(params: EmitEventParams): void {
  // 1. Persist event to DB (fire-and-forget)
  db.platformEvent
    .create({
      data: {
        type: params.type,
        entityType: params.entityType,
        entityId: params.entityId,
        dealerProfileId: params.dealerProfileId ?? null,
        userId: params.userId ?? null,
        metadata: (params.metadata ?? {}) as Prisma.InputJsonValue,
      },
    })
    .catch((err) => {
      console.error("[PlatformEvent] Failed to emit:", params.type, err?.message);
    });

  // 2. Trigger agent processor (fire-and-forget)
  processEvent(params).catch((err) => {
    console.error("[AgentProcessor] Failed:", params.type, err?.message);
  });
}
