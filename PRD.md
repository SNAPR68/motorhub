# AUTOVINCI — Product Requirements Document (PRD)

> AI-Powered Used Car Marketplace for India — The CarDekho Killer
> Version: 1.0 | Last Updated: 2026-02-23

---

## 1. PRODUCT VISION

Autovinci is an **AI-powered used car buy/sell platform for the Indian market** — a direct competitor to CarDekho, Cars24, Spinny, and OLX Autos. It differentiates through:

- **AI Photo Enhancement** — Background removal, studio lighting, HDR, ray tracing for car photos
- **AI 360° Virtual Tours** — Interactive 3D views with hotspots, ambient lighting controls
- **AI Content Auto-Generation** — Auto-create Instagram reels, Facebook posts, marketing copy from vehicle data
- **AI Concierge** — Natural language car search, comparison, budget matching
- **AI Smart Reply** — Auto-generate lead responses in professional/friendly/urgency tones
- **AI Market Intelligence** — Price prediction, demand heatmaps, scarcity index
- **AI Lead Scoring** — Sentiment analysis (HOT/WARM/COOL) with automated follow-up

**Two user types:**
- **Buyers** — Search, compare, wishlist, reserve, get AI recommendations
- **Dealers** — List inventory, manage leads, create marketing content, track analytics

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 16.1.6 (App Router) | ✅ Done |
| Language | TypeScript 5, React 19 | ✅ Done |
| Styling | Tailwind CSS v4 | ✅ Done |
| Database | PostgreSQL via Supabase (Mumbai ap-south-1) | ✅ Done |
| ORM | Prisma 7.4.1 with @prisma/adapter-pg | ✅ Done |
| Auth | Supabase Auth (email/password + Google OAuth) | ✅ Done |
| Storage | Supabase Storage (vehicle images, dealer logos) | ✅ Done |
| State | Zustand 5 (auth-store, ui-store, dealer-store, toast-store) | ✅ Done |
| Animation | Framer Motion 12 | ✅ Done |
| Payments | Razorpay (Indian market) | ⬜ Not Started |
| Monitoring | Sentry 10 (client + server + edge) | ✅ Done |
| Analytics | PostHog | ✅ Done |
| AI/ML | OpenAI / Replicate / Stability AI | ⬜ Not Started |
| Deployment | Vercel | ⬜ Not Started |

---

## 3. DATABASE SCHEMA (13 Models)

All models live in `prisma/schema.prisma` and are deployed to Supabase PostgreSQL.

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | App user (buyer or dealer) | authId, email, name, role (BUYER/DEALER), phone, avatarUrl |
| **DealerProfile** | Dealer business profile (1:1 with User) | dealershipName, dealershipId, gstin, city, state, plan |
| **StoreLocation** | Physical showroom locations | name, address, city, phone, manager, status |
| **Vehicle** | Car listings | name, year, price, status, category, fuel, transmission, engine, power, mileage, km, aiScore, images[], features (JSON) |
| **Lead** | Sales leads | buyerName, source, sentiment, sentimentLabel (HOT/WARM/COOL), status, assignedTo |
| **LeadMessage** | Lead conversation timeline | leadId, role (AI/USER/SYSTEM), text, type (AUTO/MANUAL) |
| **Appointment** | Test drives & meetings | scheduledAt, duration, status, location, notes |
| **Wishlist** | Buyer saved vehicles | userId, vehicleId (compound unique) |
| **TeamMember** | Dealer team | name, role, email, status (ACTIVE/INVITED/INACTIVE) |
| **Subscription** | Razorpay subscription | plan, status, razorpaySubscriptionId, currentPeriodStart/End |
| **Notification** | User notifications | title, message, type, read |
| **Activity** | Dealer activity feed | title, description, type (SUCCESS/WARNING/INFO/AUTO) |

### Enums
- VehicleStatus: AVAILABLE, IN_REVIEW, RESERVED, SOLD, ARCHIVED
- VehicleCategory: SUV, SEDAN, HATCHBACK, EV, LUXURY
- FuelType: PETROL, DIESEL, ELECTRIC, HYBRID, CNG
- TransmissionType: MANUAL, AUTOMATIC, CVT, AMT
- LeadStatus: NEW, CONTACTED, FOLLOW_UP, TEST_DRIVE, NEGOTIATION, CLOSED_WON, CLOSED_LOST
- LeadSource: WEBSITE, FACEBOOK, INSTAGRAM, WHATSAPP, WALKIN, REFERRAL, OTHER
- AppointmentStatus: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW

