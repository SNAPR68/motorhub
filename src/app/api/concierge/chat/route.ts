/* POST /api/concierge/chat — AI Concierge MVP (keyword-based smart responses)
 *
 * Accepts { message } and returns a template response with matching vehicles.
 * This is a placeholder until real LLM integration is added.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

interface ChatResponse {
  text: string;
  vehicles?: Array<{
    id: string;
    name: string;
    year: number;
    price: string;
    image: string;
    fuel: string;
    km: string;
  }>;
}

// Simple keyword extraction
function extractKeywords(msg: string): {
  brand?: string;
  category?: string;
  maxPrice?: number;
  intent: "search" | "compare" | "budget" | "general";
} {
  const lower = msg.toLowerCase();

  // Detect brands
  const brands = ["maruti", "suzuki", "swift", "hyundai", "creta", "tata", "nexon", "mahindra", "xuv", "toyota", "fortuner", "honda", "city", "kia", "seltos", "brezza"];
  const foundBrand = brands.find((b) => lower.includes(b));

  // Detect categories
  let category: string | undefined;
  if (lower.includes("suv")) category = "SUV";
  else if (lower.includes("sedan")) category = "SEDAN";
  else if (lower.includes("hatchback")) category = "HATCHBACK";
  else if (lower.includes("electric") || lower.includes("ev")) category = "EV";

  // Detect price
  let maxPrice: number | undefined;
  const priceMatch = lower.match(/(\d+)\s*(?:lakh|l\b|lac)/);
  if (priceMatch) maxPrice = parseInt(priceMatch[1], 10) * 100000;
  const crMatch = lower.match(/(\d+)\s*(?:crore|cr\b)/);
  if (crMatch) maxPrice = parseInt(crMatch[1], 10) * 10000000;

  // Detect intent
  let intent: "search" | "compare" | "budget" | "general" = "general";
  if (lower.includes("compare") || lower.includes("vs") || lower.includes("versus")) intent = "compare";
  else if (lower.includes("budget") || lower.includes("under") || lower.includes("below") || maxPrice) intent = "budget";
  else if (foundBrand || category || lower.includes("show") || lower.includes("find") || lower.includes("search")) intent = "search";

  return { brand: foundBrand, category, maxPrice, intent };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const keywords = extractKeywords(message);
    let response: ChatResponse;

    // Search for matching vehicles
    const where: Record<string, unknown> = { status: "AVAILABLE" };
    if (keywords.brand) {
      where.name = { contains: keywords.brand, mode: "insensitive" };
    }
    if (keywords.category) {
      where.category = keywords.category;
    }
    if (keywords.maxPrice) {
      where.price = { lte: keywords.maxPrice };
    }

    const matchingVehicles = await db.vehicle.findMany({
      where,
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        year: true,
        priceDisplay: true,
        images: true,
        fuel: true,
        km: true,
      },
    });

    const vehicleCards = matchingVehicles.map((v) => ({
      id: v.id,
      name: v.name,
      year: v.year,
      price: v.priceDisplay,
      image: v.images[0] ?? "",
      fuel: v.fuel,
      km: v.km,
    }));

    // Generate response based on intent
    switch (keywords.intent) {
      case "search":
        if (vehicleCards.length > 0) {
          response = {
            text: `I found ${vehicleCards.length} ${vehicleCards.length === 1 ? "car" : "cars"} matching your search. Here are the best options:`,
            vehicles: vehicleCards,
          };
        } else {
          response = {
            text: `I couldn't find exact matches right now, but I'm constantly updating our inventory. Would you like me to set up an alert when matching cars are listed? You can also try browsing our full showroom.`,
          };
        }
        break;

      case "budget":
        if (vehicleCards.length > 0) {
          const budgetLabel = keywords.maxPrice
            ? `under ₹${(keywords.maxPrice / 100000).toFixed(0)} Lakh`
            : "in your budget";
          response = {
            text: `Great choice! Here are ${vehicleCards.length} verified cars ${budgetLabel}. Each one has been AI-inspected for quality:`,
            vehicles: vehicleCards,
          };
        } else {
          response = {
            text: `I don't have cars in that exact budget range at the moment. Would you like to see options in a slightly higher range, or should I alert you when something comes up?`,
          };
        }
        break;

      case "compare":
        response = {
          text: `To compare vehicles, you can add up to 3 cars to your comparison list. Would you like me to suggest some popular comparisons, or do you have specific models in mind?`,
          vehicles: vehicleCards.length > 0 ? vehicleCards : undefined,
        };
        break;

      default:
        // General greeting / help
        if (vehicleCards.length > 0) {
          response = {
            text: `Welcome to Autovinci! I'm your AI concierge. Here are some of our latest listings. You can ask me about any car — budget, specifications, comparisons, or availability:`,
            vehicles: vehicleCards,
          };
        } else {
          response = {
            text: `Hi! I'm your Autovinci AI concierge. I can help you:\n\n• Find cars by brand, budget, or type\n• Compare vehicles side by side\n• Check availability and pricing\n• Schedule test drives\n\nWhat are you looking for today?`,
          };
        }
        break;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("POST /api/concierge/chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
