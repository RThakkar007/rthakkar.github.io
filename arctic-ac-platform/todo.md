# ArcticAC Platform — TODO

## Foundation
- [x] Database schema: users, technicians, services, bookings, jobs, payments, zones, notifications
- [x] Drizzle migrations applied
- [x] Arctic Pro dark theme (navy/black + cyan) in index.css
- [x] Google Fonts (Inter + Space Grotesk) in index.html
- [x] App routing structure in App.tsx

## Backend API
- [x] Services CRUD router
- [x] Bookings router (create, list, get by id, update status)
- [x] Technicians router (CRUD, availability, location update)
- [x] Jobs router (assign, accept, reject, update status, complete with photo)
- [x] GPS assignment logic (nearest technician → zone fallback → admin override)
- [x] Payments router (COD default, Razorpay integration)
- [x] Notifications router (push to customer + technician on stage change)
- [x] Analytics router (daily bookings, completion rate, technician performance)
- [x] Admin zone/area configuration router
- [x] File upload (S3) for technician photo proof

## Customer Website
- [x] Homepage — hero, services overview, how it works, CTA
- [x] Services page — all AC service types with descriptions
- [x] Booking page — service selection, date/time, customer details, confirmation
- [x] Service status tracking page — Assigned / On the Way / Completed stages
- [x] About Us page
- [x] Contact Us page
- [x] Terms of Service page
- [x] Privacy Policy page
- [x] Cancellation & Refund Policy page
- [x] User registration page
- [x] User login page
- [x] Forgot password page
- [x] Guest booking with account creation prompt
- [x] My Bookings page (customer dashboard)

## Admin Dashboard
- [x] Admin login / auth guard
- [x] Live bookings overview (status, technician, customer details)
- [x] Technician management (add/edit, availability, live location on map)
- [x] Manual job assignment and reassignment
- [x] Area/zone configuration
- [x] Service management (add/edit service types)
- [x] Payment records and transaction history
- [x] Analytics dashboard (daily bookings, completion rate, technician performance)
- [x] Live map with technician GPS markers and active jobs

## Technician Portal
- [x] Technician login page
- [x] Real-time job request notifications (Accept / Reject)
- [x] Customer details view with one-tap call button
- [x] Job status update controls (On the Way, In Progress, Completed)
- [x] Photo proof upload on job completion (S3)
- [x] Job history view

## Real-time & Integrations
- [x] WebSocket / polling for live job status updates
- [x] Push notifications to customers at every stage transition
- [x] Push notifications to technicians on new job request
- [x] Google Maps integration for admin map view
- [x] GPS-based nearest technician assignment logic
- [x] Razorpay payment gateway integration
- [x] S3 secure photo proof storage

## Polish & Delivery
- [x] Vitest unit tests for core routers (8 tests passing)
- [x] Responsive mobile design
- [x] Final checkpoint saved
- [x] GitHub repository upload → https://github.com/RThakkar007/rthakkar.github.io/tree/main/arctic-ac-platform

## i18n — Multilingual Support (EN/HI/GU)
- [x] LanguageContext with localStorage persistence
- [x] i18n.ts translation map — EN/HI/GU for all pages
- [x] Language switcher in Navbar (desktop dropdown + mobile drawer)
- [x] Dark/light mode toggle in Navbar
- [x] Home.tsx — wired to useLanguage
- [x] Services.tsx — wired to useLanguage
- [x] Booking.tsx — wired to useLanguage
- [x] TrackBooking.tsx — wired to useLanguage
- [x] MyBookings.tsx — wired to useLanguage
- [x] About.tsx — wired to useLanguage
- [x] Contact.tsx — wired to useLanguage
- [x] Login.tsx — wired to useLanguage
- [x] Register.tsx — wired to useLanguage
- [x] Footer.tsx — wired to useLanguage
- [x] TypeScript: 0 errors after all wiring
- [x] Tests: 33/33 passing after all wiring

## Client-Side Form Error Handling
- [x] Contact.tsx — inline field validation (name/email/phone/message), error messages under each field, loading spinner, success screen
- [x] Booking.tsx — per-step validation: service selection hint (step 0), date+address errors (step 1), guest field validation with inline errors (step 2), final submit guard
- [x] Booking.tsx — guest fields (name/email/phone) validated before proceeding to payment step
- [x] Booking.tsx — correct error messages for each failure case (no service, no date, no address, invalid guest fields)
- [ ] AdminServices dialog — required field validation before mutate
- [ ] AdminTechnicians dialog — required field validation before mutate
- [ ] AdminZones dialog — required field validation before mutate
- [ ] TechLogin — inline validation before submit

## Responsive & UX Polish
- [x] Booking flow: auto-scroll to top of card on every step change
- [x] Booking flow: mobile-friendly calendar and time slot grid
- [x] Booking flow: address autocomplete mobile touch UX
- [x] Navbar: mobile hamburger menu with slide-out drawer
- [x] Navbar: hide nav links on mobile, show only logo + hamburger
- [x] Homepage: responsive hero, services grid, stats on mobile
- [x] Services page: responsive card grid on mobile
- [x] Track Booking page: mobile-friendly timeline
- [x] My Bookings page: mobile card layout
- [x] About/Contact/Policy pages: mobile typography and spacing
- [x] Admin Dashboard: collapsible sidebar on mobile/tablet
- [x] Technician Portal: mobile-first layout for job cards
- [x] Global: 44px min touch targets on all buttons and links
- [x] Global: smooth scroll behavior, safe area insets for notched phones
- [x] Global: font size scaling for small screens