---

## 4. COMPLETE PAGE LIST (70 Screens from Stitch Designs)

Every page below has a pixel-perfect HTML/Tailwind design in the `/stitch` folder. The "Stitch" column shows the source design folder name. The "Status" column shows current implementation state.

### Legend
- ✅ **LIVE** = Page exists + wired to real API
- 🟡 **STATIC** = Page exists with correct UI but uses hardcoded/mock data, no API
- 🔴 **MISSING** = No page.tsx exists yet
- 🟢 **CUSTOM** = Web page exists but was built independently (no stitch design)

---

### 4.1 BUYER PAGES (23 screens)

| # | Page | Route | Stitch Design | Status | Description |
|---|------|-------|---------------|--------|-------------|
| 1 | **Home / Marketplace** | `/` | (custom — no stitch) | 🟢 CUSTOM+LIVE | CarDekho-style marketplace: search, categories, budget filters, featured cars, popular brands |
| 2 | **Showroom / Browse** | `/showroom` | (custom — no stitch) | 🟢 CUSTOM+LIVE | Vehicle search & browse with filters, category pills, sort, 2-col grid |
| 3 | **Vehicle Detail** | `/vehicle/[id]` | `luxury_digital_showroom_(client_view)` | ✅ LIVE | Full vehicle detail: gallery, specs, dealer info, similar cars, AI concierge tab |
| 4 | **Vehicle Showcase** | `/showcase/[id]` | `premium_vehicle_showcase` | ✅ LIVE | Dealer-side vehicle detail with promote/contact actions |
| 5 | **Vehicle Storyboard** | `/storyboard/[id]` | `cinematic_vehicle_storyboard` | ✅ LIVE | Cinematic multi-section scroll narrative for a vehicle |
| 6 | **Virtual Tour** | `/virtual-tour/[id]` | `ai_virtual_tour_experience` | ✅ LIVE | Interactive 360° interior view with hotspots, spec tabs |
| 7 | **Virtual Tour Viewer** | `/virtual-tour/viewer/[id]` | `ai_virtual_tour_viewer` | 🔴 MISSING | Advanced 360° with quality settings, ambient lighting controls |
| 8 | **Compare** | `/compare` | `premium_comparison_studio_1` | ✅ LIVE | Side-by-side vehicle comparison using CompareContext |
| 9 | **Technical Comparison** | `/compare/technical` | `ai_technical_comparison` | 🔴 MISSING | Detailed spec "duel" view: engine/weight/0-60/quarter-mile, benchmark scores |
| 10 | **Compare Studio v2** | `/compare/studio` | `premium_comparison_studio_2` | 🔴 MISSING | BHP/autonomous/hybrid focus, compatibility scores, engine duel visualization |
| 11 | **Wishlist** | `/wishlist` | `private_collection_wishlist` | ✅ LIVE | Saved vehicles with AI tags (Price Drop/Low Stock) |
| 12 | **My Cars / Garage** | `/my-cars` | `premium_ownership_dashboard` | ✅ LIVE | Owner's garage from wishlist, documents vault, service log |
| 13 | **Interests** | `/interests` | `curated_interests_grid` | ✅ LIVE | Grid of saved vehicles with AI match scores |
| 14 | **AI Concierge Chat** | `/concierge` | `elite_ai_concierge_chat_1` | ✅ LIVE | AI chatbot: keyword search → vehicle cards from DB |
| 15 | **Concierge Discovery** | `/concierge/discovery` | `ai_assistant_discovery_view` | ✅ LIVE | Vehicle detail with concierge overlay |
| 16 | **Concierge v2 (Dossier)** | `/concierge/dossier` | `elite_ai_concierge_chat_2` | 🔴 MISSING | Extended concierge with vehicle dossier, lot history, chassis details, provenance |
| 17 | **Reservation** | `/reservation` | `secure_luxury_reservation` | ✅ LIVE | Deposit form, refundable toggle, pricing summary |
| 18 | **Commit & Deposit** | `/reservation/commit` | `exclusive_commit_&_deposit` | 🔴 MISSING | Deposit commitment flow: pricing breakdown, deposit slider, financial documentation |
| 19 | **Alerts** | `/alerts` | `buyer_alert_preferences` | 🟡 STATIC | Email/WhatsApp toggles, frequency settings |
| 20 | **VIP Membership** | `/vip` | `vip_membership_invitation` | 🟡 STATIC | VIP invitation with value props (missing detailed application form) |
| 21 | **VIP Confirmation** | `/vip/confirmation` | `vip_membership_confirmation` | 🟡 STATIC | Welcome screen, member ID, quick-start menu |
| 22 | **VIP Rewards** | `/vip/rewards` | `vip_rewards_&_referral_circle` | 🟡 STATIC | Reward cards, tier progress, referral section |
| 23 | **VIP Showroom** | `/vip/showroom` | `vip_digital_showroom` | 🔴 MISSING | VIP-exclusive snap-scroll showroom with limited edition vehicles |
| 24 | **VIP Preferences** | `/vip/preferences` | `vip_personalized_preferences` | 🔴 MISSING | VIP onboarding: category selection, tone preference, registration steps |
| 25 | **Digital Handover** | `/handover` | `digital_handover_experience_1` | ✅ LIVE | Delivery scheduling, documentation, VIN display |
| 26 | **Handover Auth** | `/handover/auth` | `digital_handover_experience_2` | 🔴 MISSING | Ownership authentication, smart contract, digital seal |
| 27 | **Service Selection** | `/service` | `luxury_service_selection` | 🟡 STATIC | Service types, date/time picker, car selector |
| 28 | **Service Logistics** | `/service/logistics` | `service_logistics_&_confirmation` | 🟡 STATIC | Valet vs self-drop, address, confirmation |

