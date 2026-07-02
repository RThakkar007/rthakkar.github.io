# ArcticAC — On-Demand AC Service Platform

Full-stack platform for booking, tracking, and managing AC repair/installation services in real time.

## Tech Stack
- React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Node.js + Express 4 + tRPC 11
- MySQL/TiDB (Drizzle ORM)
- Manus OAuth (customer) + JWT (technician)
- Amazon S3 (photo proof storage)
- Google Maps API (live tracking)
- Razorpay (payment gateway)
- Vitest (8 tests passing)

## Portals
| Portal | URL | Description |
|--------|-----|-------------|
| Customer Website | / | Homepage, booking, tracking, auth |
| Admin Dashboard | /admin | Bookings, technicians, map, analytics |
| Technician Portal | /tech/login | Job management, GPS, photo proof |

## Key Features
- 4-step booking flow (Service → Schedule → Details → Payment)
- Real-time tracking: Assigned → On the Way → Completed
- GPS-based nearest technician auto-assignment
- Admin manual override + zone/area fallback
- Push notifications at every stage transition
- Photo proof upload to S3 on job completion
- COD default + Razorpay payment gateway
- Arctic Pro dark theme (navy/black + cyan)

## Setup
```bash
pnpm install
pnpm dev      # Start dev server
pnpm test     # Run 8 tests
pnpm check    # TypeScript check
```

## Database Schema
users, technicians, services, bookings, jobUpdates, payments, notifications, zones

## Design — Arctic Pro Dark
Background: #0A0E1A | Primary: #00D4FF | Font: Inter + Space Grotesk
