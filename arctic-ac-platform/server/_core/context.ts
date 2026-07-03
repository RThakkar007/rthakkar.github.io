import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookies } from "cookie";
import { jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import { getUserById, getUserByOpenId } from "../db";
import { COOKIE_NAME } from "@shared/const";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-change-me"
);

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const cookieHeader = opts.req.headers.cookie ?? "";
    const cookies = parseCookies(cookieHeader);
    let token: string | undefined = cookies[COOKIE_NAME];

    // Fallback: Authorization header (for Safari ITP / WebView)
    if (!token) {
      const auth = opts.req.headers.authorization;
      if (typeof auth === "string" && auth.startsWith("Bearer ")) {
        token = auth.slice(7);
      }
    }

    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
      });
      // Email/password users: JWT has { id, openId, role }
      if (typeof payload.id === "number") {
        user = (await getUserById(payload.id)) ?? null;
      } else if (typeof payload.openId === "string") {
        // Legacy Manus OAuth users: JWT has { openId, appId, name }
        user = (await getUserByOpenId(payload.openId)) ?? null;
      }
    }
  } catch {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