### 4.2 DEALER PAGES (26 screens)

| # | Page | Route | Stitch Design | Status | Description |
|---|------|-------|---------------|--------|-------------|
| 29 | **Dashboard** | `/dashboard` | `dealer_executive_dashboard_1` | ✅ LIVE | KPI stats, quick actions, recent listings, activity feed |
| 30 | **Dashboard v2** | `/dashboard/executive` | `dealer_executive_dashboard_2` | 🔴 MISSING | Market data, AI insight cards, inventory arrival alerts |
| 31 | **Dashboard v3 (Luxury)** | `/dashboard/luxury` | `luxury_dealer_dashboard` | 🔴 MISSING | Demand heatmap, social impressions, elite alerts |
| 32 | **Inventory** | `/inventory` | `premium_inventory_collection` | ✅ LIVE | Full inventory with filters, sort, status badges, CRUD |
| 33 | **Leads CRM** | `/leads` | `ai-powered_lead_crm_1` | ✅ LIVE | Lead list with sentiment, source, status filters |
| 34 | **Lead Detail** | `/leads/[id]` | `lead_communication_history` | ✅ LIVE | Message thread, sentiment, call/email/chat tabs |
| 35 | **Appointments** | `/appointments` | `ai_appointment_automation` | ✅ LIVE | Date strip, time slots, AI triggers, list |
| 36 | **Stores** | `/stores` | `multi-store_global_overview` | ✅ LIVE | Store cards with status, revenue stats |
| 37 | **Store Detail** | `/stores/[id]` | (extends multi-store) | ✅ LIVE | Individual store: vehicles, metrics, quick actions |
| 38 | **Analytics** | `/analytics` | `lead_conversion_analytics_(light)` | ✅ LIVE | Sales funnel, sentiment distribution from real lead data |
| 39 | **Performance** | `/performance` | `ai_performance_analytics_(dark)` | 🟡 STATIC | Gauge circles, bar chart, top vehicles |
| 40 | **Profit Analysis** | `/profit` | `predictive_profit_analysis` | 🟡 STATIC | Opportunity cards, period tabs, profit chart |
| 41 | **Monthly Report** | `/reports/monthly` | `dealer_monthly_performance_report` | 🟡 STATIC | Revenue bar chart, conversion funnel, lead metrics |
| 42 | **Intelligence Hub** | `/intelligence` | `ai_market_intelligence_hub_1` | 🟡 STATIC | Auction cards, market trends, scarcity index |
| 43 | **Intelligence v2** | `/intelligence/charts` | `ai_market_intelligence_hub_2` | 🔴 MISSING | Price charts, timeframes, bullish/bearish signals |
| 44 | **Intelligence v3** | `/intelligence/acquisitions` | `ai_market_intelligence_hub_3` | 🔴 MISSING | Acquisition opportunities, auction results, classic car focus |
| 45 | **Plans & Pricing** | `/plans` | `premium_dealer_plans` | 🟡 STATIC | Silver/Gold/Executive tiers, feature lists |
| 46 | **Marketing Hub** | `/marketing` | `elite_marketing_studio_1` | 🟡 STATIC | Campaign overview, asset cards, distribution stats |
| 47 | **Marketing Studio v2** | `/marketing/cinema` | `elite_marketing_studio_2` | 🔴 MISSING | Cinema-quality exports, 4K, Neon/Drift/Luxe mood presets |
| 48 | **Social Hub** | `/social-hub` | `social_media_integration_hub` | 🟡 STATIC | Platform connection, auto-post settings |
| 49 | **Social Onboarding** | `/onboarding/social` | `dealer_social_onboarding` | 🟡 STATIC | Platform cards, step indicator |
| 50 | **Notification History** | `/notifications/history` | `notification_history_log` | 🟡 STATIC | Notification entries with status/channel |
| 51 | **Alert Delivery Insights** | `/notifications/delivery` | `alert_delivery_insights` | 🔴 MISSING | Delivery rate %, bounce tracking, campaign metrics |

