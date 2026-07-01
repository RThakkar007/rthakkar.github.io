import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  float,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Services ────────────────────────────────────────────────────────────────
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["cleaning", "repair", "installation", "gas"]).notNull(),
  description: text("description"),
  basePrice: decimal("basePrice", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2 }),
  durationMinutes: int("durationMinutes").notNull(),
  unit: varchar("unit", { length: 50 }).default("per service"),
  acCount: int("acCount").default(1),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.75"),
  reviewCount: int("reviewCount").default(0),
  isPopular: boolean("isPopular").default(false),
  imageUrl: text("imageUrl"),
  highlights: text("highlights"), // JSON array stored as text
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ─── Technicians ─────────────────────────────────────────────────────────────
export const technicians = mysqlTable("technicians", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  photoUrl: text("photoUrl"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.80"),
  reviewCount: int("reviewCount").default(0),
  yearsExperience: int("yearsExperience").default(1),
  isVerified: boolean("isVerified").default(true),
  isAvailable: boolean("isAvailable").default(true),
  specializations: text("specializations"), // JSON array
  latitude: float("latitude"),
  longitude: float("longitude"),
  bio: text("bio"),
  completedJobs: int("completedJobs").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Technician = typeof technicians.$inferSelect;
export type InsertTechnician = typeof technicians.$inferInsert;

// ─── Technician Locations (live tracking) ────────────────────────────────────
export const technicianLocations = mysqlTable("technician_locations", {
  id: int("id").autoincrement().primaryKey(),
  technicianId: int("technicianId").notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechnicianLocation = typeof technicianLocations.$inferSelect;

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingRef: varchar("bookingRef", { length: 20 }).notNull().unique(),
  userId: int("userId").notNull(),
  technicianId: int("technicianId"),
  serviceId: int("serviceId").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "assigned",
    "en_route",
    "in_progress",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  scheduledDate: varchar("scheduledDate", { length: 20 }).notNull(), // YYYY-MM-DD
  scheduledTime: varchar("scheduledTime", { length: 10 }).notNull(), // HH:MM
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 200 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ─── Cart Items ───────────────────────────────────────────────────────────────
export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 100 }).notNull(),
  serviceId: int("serviceId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId"),
  userId: int("userId").notNull(),
  technicianId: int("technicianId"),
  serviceId: int("serviceId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  authorName: varchar("authorName", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
