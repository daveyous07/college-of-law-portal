import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { users } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware, signToken, setAuthCookie, clearAuthCookie } from "../auth";
import { z } from "zod";

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const authRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; email: string; name: string; role: string } } }>();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

authRoutes.post("/login", async (c) => {
  const body = loginSchema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: "Invalid credentials" }, 400);
  const db = getDb(c.env);
  const user = await db.query.users.findFirst({ where: eq(users.email, body.data.email) });
  if (!user) return c.json({ error: "Invalid credentials" }, 401);
  const hash = await hashPassword(body.data.password);
  if (hash !== user.passwordHash) return c.json({ error: "Invalid credentials" }, 401);
  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role }, c.env.JWT_SECRET);
  c.header("Set-Cookie", setAuthCookie(token, c.env.CORS_ORIGIN));
  return c.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

authRoutes.post("/logout", (c) => {
  c.header("Set-Cookie", clearAuthCookie(c.env.CORS_ORIGIN));
  return c.json({ ok: true });
});

authRoutes.get("/me", authMiddleware(), (c) => c.json({ user: c.get("user") }));
