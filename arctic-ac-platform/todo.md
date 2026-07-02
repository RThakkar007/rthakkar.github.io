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
- [ ] Forgot password page
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
- [ ] GitHub repository upload
