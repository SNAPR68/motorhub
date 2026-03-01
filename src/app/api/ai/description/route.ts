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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Support passing vehicleId OR raw fields
    let vehicleData: Record<string, unknown> = body;
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

    // If no OpenAI key, return a smart fallback
    if (!OPENAI_API_KEY) {
      const fallback = buildFallback({
        name: String(name || ""),
        year: Number(year) || 2023,
        km: String(km || "0"),
        priceDisplay,
        fuel: String(fuel || "Petrol"),
        transmission: String(transmission || "Manual"),
        location: String(location || "India"),
        owner: String(owner || "1st owner"),
      });
      return NextResponse.json({ description: fallback, generated: false });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.75,
      }),
    });

    if (!response.ok) {
      const fallback = buildFallback({
        name: String(name || ""),
        year: Number(year) || 2023,
        km: String(km || "0"),
        priceDisplay,
        fuel: String(fuel || "Petrol"),
        transmission: String(transmission || "Manual"),
        location: String(location || "India"),
        owner: String(owner || "1st owner"),
      });
      return NextResponse.json({ description: fallback, generated: false });
    }

    const json = await response.json();
    const description = json.choices?.[0]?.message?.content?.trim() ?? "";

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
      metadata: { aiScore: json.usage?.total_tokens ?? null, persisted },
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
