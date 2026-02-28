/* Autovinci — Zod Validation Schemas for API Input */

import { z } from "zod";

// ── Vehicle Schemas ──

export const createVehicleSchema = z.object({
  name: z.string().min(2, "Vehicle name must be at least 2 characters").max(200),
  year: z.number().int().min(2000).max(new Date().getFullYear() + 1),
  price: z.number().positive("Price must be positive"),
  category: z.enum(["SUV", "SEDAN", "HATCHBACK", "EV", "LUXURY"]),
  fuel: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "CNG"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC", "CVT", "AMT"]),
  engine: z.string().max(100).default(""),
  power: z.string().max(50).default(""),
  mileage: z.string().max(50).default("N/A"),
  km: z.string().max(50).default("0"),
  location: z.string().max(200).default(""),
  owner: z.string().max(50).default("1st"),
  description: z.string().max(2000).optional(),
  images: z.array(z.string().url()).max(20).default([]),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.enum(["AVAILABLE", "IN_REVIEW", "RESERVED", "SOLD", "ARCHIVED"]).optional(),
  badge: z.string().max(50).nullable().optional(),
  aiScore: z.number().min(0).max(100).nullable().optional(),
});

// ── Lead Schemas ──

export const createLeadSchema = z.object({
  buyerName: z.string().min(2, "Name must be at least 2 characters").max(200),
  source: z.enum(["WEBSITE", "FACEBOOK", "INSTAGRAM", "WHATSAPP", "WALKIN", "REFERRAL", "OTHER"]),
  vehicleId: z.string().optional(),
  message: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  location: z.string().max(200).optional(),
  budget: z.string().max(50).optional(),
  sentiment: z.number().min(0).max(100).default(50),
  sentimentLabel: z.enum(["HOT", "WARM", "COOL"]).default("WARM"),
});

export const updateLeadSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "FOLLOW_UP", "TEST_DRIVE", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]).optional(),
  sentiment: z.number().min(0).max(100).optional(),
  sentimentLabel: z.enum(["HOT", "WARM", "COOL"]).optional(),
  message: z.string().max(2000).optional(),
  phone: z.string().max(20).optional(),
  location: z.string().max(200).optional(),
  budget: z.string().max(50).optional(),
});

// ── Message Schema ──

export const createMessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(5000),
  role: z.enum(["AI", "USER"]).default("USER"),
  type: z.enum(["AUTO", "MANUAL"]).default("MANUAL"),
});

// ── Store Schemas ──

export const createStoreSchema = z.object({
  name: z.string().min(2).max(200),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  phone: z.string().max(20).optional(),
  manager: z.string().max(200).optional(),
});

export const updateStoreSchema = createStoreSchema.partial().extend({
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

// ── Appointment Schema ──

export const createAppointmentSchema = z.object({
  buyerName: z.string().min(2).max(200),
  buyerPhone: z.string().max(20).optional(),
  scheduledAt: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date format"),
  duration: z.number().int().min(15).max(480).default(60),
  location: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  leadId: z.string().optional(),
  vehicleId: z.string().optional(),
});

// ── Team Schema ──

export const inviteTeamMemberSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email("Invalid email address"),
  role: z.string().max(100).default("Sales Executive"),
});

// ── Auth Schemas ──

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  role: z.enum(["BUYER", "DEALER"]).default("BUYER"),
});

// ── Dealer Profile Schema ──

export const updateDealerProfileSchema = z.object({
  dealershipName: z.string().min(2).max(200).optional(),
  gstin: z.string().max(20).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

// ── Wishlist Schema ──

export const wishlistSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID required"),
});

// ── Utility: Parse and validate request body ──

export async function parseBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      return { data: null, error: errors };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: "Invalid JSON body" };
  }
}
