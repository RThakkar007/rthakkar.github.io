import { and, desc, eq, isNotNull, isNull, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Booking,
  InsertBooking,
  InsertTechnician,
  InsertUser,
  bookings,
  jobUpdates,
  notifications,
  payments,
  services,
  technicians,
  users,
  zones,
} from "../drizzle/schema";
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
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod", "phone"] as const;
  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    (values as Record<string, unknown>)[field] = normalized;
    updateSet[field] = normalized;
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// ─── Services ────────────────────────────────────────────────────────────────
export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).where(eq(services.isActive, true)).orderBy(services.name);
}

export async function getAllServicesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).orderBy(services.name);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

export async function createService(data: {
  name: string;
  description?: string;
  price: string;
  duration: number;
  category?: string;
  icon?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(services).values(data);
}

export async function updateService(id: number, data: Partial<typeof services.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(services).set(data).where(eq(services.id, id));
}

// ─── Zones ────────────────────────────────────────────────────────────────────
export async function getAllZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(zones).orderBy(zones.name);
}

export async function createZone(data: { name: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(zones).values(data);
}

export async function updateZone(id: number, data: Partial<typeof zones.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(zones).set(data).where(eq(zones.id, id));
}

// ─── Technicians ─────────────────────────────────────────────────────────────
export async function getAllTechnicians() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(technicians).orderBy(technicians.name);
}

export async function getActiveTechnicians() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(technicians)
    .where(and(eq(technicians.isActive, true), eq(technicians.isAvailable, true)));
}

export async function getTechnicianById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(technicians).where(eq(technicians.id, id)).limit(1);
  return result[0];
}

export async function getTechnicianByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(technicians)
    .where(eq(technicians.email, email))
    .limit(1);
  return result[0];
}

export async function createTechnician(data: InsertTechnician) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(technicians).values(data);
}

export async function updateTechnician(
  id: number,
  data: Partial<typeof technicians.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(technicians).set(data).where(eq(technicians.id, id));
}

export async function updateTechnicianLocation(
  id: number,
  latitude: number,
  longitude: number
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(technicians)
    .set({ latitude, longitude, lastLocationUpdate: new Date() })
    .where(eq(technicians.id, id));
}

// ─── GPS Assignment Logic ─────────────────────────────────────────────────────
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearestTechnician(
  lat: number,
  lon: number,
  zoneId?: number
): Promise<{ technicianId: number; method: "gps" | "zone" | null }> {
  const db = await getDb();
  if (!db) return { technicianId: -1, method: null };

  // 1. GPS-based: find available technicians with known location
  const available = await db
    .select()
    .from(technicians)
    .where(
      and(
        eq(technicians.isActive, true),
        eq(technicians.isAvailable, true),
        isNotNull(technicians.latitude),
        isNotNull(technicians.longitude)
      )
    );

  if (available.length > 0) {
    let nearest = available[0];
    let minDist = Infinity;
    for (const t of available) {
      if (t.latitude != null && t.longitude != null) {
        const d = haversineDistance(lat, lon, t.latitude, t.longitude);
        if (d < minDist) {
          minDist = d;
          nearest = t;
        }
      }
    }
    return { technicianId: nearest.id, method: "gps" };
  }

  // 2. Zone-based fallback
  if (zoneId) {
    const zoneAvailable = await db
      .select()
      .from(technicians)
      .where(
        and(
          eq(technicians.isActive, true),
          eq(technicians.isAvailable, true),
          eq(technicians.zoneId, zoneId)
        )
      )
      .limit(1);
    if (zoneAvailable.length > 0) {
      return { technicianId: zoneAvailable[0].id, method: "zone" };
    }
  }

  return { technicianId: -1, method: null };
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export async function getAllBookings(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit);
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0];
}

export async function getBookingByRef(ref: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.bookingRef, ref))
    .limit(1);
  return result[0];
}

export async function getBookingsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt));
}

export async function getBookingsByTechnician(technicianId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.technicianId, technicianId))
    .orderBy(desc(bookings.createdAt));
}

