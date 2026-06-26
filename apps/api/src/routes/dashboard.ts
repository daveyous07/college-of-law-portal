import { Hono } from "hono";
import { sql, desc } from "drizzle-orm";
import { announcements, newsArticles, documents, events } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";

export const dashboardRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

dashboardRoutes.get("/stats", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const db = getDb(c.env);
  const [annCount, newsCount, docCount, eventCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(announcements),
    db.select({ count: sql<number>`count(*)` }).from(newsArticles),
    db.select({ count: sql<number>`count(*)` }).from(documents),
    db.select({ count: sql<number>`count(*)` }).from(events),
  ]);

  const mostViewedNews = await db.select().from(newsArticles).orderBy(desc(newsArticles.viewCount)).limit(5);
  const mostDownloaded = await db.select().from(documents).orderBy(desc(documents.downloadCount)).limit(5);
  const recentDocs = await db.select().from(documents).orderBy(desc(documents.createdAt)).limit(5);

  return c.json({
    totals: {
      announcements: annCount[0]?.count ?? 0,
      news: newsCount[0]?.count ?? 0,
      documents: docCount[0]?.count ?? 0,
      events: eventCount[0]?.count ?? 0,
    },
    mostViewedNews,
    mostDownloaded,
    recentUploads: recentDocs,
  });
});
