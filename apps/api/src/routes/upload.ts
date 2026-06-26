import { Hono } from "hono";
import { mediaFiles } from "@col/db";
import { getDb, type Env } from "../db";
import { authMiddleware } from "../auth";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_DOC = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
const MAX_SIZE = 10 * 1024 * 1024;

export const uploadRoutes = new Hono<{ Bindings: Env; Variables: { user: { id: string; role: string } } }>();

async function handleUpload(c: Parameters<Parameters<typeof uploadRoutes.post>[1]>[0], allowed: string[], prefix: string) {
  const form = await c.req.formData();
  const file = form.get("file") as File | null;
  if (!file) return c.json({ error: "No file" }, 400);
  if (!allowed.includes(file.type)) return c.json({ error: "Invalid file type" }, 400);
  if (file.size > MAX_SIZE) return c.json({ error: "File too large (max 10MB)" }, 400);

  const ext = file.name.split(".").pop() || "bin";
  const key = `${prefix}/${crypto.randomUUID()}.${ext}`;
  await c.env.MEDIA.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });

  const db = getDb(c.env);
  const id = crypto.randomUUID();
  await db.insert(mediaFiles).values({
    id,
    filename: file.name,
    fileType: file.type,
    storageKey: key,
    uploadedBy: c.get("user").id,
    createdAt: new Date().toISOString(),
  });

  return c.json({ id, key, url: `/api/media/${key}`, filename: file.name, size: file.size });
}

uploadRoutes.post("/image", authMiddleware(["super_admin", "administrator", "editor"]), (c) => handleUpload(c, ALLOWED_IMAGE, "images"));
uploadRoutes.post("/document", authMiddleware(["super_admin", "administrator", "editor"]), (c) => handleUpload(c, ALLOWED_DOC, "documents"));

uploadRoutes.get("/media/*", async (c) => {
  const key = c.req.path.replace("/api/upload/media/", "");
  const obj = await c.env.MEDIA.get(key);
  if (!obj) return c.json({ error: "Not found" }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000");
  return new Response(obj.body, { headers });
});