### 4.3 AI TOOLS (11 screens)

| # | Page | Route | Stitch Design | Status | Description |
|---|------|-------|---------------|--------|-------------|
| 52 | **AI Content Studio** | `/content-studio` | `ai_content_studio_editor_1` | 🟡 STATIC | Before/after slider, lighting/BG/color adjustment tools |
| 53 | **AI Content Studio v2** | `/content-studio/advanced` | `ai_content_studio_editor_2` | 🔴 MISSING | Chrome/HDR effects, intensity sliders, Ray Tracing toggle |
| 54 | **AI Studio** | `/studio` | `premium_ai_studio_&_marketing` | 🟡 STATIC | AI enhancer with before/after, marketing preview |
| 55 | **AI Studio Editor** | `/studio/editor` | `ai_studio_content_editor` | 🔴 MISSING | Video editor: script generation, ColorGrade/MotionBlur/PrecisionBG, audio narrator |
| 56 | **AI Creative Director** | `/studio/creative` | `ai_creative_director_suite` | 🔴 MISSING | Mood board: Golden Hour/Midnight/Bloom moods, motion overlays, content suggestions |
| 57 | **Reel Editor** | `/reel-editor` | `ai_cinematic_reel_editor` | 🟡 STATIC | Timeline, waveform, tool buttons, video preview |
| 58 | **Smart Reply** | `/smart-reply` | `ai_smart_reply_assistant` | 🟡 STATIC | Tone-based replies: Professional/Friendly/Urgency |
| 59 | **Quick Draft** | `/quick-draft` | `ai_quick_draft_studio` | 🟡 STATIC | Intent chips, draft editor, tone selector |
| 60 | **Notification Customizer** | `/notifications/customizer` | `ai_notification_customizer` | 🔴 MISSING | Template editor, brand voice selector, WhatsApp/Email preview |

### 4.4 SETTINGS (8 screens)

| # | Page | Route | Stitch Design | Status | Description |
|---|------|-------|---------------|--------|-------------|
| 61 | **Settings Hub** | `/settings` | (custom navigation page) | 🟢 CUSTOM | Settings index linking to sub-pages |
| 62 | **Team Management** | `/settings/team` | `dealer_team_management` | ✅ LIVE | Team list, invite, role management |
| 63 | **Billing** | `/settings/billing` | `ai_enhancements_&_billing` | 🟡 STATIC | Add-ons, plan details, billing history |
| 64 | **Notifications** | `/settings/notifications` | `dealer_notification_settings` | 🟡 STATIC | Alert toggles per channel |
| 65 | **Permissions** | `/settings/permissions` | `access_roles_&_permissions` | 🟡 STATIC | Role cards, tier badges, capabilities |
| 66 | **Automation** | `/settings/automation` | `ai_automation_&_scheduling` | 🟡 STATIC | Automation rules, calendar, scheduling |
| 67 | **Brand Voice** | `/settings/brand-voice` | `ai_brand_voice_setup` | 🟡 STATIC | Persona selector, preview, steps |
| 68 | **Assets** | `/settings/assets` | `ai_asset_&_media_settings` | 🟡 STATIC | Asset toggle switches |
| 69 | **AI Automation Permissions** | `/settings/ai-permissions` | `ai_automation_permissions` | 🔴 MISSING | AI permission toggles for Smart Posting/Engagement/Media Sync |

