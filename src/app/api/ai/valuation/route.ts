/* POST /api/ai/valuation
 * AI-powered used car valuation using OpenAI.
 * Body: { brand, model, year, km, fuel, transmission, owner, city, condition }
 * Returns: { estimatedPrice, priceRange, factors, marketDemand }
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brand, model, year, km, fuel, transmission, owner, city, condition } = body;

    if (!brand || !model || !year) {
      return NextResponse.json({ error: "Brand, model, and year are required" }, { status: 400 });
    }

    const prompt = `You are an expert Indian used car market analyst with deep knowledge of used car prices across all Indian cities.

Given the following car details, provide a realistic market valuation in Indian Rupees (Lakhs).

Car Details:
- Brand: ${brand}
- Model: ${model}
- Year: ${year}
- KM Driven: ${km || "30,000"}
- Fuel Type: ${fuel || "Petrol"}
- Transmission: ${transmission || "Manual"}
- Owner: ${owner || "1st Owner"}
- City: ${city || "Delhi"}
- Condition: ${condition || "Good"}

Respond ONLY with a JSON object (no markdown, no explanation) in this exact format:
{
  "estimatedPrice": 8.5,
  "low": 7.8,
  "high": 9.2,
  "marketLow": 7.5,
  "marketHigh": 9.5,
  "offer": 8.7,
  "depreciationRate": 12,
  "marketDemand": "High",
  "factors": [
    {"name": "Brand Value", "impact": "+0.5L", "positive": true},
    {"name": "Low KM", "impact": "+0.3L", "positive": true},
    {"name": "City Demand", "impact": "+0.2L", "positive": true},
    {"name": "Age Depreciation", "impact": "-1.2L", "positive": false}
  ]
}

All prices must be in Lakhs (e.g., 8.5 means 8.5 Lakh). Be realistic based on actual Indian market prices for ${year} ${brand} ${model}. Factor in the city demand (metro cities have higher prices). Consider the condition and ownership history.`;

    // Fallback computation when no API key
    if (!OPENAI_API_KEY) {
      const val = computeFallback({ brand, model, year, km, fuel, condition, city, owner });
      return NextResponse.json({ ...val, generated: false });
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
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const val = computeFallback({ brand, model, year, km, fuel, condition, city, owner });
      return NextResponse.json({ ...val, generated: false });
    }

    const json = await response.json();
    const raw = json.choices?.[0]?.message?.content?.trim() ?? "";

    try {
      // Extract JSON from response (handle potential markdown wrapping)
      const jsonStr = raw.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);
      return NextResponse.json({ ...parsed, generated: true });
    } catch {
      // If JSON parsing fails, use fallback
      const val = computeFallback({ brand, model, year, km, fuel, condition, city, owner });
      return NextResponse.json({ ...val, generated: false });
    }
  } catch (error) {
    console.error("POST /api/ai/valuation error:", error);
    return NextResponse.json({ error: "Failed to generate valuation" }, { status: 500 });
  }
}

// Deterministic fallback when OpenAI is unavailable
function computeFallback(v: {
  brand: string;
  model: string;
  year: string;
  km: string;
  fuel: string;
  condition: string;
  city: string;
  owner: string;
}) {
  const BASE: Record<string, number> = {
    "Maruti Suzuki": 4.8, Hyundai: 5.5, Tata: 5.2, Mahindra: 6.0,
    Honda: 5.8, Toyota: 7.2, Kia: 6.5, Ford: 4.5, Volkswagen: 5.0,
    MG: 7.0, Renault: 3.8, Nissan: 3.5,
  };

  const base = BASE[v.brand] ?? 5.0;
  const currentYear = new Date().getFullYear();
  const age = currentYear - (parseInt(v.year) || 2020);
  const depRate = age <= 1 ? 0.85 : age <= 3 ? 0.7 : age <= 5 ? 0.55 : age <= 8 ? 0.4 : 0.3;
  let price = base * depRate;

  const kmNum = parseInt(v.km?.replace(/,/g, "") || "30000");
  if (kmNum > 50000) price *= 0.92;
  if (kmNum > 100000) price *= 0.85;

  if (v.condition === "Excellent") price *= 1.05;
  if (v.condition === "Fair") price *= 0.9;

  const metros = ["delhi", "mumbai", "bangalore", "bengaluru", "hyderabad", "pune", "chennai"];
  if (metros.some((c) => v.city.toLowerCase().includes(c))) price *= 1.03;

  const est = Math.max(price, 0.5);
  return {
    estimatedPrice: +est.toFixed(1),
    low: +(est * 0.93).toFixed(1),
    high: +(est * 1.07).toFixed(1),
    marketLow: +(est * 0.9).toFixed(1),
    marketHigh: +(est * 1.1).toFixed(1),
    offer: +(est * 1.02).toFixed(1),
    depreciationRate: Math.round((1 - depRate) * 100),
    marketDemand: est > 6 ? "High" : est > 3 ? "Medium" : "Low",
    factors: [
      { name: "Brand Value", impact: base > 5.5 ? "+0.5L" : "+0.2L", positive: true },
      { name: "Condition", impact: v.condition === "Excellent" ? "+0.3L" : v.condition === "Fair" ? "-0.5L" : "+0.0L", positive: v.condition !== "Fair" },
      { name: "KM Driven", impact: kmNum < 30000 ? "+0.3L" : kmNum > 80000 ? "-0.5L" : "+0.0L", positive: kmNum < 50000 },
      { name: "Age", impact: `-${(age * 0.4).toFixed(1)}L`, positive: false },
    ],
  };
}
