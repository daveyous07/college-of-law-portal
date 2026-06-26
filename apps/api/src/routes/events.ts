import { Hono } from "hono";
import { eq, desc, gte, and } from "drizzle-orm";
import { events } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  eventDate: z.string(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().optional(),
  registrationLink: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["upcoming", "archived"]).default("upcoming"),
});

export const eventRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

eventRoutes.get("/", async (c) => {
  const db = getDb(c.env);
  const status = c.req.query("status") || "upcoming";
  const today = new Date().toISOString().split("T")[0];
  const rows = status === "upcoming"
    ? await db.select().from(events).where(and(eq(events.status, "upcoming"), gte(events.eventDate, today))).orderBy(events.eventDate).limit(50)
    : await db.select().from(events).where(eq(events.status, "archived")).orderBy(desc(events.eventDate)).limit(50);
  return c.json(rows);
});
eventRoutes.get("/:id", async (c) => {
  const db = getDb(c.env);
  const row = await db.query.events.findFirst({ where: eq(events.id, c.req.param("id")) });
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

eventRoutes.post("/", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(events).values({ id, ...body.data, createdAt: now, updatedAt: now });
  return c.json({ id }, 201);
});

eventRoutes.put("/:id", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.partial().safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  await db.update(events).set({ ...body.data, updatedAt: new Date().toISOString() }).where(eq(events.id, c.req.param("id")));
  return c.json({ ok: true });
});

eventRoutes.delete("/:id", authMiddleware(["super_admin", "administrator"]), async (c) => {
  const db = getDb(c.env);
  await db.delete(events).where(eq(events.id, c.req.param("id")));
  return c.json({ ok: true });
});
