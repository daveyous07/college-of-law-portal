import { Hono } from "hono";
import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { announcements } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(["normal", "important", "urgent"]).default("normal"),
  featuredImage: z.string().optional(),
  attachmentUrl: z.string().optional(),
  publishDate: z.string(),
  expiryDate: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const announcementRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

announcementRoutes.get("/", async (c) => {
  const db = getDb(c.env);
  const status = c.req.query("status") || "published";
  const rows = await db.select().from(announcements)
    .where(eq(announcements.status, status as "draft" | "published" | "archived"))
    .orderBy(desc(announcements.publishDate))
    .limit(50);
  return c.json(rows);
});

announcementRoutes.get("/:id", async (c) => {
  const db = getDb(c.env);
  const row = await db.query.announcements.findFirst({ where: eq(announcements.id, c.req.param("id")) });
  if (!row) return c.json({ error: "Not found" }, 404);
  await db.update(announcements).set({ viewCount: (row.viewCount || 0) + 1 }).where(eq(announcements.id, row.id));
  return c.json(row);
});

announcementRoutes.post("/", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(announcements).values({ id, ...body.data, createdBy: c.get("user").id, createdAt: now, updatedAt: now });
  return c.json({ id }, 201);
});

announcementRoutes.put("/:id", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.partial().safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  await db.update(announcements).set({ ...body.data, updatedAt: new Date().toISOString() }).where(eq(announcements.id, c.req.param("id")));
  return c.json({ ok: true });
});

announcementRoutes.delete("/:id", authMiddleware(["super_admin", "administrator"]), async (c) => {
  const db = getDb(c.env);
  await db.delete(announcements).where(eq(announcements.id, c.req.param("id")));
  return c.json({ ok: true });
});