export async function getActiveJobForTechnician(technicianId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.technicianId, technicianId),
        or(
          eq(bookings.status, "assigned"),
          eq(bookings.status, "on_the_way"),
          eq(bookings.status, "in_progress")
        )
      )
    )
    .limit(1);
  return result[0];
}

export async function createBooking(data: InsertBooking) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(bookings).values(data);
}

export async function updateBookingStatus(
  id: number,
  status: Booking["status"],
  extra?: Partial<typeof bookings.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(bookings)
    .set({ status, ...extra })
    .where(eq(bookings.id, id));
}

export async function assignTechnicianToBooking(
  bookingId: number,
  technicianId: number,
  method: "gps" | "zone" | "manual"
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(bookings)
    .set({ technicianId, status: "assigned", assignmentMethod: method })
    .where(eq(bookings.id, bookingId));
  // Mark technician as unavailable
  await db
    .update(technicians)
    .set({ isAvailable: false })
    .where(eq(technicians.id, technicianId));
}

// ─── Job Updates ──────────────────────────────────────────────────────────────
export async function addJobUpdate(data: {
  bookingId: number;
  status: typeof jobUpdates.$inferInsert["status"];
  note?: string;
  photoUrl?: string;
  updatedBy?: "system" | "technician" | "admin";
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(jobUpdates).values(data);
}

export async function getJobUpdates(bookingId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(jobUpdates)
    .where(eq(jobUpdates.bookingId, bookingId))
    .orderBy(jobUpdates.createdAt);
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export async function createPayment(data: {
  bookingId: number;
  amount: string;
  method: "cod" | "razorpay";
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(payments).values(data);
}

export async function updatePayment(
  id: number,
  data: Partial<typeof payments.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(payments).set(data).where(eq(payments.id, id));
}

export async function getPaymentByBooking(bookingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, bookingId))
    .limit(1);
  return result[0];
}

export async function getAllPayments(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).orderBy(desc(payments.createdAt)).limit(limit);
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function createNotification(data: {
  recipientType: "customer" | "technician" | "admin";
  recipientId: number;
  bookingId?: number;
  title: string;
  message: string;
  type: typeof notifications.$inferInsert["type"];
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function getNotificationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.recipientType, "customer"),
        eq(notifications.recipientId, userId)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

export async function getNotificationsForTechnician(technicianId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.recipientType, "technician"),
        eq(notifications.recipientId, technicianId)
      )
    )
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export async function getAnalytics() {
  const db = await getDb();
  if (!db) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalBookings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings);
  const [todayBookings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(sql`DATE(${bookings.createdAt}) = CURDATE()`);
  const [completedBookings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "completed"));
  const [pendingBookings] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookings)
    .where(eq(bookings.status, "pending"));
  const [totalRevenue] = await db
    .select({ sum: sql<string>`COALESCE(SUM(${payments.amount}), 0)` })
    .from(payments)
    .where(eq(payments.status, "paid"));

  const technicianStats = await db
    .select({
      technicianId: bookings.technicianId,
      total: sql<number>`count(*)`,
      completed: sql<number>`SUM(CASE WHEN ${bookings.status} = 'completed' THEN 1 ELSE 0 END)`,
    })
    .from(bookings)
    .where(isNotNull(bookings.technicianId))
    .groupBy(bookings.technicianId)
    .limit(10);

  return {
    totalBookings: Number(totalBookings?.count ?? 0),
    todayBookings: Number(todayBookings?.count ?? 0),
    completedBookings: Number(completedBookings?.count ?? 0),
    pendingBookings: Number(pendingBookings?.count ?? 0),
    totalRevenue: parseFloat(totalRevenue?.sum ?? "0"),
    completionRate:
      Number(totalBookings?.count) > 0
        ? Math.round(
            (Number(completedBookings?.count) / Number(totalBookings?.count)) * 100
          )
        : 0,
    technicianStats,
  };
}
