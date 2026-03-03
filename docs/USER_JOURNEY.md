# CaroBest — Complete User Journey Document

> **Purpose**: Team education + explainer video scripting
> **Audience**: Product, engineering, marketing, and content teams
> **Last updated**: March 2026

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [System Architecture (Block Diagram)](#2-system-architecture)
3. [Buyer Journey](#3-buyer-journey)
4. [Dealer Journey](#4-dealer-journey)
5. [Data Flow Architecture](#5-data-flow-architecture)
6. [AI Pipeline](#6-ai-pipeline)
7. [Event System & Agent Infrastructure](#7-event-system)
8. [Payment Flow](#8-payment-flow)
9. [Key Screens Reference](#9-key-screens)

---

## 1. Platform Overview

CaroBest is an AI-powered used car marketplace for India with two distinct user types:

```
+---------------------------------------------+
|              CAROBEST PLATFORM              |
|                                              |
|   +----------------+   +----------------+   |
|   |     BUYER      |   |     DEALER     |   |
|   |  (Consumer)    |   |  (Business)    |   |
|   |                |   |                |   |
|   |  Browse cars   |   |  List cars     |   |
|   |  Compare       |   |  Manage leads  |   |
|   |  Get finance   |   |  AI tools      |   |
|   |  Book services |   |  Analytics     |   |
|   |  Negotiate     |   |  Marketing     |   |
|   +-------+--------+   +--------+-------+   |
|           |                      |           |
|           v                      v           |
|   +--------------------------------------+   |
|   |          SHARED PLATFORM             |   |
|   |  Supabase Auth | Prisma ORM | AI    |   |
|   |  Events | Notifications | Payments  |   |
|   +--------------------------------------+   |
+---------------------------------------------+
```

**Business model**: Dealers pay monthly subscriptions (STARTER / GROWTH / ENTERPRISE) for access to DealerOS tools. Buyers use the platform for free.

---

## 2. System Architecture

### High-Level Block Diagram

```
+-------------------+     +-------------------+
|   BUYER BROWSER   |     |  DEALER BROWSER   |
|   (React 19 SPA)  |     |  (React 19 SPA)   |
+---------+---------+     +---------+---------+
          |                         |
          v                         v
+-------------------------------------------+
|          NEXT.JS APP ROUTER (v16)         |
|                                           |
|  +----------+  +-----------+  +---------+ |
|  | Pages    |  | API       |  | Middle- | |
|  | (SSR/    |  | Routes    |  | ware    | |
|  |  Static) |  | (/api/*)  |  | (Auth)  | |
|  +----------+  +-----+-----+  +---------+ |
|                       |                    |
+-------------------------------------------+
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
   +-----------+  +-----------+  +-----------+
   | SUPABASE  |  | OPENAI    |  | REPLICATE |
   | PostgreSQL|  | GPT-4o    |  | Stable    |
   | + Auth    |  | GPT-4o-   |  | Diffusion |
   | + Storage |  |   mini    |  | Rembg     |
   +-----------+  +-----------+  +-----------+
          |
          v
   +-----------+
   |  PRISMA   |
   |  ORM      |
   |  (20+     |
   |  models)  |
   +-----------+
```

### Request Flow

```
Browser --> useApi() hook --> fetch("/api/...") --> API Route Handler
                                                        |
                                            +-----------+-----------+
                                            |                       |
                                     Auth Check              Business Logic
                                     (Supabase)              (Prisma + AI)
                                            |                       |
                                            v                       v
                                     Return 401              Return JSON
                                     if no session           Response
```

---

## 3. Buyer Journey

### Journey Map Overview

```
AWARENESS        CONSIDERATION         DECISION          POST-PURCHASE
   |                  |                    |                   |
   v                  v                    v                   v
+--------+     +------------+      +------------+     +-----------+
|Landing |---->| Showroom   |----->| Vehicle    |---->| My Account|
|Page    |     | Browse     |      | Detail     |     | Garage    |
|        |     | Filter     |      | Compare    |     | Warranty  |
|        |     | Search     |      | Finance    |     | Documents |
+--------+     +------------+      | Negotiate  |     | Resale    |
                                   | Book       |     +-----------+
                                   +------------+
```

### Phase 1: Entry & Discovery

**Landing Page** (`/`)
- Hero section with search bar (brand/model/budget)
- Featured vehicles carousel
- Trust signals (vehicle count, dealer count, cities)
- Quick links to popular brands and body types

**Showroom** (`/showroom`)
- Grid of vehicle cards with price, year, km, location
- Filter sidebar: brand, model, budget range, fuel type, body type, year
- Sort: price low-high, price high-low, newest, popular
- Infinite scroll pagination
- Each card shows AI score badge (0-100)

```
+------------------------------------------+
|  SHOWROOM                    [Filter] [Sort]|
|                                            |
|  +----------+  +----------+  +----------+ |
|  | [Image]  |  | [Image]  |  | [Image]  | |
|  | Creta    |  | Nexon    |  | City     | |
|  | 2022     |  | 2023     |  | 2021     | |
|  | 8.5L     |  | 7.2L     |  | 5.8L     | |
|  | AI: 85   |  | AI: 92   |  | AI: 78   | |
|  | Delhi    |  | Mumbai   |  | Pune     | |
|  +----------+  +----------+  +----------+ |
|                                            |
|  +----------+  +----------+  +----------+ |
|  | [Image]  |  | [Image]  |  | [Image]  | |
|  | ...      |  | ...      |  | ...      | |
|  +----------+  +----------+  +----------+ |
+------------------------------------------+
```

### Phase 2: Vehicle Deep Dive

**Vehicle Detail Page** (`/vehicle/[id]`)
- Full-screen image gallery with swipe
- Price, EMI estimate, year, fuel, transmission, odometer
- AI-generated description (via `/api/ai/description`)
- Dealer info card with response time
- "Contact Dealer" CTA (creates Lead)
- "Add to Wishlist" heart icon
- Tabs: Overview, Specifications, Similar Cars

**Vehicle Passport** (`/vehicle/passport/[id]`)
- CaroBest's proprietary trust report
- Sections: Ownership history, service records, accident check, flood check, theft check
- Each section scored GREEN / YELLOW / RED
- QR code for sharing
- Deterministic generation from vehicle data (no external API needed)

```
VEHICLE PASSPORT FLOW:
Vehicle Detail --> [View Passport] --> Passport Page
                                          |
                                   +------+------+
                                   |      |      |
                                   v      v      v
                               Ownership  Service  Accident
                               History    Records  Check
                               (Green)    (Yellow) (Green)
```

**TrueCost Calculator** (`/vehicle/[id]/true-cost`)
- Shows TOTAL cost of ownership beyond sticker price
- Computed client-side via `computeTrueCost()`:
  - Registration & transfer fees
  - Insurance (1st year + renewal estimate)
  - Maintenance (based on brand/model averages)
  - Fuel cost (annual estimate based on avg driving)
  - Depreciation projection (3-year)
- Bar chart visualization comparing cost categories

**AI Negotiation Coach** (`/vehicle/[id]/negotiate`)
- Client-side AI that helps buyer negotiate
- Inputs: listed price, target price, vehicle condition notes
- Outputs: negotiation strategy, talking points, fair price range
- Based on market data + vehicle AI score

### Phase 2a: 360-Degree Virtual Tour

The Virtual Tour is one of CaroBest's most immersive buyer experiences. Three distinct tour modes serve different needs:

**Main Virtual Tour** (`/virtual-tour/[id]`) -- Primary Experience
- Drag-to-rotate panorama using multi-image horizontal strip (300% viewport width)
- Momentum scrolling with inertia physics (0.92x velocity decay per frame)
- Auto-rotate animation on initial page load
- Gyroscope support: tilt phone to pan (via DeviceOrientationEvent API)
- CRT scan line visual effect on load (retro aesthetic, fades after 3 seconds)
- Per-image contextual hotspots with label, category, and description
- Compass ring navigation: vertical pill buttons (one per image) for quick jumping
- Image thumbnail strip at bottom for gallery overview
- Top HUD: vehicle name, "360 VIEW" label, progress bar, gyro toggle, photo counter
- Fetches real vehicle data via `fetchVehicle(id)` from `/api/vehicles/[id]`
- Respects `vehicle.panoramaImageIdx` -- dealer-marked preferred starting image
- CTA buttons: "Full Specs" and "Book Visit"

```
VIRTUAL TOUR FLOW (Buyer):
Dealer Uploads --> Marks Panorama --> Buyer Opens --> Drag to --> View      --> Book
Photos             Angle              Virtual Tour    Rotate      Hotspots     Visit
                   (API)              /virtual-tour   (or tilt    (per-image   /appointments
                                     /[id]           phone)      annotations)
```

```
VIRTUAL TOUR SCREEN LAYOUT:
+------------------------------------------+
|  [Back]  Hyundai Creta SX   360° VIEW   |
|          ======================== [Gyro]  |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |     << DRAG TO EXPLORE >>         |  |  o  <-- Compass
|  |                                    |  |  o      Ring
|  |   [Hotspot: LED DRLs]            |  |  o      (one dot
|  |                                    |  |  .      per image)
|  |          [Hotspot: Alloy Wheels]  |  |  .
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
|  [thumb1] [thumb2] [thumb3] [thumb4]     |
|                                          |
|  [Full Specs]           [Book Visit]     |
+------------------------------------------+
```

**Interior Viewer** (`/virtual-tour/viewer/[id]`)
- Full-screen background image viewer (single-image swap per click)
- 3 interactive hotspots: Dashboard, Steering Wheel, Leather Upholstery
- Zoom controls (+/-) for accessibility
- Tag pills at bottom: Dashboard, Leather Quality, Audio Setup, Ambient Light
- Image sidebar thumbnails for switching views
- AI Concierge link for questions

**Brand/Model 360 View** (`/[brand]/[model]/360-view`)
- Generic brand/model template page (e.g., every Hyundai Creta)
- Exterior and Interior toggle modes
- Hotspot annotations for key features
- Links to image gallery

```
VIRTUAL TOUR ROUTES:
+------------------+------------------------+-------------------------+
| Route            | Purpose                | Data Source              |
+------------------+------------------------+-------------------------+
| /virtual-tour/   | Individual vehicle     | Real API: fetchVehicle() |
|   [id]           | drag-to-rotate tour    | vehicle.images[]         |
+------------------+------------------------+-------------------------+
| /virtual-tour/   | Interior-focused       | Real API: fetchVehicle() |
|   viewer/[id]    | image viewer           | vehicle.images[]         |
+------------------+------------------------+-------------------------+
| /[brand]/[model] | Brand/model template   | Static hotspot data      |
|   /360-view      | with hotspot overlays  | (no API fetch)           |
+------------------+------------------------+-------------------------+
```

**Dealer Side: Panorama Management**
- Dealers mark one gallery image as the "hero" panoramic angle
- API: `PATCH /api/vehicles/[id]/panorama` with `{ panoramaImageIdx: 2 }`
- Client function: `setPanoramaImage(vehicleId, index)`
- DB field: `Vehicle.panoramaImageIdx` (optional Int)
- Virtual tour auto-scrolls to this image on load

```
END-TO-END PANORAMA FLOW:
1. Dealer uploads vehicle with multiple photos (up to 20)
2. Dealer opens inventory, selects vehicle, marks best angle as panorama
3. PATCH /api/vehicles/[id]/panorama --> panoramaImageIdx saved to DB
4. Buyer opens /virtual-tour/[id]
5. Frontend fetches vehicle --> gets images[] + panoramaImageIdx
6. Tour auto-jumps to panorama index on load (400ms delay for layout)
7. User drags left/right to pan through all images
8. Hotspots appear contextually per image
9. Can toggle gyroscope for phone tilt control
10. CTA: "Full Specs" or "Book Visit" to continue journey
```

### Phase 3: Comparison & Decision

**Compare** (`/compare`)
- Side-by-side comparison of 2-3 vehicles
- Specification rows: engine, power, torque, mileage, safety features
- Price comparison with EMI estimates
- AI score comparison
- "Winner" badge on best value

```
COMPARE PAGE LAYOUT:
+------------+------------+------------+
|  Creta SX  |  Nexon XZ  |  City ZX   |
+------------+------------+------------+
|  8.5L      |  7.2L      |  9.1L      |
|  2022      |  2023      |  2022      |
|  45K km    |  28K km    |  38K km    |
|  AI: 85    |  AI: 92    |  AI: 78    |
+------------+------------+------------+
|  1.5L      |  1.2L      |  1.5L      |
|  Diesel    |  Petrol    |  Petrol    |
|  115 HP    |  120 HP    |  121 HP    |
+------------+------------+------------+
|  [Contact] |  [Contact] |  [Contact] |
+------------+------------+------------+
```

**Wishlist** (`/wishlist`)
- Saved vehicles with price drop alerts
- Quick actions: compare, contact, remove
- When a vehicle gets 3+ wishlists, it's marked "Trending" (agent-driven)

### Phase 4: Engagement & Booking

**Contact Flow**:
```
Buyer clicks "Contact Dealer"
        |
        v
  Lead created (POST /api/leads)
        |
        +--> PlatformEvent: LEAD_CREATED
        |
        +--> Agent: Auto-analyze sentiment
        +--> Agent: Auto-generate reply (if dealer opted in)
        +--> Agent: Schedule follow-up reminders
        |
        v
  Dealer notified via Notification
        |
        v
  Conversation in Lead Messages
  (Buyer and Dealer exchange messages)
```

**Appointment Booking** (`/vehicle/[id]` > Schedule Visit)
- Calendar date/time picker
- Location: dealer showroom or buyer's location
- Creates Appointment record linked to Lead

### Phase 5: Finance & Insurance Tools

**Car Loan Calculator** (`/car-loan/emi-calculator`)
- EMI computation: principal, rate, tenure
- Shows total interest, total payment, monthly breakdown
- Amortization schedule table

**Car Insurance** (`/car-insurance/*`)
- Quote comparison tool
- Coverage types: comprehensive, third-party, standalone OD
- Premium estimator based on vehicle details

**Fuel Price** (`/fuel-price`)
- City-wise fuel prices (petrol, diesel, CNG)
- Historical price trend charts

**RTO Tools** (`/rto`)
- Registration fee calculator
- State-wise RTO office directory
- Required documents checklist

### Phase 6: Trade-In & Services

**SwapDirect** (`/swap`)
- Trade-in valuation: enter current car details
- AI-powered instant valuation (via `/api/ai/valuation`)
- Match with available vehicles in desired price range
- Creates ServiceBooking for swap inspection

```
SWAP FLOW:
Enter Car Details --> AI Valuation --> See Trade Value
                                           |
                                    Browse Matches
                                    (vehicles in budget
                                     after swap credit)
                                           |
                                    Book Swap Deal
                                    (ServiceBooking created)
```

**InstantRC** (`/rc-transfer`)
- RC transfer service booking
- Document upload checklist
- Status tracking

**LiveCondition** (`/inspection`)
- Professional inspection booking
- 200-point checklist
- Creates ServiceBooking with type=INSPECTION

**CrossState Express** (`/cross-state`)
- Cross-state vehicle transfer service
- NOC, re-registration guidance
- Creates ServiceBooking with type=CROSS_STATE

### Phase 7: Post-Purchase Hub

**My Account** (`/my-account/*`)

```
MY ACCOUNT SECTIONS:
+------------------------------------------+
|  My Garage (/my-account/garage)          |
|  - Owned vehicles list                   |
|  - Service reminders                     |
|  - Insurance renewal alerts              |
+------------------------------------------+
|  Warranty (/my-account/warranty)         |
|  - Active warranty cards                 |
|  - Claim history                         |
|  - Coverage details                      |
+------------------------------------------+
|  Documents (/my-account/documents)       |
|  - RC copy, insurance, PUC              |
|  - Upload / download                     |
+------------------------------------------+
|  Orders (/my-account/orders)             |
|  - Purchase history                      |
|  - Service bookings                      |
+------------------------------------------+
|  Resale (/my-account/resale)             |
|  - List car for resale                   |
|  - AI valuation                          |
|  - Market demand insights                |
+------------------------------------------+
```

### Phase 8: AI Concierge

**Concierge** (`/concierge`)
- Chat-based AI assistant for buyers
- Context-aware: remembers conversation history via `ConciergeMemory` table
- Can recommend vehicles, answer questions, guide through process
- Powered by OpenAI with conversation memory

### Phase 9: Consumer Marketplace (SEO Pages)

```
SEO ROUTE TREE:
/used-cars/[city]                    --> Used cars in Delhi
/used-cars/[city]/[brand]            --> Used Hyundai in Delhi
/[brand]                             --> Hyundai cars
/[brand]/[model]                     --> Hyundai Creta
/[brand]/[model]/price               --> Creta price
/[brand]/[model]/mileage             --> Creta mileage
/[brand]/[model]/specifications      --> Creta specs
/[brand]/[model]/[variant]           --> Creta SX (O)
/dealers/[city]                      --> Dealers in Mumbai
/car-news                            --> News articles
/car-news/[slug]                     --> Individual article
```

These are statically generated pages (167 at build time) optimized for search engines. They pull data from the car catalog database (12 brands, 17 models, 24 variants).

### Buyer Navigation

```
BOTTOM NAV (Mobile):
+----------+----------+----------+----------+----------+
|  Home    | Showroom | Wishlist |Concierge |  Account |
| (house)  | (store)  | (heart)  | (chat)   | (person) |
+----------+----------+----------+----------+----------+
```

---

## 4. Dealer Journey

### Journey Map Overview

```
ONBOARDING        DAILY OPS          GROWTH            INTELLIGENCE
    |                 |                  |                   |
    v                 v                  v                   v
+--------+     +------------+     +-----------+     +-----------+
| Signup |---->| Dashboard  |---->| AI Studio |---->| Analytics |
| Login  |     | Inventory  |     | Photo     |     | Reports   |
| Profile|     | Leads      |     | Content   |     | Benchmarks|
| Plans  |     | Messages   |     | Marketing |     | Intel     |
+--------+     +------------+     +-----------+     +-----------+
```

### Phase 1: Onboarding

**Dealer Signup** (`/dealer/signup`)
- 5-step registration wizard:
  1. Business details (name, type, city)
  2. Contact info (phone, email, WhatsApp)
  3. Documents upload (GSTIN, trade license)
  4. Showroom photos upload
  5. Plan selection (STARTER / GROWTH / ENTERPRISE)

```
SIGNUP FLOW:
Step 1          Step 2          Step 3          Step 4          Step 5
Business   -->  Contact    -->  Documents  -->  Photos    -->  Plan
Details         Info            Upload          Upload         Selection
                                                                  |
                                                                  v
                                                            Razorpay
                                                            Payment
                                                                  |
                                                                  v
                                                            Dashboard
```

**Subscription Plans** (`/plans`)
```
+------------------+------------------+------------------+
|    STARTER       |     GROWTH       |   ENTERPRISE     |
|    Free          |    2,999/mo      |   9,999/mo       |
|                  |                  |                   |
|  5 listings      |  50 listings     |  Unlimited       |
|  Basic leads     |  AI tools        |  Everything      |
|  Email support   |  Priority        |  Dedicated       |
|                  |  Analytics       |  White-label      |
|                  |                  |  API access       |
|  [Current]       |  [Upgrade]       |  [Contact]        |
+------------------+------------------+------------------+
```

### Phase 2: Dashboard & Daily Operations

**Dashboard** (`/dashboard`)
- Key metrics at a glance:
  - Active listings count
  - New leads today
  - Response time average
  - Conversion rate
  - Revenue this month
- Recent activity feed
- Quick actions: Add Vehicle, View Leads, Check Messages
- AI Agent Activity section (auto-replies sent, sentiments analyzed)

```
DASHBOARD LAYOUT:
+------------------------------------------+
|  Welcome, [Dealer Name]                  |
|                                          |
|  +--------+  +--------+  +--------+     |
|  | 24     |  | 8      |  | 2.1h   |     |
|  | Active |  | New    |  | Avg    |     |
|  | Cars   |  | Leads  |  | Reply  |     |
|  +--------+  +--------+  +--------+     |
|                                          |
|  Recent Activity                         |
|  - New lead: Rahul (Creta) - 2h ago    |
|  - AI auto-replied to Priya - 3h ago   |
|  - Vehicle sold: Swift - yesterday      |
|                                          |
|  AI Agent Activity (Today)              |
|  - Auto-replies: 5                       |
|  - Sentiments analyzed: 12              |
|  - Follow-ups scheduled: 3              |
+------------------------------------------+
```

**Inventory Management** (`/dashboard/inventory`)
- Vehicle list with status badges (AVAILABLE / SOLD / RESERVED)
- Bulk actions: mark sold, update price, archive
- Each vehicle shows: image, name, price, AI score, views, leads count
- "Add Vehicle" button with full form

**Add/Edit Vehicle** (`/dashboard/inventory/add` or `/dashboard/inventory/[id]`)
```
VEHICLE CREATION FLOW:
+------------------------------------------+
| 1. BASIC INFO                            |
|    Brand, Model, Variant, Year           |
|    Registration Number, Color            |
|                                          |
| 2. PRICING                               |
|    Listed Price, Display Text            |
|                                          |
| 3. SPECIFICATIONS                        |
|    Fuel, Transmission, KM driven         |
|    Engine, Owners, Insurance validity    |
|                                          |
| 4. PHOTOS (up to 20)                     |
|    Drag-drop upload to Supabase Storage  |
|                                          |
| 5. AI ENHANCEMENT (auto)                 |
|    --> AI Description generated          |
|    --> AI Score calculated               |
|    --> Event: VEHICLE_CREATED emitted    |
|                                          |
| 6. PANORAMA (optional)                   |
|    Dealer marks best angle for 360 tour  |
|    PATCH /api/vehicles/[id]/panorama     |
|    --> panoramaImageIdx saved to DB      |
|    --> Buyers see this image first in    |
|       /virtual-tour/[id]                 |
+------------------------------------------+
```

### Phase 3: Lead Management

**Leads List** (`/dashboard/leads`)
- All incoming leads with filters: status, source, sentiment
- Status badges: NEW (blue), CONTACTED (yellow), QUALIFIED (green), CLOSED_WON (purple), CLOSED_LOST (red)
- Sentiment badges: HOT (red fire), WARM (orange), COOL (blue)
- Source tracking: WEBSITE, FACEBOOK, INSTAGRAM, WHATSAPP, WALKIN, REFERRAL
- Quick actions: call, message, change status

**Lead Detail** (`/dashboard/leads/[id]`)
- Full conversation thread (manual + auto messages)
- Buyer info: name, phone, email, interested vehicle
- Sentiment analysis result with confidence score
- Intent signals: keywords detected, urgency indicators
- Status change dropdown
- Message composer (text input + send)

```
LEAD LIFECYCLE:

  Buyer contacts dealer
         |
         v
  +------+------+
  | LEAD CREATED |  --> Agent: Auto-sentiment
  | Status: NEW  |  --> Agent: Auto-reply (if opted in)
  +------+------+  --> Agent: Schedule follow-ups
         |
   Dealer responds
         |
         v
  +------+-------+
  | CONTACTED    |  --> Agent: Record response in memory
  +------+-------+  --> Agent: Adjust follow-up schedule
         |
   Buyer qualifies
         |
         v
  +------+-------+
  | QUALIFIED    |  --> Track conversion funnel
  +------+-------+
         |
    +----+----+
    |         |
    v         v
+--------+ +--------+
|CLOSED  | |CLOSED  |
|WON     | |LOST    |
|(Deal!) | |(Lost)  |
+--------+ +--------+
```

### Phase 4: AI Studio

**Photo Studio** (`/dashboard/studio/photos`)
- AI-powered photo enhancement for vehicle listings
- Tools available:
  1. **Background Remove**: Remove messy backgrounds (Replicate rembg)
  2. **Mood Application**: Apply professional lighting styles:
     - Golden Hour (warm amber)
     - Midnight (deep blue city)
     - Bloom (soft ethereal)
     - Vivid (saturated, punchy)
     - Cinematic (teal & orange)
     - Matte (flat editorial)

```
PHOTO STUDIO FLOW:
Upload Photo --> Choose Tool
                    |
         +----------+-----------+
         |                      |
    Background              Apply Mood
    Remove                      |
         |              Select Style
         v              (6 options)
    Clean cutout             |
    (transparent BG)         v
         |           Styled photo
         |           (new lighting)
         v                   v
    Download / Use in Listing
```

**Content Studio** (`/dashboard/studio/content`)
- AI Description Generator: auto-write vehicle listings
- Quick Draft: generate marketing copy for any purpose
- Notification Enhancer: improve notification text

**Reel Creator** (`/dashboard/studio/reels`)
- AI Script Generator: create video scripts for vehicle promos
- Text-to-Speech: convert scripts to voiceover audio
- Exports for social media (Instagram Reels, YouTube Shorts)

**Creative Suggestions** (`/dashboard/studio/creative`)
- AI-powered marketing ideas based on inventory
- Campaign templates: seasonal, festive, clearance
- Social media post suggestions with copy

### Phase 5: Analytics & Intelligence

**Performance Analytics** (`/dashboard/analytics`)
- Inventory health: listed vs sold vs reserved
- Lead funnel: new > contacted > qualified > closed
- Revenue tracking: monthly with MoM growth
- Top 5 vehicles by views/leads
- Source breakdown: which channels bring most leads

**Reports** (`/dashboard/analytics/reports`)
- Monthly performance reports
- Downloadable PDF format
- MoM growth percentages
- Lead source effectiveness

```
ANALYTICS DASHBOARD:
+------------------------------------------+
|  PERFORMANCE THIS MONTH                  |
|                                          |
|  Revenue        Leads         Conversion |
|  12.5L          48            18%        |
|  +23% MoM       +15% MoM     +2% MoM   |
|                                          |
|  LEAD FUNNEL                             |
|  New: 48 --> Contacted: 32 --> Qual: 12  |
|                              --> Won: 8  |
|                              --> Lost: 4 |
|                                          |
|  TOP VEHICLES                            |
|  1. Creta SX 2022 - 12 leads           |
|  2. Nexon XZ 2023 - 8 leads            |
|  3. City ZX 2022 - 6 leads             |
|                                          |
|  LEAD SOURCES                            |
|  Website: 40%  WhatsApp: 25%            |
|  Facebook: 20% Walk-in: 15%            |
+------------------------------------------+
```

**Dealer Benchmarks** (`/dashboard/analytics` > Benchmarks section)
- Cross-dealer comparison (anonymized)
- "Your avg response time: 4.2h. Platform avg: 2.1h."
- "Your conversion rate: 18%. Top dealers: 32%."
- Network effect: more dealers = more accurate benchmarks

**Dealer Health Score**
- Proprietary composite metric (CaroBest Score)
- Factors: response time, conversion rate, AI score avg, listing quality, reviews
- Shown on dealer's public profile
- Incentivizes platform engagement

**DemandPulse Intelligence** (`/intelligence/*`)
- Market demand heatmaps
- Price trend analysis
- Competitor pricing intelligence
- Demand forecasting
- Best time to list analysis
- Depreciation curves

### Phase 6: Settings & Preferences

**Dealer Settings** (`/dashboard/settings`)
```
SETTINGS SECTIONS:
+------------------------------------------+
| Profile                                  |
|  - Business name, logo, description     |
|  - Contact details, WhatsApp            |
|  - Showroom address + map               |
+------------------------------------------+
| Preferences                              |
|  - Auto-reply: ON/OFF                   |
|  - Notification preferences             |
|  - Working hours                        |
|  - Language preference                   |
+------------------------------------------+
| Subscription                             |
|  - Current plan + usage                 |
|  - Upgrade/downgrade                    |
|  - Billing history                      |
+------------------------------------------+
| Team (Enterprise only)                   |
|  - Add/remove team members              |
|  - Role assignment                      |
+------------------------------------------+
```

### Dealer Navigation

```
BOTTOM NAV (Mobile):
+----------+----------+----------+----------+----------+
|Dashboard | Inventory| Leads    | Studio   | Settings |
| (grid)   | (car)    | (people) | (wand)   | (gear)   |
+----------+----------+----------+----------+----------+

SIDEBAR (Desktop):
+------------------+
| [Logo]           |
| Dashboard        |
| Inventory        |
| Leads            |
| AI Studio        |
|   - Photos       |
|   - Content      |
|   - Reels        |
|   - Creative     |
| Analytics        |
|   - Performance  |
|   - Reports      |
| Intelligence     |
| Marketing        |
| Settings         |
+------------------+
```

---

## 5. Data Flow Architecture

### Frontend Data Fetching Pattern

```
COMPONENT (React 19)
    |
    | useApi(fetchVehicles, [filters])
    |
    v
USE_API HOOK
    |
    | Manages: loading, data, error states
    | Auto-retry on 5xx (1 retry, 2s delay)
    |
    v
FETCH FUNCTION (src/lib/api.ts)
    |
    | fetch("/api/vehicles?status=AVAILABLE")
    | Adds auth headers from Supabase session
    |
    v
API ROUTE (src/app/api/vehicles/route.ts)
    |
    | 1. Auth check (Supabase getUser)
    | 2. Zod validation (POST/PATCH)
    | 3. Business logic
    |
    v
PRISMA ORM (src/lib/db.ts)
    |
    | Typed queries with relations
    |
    v
SUPABASE POSTGRESQL
```

### Key Database Models (Relationships)

```
User (Supabase Auth)
  |
  +---> DealerProfile (1:1)
  |       |
  |       +---> Vehicle[] (1:many)
  |       |       |
  |       |       +---> VehicleImage[] (1:many)
  |       |
  |       +---> Lead[] (1:many)
  |       |       |
  |       |       +---> LeadMessage[] (1:many)
  |       |       +---> Appointment[] (1:many)
  |       |
  |       +---> Subscription (1:1)
  |       +---> DealerPreference (1:1)
  |       +---> Notification[] (1:many)
  |       +---> Activity[] (1:many)
  |       +---> PlatformEvent[] (1:many)
  |
  +---> Wishlist[] (1:many) --> Vehicle
  +---> ConciergeMemory[] (1:many)
  +---> ServiceBooking[] (1:many)

Standalone:
  CarBrand --> CarModel[] --> CarVariant[]
  PlatformEvent (append-only audit log)
```

### API Routes Map

```
AUTH
  POST /api/auth/dealer-signup     Create dealer account
  GET  /api/auth/me                Current user + profile

VEHICLES
  GET  /api/vehicles               List (paginated, filtered)
  POST /api/vehicles               Create (dealer auth required)
  GET  /api/vehicles/[id]          Single vehicle detail
  PATCH /api/vehicles/[id]         Update vehicle
  PATCH /api/vehicles/[id]/panorama Set panorama image index

LEADS
  GET  /api/leads                  List dealer's leads
  POST /api/leads                  Create lead (buyer inquiry)
  GET  /api/leads/[id]             Lead detail + messages
  PATCH /api/leads/[id]            Update lead status
  GET  /api/leads/[id]/messages    Message thread
  POST /api/leads/[id]/messages    Send message

DEALER
  GET  /api/dealer/profile         Dealer profile
  PATCH /api/dealer/profile        Update profile
  GET  /api/dealer/preferences     Dealer preferences
  PATCH /api/dealer/preferences    Update preferences

AI (11 endpoints)
  POST /api/ai/description         Generate vehicle description
  POST /api/ai/sentiment           Analyze lead sentiment
  POST /api/ai/valuation           Vehicle valuation
  POST /api/ai/smart-reply         AI reply suggestions
  POST /api/ai/quick-draft         Marketing copy draft
  POST /api/ai/notification-enhance  Enhance notification text
  POST /api/ai/creative/suggestions  Marketing ideas
  POST /api/ai/reel/script         Video script generation
  POST /api/ai/reel/tts            Text-to-speech
  POST /api/ai/photo/background-remove  Remove photo BG
  POST /api/ai/photo/apply-mood    Apply lighting mood

ANALYTICS
  GET /api/analytics/performance   Dashboard metrics
  GET /api/analytics/reports       Monthly reports
  GET /api/analytics/benchmarks    Cross-dealer benchmarks
  GET /api/analytics/health-score  Dealer health score

INTELLIGENCE
  GET /api/intelligence/market-feed  Market insights

PAYMENTS
  POST /api/payments/create-order  Create Razorpay order
  POST /api/payments/verify        Verify payment

SERVICES
  POST /api/service-bookings       Book service (swap/RC/inspection)

WISHLIST
  GET  /api/wishlist               Buyer's wishlist
  POST /api/wishlist               Add/remove from wishlist

NOTIFICATIONS
  GET  /api/notifications          List notifications
  PATCH /api/notifications         Mark read

ADMIN
  GET /api/admin/overview          Platform stats
  GET /api/admin/alerts            System health + errors
  Various CRUD for admin operations
```

---

## 6. AI Pipeline

### AI Request Flow (Centralized)

```
Any AI API Route
      |
      v
aiRequest() [src/lib/ai-router.ts]
      |
      | 1. Determine complexity (SIMPLE/MODERATE/COMPLEX)
      | 2. Select model:
      |    - SIMPLE --> gpt-4o-mini (fast, cheap)
      |    - MODERATE --> gpt-4o-mini
      |    - COMPLEX --> gpt-4o (powerful)
      | 3. Execute with retry:
      |    - 3 attempts
      |    - Exponential backoff (500ms base, 8s cap)
      |    - 30% jitter
      |
      v
OpenAI API
      |
      v
Return { content, model, tokensUsed, latencyMs, retries }
```

### Circuit Breaker Protection

```
AI Call Attempt
      |
      v
+-- Circuit Breaker Check --+
|                            |
| State: CLOSED              | State: OPEN
| (normal)                   | (failing)
|   |                        |   |
|   v                        |   v
| Execute AI call            | Return null
|   |                        | (use fallback)
|   +-- Success --> Reset    |
|   |                        | After 30s:
|   +-- Failure --> Count    | State: HALF_OPEN
|       (3 failures in 5min  |   |
|        --> OPEN)           |   v
|                            | Try one call
+----------------------------+   |
                              Success --> CLOSED
                              Failure --> OPEN
```

### AI Features Map

```
+--------------------+-------------------+------------------+
| FEATURE            | AI MODEL          | FALLBACK         |
+--------------------+-------------------+------------------+
| Description Gen    | GPT-4o-mini       | Template text    |
| Sentiment Analysis | GPT-4o-mini       | Msg count heuristic|
| Valuation          | GPT-4o            | Deterministic calc|
| Smart Reply        | GPT-4o            | 3 canned replies |
| Quick Draft        | GPT-4o-mini       | Template from intent|
| Notification       | GPT-4o-mini       | Original text    |
| Creative Ideas     | GPT-4o-mini       | 3 static ideas   |
| Reel Script        | GPT-4o-mini       | Template script  |
| TTS                | OpenAI TTS        | 503 error        |
| Background Remove  | Replicate (rembg) | Original image   |
| Mood Application   | Replicate (SD)    | Original image   |
| Concierge Chat     | GPT-4o            | Apology message  |
+--------------------+-------------------+------------------+
```

---

## 7. Event System & Agent Infrastructure

### Event Emission

Every significant action in the platform emits a `PlatformEvent`:

```
API Route (e.g., POST /api/leads)
      |
      | Business logic completes
      |
      v
emitEvent({
  type: "LEAD_CREATED",
  entityType: "Lead",
  entityId: lead.id,
  dealerProfileId: dealer.id,
  metadata: { source, buyerName }
})
      |
      +---> 1. Persist to PlatformEvent table (fire-and-forget)
      |
      +---> 2. processEvent() (fire-and-forget)
                  |
                  v
            Agent actions triggered
```

### Event Types (16 total)

```
LEAD_CREATED          --> Auto-sentiment + auto-reply + follow-ups
LEAD_STATUS_CHANGED   --> Record agent memory if CONTACTED
LEAD_MESSAGE_SENT     --> Track communication patterns
SENTIMENT_ANALYZED    --> Notify dealer if HOT lead
DESCRIPTION_GENERATED --> Track AI usage
VEHICLE_CREATED       --> Track inventory growth
VEHICLE_WISHLISTED    --> Check trending threshold
VEHICLE_MODERATED     --> Admin audit trail
SUBSCRIPTION_ACTIVATED --> Welcome sequence
AUTO_REPLY_SENT       --> Agent memory learning
VEHICLE_SCORED        --> Track AI scoring
TRENDING_BADGE_SET    --> Badge assignment audit
CIRCUIT_BREAKER_OPEN  --> Admin alert
API_ERROR             --> Error monitoring
FOLLOW_UP_SENT        --> Follow-up tracking
PRICE_ADJUSTED        --> Price change audit
```

### Agent Action Map

```
EVENT                    AGENT ACTIONS
-----                    -------------
LEAD_CREATED      -----> [1] Auto-analyze sentiment (OpenAI)
                         [2] Auto-reply to lead (if dealer opted in)
                         [3] Schedule follow-up reminders
                         [4] 10% chance: check unresponsive leads batch

SENTIMENT = HOT   -----> [1] Create urgent Notification for dealer

LEAD CONTACTED    -----> [1] Record in agent memory (Thompson Sampling)
                         [2] Improve future auto-reply template selection

VEHICLE WISHLISTED ----> [1] Check if vehicle has 3+ wishlists
                         [2] If yes: mark as Trending
```

### Nightly Cron (Runs daily at 2 AM IST)

```
/api/cron/nightly-scoring
      |
      v
  1. Re-score vehicles with stale AI scores (>7 days)
  2. Re-analyze leads with no sentiment update (>48h)
  3. Check overdue follow-ups and send reminders
  4. Auto-adjust pricing suggestions based on demand
  5. Take daily analytics snapshot
  6. Log all actions as Activity records
```

---

## 8. Payment Flow

### Razorpay Integration

```
SUBSCRIPTION PURCHASE FLOW:

Dealer selects plan (/plans)
      |
      v
POST /api/payments/create-order
      |
      | Create Razorpay order
      | Amount based on plan
      |
      v
Razorpay checkout opens (client-side)
      |
      | Dealer enters card/UPI/netbanking
      |
      v
Payment processed by Razorpay
      |
      v
POST /api/payments/verify
      |
      | 1. Verify payment signature (HMAC)
      | 2. Create/update Subscription record
      | 3. Update DealerProfile plan
      | 4. Emit SUBSCRIPTION_ACTIVATED event
      |
      v
Dealer redirected to dashboard
(plan now active)
```

**Demo Mode**: If `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are not set, the payment flow runs in demo mode (simulated success).

---

## 9. Key Screens Reference

All UI designs are available in the `stitch/` directory. Each subfolder contains:
- `code.html` — Full HTML/Tailwind implementation
- `screen.png` — Visual screenshot

### Buyer Screens

| Screen | Stitch Folder | Description |
|--------|--------------|-------------|
| Landing | `stitch/homepage/` | Hero + featured cars + trust signals |
| Showroom | `stitch/showroom/` | Vehicle grid + filters |
| Vehicle Detail | `stitch/vehicle-detail/` | Full car page |
| Compare | `stitch/compare/` | Side-by-side comparison |
| Wishlist | `stitch/wishlist/` | Saved vehicles |
| Concierge | `stitch/concierge/` | AI chat interface |
| My Account | `stitch/my-account/` | Account sections |
| Car Loan | `stitch/car-loan/` | EMI calculator |
| Swap | `stitch/swap/` | Trade-in flow |

### Dealer Screens

| Screen | Stitch Folder | Description |
|--------|--------------|-------------|
| Dashboard | `stitch/dashboard/` | Metrics + activity |
| Inventory | `stitch/inventory/` | Vehicle list + management |
| Leads | `stitch/leads/` | Lead list + detail |
| AI Studio | `stitch/studio/` | Photo + content tools |
| Analytics | `stitch/analytics/` | Charts + reports |
| Intelligence | `stitch/intelligence/` | Market data |
| Settings | `stitch/settings/` | Profile + preferences |
| Plans | `stitch/plans/` | Subscription selection |

---

## Appendix A: Authentication Flow

```
BUYER AUTH:
  /login/buyer --> Supabase Magic Link or Google OAuth
  --> Session cookie set
  --> Redirect to /showroom or previous page

DEALER AUTH:
  /login/dealer --> Supabase Email/Password
  --> Session cookie set
  --> Middleware checks /dashboard/* routes
  --> AuthGuard component wraps dealer pages
  --> Redirect to /dealer/login if no session

SESSION MANAGEMENT:
  Supabase middleware refreshes session on every request
  Protected routes: /dashboard/*, /my-account/*
  API routes check auth: supabase.auth.getUser()
```

## Appendix B: Notification System

```
NOTIFICATION TYPES:
  LEAD     --> "New lead from Rahul interested in Creta"
  SYSTEM   --> "Your subscription renews in 3 days"
  AI       --> "AI auto-replied to 5 leads while you were away"
  ALERT    --> "AI service temporarily unavailable"

DELIVERY:
  In-app bell icon with unread count badge
  Database: Notification table with read/unread status
  Real-time: Polling on dashboard (every 30s)
```

## Appendix C: Error Handling Architecture

```
ERROR FLOW:

API Route Error
      |
      v
ApiError class (typed errors)
      |
      | Code: VALIDATION_ERROR | AUTH_REQUIRED | NOT_FOUND |
      |       DB_ERROR | AI_UNAVAILABLE | PAYMENT_FAILED
      |
      v
handleApiError() --> Consistent JSON response
      |
      +---> Sentry.captureException() (server-side)
      +---> PlatformEvent: API_ERROR (for monitoring)

Client Error
      |
      v
useApi hook
      |
      | errorCode from API response
      | Auto-retry for 5xx (1 retry, 2s delay)
      |
      v
ApiErrorState component
      |
      | 401 --> "Session expired. Please log in again."
      | 403 --> "You don't have access."
      | 500 --> "Something went wrong. Retrying..."
      | Network --> "You appear to be offline."

Global Error Boundary
      |
      v
Sentry.captureException() (client-side)
+ Friendly fallback UI
```

---

*Document prepared for CaroBest team. Reference stitch/ designs for visual screen mockups.*
