# Radharani Tours & Travels — PRD

## Original Problem Statement
Build a complete, production-ready website + booking management system for **Radharani Tours & Travels** — an Indian tour & travel / taxi / cab booking business serving Mathura, Vrindavan, Agra and Delhi. Public site + secure admin dashboard with real DB persistence. No fake data or fake payments.

## User Personas
- **Traveler / Customer**: browses fleet, tour packages and destinations, submits a booking request, contacts via WhatsApp / Phone.
- **Business Owner (Admin)**: manages bookings, vehicles, tours, destinations, reviews, gallery and business settings from a secure dashboard.

## Design
- Hybrid theme: dark navy + gold hero with Radha-Krishna spiritual accents ("Radhe Radhe"), transitioning to clean light content.
- Fonts: Playfair Display (headings), Outfit (body), Great Vibes (accent).

## Architecture
- **Backend**: FastAPI + Motor + MongoDB. JWT bearer auth (12h admin session). All routes prefixed `/api`. Atomic booking-ID counter (RRT-YYYY-NNNN). Idempotent seed on startup.
- **Frontend**: React 19 + Tailwind + Shadcn + sonner + lucide-react. AuthContext + SettingsContext. Public layout with Navbar/Footer/Floating WhatsApp+Call.

## Implemented (2026-02-25)
- Public pages: Home (hero + booking widget + fleet + destinations + why-us + reviews + CTA), About, Fleet, Tour Packages, Destinations, Booking, Booking Confirmation, Contact (with Google Maps), Reviews, Gallery (categorized), Privacy, Terms.
- Admin: Login (JWT), Dashboard (stats + recent bookings), Bookings (list/filter/search + status modal + vehicle assignment + notes), Vehicles/Tours/Destinations/Reviews/Gallery CRUD, Customers list, Business Settings (all editable — phone, WhatsApp, email, address, social, maps, headline etc).
- Backend: POST/GET bookings with unique ID, admin CRUD for all resources, stats, contact form, review approval workflow.
- Seed data: admin user, 3 vehicles (Aura/Ertiga/Eeco), 4 destinations (Mathura/Vrindavan/Agra/Delhi), default settings with placeholder contact.
- WhatsApp click-to-chat (uses admin-editable number) + sticky Call button on all pages.
- SEO: LocalBusiness JSON-LD, meta tags, OG image, robots.txt, sitemap.xml.

## Test Credentials
- Admin: `admin@radharanitours.com` / `Radhe@2026`

## Backlog / P1
- Sample tour packages (currently empty — user should add real ones via admin)
- Sample gallery images (empty — add via admin)
- Real business contact info (currently placeholder `+91-XXXXXXXXXX`)
- Vehicle conflict detection when assigning to bookings for the same date/time
- Email/SMS notification to admin on new booking (Resend / Twilio integration)
- Payment gateway integration (Stripe / Razorpay) — deferred per user

## P2
- Bulk vehicle unavailability calendar
- Booking history per customer view
- Export bookings CSV
- Admin change-password UI
