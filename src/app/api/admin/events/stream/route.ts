/* Autovinci — Real-Time Event Feed (Server-Sent Events)
 * Streams PlatformEvents to admin dashboard in real-time.
 * Polls DB every 2 seconds for new events since last check.
 * Admin-only: requires admin auth.
 */

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      let lastEventTime = new Date();

      // Send initial heartbeat
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", timestamp: lastEventTime.toISOString() })}\n\n`));

      const poll = async () => {
        if (isClosed) return;

        try {
          const events = await db.platformEvent.findMany({
            where: { createdAt: { gt: lastEventTime } },
            orderBy: { createdAt: "asc" },
            take: 50,
            select: {
              id: true,
              type: true,
              entityType: true,
              entityId: true,
              dealerProfileId: true,
              metadata: true,
              createdAt: true,
            },
          });

          for (const event of events) {
            if (isClosed) return;
            const data = JSON.stringify({
              type: "event",
              event: {
                id: event.id,
                type: event.type,
                entityType: event.entityType,
                entityId: event.entityId,
                dealerProfileId: event.dealerProfileId,
                metadata: event.metadata,
                createdAt: event.createdAt.toISOString(),
              },
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            lastEventTime = event.createdAt;
          }

          // Send heartbeat every 30 seconds (every 15 polls) to keep connection alive
          if (!isClosed) {
            controller.enqueue(encoder.encode(`: heartbeat ${new Date().toISOString()}\n\n`));
          }
        } catch (error) {
          console.error("[SSE] Poll error:", error instanceof Error ? error.message : error);
          if (!isClosed) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Poll failed" })}\n\n`));
          }
        }

        if (!isClosed) {
          setTimeout(poll, 2000);
        }
      };

      // Start polling
      poll();

      // Clean up on abort
      req.signal.addEventListener("abort", () => {
        isClosed = true;
        try { controller.close(); } catch { /* already closed */ }
      });
    },
    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
