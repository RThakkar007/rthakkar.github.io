import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  addJobUpdate,
  assignTechnicianToBooking,
  createBooking,
  createNotification,
  createPayment,
  createService,
  createTechnician,
  createZone,
  findNearestTechnician,
  getActiveJobForTechnician,
  getAllBookings,
  getAllPayments,
  getAllServices,
  getAllServicesAdmin,
  getAllTechnicians,
  getAllZones,
  getAnalytics,
  getBookingByRef,
  getBookingById,
  getBookingsByTechnician,
  getBookingsByUser,
  getJobUpdates,
  getNotificationsForTechnician,
  getNotificationsForUser,
  getPaymentByBooking,
  getTechnicianByEmail,
  getTechnicianById,
  markNotificationRead,
  updateBookingStatus,
  updateService,
  updateTechnician,
  updateTechnicianLocation,
  updateZone,
  getUserByOpenId,
} from "./db";
import { storagePut } from "./storage";
import { ENV } from "./_core/env";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret-change-me");

async function signTechJwt(payload: object): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

async function verifyTechJwt(token: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as Record<string, unknown>;
}

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Services Router ─────────────────────────────────────────────────────────
const servicesRouter = router({
  list: publicProcedure.query(() => getAllServices()),
  listAdmin: adminProcedure.query(() => getAllServicesAdmin()),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        duration: z.number().int().positive(),
        category: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .mutation(({ input }) => createService(input)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        duration: z.number().optional(),
        category: z.string().optional(),
        icon: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateService(id, data);
    }),
});

// ─── Zones Router ─────────────────────────────────────────────────────────────
const zonesRouter = router({
  list: publicProcedure.query(() => getAllZones()),
  create: adminProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().optional() }))
    .mutation(({ input }) => createZone(input)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateZone(id, data);
    }),
});

// ─── Technicians Router ───────────────────────────────────────────────────────
const techniciansRouter = router({
  list: adminProcedure.query(() => getAllTechnicians()),
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getTechnicianById(input.id)),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(10),
        password: z.string().min(6),
        zoneId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const passwordHash = await bcrypt.hash(input.password, 10);
      await createTechnician({
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        zoneId: input.zoneId,
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        zoneId: z.number().optional(),
        isAvailable: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateTechnician(id, data);
    }),
  updateLocation: publicProcedure
    .input(z.object({ id: z.number(), latitude: z.number(), longitude: z.number() }))
    .mutation(({ input }) =>
      updateTechnicianLocation(input.id, input.latitude, input.longitude)
    ),
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const tech = await getTechnicianByEmail(input.email);
      if (!tech || !tech.isActive) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const valid = await bcrypt.compare(input.password, tech.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      const token = await signTechJwt({ technicianId: tech.id, role: "technician" });
      ctx.res.cookie("tech_session", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      });
      return { token, technician: { id: tech.id, name: tech.name, email: tech.email, phone: tech.phone } };
    }),
  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.tech_session;
    if (!token) return null;
    try {
      const payload = await verifyTechJwt(token) as { technicianId: number };
      return getTechnicianById(payload.technicianId);
    } catch {
      return null;
    }
  }),
  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie("tech_session", { path: "/" });
    return { success: true };
  }),
});

