import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllServices, getServiceBySlug, getServiceById,
  getAllTechnicians, getAvailableTechnicians, getTechnicianById, getTechnicianLocation, updateTechnicianLocation,
  createBooking, getBookingsByUserId, getBookingById, updateBookingPayment, updateBookingStatus,
  getReviewsByServiceId, getReviewsByTechnicianId, getAllReviews, createReview,
  getCartItems, addCartItem, removeCartItem, clearCart,
  updateUserProfile,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({ name: z.string().optional(), phone: z.string().optional(), address: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  services: router({
    list: publicProcedure.query(async () => {
      return getAllServices();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getServiceBySlug(input.slug);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getServiceById(input.id);
      }),
  }),

  technicians: router({
    list: publicProcedure.query(async () => {
      return getAllTechnicians();
    }),
    available: publicProcedure.query(async () => {
      return getAvailableTechnicians();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getTechnicianById(input.id);
      }),
    getLocation: publicProcedure
      .input(z.object({ technicianId: z.number() }))
      .query(async ({ input }) => {
        return getTechnicianLocation(input.technicianId);
      }),
    updateLocation: protectedProcedure
      .input(z.object({ technicianId: z.number(), latitude: z.number(), longitude: z.number() }))
      .mutation(async ({ input }) => {
        await updateTechnicianLocation(input.technicianId, input.latitude, input.longitude);
        return { success: true };
      }),
  }),

  bookings: router({
    create: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        scheduledDate: z.string(),
        scheduledTime: z.string(),
        address: z.string(),
        city: z.string().optional(),
        totalAmount: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createBooking({ ...input, userId: ctx.user.id });
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return getBookingsByUserId(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const booking = await getBookingById(input.id);
        if (!booking || booking.userId !== ctx.user.id) return null;
        return booking;
      }),
    confirmPayment: protectedProcedure
      .input(z.object({ bookingId: z.number(), paymentIntentId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking || booking.userId !== ctx.user.id) throw new Error("Booking not found");
        await updateBookingPayment(input.bookingId, input.paymentIntentId);
        // Return booking with technician details
        const updated = await getBookingById(input.bookingId);
        const technician = updated?.technicianId ? await getTechnicianById(updated.technicianId) : null;
        return { booking: updated, technician };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        status: z.enum(["pending", "confirmed", "assigned", "en_route", "in_progress", "completed", "cancelled"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await getBookingById(input.bookingId);
        if (!booking || booking.userId !== ctx.user.id) throw new Error("Booking not found");
        await updateBookingStatus(input.bookingId, input.status);
        return { success: true };
      }),
  }),

  reviews: router({
    byService: publicProcedure
      .input(z.object({ serviceId: z.number() }))
      .query(async ({ input }) => {
        return getReviewsByServiceId(input.serviceId);
      }),
    byTechnician: publicProcedure
      .input(z.object({ technicianId: z.number() }))
      .query(async ({ input }) => {
        return getReviewsByTechnicianId(input.technicianId);
      }),
    all: publicProcedure.query(async () => {
      return getAllReviews();
    }),
    create: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        technicianId: z.number().optional(),
        bookingId: z.number().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string(),
        authorName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createReview({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
  }),

  cart: router({
    get: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const items = await getCartItems(input.sessionId);
        // Enrich with service details
        const enriched = await Promise.all(
          items.map(async (item) => {
            const service = await getServiceById(item.serviceId);
            return { ...item, service };
          })
        );
        return enriched;
      }),
    add: publicProcedure
      .input(z.object({ sessionId: z.string(), serviceId: z.number() }))
      .mutation(async ({ input }) => {
        await addCartItem(input.sessionId, input.serviceId);
        return { success: true };
      }),
    remove: publicProcedure
      .input(z.object({ sessionId: z.string(), serviceId: z.number() }))
      .mutation(async ({ input }) => {
        await removeCartItem(input.sessionId, input.serviceId);
        return { success: true };
      }),
    clear: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        await clearCart(input.sessionId);
        return { success: true };
      }),
  }),

  payments: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        bookingId: z.number(),
        amount: z.number(),
        serviceName: z.string(),
        currency: z.string().default("inr"),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
          // Fallback demo mode when Stripe is not configured
          return { checkoutUrl: null, sessionId: `demo_${Date.now()}` };
        }
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey);
        const origin = ctx.req.headers.origin as string || "http://localhost:3000";
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: input.currency,
              product_data: { name: input.serviceName },
              unit_amount: input.amount,
            },
            quantity: 1,
          }],
          mode: "payment",
          customer_email: ctx.user.email ?? undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            booking_id: input.bookingId.toString(),
            customer_email: ctx.user.email ?? "",
            customer_name: ctx.user.name ?? "",
          },
          allow_promotion_codes: true,
          success_url: `${origin}/booking-confirmation/${input.bookingId}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/book`,
        });
        return { checkoutUrl: session.url, sessionId: session.id };
      }),
    createIntent: protectedProcedure
      .input(z.object({ amount: z.number(), currency: z.string().default("inr") }))
      .mutation(async ({ input }) => {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
          const mockClientSecret = `pi_demo_${Date.now()}_secret_${Math.random().toString(36).slice(2)}`;
          return { clientSecret: mockClientSecret, amount: input.amount, currency: input.currency };
        }
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey);
        const intent = await stripe.paymentIntents.create({
          amount: input.amount,
          currency: input.currency,
          automatic_payment_methods: { enabled: true },
        });
        return { clientSecret: intent.client_secret!, amount: input.amount, currency: input.currency };
      }),
  }),
});

export type AppRouter = typeof appRouter;
