# CaroBest Platform Guide

## Complete Dealer & Buyer Experience Documentation

**Version 2.0 | March 2026**

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Dealer Experience](#2-dealer-experience)
   - 2.1 Registration & Onboarding
   - 2.2 Dealer Dashboard (DealerOS)
   - 2.3 Inventory Management
   - 2.4 Lead Management & CRM
   - 2.5 AI Studio (6 Tools)
   - 2.6 Analytics & Reporting
   - 2.7 DemandPulse Intelligence
   - 2.8 Marketing & Social Hub
   - 2.9 Store & Team Management
   - 2.10 Settings & Configuration
   - 2.11 Subscription Plans & Billing
3. [Buyer Experience](#3-buyer-experience)
   - 3.1 Discovery & Browsing
   - 3.2 Vehicle Detail & Decision Tools
   - 3.3 Comparison Engine
   - 3.4 Wishlist & Interests
   - 3.5 AI Concierge
   - 3.6 VIP Programme
   - 3.7 Services Marketplace
   - 3.8 Post-Purchase Hub (My Account)
   - 3.9 Finance & Insurance Tools
4. [How Dealer & Buyer Connect](#4-how-dealer--buyer-connect)
5. [Subscription Plans (Tier Comparison)](#5-subscription-plans)
6. [Technical Architecture](#6-technical-architecture)
7. [API Reference Summary](#7-api-reference-summary)

---

## 1. Platform Overview

CaroBest is an AI-powered used car marketplace built for the Indian market. It serves two distinct user types through a unified platform:

- **Dealers** operate through a dedicated portal (DealerOS) to manage inventory, leads, AI-generated content, analytics, and marketing. Access is restricted behind authentication and route protection.
- **Buyers** browse vehicles, compare options, use AI-powered decision tools, access services (financing, insurance, RC transfer), and manage post-purchase needs.

The two experiences share a common vehicle database: dealers list vehicles through DealerOS, and those vehicles surface in the buyer marketplace. Buyer inquiries generate leads that flow into the dealer CRM.

**Key numbers:**
- 204+ routes across the application
- 37+ API endpoints
- 75+ screen designs implemented
- 10 differentiated "killer features"
- 4-tier subscription model (FREE / STARTER / GROWTH / ENTERPRISE)

---

## 2. Dealer Experience

### 2.1 Registration & Onboarding

**Entry Points:**
- Signup: `/dealer/signup`
- Login: `/login/dealer`

**Signup Flow:**

The dealer signup page collects:
1. **Business Details** -- Dealership name, GST number, business type (Individual / Partnership / Pvt Ltd / LLP), city, state
2. **Owner Details** -- Full name, email, phone number
3. **Security** -- Password with confirmation
4. **Plan Selection** -- Choose from FREE, Starter, Growth, or Enterprise during registration

Alternative: Google SSO signup available.

After successful submission, the system creates a Supabase auth user + DealerProfile record via `/api/auth/dealer-signup` (Zod-validated), then redirects to `/login/dealer?onboard=1`.

**5-Step Onboarding Wizard** (`/onboarding/dealer`):

| Step | Name | What Happens |
|------|------|-------------|
| 1 | **Store Setup** | Configure store display name, upload logo, set operating hours (Mon-Sat 9AM-7PM default), add WhatsApp contact number |
| 2 | **Add Inventory** | Add first car via photo upload (AI auto-fills details) or manual entry; option to skip |
| 3 | **Connect Social** | Link Instagram (auto-post photos), Facebook (Marketplace sharing), WhatsApp Business (auto-reply), YouTube (video walkarounds) |
| 4 | **AI Tools** | Configure AI description style, enable auto-reply, set smart pricing, activate lead scoring |
| 5 | **Go Live** | Final review and publish storefront |

After completing onboarding, the dealer lands on their dashboard.

---

### 2.2 Dealer Dashboard (DealerOS)

**Route:** `/dashboard`

The executive dashboard provides a command center for dealership operations.

**Header:** Dealer avatar/initials, dealership name, notification bell, add-vehicle quick action button.

**Key Metrics (API-powered):**
- Portfolio Value (total revenue)
- Active Leads count
- Hot Leads count
- AI Replies sent
- Total Vehicles in inventory

**Quick Actions Grid (7 actions):**
| Action | Route | Description |
|--------|-------|-------------|
| Reports | `/reports/monthly` | Monthly performance reports |
| Messages | `/leads` | Lead inbox / CRM |
| Schedule | `/appointments` | Appointment calendar |
| Market | `/marketing` | Marketing tools |
| Intelligence | `/intelligence` | DemandPulse market intelligence |
| Analytics | `/analytics` | Performance analytics |
| Social Hub | `/social-hub` | Social media management |

**Recent Listings:** Shows 3 most recent vehicles with images, pricing, and status.

**Alternate Dashboard Variants:**
- `/dashboard/overview` -- Expanded overview with greeting, task list, performance rings (enquiries, listings, revenue), appointment timeline, and activity feed
- `/dashboard/ai-hub` -- AI command center showing description generation, smart pricing, lead scoring, market intelligence, and content studio quick links

---

### 2.3 Inventory Management

**Routes:**
- `/inventory` -- Vehicle grid/list view
- `/inventory/add` -- Add new vehicle
- `/inventory/[id]` -- Vehicle detail/edit

**Capabilities:**
- Full vehicle CRUD (Create, Read, Update, Delete)
- Status management: AVAILABLE / SOLD / RESERVED
- AI-powered vehicle descriptions (auto-generated from photos + specs)
- Photo management with AI studio integration (background removal, mood application)
- Price display formatting (INR with commas)
- AI Score (0-100) for listing quality assessment
- Bulk operations for multi-vehicle management
- Filter by status, price range, make/model
- Sort by date added, price, AI score

**Vehicle Data Model:**
Each vehicle record includes: make, model, year, variant, fuel type, transmission, kilometers driven, ownership count, registration state, color, price, AI-generated description, up to 20 photos, VIN, registration number, insurance validity, and AI quality score.

---

### 2.4 Lead Management & CRM

**Routes:**
- `/leads` -- Lead inbox with filters
- `/leads/[id]` -- Individual lead detail + conversation

**Lead Properties:**
- Status pipeline: NEW -> CONTACTED -> QUALIFIED -> CLOSED_WON / CLOSED_LOST
- Sentiment labels: HOT / WARM / COOL (AI-analyzed)
- Source tracking: WEBSITE / FACEBOOK / INSTAGRAM / WHATSAPP / WALKIN / REFERRAL
- Linked vehicle interest
- Full conversation thread (MANUAL + AUTO messages)

**Features:**
- Lead cards with sentiment badges and source icons
- Conversation view with message history
- Manual reply composition
- AI Smart Reply suggestions (Growth+ plans)
- AI Auto-Reply for instant response (Growth+ plans)
- Lead assignment to team members (Growth+ plans)
- AI follow-up scheduling (Growth+ plans)
- Agent memory for personalized interactions (Growth+ plans)

**Smart Reply** (`/smart-reply`):
AI-powered response suggestions that analyze lead context, vehicle interest, and conversation history to generate contextually appropriate replies.

**Quick Draft** (`/quick-draft`):
AI content drafting tool for composing messages, descriptions, and marketing copy with adjustable tone and format.

---

### 2.5 AI Studio (6 Tools)

**Route:** `/studio`

The AI Studio is the creative hub for dealers, providing six specialized tools:

| Tool | Description | Min Plan |
|------|-------------|----------|
| **AI Description Generator** | Auto-generate compelling vehicle listings from photos and specs | FREE |
| **Background Removal** | Remove/replace photo backgrounds with studio-quality results | STARTER |
| **Mood Application** | Apply cinematic lighting and mood presets to vehicle photos | GROWTH |
| **Reel Script Generator** | Create video scripts for social media reels with hooks, CTAs | GROWTH |
| **Text-to-Speech** | Convert scripts to voiceover audio for video content | GROWTH |
| **Cinema Exports** | 4K export with cinematic color grading | ENTERPRISE |

**Content Studio** (`/content-studio`):
Extended workspace for creating marketing materials -- social media posts, email templates, and promotional content with AI assistance.

**Reel Editor** (`/reel-editor`):
Video content creation tool with script-to-reel workflow, music library, transition effects, and export for Instagram Reels / YouTube Shorts.

---

### 2.6 Analytics & Reporting

**Routes:**
- `/analytics` -- Performance analytics dashboard
- `/reports` -- Report hub
- `/reports/monthly` -- Monthly performance report
- `/performance` -- Inventory health metrics
- `/profit` -- Revenue and profit tracking

**Analytics Dashboard** (`/analytics`):
- Enquiry trends (daily/weekly/monthly)
- Lead conversion funnel visualization
- Source performance breakdown (which channels generate best leads)
- Vehicle performance metrics (views, inquiries, time-to-sell)
- Retention period: 7 days (FREE) / 30 days (STARTER) / 90 days (GROWTH) / Unlimited (ENTERPRISE)

**Monthly Reports** (`/reports/monthly`):
- Month-over-month growth comparisons
- Revenue tracking and MoM changes
- Lead source breakdown with conversion rates
- Top performing vehicles
- AI usage statistics

**Performance** (`/performance`):
- Inventory health scores
- Average days on lot
- Price competitiveness index
- Listing quality scores

**Profit Tracking** (`/profit`):
- Purchase price vs. sale price tracking
- Per-vehicle profit margins
- Monthly profit trends
- Cost analysis (reconditioning, photography, marketing spend)

---

### 2.7 DemandPulse Intelligence

**Route:** `/intelligence`

Market intelligence suite providing data-driven insights for pricing and inventory decisions.

**Sub-pages (6):**

| Page | Route | Description | Min Plan |
|------|-------|-------------|----------|
| Overview | `/intelligence` | Market summary with key indicators | GROWTH |
| Pricing Intelligence | `/intelligence/pricing` | Real-time market pricing data, competitor analysis, price recommendations (uses real inventory data) | GROWTH |
| Demand Trends | `/intelligence/trends` | Search volume trends, popular models, emerging demand patterns | GROWTH |
| Depreciation Curves | `/intelligence/depreciation` | Model-wise depreciation analysis, optimal buy/sell timing | GROWTH |
| Market Forecast | `/intelligence/forecast` | Predictive analytics for market movements | ENTERPRISE |
| Competitor Analysis | `/intelligence/competitors` | Competitor inventory monitoring, pricing comparison | ENTERPRISE |

---

### 2.8 Marketing & Social Hub

**Routes:**
- `/marketing` -- Marketing command center
- `/marketing/campaigns` -- Campaign management
- `/marketing/templates` -- Marketing template library
- `/social-hub` -- Social media management

**Marketing Hub** (`/marketing`):
- Campaign creation and scheduling
- Performance tracking (impressions, clicks, leads generated)
- Budget allocation and ROI analysis
- Template-based content creation

**Social Hub** (`/social-hub`):
- Unified social media management dashboard
- Cross-platform posting (Instagram, Facebook, YouTube)
- Content calendar with scheduling
- Engagement metrics and analytics
- Auto-posting capability (Enterprise plan)

**Plan Requirements:**
- Social Hub access: GROWTH+
- Campaign tools: GROWTH+
- Auto-posting: ENTERPRISE only

---

### 2.9 Store & Team Management

**Routes:**
- `/stores` -- Multi-store management
- `/settings/team` -- Team member management

**Multi-Store Management** (`/stores`):
- Add and manage multiple dealership locations
- Per-store inventory tracking
- Store-specific analytics
- Store limit: 1 (FREE/STARTER) / 3 (GROWTH) / Unlimited (ENTERPRISE)

**Team Management** (`/settings/team`):
- Invite team members by email
- Role-based access control (RBAC): Owner / Manager / Salesperson / Viewer
- Per-member lead assignment
- Activity tracking per team member
- Team limit: 1 (FREE) / 2 (STARTER) / 5 (GROWTH) / Unlimited (ENTERPRISE)

**Appointments** (`/appointments`):
- Calendar-based appointment scheduling
- Customer name, vehicle interest, date/time, notes
- Status tracking (Scheduled / Completed / Cancelled / No-show)

---

### 2.10 Settings & Configuration

**Route:** `/settings`

**Settings Hub** with sections:

| Setting | Route | Description |
|---------|-------|-------------|
| Profile | `/settings` | Dealership info, logo, contact details |
| Team | `/settings/team` | Team member management + RBAC |
| Billing | `/settings/billing` | Subscription management, invoices |
| Permissions | `/settings/permissions` | Feature access matrix based on plan |
| AI Permissions | `/settings/ai-permissions` | Granular AI feature toggles |
| Automation | `/settings/automation` | Auto-reply rules, follow-up schedules |
| Brand Voice | `/settings/brand-voice` | AI tone/style configuration |
| Notifications | `/settings/notifications` | Notification preferences |
| Assets | `/settings/assets` | Brand assets (logos, watermarks) |

**Permissions Page** (`/settings/permissions`):
Dynamically displays feature access based on the dealer's current plan:
- Plan Quotas grid showing limits for vehicles, leads, AI calls, photo edits, team members, and analytics retention
- AI Capabilities section with per-feature lock/unlock status
- Granular permission toggles for 10 feature categories
- Upgrade CTA linking to plans page (hidden for Enterprise)

**Notification System:**
- `/notifications` -- Notification center (all alerts)
- `/notifications/history` -- Historical notification log
- `/settings/notifications` -- Notification delivery preferences
- `/alerts` -- Real-time alert management

---

### 2.11 Subscription Plans & Billing

**Routes:**
- `/plans` -- Plan comparison and upgrade page
- `/settings/billing` -- Current subscription, invoices, payment history

**4-Tier Pricing (INR):**

| Feature | FREE | STARTER (INR 1,999/mo) | GROWTH (INR 4,999/mo) | ENTERPRISE (INR 14,999/mo) |
|---------|------|------------------------|----------------------|---------------------------|
| Vehicle Listings | 5 | 25 | 100 | Unlimited |
| Leads / month | 20 | 100 | Unlimited | Unlimited |
| AI Calls / month | 10 | 50 | 200 | Unlimited |
| Photo Edits / month | 0 | 20 | 100 | Unlimited |
| Video Scripts / month | 0 | 0 | 30 | Unlimited |
| Team Members | 1 | 2 | 5 | Unlimited |
| Analytics Retention | 7 days | 30 days | 90 days | Unlimited |
| Stores | 1 | 1 | 3 | Unlimited |
| AI Descriptions | Yes | Yes | Yes | Yes |
| AI Quick Draft | -- | Yes | Yes | Yes |
| AI Creative Suggestions | -- | -- | Yes | Yes |
| AI Sentiment Analysis | -- | Yes | Yes | Yes |
| AI Smart Reply | -- | -- | Yes | Yes |
| AI Auto-Reply | -- | -- | Yes | Yes |
| AI Follow-ups | -- | -- | Yes | Yes |
| Agent Memory | -- | -- | Yes | Yes |
| Background Removal | -- | Yes | Yes | Yes |
| Mood Application | -- | -- | Yes | Yes |
| Reel Scripts | -- | -- | Yes | Yes |
| Text-to-Speech | -- | -- | Yes | Yes |
| Cinema Exports (4K) | -- | -- | -- | Yes |
| Advanced Analytics | -- | -- | Yes | Yes |
| Benchmarks | -- | -- | Yes | Yes |
| Health Score | -- | -- | Yes | Yes |
| Intelligence (Basic) | -- | -- | Yes | Yes |
| Intelligence (Full) | -- | -- | -- | Yes |
| Data Export (CSV/PDF) | -- | -- | -- | Yes |
| WhatsApp Integration | -- | -- | Yes | Yes |
| Bulk Messaging | -- | -- | -- | Yes |
| Social Hub | -- | -- | Yes | Yes |
| Campaign Tools | -- | -- | Yes | Yes |
| Auto-Posting | -- | -- | -- | Yes |
| Lead Assignment | -- | -- | Yes | Yes |
| Multi-Store | -- | -- | -- | Yes |
| Team Roles (RBAC) | -- | -- | Yes | Yes |
| API Access | -- | -- | -- | Yes |
| Custom Branding | -- | -- | -- | Yes |
| 360 Virtual Tour | -- | Yes | Yes | Yes |
| Interior Viewer | -- | -- | Yes | Yes |
| Public Badge | -- | -- | Gold | Platinum |
| Remove Branding | -- | Yes | Yes | Yes |

**Annual Billing:** 2 months free on all paid plans.

**Payment Processing:** Razorpay integration with order creation, payment verification, and demo mode fallback when Razorpay credentials are not configured.

---

## 3. Buyer Experience

### 3.1 Discovery & Browsing

**Entry Points:**
- Homepage: `/` -- Featured vehicles, trending cars, brand showcase, city-wise browsing
- Landing: `/landing` -- Cinematic hero with "Browse Collection" and "Private Showroom" CTAs
- Showroom: `/showroom` -- Curated vehicle gallery with premium presentation
- Used Cars: `/used-cars` -- Full marketplace listing with filters
- New Cars: `/new-cars` -- New car catalog browsing

**Homepage Features:**
- Hero section with search functionality
- Trending vehicles carousel
- Brand grid (12 brands: Maruti, Hyundai, Tata, Honda, Toyota, Mahindra, Kia, MG, Volkswagen, Skoda, BMW, Mercedes)
- City-wise browsing links
- Featured dealer section
- Quick access to services (loan calculator, insurance, RC transfer)

**Showroom** (`/showroom`):
- Premium vehicle grid with high-quality imagery
- Filter by price, brand, fuel type, body style
- Sort by relevance, price, year, mileage
- Infinite scroll pagination

**Used Cars** (`/used-cars`):
- Comprehensive marketplace with advanced filters
- Price range slider
- Multi-select for brand, fuel type, transmission, body type
- Location-based filtering
- Sort options: Relevance, Price (Low-High), Price (High-Low), Year, Mileage
- Grid and list view toggles

**SEO Pages:**
- `/used-cars/[city]` -- City-specific listings (Mumbai, Delhi, Bangalore, etc.)
- `/[brand]/[model]` -- Brand and model pages
- `/dealers` -- Dealer directory
- `/dealers/[city]` -- City-specific dealer listings
- `/car-news` -- Automotive news and reviews

---

### 3.2 Vehicle Detail & Decision Tools

**Route:** `/vehicle/[id]`

**Vehicle Detail Page:**
- Full-screen image gallery with swipe navigation
- Price display with EMI estimate
- Key specs grid (year, fuel, transmission, km driven, owners)
- AI-generated vehicle description
- Dealer info card with contact options
- "Similar Cars" recommendations
- Share and wishlist actions

**Decision Tools (3 exclusive features):**

**1. TrueCost Engine** (`/vehicle/[id]/true-cost`):
Total cost of ownership calculator that computes:
- Purchase price
- Registration & road tax
- Insurance (comprehensive, third-party)
- Estimated maintenance (year 1-5)
- Fuel costs (based on average driving)
- Depreciation projection
- 5-year total cost of ownership comparison

**2. AI Negotiation Coach** (`/vehicle/[id]/negotiate`):
AI-powered negotiation advisor that provides:
- Fair market price analysis
- Negotiation talking points
- Price history context
- "Walk-away price" recommendation
- Counter-offer strategies

**3. Vehicle Passport** (`/vehicle/passport/[id]`):
Comprehensive vehicle history report:
- Ownership history
- Service records
- Insurance claims
- RTO registration verification
- Flood/accident damage assessment
- Estimated condition score

---

### 3.3 Comparison Engine

**Routes:**
- `/compare` -- Comparison hub (select vehicles)
- `/compare/technical` -- Side-by-side technical specs
- `/compare/studio` -- Visual comparison with photo overlays

**Features:**
- Compare up to 3 vehicles simultaneously
- Technical specifications table (engine, dimensions, features)
- Price comparison with value scoring
- Photo side-by-side comparison
- Share comparison results

---

### 3.4 Wishlist & Interests

**Routes:**
- `/wishlist` -- Saved vehicles
- `/interests` -- Interest tracking and recommendations

**Wishlist:**
- Save vehicles from any listing page
- Price drop alerts
- Quick comparison from wishlist
- Remove and organize saved cars

**Interests** (`/interests`):
- Tracked vehicle interests with engagement metrics
- AI-powered recommendations based on browsing history
- "You might also like" suggestions
- Interest-based notifications

---

### 3.5 AI Concierge

**Routes:**
- `/concierge` -- AI chat interface
- `/concierge/discovery` -- Guided vehicle discovery
- `/concierge/dossier` -- AI-generated vehicle dossier

**AI Concierge:**
Conversational AI assistant that helps buyers:
- Discover vehicles based on natural language queries ("I need a family car under 10 lakhs")
- Get personalized recommendations
- Answer questions about vehicles, financing, and services
- Generate detailed vehicle dossiers with pros/cons analysis

**Discovery Mode** (`/concierge/discovery`):
Guided questionnaire flow:
- Budget range
- Primary use case (city commute, highway, family, off-road)
- Fuel preference
- Must-have features
- Returns AI-curated shortlist

**Vehicle Dossier** (`/concierge/dossier`):
AI-compiled comprehensive report for a specific vehicle including market analysis, ownership cost projection, and buy/wait recommendation.

---

### 3.6 VIP Programme

**Routes:**
- `/vip` -- VIP membership overview
- `/vip/showroom` -- Exclusive VIP vehicle showcase
- `/vip/rewards` -- Rewards and benefits tracking
- `/vip/confirmation` -- VIP enrollment confirmation

**VIP Benefits:**
- Priority access to new listings
- Exclusive VIP-only inventory
- Enhanced negotiation tools
- Concierge priority support
- Reward points on transactions
- Special financing rates

---

### 3.7 Services Marketplace

**Routes and Services:**

| Service | Route | Description |
|---------|-------|-------------|
| **SwapDirect** | `/swap` | Direct car swap/exchange marketplace |
| | `/swap/deal` | Active swap deal management |
| | `/swap/matches` | AI-matched swap opportunities |
| **LiveCondition** | `/inspection` | Professional vehicle inspection booking |
| **InstantRC** | `/rc-transfer` | Online RC (Registration Certificate) transfer service |
| **CrossState Express** | `/cross-state` | Inter-state vehicle transfer facilitation |
| **Sell Your Car** | `/sell-car` | Sell-your-car flow with valuation |

**SwapDirect** (`/swap`):
- List your current car
- Get AI-matched swap opportunities
- Direct dealer-to-buyer or buyer-to-buyer swaps
- Price difference calculation
- Swap deal management interface

**LiveCondition** (`/inspection`):
- Book professional vehicle inspection
- 200+ checkpoint inspection
- Digital inspection report
- Certified condition rating
- ServiceBooking API integration

**InstantRC** (`/rc-transfer`):
- Online RC transfer application
- Document upload (ID, address proof, insurance)
- RTO fee calculation
- Status tracking
- ServiceBooking API integration

**CrossState Express** (`/cross-state`):
- Inter-state transfer facilitation
- NOC application assistance
- State-wise road tax calculation
- Timeline estimation
- ServiceBooking API integration

---

### 3.8 Post-Purchase Hub (My Account)

**Route:** `/my-account`

Comprehensive post-purchase management center.

**Sections:**

| Section | Route | Description |
|---------|-------|-------------|
| Profile | `/my-account` | Personal info, contact details, preferences |
| My Garage | `/my-account/garage` | Owned vehicles with service reminders |
| Warranty | `/my-account/warranty` | Warranty tracking and claims |
| Documents | `/my-account/documents` | Digital document vault (RC, insurance, PUC) |
| Orders | `/my-account/orders` | Purchase history and order tracking |
| Resale | `/my-account/resale` | Resale value tracking and listing tools |

**My Garage** (`/my-account/garage`):
- All owned vehicles
- Service schedule reminders (next service, PUC renewal, insurance renewal)
- Mileage tracking
- Maintenance log

**Documents** (`/my-account/documents`):
- Upload and store vehicle documents
- RC copy, insurance policy, PUC certificate
- Expiry tracking with renewal reminders
- Secure digital vault

---

### 3.9 Finance & Insurance Tools

**Routes:**

| Tool | Route | Description |
|------|-------|-------------|
| Car Loan Calculator | `/car-loan` | EMI calculator with bank comparison |
| Car Insurance | `/car-insurance` | Insurance quote comparison |
| Fuel Price | `/fuel-price` | City-wise fuel price tracker |
| RTO Info | `/rto` | RTO office directory and fee calculator |

**Car Loan Calculator** (`/car-loan`):
- EMI calculator with adjustable tenure, down payment, interest rate
- Bank-wise interest rate comparison
- Pre-approval eligibility check
- Total interest cost visualization

**Car Insurance** (`/car-insurance`):
- Comprehensive vs. third-party comparison
- IDV (Insured Declared Value) calculator
- Multi-insurer quote comparison
- Add-on coverage recommendations

---

## 4. How Dealer & Buyer Connect

The platform uses a shared PostgreSQL database (Supabase) as the connection point between dealer and buyer experiences.

**Vehicle Flow:**
```
Dealer adds vehicle via /inventory/add
    |
    v
Vehicle stored in DB (Vehicle table)
    |-- status: AVAILABLE
    |-- dealerId links to DealerProfile
    |-- AI description auto-generated
    |
    v
Buyer browses /showroom, /used-cars, /new-cars
    |
    v
API: GET /api/vehicles returns AVAILABLE vehicles
    |
    v
Buyer views vehicle at /vehicle/[id]
    |
    v
Buyer inquires (WhatsApp, call, or message)
    |
    v
Lead created in DB (Lead table)
    |-- linked to Vehicle + Buyer contact
    |-- source: WEBSITE/WHATSAPP/etc.
    |-- sentiment: AI-analyzed (HOT/WARM/COOL)
    |
    v
Dealer sees lead in /leads CRM
    |
    v
Dealer responds (manual or AI auto-reply)
    |
    v
Conversation tracked in LeadMessage table
    |
    v
Deal progresses through pipeline
    NEW -> CONTACTED -> QUALIFIED -> CLOSED_WON
```

**Data Isolation:**
- Buyers never see dealer-internal pages (middleware + AuthGuard protection)
- No dealer CTAs, links, or references appear in buyer UI
- Dealer routes (`/dashboard`, `/inventory`, `/leads`, `/settings`, etc.) return 302 redirect to `/login/dealer` for unauthenticated users
- Buyer pages use `BuyerBottomNav` and `BuyerPageLayout`; dealer pages use `DealerAppShell` and `DealerPageLayout`

---

## 5. Subscription Plans

### Plan Summary

| Aspect | FREE | STARTER | GROWTH | ENTERPRISE |
|--------|------|---------|--------|------------|
| **Price (Monthly)** | INR 0 | INR 1,999 | INR 4,999 | INR 14,999 |
| **Price (Annual)** | INR 0 | INR 19,990 | INR 49,990 | INR 1,49,990 |
| **Annual Savings** | -- | INR 3,998 | INR 9,998 | INR 29,998 |
| **Tagline** | Get started, zero cost | For independent dealers | For growing dealerships | For large dealership chains |
| **Badge** | -- | -- | Gold Dealer | Platinum Dealer |

### Feature Availability by Plan

**Inventory & Leads:**
- FREE: 5 vehicles, 20 leads/mo
- STARTER: 25 vehicles, 100 leads/mo
- GROWTH: 100 vehicles, unlimited leads
- ENTERPRISE: Unlimited everything

**AI Content Tools:**
- FREE: Descriptions only (10 calls/mo)
- STARTER: + Quick Draft, Sentiment (50 calls/mo)
- GROWTH: + Creative Suggestions, Notification Enhancement, Smart Reply, Auto-Reply, Follow-ups, Agent Memory (200 calls/mo)
- ENTERPRISE: All AI tools, unlimited calls

**Photo & Video Studio:**
- FREE: None
- STARTER: Background Removal (20/mo)
- GROWTH: + Mood Application, Reel Scripts, TTS (100 photo / 30 video per mo)
- ENTERPRISE: + Cinema Exports (4K), unlimited

**Analytics & Intelligence:**
- FREE: Basic dashboard, 7-day retention
- STARTER: 30-day retention
- GROWTH: Advanced analytics, benchmarks, health score, basic intelligence, 90-day retention
- ENTERPRISE: Full intelligence suite, data export, unlimited retention

**Communication:**
- FREE: Manual responses only
- STARTER: Manual responses only
- GROWTH: WhatsApp integration
- ENTERPRISE: + Bulk messaging

**Marketing:**
- FREE: None
- STARTER: None
- GROWTH: Social Hub, campaign tools
- ENTERPRISE: + Auto-posting

**Management:**
- FREE: 1 member, 1 store
- STARTER: 2 members, 1 store
- GROWTH: 5 members, 3 stores, lead assignment, team roles
- ENTERPRISE: Unlimited members/stores, multi-store management, API access, custom branding

---

## 6. Technical Architecture

### Stack
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS v4
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 7.4.1
- **Auth:** Supabase Auth (email/password + Google SSO)
- **AI:** OpenAI (descriptions, concierge, valuation, sentiment)
- **Media AI:** Replicate (photo studio)
- **Payments:** Razorpay (subscriptions)
- **State:** Zustand 5
- **Animations:** Framer Motion 12
- **Icons:** Material Symbols Outlined

### Route Protection
All dealer routes are protected by server-side middleware (`src/lib/supabase/middleware.ts`) that:
1. Refreshes the auth session on every request
2. Checks if the current route starts with any protected prefix (29 prefixes including `/dashboard`, `/inventory`, `/leads`, `/settings`, `/studio`, `/intelligence`, etc.)
3. Redirects unauthenticated users to `/login/dealer?redirect={path}`

### Data Fetching Pattern
```
Client Component
    |-- useApi(fetchFunction, dependencies)
    |-- Renders SkeletonCard during loading
    |
    v
src/lib/api.ts (fetch functions)
    |-- fetchVehicles(), fetchDashboard(), fetchLeads(), etc.
    |
    v
Next.js API Routes (/api/*)
    |-- Zod validation on POST
    |-- Auth check via Supabase server client
    |
    v
Prisma ORM -> Supabase PostgreSQL
```

### Key Database Models
- **User** -- Auth user (buyer or dealer)
- **DealerProfile** -- One-to-one with User; stores plan, dealershipName, GST, etc.
- **Vehicle** -- Car listing with AI score, status, pricing
- **Lead** -- Buyer inquiry with sentiment, source, status pipeline
- **LeadMessage** -- Conversation messages (manual + AI auto-replies)
- **Notification** -- System notifications
- **Activity** -- Audit trail for all actions
- **Appointment** -- Scheduled meetings
- **Subscription** -- Plan billing records
- **Store** -- Multi-location support

---

## 7. API Reference Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Current user + dealer profile |
| POST | `/api/auth/dealer-signup` | Create dealer account (Zod-validated) |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Paginated vehicle list (filter by status) |
| GET | `/api/vehicles/[id]` | Single vehicle detail |
| POST | `/api/vehicles` | Create vehicle (dealer auth required) |
| PUT | `/api/vehicles/[id]` | Update vehicle (dealer auth required) |
| DELETE | `/api/vehicles/[id]` | Delete vehicle (dealer auth required) |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Lead list (dealer auth required) |
| GET | `/api/leads/[id]` | Lead detail + messages |
| POST | `/api/leads` | Create lead (from buyer inquiry) |
| PATCH | `/api/leads/[id]` | Update lead status |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/performance` | Inventory health, sentiment, revenue, top vehicles |
| GET | `/api/analytics/reports` | Monthly stats, MoM growth, source breakdown |
| GET | `/api/dashboard` | Dashboard summary metrics |

### Dealer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dealer/profile` | Dealer profile data |
| PUT | `/api/dealer/profile` | Update dealer profile |
| GET | `/api/stores` | Store list |

### Buyer
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Buyer wishlist |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist/[id]` | Remove from wishlist |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/service/book` | Book service (inspection, RC transfer, etc.) |
| GET | `/api/appointments` | Appointment list |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/describe` | Generate vehicle description |
| POST | `/api/ai/concierge` | AI concierge chat |
| POST | `/api/ai/valuation` | Vehicle valuation |
| POST | `/api/ai/sentiment` | Lead sentiment analysis |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |

---

*Document generated March 2026. CaroBest v2.0.*