// ─── Bookings Router ──────────────────────────────────────────────────────────
const bookingsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        serviceId: z.number(),
        scheduledAt: z.string(),
        address: z.string().min(5),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        zoneId: z.number().optional(),
        paymentMethod: z.enum(["cod", "razorpay"]).default("cod"),
        notes: z.string().optional(),
        // Guest fields
        guestName: z.string().optional(),
        guestEmail: z.string().email().optional(),
        guestPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const bookingRef = "AC" + nanoid(8).toUpperCase();
      const bookingData: Parameters<typeof createBooking>[0] = {
        bookingRef,
        serviceId: input.serviceId,
        scheduledAt: new Date(input.scheduledAt),
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        zoneId: input.zoneId,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
        status: "pending",
      };

      if (ctx.user) {
        bookingData.userId = ctx.user.id;
      } else {
        bookingData.guestName = input.guestName;
        bookingData.guestEmail = input.guestEmail;
        bookingData.guestPhone = input.guestPhone;
      }

      await createBooking(bookingData);
      const booking = await getBookingByRef(bookingRef);
      if (!booking) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Auto-assign technician
      if (input.latitude && input.longitude) {
        const { technicianId, method } = await findNearestTechnician(
          input.latitude,
          input.longitude,
          input.zoneId
        );
        if (technicianId > 0 && method) {
          await assignTechnicianToBooking(booking.id, technicianId, method);
          await addJobUpdate({ bookingId: booking.id, status: "assigned", updatedBy: "system" });
          // Notify customer
          if (ctx.user) {
            await createNotification({
              recipientType: "customer",
              recipientId: ctx.user.id,
              bookingId: booking.id,
              title: "Technician Assigned",
              message: "A technician has been assigned to your booking.",
              type: "job_assigned",
            });
          }
          // Notify technician
          await createNotification({
            recipientType: "technician",
            recipientId: technicianId,
            bookingId: booking.id,
            title: "New Job Request",
            message: `New booking ${bookingRef} assigned to you.`,
            type: "new_booking",
          });
        }
      }

      // Create payment record
      const service = await getAllServices().then(s => s.find(sv => sv.id === input.serviceId));
      if (service) {
        await createPayment({ bookingId: booking.id, amount: service.price, method: input.paymentMethod });
      }

      return { bookingRef, bookingId: booking.id };
    }),

  getByRef: publicProcedure
    .input(z.object({ ref: z.string() }))
    .query(async ({ input }) => {
      const booking = await getBookingByRef(input.ref);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      const updates = await getJobUpdates(booking.id);
      return { ...booking, updates };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const booking = await getBookingById(input.id);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      const updates = await getJobUpdates(booking.id);
      return { ...booking, updates };
    }),

  myBookings: protectedProcedure.query(({ ctx }) => getBookingsByUser(ctx.user.id)),

  adminList: adminProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => getAllBookings(input.limit ?? 50)),

  updateStatus: publicProcedure
    .input(
      z.object({
        bookingId: z.number(),
        status: z.enum(["assigned", "on_the_way", "in_progress", "completed", "cancelled"]),
        technicianId: z.number().optional(),
        note: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const booking = await getBookingById(input.bookingId);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });

      await updateBookingStatus(input.bookingId, input.status);
      await addJobUpdate({
        bookingId: input.bookingId,
        status: input.status,
        note: input.note,
        photoUrl: input.photoUrl,
        updatedBy: input.technicianId ? "technician" : "admin",
      });

      // If completed, free up technician
      if (input.status === "completed" && booking.technicianId) {
        await updateTechnician(booking.technicianId, { isAvailable: true });
      }

      // Notify customer
      if (booking.userId) {
        const msgMap: Record<string, string> = {
          assigned: "Your technician has been assigned.",
          on_the_way: "Your technician is on the way!",
          in_progress: "Service is in progress.",
          completed: "Your service has been completed. Thank you!",
          cancelled: "Your booking has been cancelled.",
        };
        const typeMap: Record<string, "job_assigned" | "on_the_way" | "completed"> = {
          assigned: "job_assigned",
          on_the_way: "on_the_way",
          completed: "completed",
        };
        if (typeMap[input.status]) {
          await createNotification({
            recipientType: "customer",
            recipientId: booking.userId,
            bookingId: booking.id,
            title: input.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            message: msgMap[input.status] ?? "Booking status updated.",
            type: typeMap[input.status] ?? "job_assigned",
          });
        }
      }

      return { success: true };
    }),

  adminAssign: adminProcedure
    .input(z.object({ bookingId: z.number(), technicianId: z.number() }))
    .mutation(async ({ input }) => {
      await assignTechnicianToBooking(input.bookingId, input.technicianId, "manual");
      await addJobUpdate({ bookingId: input.bookingId, status: "assigned", updatedBy: "admin" });
      await createNotification({
        recipientType: "technician",
        recipientId: input.technicianId,
        bookingId: input.bookingId,
        title: "New Job Assigned",
        message: `Booking #${input.bookingId} has been assigned to you by admin.`,
        type: "new_booking",
      });
      return { success: true };
    }),
});

