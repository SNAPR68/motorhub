/* Autovinci — Auto-Price Adjustment Agent
 * Suggests or auto-adjusts price for vehicles listed 30+ days.
 * Stays within dealer-set bounds. Never exceeds 10% reduction.
 */

import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";

interface PriceAdjustment {
  vehicleId: string;
  vehicleName: string;
  currentPrice: number;
  suggestedPrice: number;
  reductionPct: number;
  reason: string;
  daysListed: number;
  applied: boolean;
}

/** Calculate price adjustments for stale inventory (called by nightly cron) */
export async function suggestPriceAdjustments(dealerProfileId?: string): Promise<PriceAdjustment[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const where = {
    status: "AVAILABLE" as const,
    createdAt: { lt: thirtyDaysAgo },
    ...(dealerProfileId ? { dealerProfileId } : {}),
  };

  const staleVehicles = await db.vehicle.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      priceDisplay: true,
      createdAt: true,
      dealerProfileId: true,
      _count: { select: { leads: true, wishlists: true } },
    },
    take: 30,
  });

  // Get dealer auto-pricing preferences
  const dealerPrefs = new Map<string, { enabled: boolean; maxReduction: number }>();
  if (staleVehicles.length > 0) {
    const dpIds = [...new Set(staleVehicles.map((v) => v.dealerProfileId))];
    const prefs = await db.dealerPreference.findMany({
      where: { dealerProfileId: { in: dpIds } },
    });
    for (const p of prefs) {
      const auto = (p.automation as Record<string, unknown>) ?? {};
      dealerPrefs.set(p.dealerProfileId, {
        enabled: auto.autoPricing === true,
        maxReduction: typeof auto.maxPriceReduction === "number" ? auto.maxPriceReduction : 5,
      });
    }
  }

  const adjustments: PriceAdjustment[] = [];

  for (const vehicle of staleVehicles) {
    const daysListed = Math.floor((Date.now() - vehicle.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const hasInterest = vehicle._count.leads > 0 || vehicle._count.wishlists > 0;
    const pref = dealerPrefs.get(vehicle.dealerProfileId);

    // Calculate suggested reduction
    let reductionPct = 0;
    let reason = "";

    if (vehicle.createdAt < ninetyDaysAgo && !hasInterest) {
      reductionPct = 8;
      reason = `Listed ${daysListed} days with no inquiries. Significant price reduction recommended.`;
    } else if (vehicle.createdAt < sixtyDaysAgo && !hasInterest) {
      reductionPct = 5;
      reason = `Listed ${daysListed} days with no inquiries. Moderate price reduction suggested.`;
    } else if (vehicle.createdAt < thirtyDaysAgo) {
      reductionPct = hasInterest ? 2 : 3;
      reason = hasInterest
        ? `Listed ${daysListed} days with ${vehicle._count.leads} inquiries but no sale. Small adjustment may help close.`
        : `Listed ${daysListed} days. Slight reduction to boost visibility.`;
    }

    // Cap at dealer max or 10% global max
    const maxAllowed = pref ? Math.min(pref.maxReduction, 10) : 10;
    reductionPct = Math.min(reductionPct, maxAllowed);

    if (reductionPct === 0) continue;

    const suggestedPrice = Math.round(vehicle.price * (1 - reductionPct / 100));
    const shouldApply = pref?.enabled === true;

    if (shouldApply) {
      // Auto-apply the price adjustment
      const newDisplay = formatPriceDisplay(suggestedPrice);
      await db.vehicle.update({
        where: { id: vehicle.id },
        data: { price: suggestedPrice, priceDisplay: newDisplay },
      });

      emitEvent({
        type: "VEHICLE_SCORED",
        entityType: "Vehicle",
        entityId: vehicle.id,
        dealerProfileId: vehicle.dealerProfileId,
        metadata: {
          action: "AUTO_PRICE_ADJUST",
          previousPrice: vehicle.price,
          newPrice: suggestedPrice,
          reductionPct,
          reason,
        },
      });
    }

    adjustments.push({
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      currentPrice: vehicle.price,
      suggestedPrice,
      reductionPct,
      reason,
      daysListed,
      applied: shouldApply,
    });
  }

  // Notify dealers about suggestions (only for non-auto dealers)
  const dealerAdjustments = new Map<string, PriceAdjustment[]>();
  for (const adj of adjustments) {
    if (!adj.applied) {
      const dpId = staleVehicles.find((v) => v.id === adj.vehicleId)?.dealerProfileId;
      if (dpId) {
        if (!dealerAdjustments.has(dpId)) dealerAdjustments.set(dpId, []);
        dealerAdjustments.get(dpId)!.push(adj);
      }
    }
  }

  for (const [dpId, adjs] of dealerAdjustments) {
    const dealer = await db.dealerProfile.findUnique({
      where: { id: dpId },
      select: { userId: true },
    });
    if (dealer) {
      await db.notification.create({
        data: {
          userId: dealer.userId,
          title: "Price Adjustment Suggestions",
          message: `${adjs.length} vehicle${adjs.length > 1 ? "s" : ""} could benefit from a price reduction. Check your inventory for details.`,
          type: "VEHICLE",
        },
      });
    }
  }

  return adjustments;
}

function formatPriceDisplay(price: number): string {
  if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `Rs ${(price / 100000).toFixed(2)} Lakh`;
  return `Rs ${price.toLocaleString("en-IN")}`;
}
