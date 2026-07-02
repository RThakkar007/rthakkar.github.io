import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust the first proxy (Cloud Run / load balancer sets X-Forwarded-For)
  app.set("trust proxy", 1);

  // ── Security: HTTP headers via Helmet ─────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Required for Vite HMR in dev
            "https://maps.googleapis.com",
            "https://maps.gstatic.com",
            "https://forge.butterfly-effect.dev",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
            "https://maps.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://maps.googleapis.com",
            "https://maps.gstatic.com",
            "https://*.manus.space",
            "https://*.amazonaws.com",
          ],
          connectSrc: [
            "'self'",
            "https://maps.googleapis.com",
            "https://forge.butterfly-effect.dev",
            "https://*.manus.space",
            "wss:",
          ],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow Google Maps iframes
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );

  // ── Security: Rate limiting ────────────────────────────────────────────────
  // Global limiter: 200 req / 15 min per IP
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  });
  // Strict limiter for auth endpoints: 10 req / 15 min per IP
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many login attempts, please try again later." },
  });
  app.use(globalLimiter);
  app.use("/api/trpc/technicians.login", authLimiter);
  app.use("/api/trpc/auth.logout", authLimiter);

  // ── Security: Cookie parser ────────────────────────────────────────────────
  app.use(cookieParser());

  // Configure body parser with larger size limit for file uploads
  // Limit JSON to 10mb (enough for base64 photo proofs ~7MB image)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