// ─── Technician Jobs Router ───────────────────────────────────────────────────
const techJobsRouter = router({
  myJobs: publicProcedure
    .input(z.object({ technicianId: z.number() }))
    .query(({ input }) => getBookingsByTechnician(input.technicianId)),

  activeJob: publicProcedure
    .input(z.object({ technicianId: z.number() }))
    .query(({ input }) => getActiveJobForTechnician(input.technicianId)),

  acceptJob: publicProcedure
    .input(z.object({ bookingId: z.number(), technicianId: z.number() }))
    .mutation(async ({ input }) => {
      const booking = await getBookingById(input.bookingId);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      await addJobUpdate({ bookingId: input.bookingId, status: "assigned", note: "Technician accepted", updatedBy: "technician" });
      if (booking.userId) {
        await createNotification({
          recipientType: "customer",
          recipientId: booking.userId,
          bookingId: booking.id,
          title: "Technician Assigned",
          message: "Your technician has accepted the job and will be with you soon.",
          type: "job_assigned",
        });
      }
      return { success: true };
    }),

  rejectJob: publicProcedure
    .input(z.object({ bookingId: z.number(), technicianId: z.number() }))
    .mutation(async ({ input }) => {
      await updateBookingStatus(input.bookingId, "pending", { technicianId: undefined });
      await updateTechnician(input.technicianId, { isAvailable: true });
      return { success: true };
    }),

  respondToJob: publicProcedure
    .input(z.object({ bookingId: z.number(), technicianId: z.number(), accept: z.boolean() }))
    .mutation(async ({ input }) => {
      if (input.accept) {
        await addJobUpdate({ bookingId: input.bookingId, status: "assigned", note: "Technician accepted", updatedBy: "technician" });
        const booking = await getBookingById(input.bookingId);
        if (booking?.userId) {
          await createNotification({
            recipientType: "customer",
            recipientId: booking.userId,
            bookingId: booking.id,
            title: "Technician Assigned",
            message: "Your technician has accepted the job and will be with you soon.",
            type: "job_assigned",
          });
        }
      } else {
        await updateBookingStatus(input.bookingId, "pending", { technicianId: undefined });
        await updateTechnician(input.technicianId, { isAvailable: true });
      }
      return { success: true };
    }),

  updateJobStatus: publicProcedure
    .input(z.object({
      bookingId: z.number(),
      technicianId: z.number(),
      status: z.enum(["on_the_way", "in_progress", "completed"]),
    }))
    .mutation(async ({ input }) => {
      await updateBookingStatus(input.bookingId, input.status);
      await addJobUpdate({ bookingId: input.bookingId, status: input.status, updatedBy: "technician" });
      const booking = await getBookingById(input.bookingId);
      if (booking?.userId) {
        const msgs: Record<string, string> = {
          on_the_way: "Your technician is on the way!",
          in_progress: "Your technician has arrived and started the job.",
          completed: "Your service has been completed. Thank you!",
        };
        const titles: Record<string, string> = {
          on_the_way: "Technician On the Way",
          in_progress: "Service Started",
          completed: "Service Completed",
        };
        await createNotification({
          recipientType: "customer",
          recipientId: booking.userId,
          bookingId: booking.id,
          title: titles[input.status] ?? "Status Update",
          message: msgs[input.status] ?? "Your booking status has been updated.",
          type: input.status === "on_the_way" ? "on_the_way" : "completed",
        });
      }
      if (input.status === "completed") {
        await updateTechnician(input.technicianId, { isAvailable: true });
      }
      return { success: true };
    }),

  uploadProof: publicProcedure
    .input(
      z.object({
        bookingId: z.number(),
        technicianId: z.number(),
        fileData: z.string(),
        fileName: z.string(),
        mimeType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const key = `proof/${input.bookingId}/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      await addJobUpdate({
        bookingId: input.bookingId,
        status: "completed",
        note: "Job completed with photo proof",
        photoUrl: url,
        updatedBy: "technician",
      });
      await updateBookingStatus(input.bookingId, "completed");
      await updateTechnician(input.technicianId, { isAvailable: true });
      return { url };
    }),

  notifications: publicProcedure
    .input(z.object({ technicianId: z.number() }))
    .query(({ input }) => getNotificationsForTechnician(input.technicianId)),
});

// ─── Payments Router ──────────────────────────────────────────────────────────
const paymentsRouter = router({
  getByBooking: publicProcedure
    .input(z.object({ bookingId: z.number() }))
    .query(({ input }) => getPaymentByBooking(input.bookingId)),
  adminList: adminProcedure.query(() => getAllPayments()),
  markCodPaid: adminProcedure
    .input(z.object({ bookingId: z.number() }))
    .mutation(async ({ input }) => {
      const payment = await getPaymentByBooking(input.bookingId);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND" });
      const { updatePayment } = await import("./db");
      await updatePayment(payment.id, { status: "paid", paidAt: new Date() });
      await updateBookingStatus(input.bookingId, "completed", { paymentStatus: "paid" });
      return { success: true };
    }),
});

// ─── Analytics Router ─────────────────────────────────────────────────────────
const analyticsRouter = router({
  summary: adminProcedure.query(() => getAnalytics()),
  technicianPerformance: adminProcedure.query(async () => {
    const techs = await getAllTechnicians();
    const stats = await Promise.all(
      techs.map(async t => {
        const jobs = await getBookingsByTechnician(t.id);
        const completed = jobs.filter(j => j.status === "completed").length;
        return {
          id: t.id,
          name: t.name,
          total: jobs.length,
          completed,
          rate: jobs.length > 0 ? Math.round((completed / jobs.length) * 100) : 0,
        };
      })
    );
    return stats;
  }),
});

// ─── Notifications Router ─────────────────────────────────────────────────────
const notificationsRouter = router({
  myNotifications: protectedProcedure.query(({ ctx }) =>
    getNotificationsForUser(ctx.user.id)
  ),
  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => markNotificationRead(input.id)),
});

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  services: servicesRouter,
  zones: zonesRouter,
  technicians: techniciansRouter,
  bookings: bookingsRouter,
  techJobs: techJobsRouter,
  payments: paymentsRouter,
  analytics: analyticsRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
