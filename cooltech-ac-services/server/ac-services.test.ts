import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(overrides?: Partial<TrpcContext["user"]>): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-001",
      email: "test@cooltech.in",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

// ─── Auth Tests ───────────────────────────────────────────────────────────────

describe("auth.logout", () => {
  it("clears the session cookie and returns success", async () => {
    const cleared: string[] = [];
    const ctx: TrpcContext = {
      user: {
        id: 1, openId: "u1", email: "a@b.com", name: "A", loginMethod: "manus",
        role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: (name: string) => cleared.push(name) } as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(cleared).toContain("app_session_id");
  });

  it("returns the current user from auth.me when authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me?.email).toBe("test@cooltech.in");
    expect(me?.role).toBe("user");
  });

  it("returns null from auth.me when not authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const me = await caller.auth.me();
    expect(me).toBeNull();
  });
});

// ─── Services Tests ───────────────────────────────────────────────────────────

describe("services", () => {
  it("services.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const services = await caller.services.list();
    expect(Array.isArray(services)).toBe(true);
  });

  it("services.getById returns null for non-existent id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const service = await caller.services.getById({ id: 999999 });
    expect(service).toBeNull();
  });

  it("services.getBySlug returns null for unknown slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const service = await caller.services.getBySlug({ slug: "non-existent-slug" });
    expect(service).toBeNull();
  });
});

// ─── Technicians Tests ────────────────────────────────────────────────────────

describe("technicians", () => {
  it("technicians.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const techs = await caller.technicians.list();
    expect(Array.isArray(techs)).toBe(true);
  });

  it("technicians.available returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const techs = await caller.technicians.available();
    expect(Array.isArray(techs)).toBe(true);
  });

  it("technicians.getById returns null for non-existent id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const tech = await caller.technicians.getById({ id: 999999 });
    expect(tech).toBeNull();
  });
});

// ─── Reviews Tests ────────────────────────────────────────────────────────────

describe("reviews", () => {
  it("reviews.byService returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const reviews = await caller.reviews.byService({ serviceId: 1 });
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("reviews.byTechnician returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const reviews = await caller.reviews.byTechnician({ technicianId: 1 });
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("reviews.all returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const reviews = await caller.reviews.all();
    expect(Array.isArray(reviews)).toBe(true);
  });
});

// ─── Bookings Tests ───────────────────────────────────────────────────────────

describe("bookings", () => {
  it("bookings.list requires authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.bookings.list()).rejects.toThrow();
  });

  it("bookings.getById returns null for non-existent booking", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const booking = await caller.bookings.getById({ id: 999999 });
    expect(booking).toBeNull();
  });
});

// ─── Cart Tests ───────────────────────────────────────────────────────────────

describe("cart", () => {
  it("cart.get returns an array for a session", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const items = await caller.cart.get({ sessionId: "test-session-abc" });
    expect(Array.isArray(items)).toBe(true);
  });

  it("cart.clear succeeds for any session", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.cart.clear({ sessionId: "test-session-xyz" });
    expect(result.success).toBe(true);
  });
});
