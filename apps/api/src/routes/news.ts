import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { newsArticles } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  relatedLinks: z.string().optional(),
  publishedAt: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const newsRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

newsRoutes.get("/", async (c) => {
  const db = getDb(c.env);
  const status = c.req.query("status") || "published";
  const rows = await db.select().from(newsArticles)
    .where(eq(newsArticles.status, status as "draft" | "published" | "archived"))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(50);
  return c.json(rows);
});

newsRoutes.get("/:slug", async (c) => {
  const db = getDb(c.env);
  const row = await db.query.newsArticles.findFirst({ where: eq(newsArticles.slug, c.req.param("slug")) });
  if (!row) return c.json({ error: "Not found" }, 404);
  await db.update(newsArticles).set({ viewCount: (row.viewCount || 0) + 1 }).where(eq(newsArticles.id, row.id));
  return c.json(row);
});

newsRoutes.post("/", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(newsArticles).values({ id, ...body.data, authorId: c.get("user").id, createdAt: now, updatedAt: now });
  return c.json({ id }, 201);
});

newsRoutes.put("/:id", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.partial().safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  await db.update(newsArticles).set({ ...body.data, updatedAt: new Date().toISOString() }).where(eq(newsArticles.id, c.req.param("id")));
  return c.json({ ok: true });
});

newsRoutes.delete("/:id", authMiddleware(["super_admin", "administrator"]), async (c) => {
  const db = getDb(c.env);
  await db.delete(newsArticles).where(eq(newsArticles.id, c.req.param("id")));
  return c.json({ ok: true });
});
