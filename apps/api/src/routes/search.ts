import { Hono } from "hono";
import { like, or, and, eq } from "drizzle-orm";
import { announcements, newsArticles, documents } from "@col/db";
import { getDb, type Env } from "../db";

export const searchRoutes = new Hono<{ Bindings: Env }>();

searchRoutes.get("/", async (c) => {
  const q = c.req.query("q") || "";
  if (!q) return c.json({ announcements: [], news: [], documents: [] });

  const db = getDb(c.env);
  const pattern = `%${q}%`;

  const [ann, news, docs] = await Promise.all([
    db.select().from(announcements).where(and(like(announcements.title, pattern), eq(announcements.status, "published"))).limit(20),
    db.select().from(newsArticles).where(and(or(like(newsArticles.title, pattern), like(newsArticles.content, pattern)), eq(newsArticles.status, "published"))).limit(20),
    db.select().from(documents).where(like(documents.title, pattern)).limit(20),
  ]);

  return c.json({ announcements: ann, news, documents: docs });
});
