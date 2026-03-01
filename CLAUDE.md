# Autovinci — Claude Code Instructions

## Project Overview
AI-powered used car marketplace for India. Dual-user: **Buyers** and **Dealers**.

- **Stack**: Next.js 16.1.6 App Router, TypeScript 5, React 19, Tailwind CSS v4, Prisma 7.4.1, Supabase (PostgreSQL + Auth), OpenAI, Zustand 5, Framer Motion 12
- **Root**: `/Users/autovinci-web`
- **Design source of truth**: `stitch/` — 75+ HTML/Tailwind screens (each folder has `code.html` + `screen.png`)
- **Key docs**: `PRD.md`, `docs/FORENSIC_AUDIT.md`, `docs/ROUTE_AUDIT.md`
- **Bible docs** (external, source of truth for features):
  - `~/Downloads/autovinci-web/Autovinci structure.md` — complete route map, buyer journey, SEO strategy
  - `~/Downloads/autovinci-web/cardekho-gap-analysis.md` — 10 killer features, competitive moat

## Architecture Rules
- All pages `max-w-md mx-auto` (mobile-first, 390px target)
- Client pages: `useApi(fn, [])` hook from `src/lib/hooks/use-api.ts`
- Data flow: `src/lib/api.ts` → `/api/*` routes → Prisma → Supabase
- Dealer pages: wrap with `AuthGuard` → redirects to `/dealer/login`
- Icons: `<MaterialIcon name="..." />` (Material Symbols Outlined)
- Skeletons: `<SkeletonCard variant="dark" />`
- Bottom navs on mobile: always add `md:hidden` (desktop sidebar takes over)
- No emojis in code or responses

## File Patterns
```
src/app/[route]/page.tsx     — page component
src/app/api/[route]/route.ts — API handler
src/lib/api.ts               — all fetch functions + TypeScript interfaces
src/lib/hooks/use-api.ts     — useApi(fn, deps) hook
src/lib/db.ts                — Prisma client singleton
src/components/              — shared components
stitch/[name]/code.html      — design reference
```

## DB Schema (key models)
- `User` → `DealerProfile` (one-to-one; plan: STARTER/GROWTH/ENTERPRISE)
- `Vehicle` (status: AVAILABLE/SOLD/RESERVED; aiScore 0-100; priceDisplay)
- `Lead` (status: NEW/CONTACTED/QUALIFIED/CLOSED_WON/CLOSED_LOST; sentimentLabel: HOT/WARM/COOL; source: WEBSITE/FACEBOOK/INSTAGRAM/WHATSAPP/WALKIN/REFERRAL)
- `LeadMessage` (type: MANUAL/AUTO)
- `Notification`, `Activity`, `Appointment`, `Subscription`

## Component Library
```
DealerAppShell      — dealer layout (bottom nav + sidebar)
DealerPageLayout    — dealer page wrapper
BuyerPageLayout     — buyer page wrapper
AuthGuard           — protects dealer pages
MaterialIcon        — Google Material Symbols icon
VehicleCard         — car listing card
LeadCard            — lead list item
SkeletonCard        — loading placeholder
PageHeader          — page title bar
ImageUploader       — drag-drop image upload
```

## API Routes Available
```
GET  /api/analytics/performance   → inventory health, lead sentiment, revenue, top 5 vehicles
GET  /api/analytics/reports       → monthly stats + MoM growth, source breakdown
GET  /api/auth/me                 → current user + dealerProfile
POST /api/auth/dealer-signup      → create dealer account (Zod-validated)
GET  /api/vehicles                → paginated vehicle list (?status=AVAILABLE)
GET  /api/vehicles/[id]           → single vehicle
GET  /api/leads                   → leads list
GET  /api/leads/[id]              → lead + messages
GET  /api/dealer/profile          → dealer profile
GET  /api/stores                  → store list
GET  /api/wishlist                → buyer wishlist
```

## Build Status (Feb 2026)

### Route Coverage: 204+ pages, 96% structure.md alignment
- **Dealer pages**: 30+ routes (dashboard, inventory, leads, analytics, intelligence, settings, studio, marketing)
- **Buyer pages**: 80+ routes (showroom, vehicle/[id], compare, wishlist, concierge, VIP, my-account/*)
- **Consumer marketplace**: 60+ SEO routes ([brand]/[model]/*, used-cars/[city], dealers/[city], car-news, etc.)
- **Finance tools**: car-loan/*, car-insurance/*, fuel-price, rto
- **Auth**: login/buyer, login/dealer, register, forgot-password, dealer/signup (5-step)

### 10 Killer Features (from gap-analysis bible)
| # | Feature | Route | Status |
|---|---------|-------|--------|
| 1 | VehiclePassport | /vehicle/passport/[id] | BUILT (real API data) |
| 2 | TrueCost Engine | /vehicle/[id]/true-cost | BUILT (client-side computation) |
| 3 | InstantRC | /rc-transfer | BUILT (API-wired) |
| 4 | DealerOS | /dashboard/* | BUILT (full API wiring) |
| 5 | SwapDirect | /swap | BUILT (API-wired) |
| 6 | LiveCondition | /inspection | BUILT (API-wired) |
| 7 | CrossState Express | /cross-state | BUILT (API-wired) |
| 8 | PostPurchase Hub | /my-account/garage,warranty,documents | BUILT |
| 9 | AI NegotiationCoach | /vehicle/[id]/negotiate | BUILT (client-side) |
| 10 | DemandPulse | /intelligence/* | BUILT (6 sub-pages) |

### Sprint Priorities (current)
1. Wire static killer features to real APIs (InstantRC, SwapDirect, LiveCondition, CrossState)
2. AI integrations (Replicate for photo studio, OpenAI for content/smart-reply)
3. Razorpay subscription payments for /plans
4. Connect car catalog pages to real DB (currently using static car-catalog.ts)
5. Production polish + Vercel deploy

## Commands
```bash
npm run dev          # dev at http://localhost:3000
npm run build        # Prisma generate + Next.js build
npm run db:migrate   # Prisma migrations
npm run db:seed      # seed database
npm run db:studio    # Prisma Studio GUI
```

## Vercel Env Vars
**Required:**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`

**Optional (feature-specific):**
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — Razorpay payments (falls back to demo mode without these)
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` — WhatsApp messaging integration
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` — PostHog analytics (disabled if absent)

## Key Conventions
- Always read stitch design (`stitch/[name]/code.html`) before building a page
- Always add `'use client'` at top of pages that use hooks/state
- Use `useApi` for data fetching, not raw `fetch` in components
- Zod validation on all API POST handlers
- Return `NextResponse.json({ error }, { status })` on errors
- Dealer pages check auth via `AuthGuard` component
- Import order: React → Next → external → internal → types
