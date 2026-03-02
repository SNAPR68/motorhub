/* POST /api/ai/description
 * Generates a premium AI marketing description for a vehicle.
 * Body: { vehicleId } OR direct fields { name, year, km, price, fuel, transmission, engine, power, mileage, features, location }
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { emitEvent } from "@/lib/events";
import { handleApiError } from "@/lib/api-error";
import { aiRequest } from "@/lib/ai-router";
import { parseBody, aiDescriptionSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = await parseBody(request, aiDescriptionSchema);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const body = parsed.data!;

    // Support passing vehicleId OR raw fields
    let vehicleData: Record<string, unknown> = body as Record<string, unknown>;
    if (body.vehicleId) {
      const vehicle = await db.vehicle.findUnique({
        where: { id: body.vehicleId },
        select: {
          name: true,
          year: true,
          km: true,
          price: true,
          fuel: true,
          transmission: true,
          engine: true,
          power: true,
          mileage: true,
          location: true,
          owner: true,
          category: true,
          features: true,
        },
      });
      if (!vehicle) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
      }
      vehicleData = vehicle as Record<string, unknown>;
    }

    const {
      name,
      year,
      km,
      price,
      fuel,
      transmission,
      engine,
      power,
      mileage,
      location,
      owner,
      category,
      features,
    } = vehicleData;

    // Format price for prompt
    const priceNum = Number(price) || 0;
    const priceDisplay =
      priceNum >= 10000000
        ? `₹${(priceNum / 10000000).toFixed(2)} Cr`
        : `₹${(priceNum / 100000).toFixed(1)}L`;

    // Format features for prompt
    type Feature = { key: string; label: string; available: boolean };
    const featureList =
      Array.isArray(features)
        ? (features as Feature[])
            .filter((f) => f.available)
            .map((f) => f.label)
            .slice(0, 6)
            .join(", ")
        : "";

    const prompt = `You are an expert automotive copywriter for a premium used car marketplace in India called Autovinci.

Write a compelling, premium 3–4 sentence marketing description for this vehicle listing. Be specific, confident, and persuasive. Use rupees (₹) for prices. Highlight the best features. End with a value statement. Do NOT use bullet points. Do NOT start with "Introducing". Write in third person.

Vehicle Details:
- Name: ${name}
- Year: ${year}
- Category: ${category || "Car"}
- Odometer: ${km} km
- Price: ${priceDisplay}
- Fuel: ${fuel}
- Transmission: ${transmission}
- Engine: ${engine || "N/A"}
- Power: ${power || "N/A"}
- Mileage: ${mileage || "N/A"}
- Owner: ${owner || "1st owner"}
- Location: ${location}
${featureList ? `- Key Features: ${featureList}` : ""}

Write only the description paragraph. No preamble, no quotation marks.`;

    const fallbackData = {
      name: String(name || ""),
      year: Number(year) || 2023,
      km: String(km || "0"),
      priceDisplay,
      fuel: String(fuel || "Petrol"),
      transmission: String(transmission || "Manual"),
      location: String(location || "India"),
      owner: String(owner || "1st owner"),
    };

    const result = await aiRequest({
      messages: [{ role: "user", content: prompt }],
      complexity: "MODERATE",
      maxTokens: 200,
    });

    const description = result.content ?? "";

    if (!description) {
      const fallback = buildFallback(fallbackData);
      return NextResponse.json({ description: fallback, generated: false });
    }

    // Persist description to vehicle if vehicleId was provided
    const persisted = !!(body.vehicleId && description);
    if (persisted) {
      await db.vehicle.update({
        where: { id: body.vehicleId },
        data: { description },
      });
    }

    emitEvent({
      type: "DESCRIPTION_GENERATED",
      entityType: "Vehicle",
      entityId: body.vehicleId || "inline",
      dealerProfileId: dealer.dealerProfileId,
      metadata: { tokensUsed: result.tokensUsed, persisted },
    });

    return NextResponse.json({ description, generated: true });
  } catch (error) {
    return handleApiError(error, "POST /api/ai/description");
  }
}

function buildFallback(v: {
  name: string;
  year: number;
  km: string;
  priceDisplay: string;
  fuel: string;
  transmission: string;
  location: string;
  owner: string;
}) {
  const kmNum = parseInt(v.km.replace(/,/g, "")) || 0;
  const kmNote =
    kmNum < 30000
      ? "low odometer reading"
      : kmNum < 70000
      ? "well-maintained"
      : "honest kilometres";

  return `The ${v.year} ${v.name} arrives with a ${kmNote} of ${v.km} km on the clock, making it a standout choice in the ${v.fuel} ${v.transmission.toLowerCase()} segment. Carefully maintained and sourced from a ${v.owner} in ${v.location}, this vehicle combines reliability with premium value. At ${v.priceDisplay}, it represents a compelling opportunity for buyers seeking quality without compromise. Book a test drive today and experience the difference firsthand.`;
}
