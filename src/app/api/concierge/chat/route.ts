/* POST /api/concierge/chat — AI Concierge powered by OpenAI
 * Falls back to keyword matching if OPENAI_API_KEY is not set.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

interface VehicleCard {
  id: string;
  name: string;
  year: number;
  price: string;
  image: string;
  fuel: string;
  km: string;
}

interface ChatResponse {
  text: string;
  vehicles?: VehicleCard[];
}

// Fetch up to 6 available vehicles for context
async function fetchInventoryContext(): Promise<string> {
  const vehicles = await db.vehicle.findMany({
    where: { status: "AVAILABLE" },
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      year: true,
      priceDisplay: true,
      category: true,
      fuel: true,
      transmission: true,
      km: true,
      location: true,
    },
  });

  if (vehicles.length === 0) return "No vehicles currently in inventory.";

  return vehicles
    .map(
      (v) =>
        `- ${v.name} (${v.year}): ${v.priceDisplay}, ${v.category}, ${v.fuel}, ${v.transmission}, ${v.km} km, ${v.location}`
    )
    .join("\n");
}

// Fetch matching vehicles for response cards
async function fetchMatchingVehicles(filters: {
  search?: string;
  category?: string;
  maxPrice?: number;
}): Promise<VehicleCard[]> {
  const where: Record<string, unknown> = { status: "AVAILABLE" };

  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.maxPrice) {
    where.price = { lte: filters.maxPrice };
  }

  const vehicles = await db.vehicle.findMany({
    where,
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, year: true, priceDisplay: true, images: true, fuel: true, km: true },
  });

  return vehicles.map((v) => ({
    id: v.id,
    name: v.name,
    year: v.year,
    price: v.priceDisplay,
    image: v.images[0] ?? "",
    fuel: v.fuel,
    km: v.km,
  }));
}

// Simple keyword fallback (used when no OpenAI key)
function extractKeywords(msg: string) {
  const lower = msg.toLowerCase();
  const brands = ["maruti", "suzuki", "swift", "hyundai", "creta", "tata", "nexon", "mahindra", "xuv", "toyota", "fortuner", "honda", "city", "kia", "seltos", "brezza"];
  const foundBrand = brands.find((b) => lower.includes(b));
  let category: string | undefined;
  if (lower.includes("suv")) category = "SUV";
  else if (lower.includes("sedan")) category = "SEDAN";
  else if (lower.includes("hatchback")) category = "HATCHBACK";
  else if (lower.includes("electric") || lower.includes("ev")) category = "EV";
  let maxPrice: number | undefined;
  const priceMatch = lower.match(/(\d+)\s*(?:lakh|l\b|lac)/);
  if (priceMatch) maxPrice = parseInt(priceMatch[1], 10) * 100000;
  const crMatch = lower.match(/(\d+)\s*(?:crore|cr\b)/);
  if (crMatch) maxPrice = parseInt(crMatch[1], 10) * 10000000;
  return { brand: foundBrand, category, maxPrice };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message?.trim();
    const history: { role: "user" | "assistant"; content: string }[] = body.history ?? [];

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;

    // ── OpenAI path ──
    if (openaiKey) {
      const inventoryContext = await fetchInventoryContext();

      const systemPrompt = `You are Aria, an intelligent AI car concierge for Autovinci — India's premium AI-powered used car marketplace. You help buyers find their perfect car and assist dealers.

CURRENT INVENTORY:
${inventoryContext}

INSTRUCTIONS:
- Be warm, helpful, and concise. Max 3 sentences per response.
- If the user asks about a specific car/budget/type, mention relevant cars from the inventory above by name.
- If they ask about scheduling a test drive, tell them to tap the car card to book.
- At the end of your response, output a JSON block on a new line like this (or omit if not relevant):
FILTERS: {"search": "creta", "category": "SUV", "maxPrice": 1000000}
- Only include filters relevant to the user's query. Omit filters that don't apply.
- Always respond in English. Be concise and helpful.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.slice(-6),
        { role: "user" as const, content: message },
      ];

      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!openaiRes.ok) {
        const err = await openaiRes.text();
        console.error("OpenAI error:", err);
        throw new Error("OpenAI request failed");
      }

      const openaiData = await openaiRes.json();
      const rawText: string = openaiData.choices?.[0]?.message?.content ?? "";

      // Parse out FILTERS block if present
      let aiText = rawText;
      let vehicles: VehicleCard[] | undefined;

      const filterMatch = rawText.match(/FILTERS:\s*(\{[\s\S]*?\})/);
      if (filterMatch) {
        aiText = rawText.replace(/FILTERS:\s*\{[\s\S]*?\}/, "").trim();
        try {
          const filters = JSON.parse(filterMatch[1]);
          vehicles = await fetchMatchingVehicles(filters);
        } catch {
          // ignore parse error
        }
      }

      return NextResponse.json({ response: { text: aiText, vehicles } });
    }

    // ── Keyword fallback (no OpenAI key) ──
    const keywords = extractKeywords(message);
    const vehicles = await fetchMatchingVehicles({
      search: keywords.brand,
      category: keywords.category,
      maxPrice: keywords.maxPrice,
    });

    let text = "";
    if (vehicles.length > 0) {
      text = `I found ${vehicles.length} car${vehicles.length > 1 ? "s" : ""} matching your query. Here are the best options:`;
    } else if (keywords.brand || keywords.category || keywords.maxPrice) {
      text = `I couldn't find exact matches right now, but our inventory is updated daily. Would you like me to alert you when something matches?`;
    } else {
      text = `Hi! I'm Aria, your Autovinci AI concierge. Tell me your budget, preferred brand, or car type and I'll find the best options for you!`;
    }

    return NextResponse.json({ response: { text, vehicles: vehicles.length > 0 ? vehicles : undefined } });
  } catch (error) {
    console.error("POST /api/concierge/chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
