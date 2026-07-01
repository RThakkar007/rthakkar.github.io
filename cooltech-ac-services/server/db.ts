import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, technicians, bookings, reviews, cartItems, technicianLocations } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    textFields.forEach((field) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    });
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: { name?: string; phone?: string; address?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ─── Services ─────────────────────────────────────────────────────────────────
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.id);
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result[0] ?? null;
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0] ?? null;
}

// ─── Technicians ──────────────────────────────────────────────────────────────
export async function getAllTechnicians() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technicians).orderBy(desc(technicians.rating));
}

export async function getAvailableTechnicians() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technicians).where(eq(technicians.isAvailable, true)).orderBy(desc(technicians.rating));
}

export async function getTechnicianById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(technicians).where(eq(technicians.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getTechnicianLocation(technicianId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(technicianLocations).where(eq(technicianLocations.technicianId, technicianId)).limit(1);
  return result[0] ?? null;
}

export async function updateTechnicianLocation(technicianId: number, latitude: number, longitude: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await getTechnicianLocation(technicianId);
  if (existing) {
    await db.update(technicianLocations).set({ latitude, longitude }).where(eq(technicianLocations.technicianId, technicianId));
  } else {
    await db.insert(technicianLocations).values({ technicianId, latitude, longitude });
  }
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export async function createBooking(data: {
  userId: number;
  serviceId: number;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  city?: string;
  totalAmount: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const bookingRef = "CT" + Date.now().toString(36).toUpperCase();
  // Auto-assign an available technician
  const availableTechs = await getAvailableTechnicians();
  const technicianId = availableTechs.length > 0 ? availableTechs[Math.floor(Math.random() * Math.min(availableTechs.length, 3))].id : null;
  await db.insert(bookings).values({ ...data, bookingRef, technicianId, status: "confirmed" });
  const result = await db.select().from(bookings).where(eq(bookings.bookingRef, bookingRef)).limit(1);
  return result[0];
}

export async function getBookingsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.userId, userId)).orderBy(desc(bookings.createdAt));
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0] ?? null;
}

export async function updateBookingPayment(bookingId: number, stripePaymentIntentId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(bookings).set({ paymentStatus: "paid", status: "assigned", stripePaymentIntentId }).where(eq(bookings.id, bookingId));
}

export async function updateBookingStatus(bookingId: number, status: "pending" | "confirmed" | "assigned" | "en_route" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) return;
  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function getReviewsByServiceId(serviceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.serviceId, serviceId)).orderBy(desc(reviews.createdAt)).limit(20);
}

export async function getReviewsByTechnicianId(technicianId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.technicianId, technicianId)).orderBy(desc(reviews.createdAt)).limit(20);
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(50);
}

export async function createReview(data: { userId: number; serviceId: number; technicianId?: number; bookingId?: number; rating: number; comment: string; authorName: string }) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(reviews).values(data);
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export async function getCartItems(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
}

export async function addCartItem(sessionId: string, serviceId: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(cartItems).where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.serviceId, serviceId))).limit(1);
  if (existing.length > 0) {
    await db.update(cartItems).set({ quantity: existing[0].quantity + 1 }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ sessionId, serviceId, quantity: 1 });
  }
}

export async function removeCartItem(sessionId: string, serviceId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(and(eq(cartItems.sessionId, sessionId), eq(cartItems.serviceId, serviceId)));
}

export async function clearCart(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}
