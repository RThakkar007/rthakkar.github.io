import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
      cookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("appRouter structure", () => {
  it("has services router", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.services.list).toBe("function");
  });

  it("has bookings router", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.bookings.create).toBe("function");
  });

  it("has technicians router with login", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.technicians.login).toBe("function");
  });

  it("has techJobs router with myJobs, respondToJob, updateJobStatus, uploadProof", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.techJobs.myJobs).toBe("function");
    expect(typeof caller.techJobs.respondToJob).toBe("function");
    expect(typeof caller.techJobs.updateJobStatus).toBe("function");
    expect(typeof caller.techJobs.uploadProof).toBe("function");
  });

  it("has analytics router (admin)", () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    expect(typeof caller.analytics.summary).toBe("function");
  });

  it("has notifications router", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.notifications.myNotifications).toBe("function");
  });

  it("has payments router", () => {
    const caller = appRouter.createCaller(makeCtx());
    expect(typeof caller.payments.getByBooking).toBe("function");
  });
});