### 4.5 AUTH & LEGAL (4 screens)

| # | Page | Route | Stitch Design | Status | Description |
|---|------|-------|---------------|--------|-------------|
| 70 | **Buyer Login** | `/login/buyer` | `buyer_portal_login` | ✅ LIVE | Google SSO + email/password |
| 71 | **Dealer Login** | `/login/dealer` | `dealer_portal_login` | ✅ LIVE | Dealer ID + password |
| 72 | **Landing Page** | `/landing` | `autovinci_luxury_landing_page` | 🔴 MISSING | Marketing hero: "Future of Luxury Automotive Intelligence", portal buttons |
| 73 | **Privacy Policy** | `/privacy` | (legal, no stitch) | 🟢 CUSTOM | Privacy policy page |
| 74 | **Terms of Service** | `/terms` | (legal, no stitch) | 🟢 CUSTOM | Terms of service page |

---

## 5. STATUS SUMMARY

| Status | Count | % |
|--------|-------|---|
| ✅ LIVE (API-connected) | 22 | 30% |
| 🟡 STATIC (UI done, no API) | 22 | 30% |
| 🔴 MISSING (no page exists) | 21 | 28% |
| 🟢 CUSTOM (no stitch, built independently) | 9 | 12% |
| **TOTAL** | **74** | 100% |

---

## 6. AI TOOLS — COMPLETE FEATURE SPEC

These are the **differentiating features** that make Autovinci a CarDekho killer. Every AI tool has a stitch design. None are currently functional.

### 6.1 AI Photo Enhancement Studio
**Stitch**: `ai_content_studio_editor_1`, `ai_content_studio_editor_2`, `premium_ai_studio_&_marketing`
**Pages**: `/content-studio`, `/content-studio/advanced`, `/studio`

**Features:**
- **Background Removal** — Remove existing background, replace with studio/showroom/outdoor/gradient
- **Studio Lighting** — Simulate studio lighting on car photos (soft, dramatic, golden hour)
- **HDR Enhancement** — Enhance dynamic range for richer colors and detail
- **Chrome/Metallic Effects** — Enhance paint reflections and chrome trim
- **Ray Tracing Toggle** — Simulate realistic light reflections on car body
- **Color Grading** — Cinematic color presets (Warm, Cool, Vivid, Matte)
- **Before/After Slider** — Side-by-side comparison of original vs enhanced
- **Intensity Controls** — Slider for each effect (0-100%)
- **Batch Processing** — Apply enhancements to all vehicle images at once
- **Export** — High-res download, direct to listing, share to social

**Tech Required**: Replicate API (Stable Diffusion inpainting, background removal models) OR Stability AI

### 6.2 AI Cinematic Reel Editor
**Stitch**: `ai_cinematic_reel_editor`, `ai_studio_content_editor`
**Pages**: `/reel-editor`, `/studio/editor`

**Features:**
- **Auto-Script Generation** — Generate video script from vehicle specs + selling points
- **Timeline Editor** — Multi-track timeline with clips, transitions, text overlays
- **Waveform Audio** — Visual audio timeline for music/voiceover
- **AI Narrator** — Text-to-speech voiceover generation
- **Motion Templates** — Pre-built motion presets (Ken Burns, Parallax, Zoom)
- **ColorGrade Tool** — Real-time color grading on video clips
- **MotionBlur Tool** — Cinematic motion blur effects
- **PrecisionBG Tool** — Background swap in video frames
- **Export** — 1080p/4K, Instagram Reel format, Facebook, YouTube Shorts

**Tech Required**: FFmpeg (server-side), OpenAI TTS, Replicate video models

### 6.3 AI Creative Director Suite
**Stitch**: `ai_creative_director_suite`
**Page**: `/studio/creative`

