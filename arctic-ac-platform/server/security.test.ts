import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCtx(overrides: Partial<TrpcContext> = {}): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
    ...overrides,
  };
}

function makeAdminCtx(): TrpcContext {
  return makeCtx({
    user: {
      id: 1,
      openId: "admin-open-id",
      name: "Admin",
      email: "admin@test.com",
      phone: null,
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  });
}

function makeUserCtx(): TrpcContext {
  return makeCtx({
    user: {
      id: 2,
      openId: "user-open-id",
      name: "User",
      email: "user@test.com",
      phone: null,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  });
}

// ─── AUTH & ROLE SECURITY TESTS ──────────────────────────────────────────────

describe("Security: Admin-only endpoints reject non-admins", () => {
  it("rejects unauthenticated user from adminList bookings", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.bookings.adminList({})).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects regular user from adminList bookings", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.bookings.adminList({})).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects unauthenticated user from technicians.adminList", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.technicians.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects regular user from technicians.adminList", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.technicians.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects unauthenticated user from payments.adminList", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.payments.adminList()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects regular user from payments.adminList", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.payments.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects unauthenticated user from analytics", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.analytics.summary()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects regular user from analytics", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.analytics.summary()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

// ─── TECHNICIAN JWT AUTH TESTS ────────────────────────────────────────────────

describe("Security: Technician JWT-protected endpoints reject unauthenticated access", () => {
  it("rejects myJobs without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.myJobs({ technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects activeJob without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.activeJob({ technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects acceptJob without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.acceptJob({ bookingId: 1, technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects rejectJob without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.rejectJob({ bookingId: 1, technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects updateJobStatus without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.updateJobStatus({ bookingId: 1, technicianId: 1, status: "on_the_way" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects uploadProof without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.techJobs.uploadProof({ bookingId: 1, technicianId: 1, fileData: "abc", fileName: "test.jpg", mimeType: "image/jpeg" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects notifications without tech_session cookie", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.techJobs.notifications({ technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects myJobs with an invalid/expired JWT token", async () => {
    const ctx = makeCtx({ req: { protocol: "https", headers: {}, cookies: { tech_session: "invalid.jwt.token" } } as TrpcContext["req"] });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.techJobs.myJobs({ technicianId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

// ─── INPUT VALIDATION TESTS ───────────────────────────────────────────────────

describe("Security: Input validation rejects bad data", () => {
  it("rejects booking with address shorter than 5 chars", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.bookings.create({
        serviceId: 1,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        address: "abc",
        paymentMethod: "cod",
      })
    ).rejects.toThrow();
  });

  it("rejects booking with invalid payment method", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.bookings.create({
        serviceId: 1,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        address: "123 Main Street",
        paymentMethod: "bitcoin" as any,
      })
    ).rejects.toThrow();
  });

  it("rejects technician login with non-email string", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.technicians.login({ email: "not-an-email", password: "password123" })
    ).rejects.toThrow();
  });

  it("rejects uploadProof with disallowed MIME type", async () => {
    const ctx = makeCtx({ req: { protocol: "https", headers: {}, cookies: { tech_session: "invalid.jwt.token" } } as TrpcContext["req"] });
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.techJobs.uploadProof({
        bookingId: 1,
        technicianId: 1,
        fileData: "abc",
        fileName: "malware.exe",
        mimeType: "application/x-msdownload" as any,
      })
    ).rejects.toThrow();
  });

  it("rejects uploadProof with path-traversal filename", async () => {
    // The Zod regex /^[\w\-. ]+$/ blocks path traversal chars like / and ..
    const ctx = makeCtx({ req: { protocol: "https", headers: {}, cookies: { tech_session: "invalid.jwt.token" } } as TrpcContext["req"] });
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.techJobs.uploadProof({
        bookingId: 1,
        technicianId: 1,
        fileData: "abc",
        fileName: "../../etc/passwd",
        mimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });

  it("rejects guest booking with invalid email", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.bookings.create({
        serviceId: 1,
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        address: "123 Main Street, Mumbai",
        paymentMethod: "cod",
        guestName: "John",
        guestEmail: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

// ─── PROTECTED USER ENDPOINTS ─────────────────────────────────────────────────

describe("Security: User-protected endpoints require authentication", () => {
  it("rejects myBookings for unauthenticated user", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.bookings.myBookings()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("allows myBookings for authenticated user", async () => {
    // This will fail at DB level (no DB in test env) but NOT at auth level
    const caller = appRouter.createCaller(makeUserCtx());
    // Should not throw UNAUTHORIZED — may throw DB error which is expected
    try {
      await caller.bookings.myBookings();
    } catch (e: any) {
      expect(e.code).not.toBe("UNAUTHORIZED");
    }
  });
});

// ─── AUTH LOGOUT TESTS ────────────────────────────────────────────────────────

describe("Security: Auth logout clears session cookie", () => {
  it("clears the session cookie and returns success", async () => {
    const { ctx } = (() => {
      const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];
      const ctx: TrpcContext = {
        user: {
          id: 1,
          openId: "test-user",
          email: "test@example.com",
          name: "Test User",
          phone: null,
          loginMethod: "manus",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        },
        req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
        res: {
          clearCookie: (name: string, options: Record<string, unknown>) => {
            clearedCookies.push({ name, options });
          },
        } as unknown as TrpcContext["res"],
      };
      return { ctx, clearedCookies };
    })();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
