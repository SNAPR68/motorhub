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
          // Auto-analyze sentiment + auto-reply (parallel)
          await Promise.allSettled([
            autoAnalyzeSentiment(event.entityId, event.dealerProfileId),
            autoReplyToLead(event.entityId, event.dealerProfileId),
          ]);
        }
        break;

      case "SENTIMENT_ANALYZED":
        if (event.metadata?.label === "HOT" && event.dealerProfileId) {
          await notifyHotLead(event.entityId, event.dealerProfileId);
        }
        break;

      case "LEAD_STATUS_CHANGED":
        // When lead moves to CONTACTED, could schedule follow-up (future)
        break;

      case "VEHICLE_WISHLISTED":
        await checkTrendingVehicle(event.entityId);
        break;

      case "LEAD_CREATED":
        // Check for unresponsive leads batch (runs occasionally, not on every event)
        if (event.dealerProfileId && Math.random() < 0.1) {
          await warnUnresponsiveLeads(event.dealerProfileId);
        }
        break;
    }
  } catch (error) {
    console.error("[AgentProcessor] Error processing event:", event.type, error instanceof Error ? error.message : error);
  }
}