**Features:**
- **Mood Board Generator** — AI generates mood boards from vehicle type (Golden Hour, Midnight, Bloom, etc.)
- **Motion Overlays** — Particle effects, lens flares, rain, dust
- **Content Suggestions** — AI suggests marketing angles based on vehicle data
- **Campaign Planning** — Multi-platform content calendar
- **Style Transfer** — Apply visual styles to car photos (magazine, editorial, street)

**Tech Required**: OpenAI GPT-4 for copy, Stable Diffusion for style transfer

### 6.4 AI Concierge (Chat)
**Stitch**: `elite_ai_concierge_chat_1`, `elite_ai_concierge_chat_2`
**Pages**: `/concierge`, `/concierge/dossier`

**Features (Current MVP):**
- Keyword-based vehicle search (brand, category, budget extraction)
- Template responses with matching vehicle cards from DB

**Features (Full Version):**
- **Natural Language Search** — "Show me a red SUV under 15 lakh with low mileage"
- **Vehicle Dossier** — Detailed provenance: lot history, chassis details, service records
- **EMI Calculator** — Inline loan calculation
- **Test Drive Booking** — Book directly from chat
- **Comparison Suggestions** — "This Creta vs Seltos" generates comparison table
- **Follow-up Memory** — Remember user preferences across sessions
- **Multi-language** — Hindi, Tamil, Telugu, Marathi, Bengali support

**Tech Required**: OpenAI GPT-4 API, vector search (pgvector on Supabase)

### 6.5 AI Smart Reply
**Stitch**: `ai_smart_reply_assistant`
**Page**: `/smart-reply`

**Features:**
- **Tone Selection** — Professional / Friendly / Urgency
- **Context-Aware** — Reads lead message + vehicle info to craft response
- **One-Click Send** — Pick AI suggestion, send immediately via WhatsApp/SMS/Email
- **Edit Before Send** — Modify AI draft before sending
- **Learning** — Improves suggestions based on dealer's past edits

**Tech Required**: OpenAI GPT-4, WhatsApp Business API

### 6.6 AI Quick Draft
**Stitch**: `ai_quick_draft_studio`
**Page**: `/quick-draft`

**Features:**
- **Intent Selection** — Listing description, social post, email campaign, SMS blast
- **Tone Selector** — Luxury, Casual, Urgent, Informative
- **Auto-Fill from Vehicle** — Pull specs, images, price into draft
- **Multi-Platform Export** — Format for Instagram caption, WhatsApp broadcast, email template
- **Character Count** — Platform-specific limits

**Tech Required**: OpenAI GPT-4

### 6.7 AI Market Intelligence
**Stitch**: `ai_market_intelligence_hub_1`, `_2`, `_3`
**Pages**: `/intelligence`, `/intelligence/charts`, `/intelligence/acquisitions`

**Features:**
- **Price Trend Charts** — Historical pricing by model (1W/2W/1M/3M/6M/1Y)
- **Demand Heatmap** — Geographic demand by vehicle type
- **Scarcity Index** — Low-supply vehicles with price appreciation potential
- **Auction Intelligence** — Recent auction results and opportunities
- **Bullish/Bearish Signals** — Market direction indicators per segment
- **Acquisition Recommendations** — AI suggests which cars to buy for inventory

**Tech Required**: Data aggregation pipeline, OpenAI for analysis, chart library (Recharts)

### 6.8 AI Virtual Tour
**Stitch**: `ai_virtual_tour_experience`, `ai_virtual_tour_viewer`
**Pages**: `/virtual-tour/[id]`, `/virtual-tour/viewer/[id]`

**Features (Current):**
- Interior hotspots with spec tabs
- Vehicle data from API

**Features (Full Version):**
- **360° Rotation** — Full exterior rotation from multiple angles
- **Interior Walk-Through** — Navigate inside the car
- **Hotspot Annotations** — Click features to see specs/condition
- **Quality Settings** — Low/Medium/High/4K rendering
- **Ambient Lighting** — Change virtual lighting (daylight, showroom, evening)
- **AR Mode** — See car in your driveway (mobile only)

**Tech Required**: Three.js or React Three Fiber, panoramic image stitching

### 6.9 AI Notification Customizer
**Stitch**: `ai_notification_customizer`
**Page**: `/notifications/customizer`

