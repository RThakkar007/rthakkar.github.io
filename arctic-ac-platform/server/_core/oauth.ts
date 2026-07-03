import type { Express, Request, Response } from "express";

/**
 * OAuth routes — Manus OAuth is disabled; customers now use email/password auth.
 * This file is kept as a no-op to avoid breaking the import in index.ts.
 */
export function registerOAuthRoutes(app: Express) {
  // Manus OAuth callback is disabled — email/password auth is used instead.
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect(302, "/login");
  });
}
