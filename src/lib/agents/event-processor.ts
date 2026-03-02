/* Autovinci — Agent Event Processor
 * Processes PlatformEvents and triggers autonomous AI actions.
 * Called fire-and-forget after each event emission.
 * Never blocks the calling API route.
 */

import {
  autoAnalyzeSentiment,
  autoReplyToLead,
  notifyHotLead,
  checkTrendingVehicle,
  warnUnresponsiveLeads,
} from "./actions";
import { scheduleFollowUps } from "./follow-ups";
import { recordResponse } from "./agent-memory";

interface EventPayload {
  type: string;
  entityType: string;
  entityId: string;
  dealerProfileId?: string | null;
  userId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Process an event and trigger appropriate agent actions.
 * Fire-and-forget: catches all errors internally.
 */
export async function processEvent(event: EventPayload): Promise<void> {
  try {
    switch (event.type) {
      case "LEAD_CREATED":
        if (event.dealerProfileId) {
          // Auto-analyze sentiment + auto-reply + schedule follow-ups (parallel)
          await Promise.allSettled([
            autoAnalyzeSentiment(event.entityId, event.dealerProfileId),
            autoReplyToLead(event.entityId, event.dealerProfileId),
            scheduleFollowUps(event.entityId, event.dealerProfileId),
          ]);
          // Occasionally check for unresponsive leads batch
          if (Math.random() < 0.1) {
            await warnUnresponsiveLeads(event.dealerProfileId);
          }
        }
        break;

      case "SENTIMENT_ANALYZED":
        if (event.metadata?.label === "HOT" && event.dealerProfileId) {
          await notifyHotLead(event.entityId, event.dealerProfileId);
        }
        break;

      case "LEAD_STATUS_CHANGED":
        // Track agent memory: if buyer responded after auto-reply, record it
        if (event.dealerProfileId && event.metadata?.newStatus === "CONTACTED") {
          await recordResponse(event.dealerProfileId, event.entityId);
        }
        break;

      case "VEHICLE_WISHLISTED":
        await checkTrendingVehicle(event.entityId);
        break;
    }
  } catch (error) {
    console.error("[AgentProcessor] Error processing event:", event.type, error instanceof Error ? error.message : error);
  }
}