**Features:**
- **Template Editor** — WYSIWYG editor for notification templates
- **Brand Voice Integration** — Apply dealer's brand voice to all notifications
- **Channel Preview** — See how notification looks on WhatsApp vs Email vs SMS
- **Trigger Rules** — Set conditions for auto-notifications (new lead, price drop, etc.)

**Tech Required**: Template engine, WhatsApp Business API, SendGrid/Resend

---

## 7. API ROUTES (20 Existing + Needed)

### 7.1 Existing API Routes (20)

| Route | Methods | Auth | Status |
|-------|---------|------|--------|
| `/api/auth/login` | POST | Public | ✅ Live |
| `/api/auth/signup` | POST | Public | ✅ Live |
| `/api/auth/logout` | POST | Auth | ✅ Live |
| `/api/auth/me` | GET | Auth | ✅ Live |
| `/api/auth/callback` | GET | Public | ✅ Live |
| `/api/vehicles` | GET, POST | GET=Public, POST=Dealer | ✅ Live |
| `/api/vehicles/[id]` | GET, PUT, DELETE | GET=Public, PUT/DEL=Dealer | ✅ Live |
| `/api/leads` | GET, POST | Dealer | ✅ Live |
| `/api/leads/[id]` | GET, PUT, DELETE | Dealer | ✅ Live |
| `/api/leads/[id]/messages` | POST | Dealer | ✅ Live |
| `/api/appointments` | GET, POST | Dealer | ✅ Live |
| `/api/stores` | GET, POST | Dealer | ✅ Live |
| `/api/stores/[id]` | GET, PUT, DELETE | Dealer | ✅ Live |
| `/api/dealer/profile` | GET, PUT | Dealer | ✅ Live |
| `/api/dealer/team` | GET, POST, DELETE | Dealer | ✅ Live |
| `/api/wishlist` | GET, POST, DELETE | Auth | ✅ Live |
| `/api/analytics/dashboard` | GET | Dealer | ✅ Live |
| `/api/analytics/funnel` | GET | Dealer | ✅ Live |
| `/api/notifications` | GET, PUT | Auth | ✅ Live |
| `/api/concierge/chat` | POST | Public | ✅ Live |

