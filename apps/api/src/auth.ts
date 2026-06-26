import { SignJWT, jwtVerify } from "jose";
import type { Context, Next } from "hono";
import type { Env } from "./db";

export type AuthUser = { id: string; email: string; name: string; role: string };

const COOKIE = "col_auth";

export async function signToken(user: AuthUser, secret: string) {
  const key = new TextEncoder().encode(secret);
  return new SignJWT({ sub: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string, secret: string): Promise<AuthUser | null> {
  try {
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return {
      id: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export function authMiddleware(requiredRoles?: string[]) {
  return async (c: Context<{ Bindings: Env; Variables: { user: AuthUser } }>, next: Next) => {
    const cookie = c.req.header("Cookie")?.match(/col_auth=([^;]+)/)?.[1];
    const bearer = c.req.header("Authorization")?.replace("Bearer ", "");
    const token = cookie || bearer;
    if (!token) return c.json({ error: "Unauthorized" }, 401);
    const user = await verifyToken(token, c.env.JWT_SECRET);
    if (!user) return c.json({ error: "Invalid token" }, 401);
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    c.set("user", user);
    await next();
  };
}

export function setAuthCookie(token: string) {
  return `col_auth=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`;
}

export function clearAuthCookie() {
  return `col_auth=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export { COOKIE };
