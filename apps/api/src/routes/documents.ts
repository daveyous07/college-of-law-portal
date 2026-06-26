import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { documents } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().default(0),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const documentRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

documentRoutes.get("/", async (c) => {
  const db = getDb(c.env);
  const category = c.req.query("category");
  const rows = category
    ? await db.select().from(documents).where(eq(documents.category, category)).orderBy(desc(documents.createdAt))
    : await db.select().from(documents).orderBy(desc(documents.createdAt)).limit(100);
  return c.json(rows);
});

documentRoutes.get("/:id/download", async (c) => {
  const db = getDb(c.env);
  const row = await db.query.documents.findFirst({ where: eq(documents.id, c.req.param("id")) });
  if (!row) return c.json({ error: "Not found" }, 404);
  await db.update(documents).set({ downloadCount: (row.downloadCount || 0) + 1 }).where(eq(documents.id, row.id));
  return c.json({ url: row.fileUrl });
});

documentRoutes.post("/", authMiddleware(["super_admin", "administrator", "editor"]), async (c) => {
  const body = schema.safeParse(await c.req.json());
  if (!body.success) return c.json({ error: body.error.flatten() }, 400);
  const db = getDb(c.env);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.insert(documents).values({ id, ...body.data, createdAt: now, updatedAt: now });
  return c.json({ id }, 201);
});

documentRoutes.delete("/:id", authMiddleware(["super_admin", "administrator"]), async (c) => {
  const db = getDb(c.env);
  await db.delete(documents).where(eq(documents.id, c.req.param("id")));
  return c.json({ ok: true });
});