### 7.2 API Routes Needed

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/ai/enhance-image` | POST | AI photo enhancement (background removal, lighting, HDR) |
| `/api/ai/generate-content` | POST | AI content generation (listings, social posts, email) |
| `/api/ai/smart-reply` | POST | AI reply suggestion for lead messages |
| `/api/ai/market-intelligence` | GET | AI market analysis, price trends, demand data |
| `/api/ai/virtual-tour/[id]` | GET | 360° tour data for a vehicle |
| `/api/payments/create-subscription` | POST | Razorpay subscription creation |
| `/api/payments/webhook` | POST | Razorpay webhook handler |
| `/api/payments/verify` | POST | Payment verification |
| `/api/analytics/performance` | GET | Detailed performance metrics |
| `/api/analytics/reports` | GET | Monthly report data |
| `/api/vehicles/[id]/images` | POST | Image upload to Supabase Storage |

---

## 8. COMPONENT LIBRARY (22 Existing)

| Component | Path | Purpose |
|-----------|------|---------|
| `MaterialIcon` | `components/MaterialIcon.tsx` | Google Material Icons wrapper |
| `AuthGuard` | `components/AuthGuard.tsx` | Route protection (redirects unauthenticated) |
| `DealerAppShell` | `components/DealerAppShell.tsx` | Dealer layout wrapper |
| `DealerPageLayout` | `components/DealerPageLayout.tsx` | Dealer page layout |
| `DealerBottomNav` | `components/DealerBottomNav.tsx` | Dealer 5-tab bottom nav |
| `BuyerPageLayout` | `components/BuyerPageLayout.tsx` | Buyer layout wrapper |
| `BuyerBottomNav` | `components/BuyerBottomNav.tsx` | Buyer 5-tab bottom nav |
| `VehicleCard` | `components/VehicleCard.tsx` | 3 variants: inventory (4:5), showcase (21:9), compact |
| `VehicleSpecsGrid` | `components/VehicleSpecsGrid.tsx` | Vehicle specifications grid |
| `VehicleJsonLd` | `components/VehicleJsonLd.tsx` | SEO structured data for vehicles |
| `LeadCard` | `components/LeadCard.tsx` | Lead display card with sentiment |
| `PageHeader` | `components/PageHeader.tsx` | Reusable page header |
| `Badge` | `components/ui/Badge.tsx` | Status/label badge |
| `BottomSheet` | `components/ui/BottomSheet.tsx` | Framer Motion bottom sheet modal |
| `EmptyState` | `components/ui/EmptyState.tsx` | Empty state with CTA (dark/light) |
| `FilterPills` | `components/ui/FilterPills.tsx` | Horizontal filter chips |
| `GlassButton` | `components/ui/GlassButton.tsx` | 3 variants: glass/primary/outline |
| `SearchBar` | `components/ui/SearchBar.tsx` | Search input (dark/light) |
| `Skeleton` | `components/ui/Skeleton.tsx` | Loading skeleton primitives |
| `StatCard` | `components/ui/StatCard.tsx` | KPI stat display card |
| `Toast` | `components/ui/Toast.tsx` | Toast notifications (success/error/info) |
| `ToggleSwitch` | `components/ui/ToggleSwitch.tsx` | Toggle switch control |

---

## 9. DESIGN SYSTEM

From stitch designs — the app uses multiple design token sets per section:

### Color Families
| Section | Primary | Background | Font |
|---------|---------|------------|------|
| Buyer Home | `#3b82f6` (blue) | `#0a0c10` (dark) | Inter |
| Showroom | `#3b82f6` | `#0a0c10` | Inter |
| Vehicle Detail | `#7311d4` (purple) | `#050505` | Noto Serif + Noto Sans |
| Concierge | `#1773cf` (blue) | `#111921` | Newsreader |
| VIP | `#dab80b` (gold) | `#16150d` | Space Grotesk |
| Dealer Dashboard | `#7311d4` | `#101622` | Plus Jakarta Sans |
| Leads CRM | `#1152d4` (royal blue) | `#050505` | Manrope |
| Analytics | `#137fec` | `#ffffff` (light) | Inter |
| Inventory | `#a855f7` (purple) | `#0c0a14` | Space Grotesk |
| Stores | `#0df2f2` (cyan) | `#0a0f0f` | Manrope |
| Content Studio | `#f97316` (orange) | `#1a1008` | Manrope |
| Marketing | `#3366FF` | `#0B1426` | Space Grotesk |
| Settings | Various | Dark/Light | Various |

### Common Patterns
- Glassmorphism: `backdrop-blur-md`, `bg-white/5`, `border-white/10`
- Bottom navigation: Fixed, 5 tabs, blur backdrop
- Cards: Rounded corners (xl/2xl), subtle borders, glass effect
- Mobile-first: `max-w-md mx-auto`, `pb-20` (bottom nav clearance)
- Animations: Framer Motion `animate-pulse`, slide-in toasts, bottom sheet

---

## 10. IMPLEMENTATION PRIORITY (Sprints Remaining)

### Sprint 10: Build Missing Pages (21 screens)
Create page.tsx for all 🔴 MISSING pages using stitch HTML as reference.

### Sprint 11: Wire Static Pages to APIs (22 screens)
Convert all 🟡 STATIC pages to use real API data.

### Sprint 12: AI Integration
Build `/api/ai/*` endpoints. Start with:
1. Photo Enhancement (highest dealer value)
2. Smart Reply (immediate lead conversion impact)
3. Content Generation (marketing automation)

### Sprint 13: Razorpay Payments
Wire plans/billing to Razorpay for subscription revenue.

### Sprint 14: Production Deploy
Vercel deployment, custom domain, final QA.

---

## 11. FILES REFERENCE

| Category | Count |
|----------|-------|
| Page Routes (page.tsx) | 54 existing + 21 to build = 75 |
| API Routes (route.ts) | 20 existing + 11 to build = 31 |
| Components | 22 existing |
| Lib Files | 23 existing |
| Prisma Models | 13 |
| Stitch Designs | 70 (75 folders - 4 prompts - 1 empty) |
| Total TypeScript (src/) | ~38,000 lines |

---

*This PRD is the single source of truth for Autovinci development. Every page, every AI tool, every API route is documented here. Follow the stitch designs to the T.*
