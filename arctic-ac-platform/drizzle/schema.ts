import {
  boolean,
  decimal,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users (customers + admins) ─────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ─── Service Zones ───────────────────────────────────────────────────────────
export const zones = mysqlTable("zones", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Technicians ─────────────────────────────────────────────────────────────
export const technicians = mysqlTable("technicians", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  zoneId: int("zoneId"),
  latitude: float("latitude"),
  longitude: float("longitude"),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  profilePhoto: text("profilePhoto"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Services ────────────────────────────────────────────────────────────────
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: int("duration").notNull(),
  category: varchar("category", { length: 50 }),
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingRef: varchar("bookingRef", { length: 20 }).notNull().unique(),
  userId: int("userId"),
  guestName: varchar("guestName", { length: 100 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  guestPhone: varchar("guestPhone", { length: 20 }),
  serviceId: int("serviceId").notNull(),
  technicianId: int("technicianId"),
  zoneId: int("zoneId"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  address: text("address").notNull(),
  latitude: float("latitude"),
  longitude: float("longitude"),
  status: mysqlEnum("status", [
    "pending",
    "assigned",
    "on_the_way",
    "in_progress",
    "completed",
    "cancelled",
  ])
    .default("pending")
    .notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cod", "razorpay"])
    .default("cod")
    .notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"])
    .default("pending")
    .notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  assignmentMethod: mysqlEnum("assignmentMethod", ["gps", "zone", "manual"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Job Updates (status history) ────────────────────────────────────────────
export const jobUpdates = mysqlTable("jobUpdates", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  status: mysqlEnum("status", [
    "pending",
    "assigned",
    "on_the_way",
    "in_progress",
    "completed",
    "cancelled",
  ]).notNull(),
  note: text("note"),
  photoUrl: text("photoUrl"),
  updatedBy: mysqlEnum("updatedBy", ["system", "technician", "admin"]).default("system"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Payments ─────────────────────────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  method: mysqlEnum("method", ["cod", "razorpay"]).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"])
    .default("pending")
    .notNull(),
  razorpayOrderId: varchar("razorpayOrderId", { length: 100 }),
  razorpayPaymentId: varchar("razorpayPaymentId", { length: 100 }),
  razorpaySignature: varchar("razorpaySignature", { length: 255 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientType: mysqlEnum("recipientType", ["customer", "technician", "admin"]).notNull(),
  recipientId: int("recipientId").notNull(),
  bookingId: int("bookingId"),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: mysqlEnum("type", [
    "job_assigned",
    "job_accepted",
    "on_the_way",
    "completed",
    "new_booking",
    "payment",
  ]).notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Technician = typeof technicians.$inferSelect;
export type InsertTechnician = typeof technicians.$inferInsert;
export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type JobUpdate = typeof jobUpdates.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Zone = typeof zones.$inferSelect;
