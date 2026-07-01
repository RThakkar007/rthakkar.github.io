# CoolTech AC Services — Project TODO

## Phase 1: Database Schema & Backend
- [x] Define schema: services, technicians, bookings, reviews, technician_locations, cart_items
- [x] Generate and apply DB migrations
- [x] Seed services data (Foam-jet 1-5 ACs, AC Repair, Gas Refill, Installation, Uninstallation)
- [x] Seed technician profiles with ratings, reviews, experience
- [x] tRPC router: services (list, getById)
- [x] tRPC router: technicians (list, getById, getNearby)
- [x] tRPC router: bookings (create, list, getById, updateStatus)
- [x] tRPC router: reviews (list by service/technician, create)
- [x] tRPC router: cart (add, remove, clear, get)
- [x] tRPC router: payments (createIntent, confirmBooking)
- [x] tRPC router: tracking (getTechnicianLocation, updateLocation)

## Phase 2: Home Page
- [x] Hero section with city/location selector and AC services CTA
- [x] Trust badges: "Transparent Pricing", "Trained Experts", "Fully Equipped"
- [x] AC service category cards (highlighted, prominent)
- [x] How it works section (3-step flow)
- [x] Featured technicians section
- [x] Customer reviews/testimonials section
- [x] Footer with links and contact info

## Phase 3: AC Services Catalog
- [x] Service listing page with all 5 AC service types
- [x] Pricing, duration, ratings on each card
- [x] Add to Cart button per service
- [x] Book Now button (direct booking flow)
- [x] Service detail modal/drawer
- [x] Cart sidebar/drawer

## Phase 4: Multi-Step Booking Flow
- [x] Step 1: Service selection confirmation
- [x] Step 2: Date and time slot picker
- [x] Step 3: Address input with map pin
- [x] Step 4: Order summary review
- [x] Step 5: Stripe payment checkout
- [x] Step 6: Booking confirmation with technician details

## Phase 5: Stripe Payment Integration
- [x] Stripe setup via webdev_add_feature
- [x] Payment intent creation on backend
- [x] Stripe Elements on frontend
- [x] Post-payment confirmation screen with technician details

## Phase 6: GPS Technician Locator
- [x] Map page showing technicians in local area
- [x] "Find Near Me" button using browser geolocation
- [x] Technician markers on map with popup cards
- [x] Distance and availability indicators

## Phase 7: Live Technician Tracking
- [x] Real-time map with technician's live location
- [x] ETA display
- [x] Technician profile card (photo, name, rating, contact)
- [x] Simulated location updates for demo

## Phase 8: User Auth & Account
- [x] Login / Sign-up flow
- [x] User profile page
- [x] Booking history list
- [x] Active booking status tracker
- [x] Profile management (name, phone, address)

## Phase 9: Technician Profiles
- [x] Individual technician profile page
- [x] Photo, name, rating, experience, verified badge
- [x] Customer reviews on profile
- [x] Services offered list

## Phase 10: Reviews & Ratings
- [x] Star rating display on service cards
- [x] Review list on service detail
- [x] Review list on technician profile
- [x] Submit review after completed booking

## Phase 11: Polish & Testing
- [x] Mobile responsiveness across all pages
- [x] Loading states and error handling
- [x] Vitest unit tests for routers (17 tests passing)
- [x] Final UI polish and animations
- [x] Push code to GitHub repository
