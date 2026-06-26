import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./db";
import { ensureDb } from "./bootstrap";
import { authRoutes } from "./routes/auth";
import { announcementRoutes } from "./routes/announcements";
import { newsRoutes } from "./routes/news";
import { eventRoutes } from "./routes/events";
import { documentRoutes } from "./routes/documents";
import { uploadRoutes } from "./routes/upload";
import { searchRoutes } from "./routes/search";
import { dashboardRoutes } from "./routes/dashboard";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  await ensureDb(c.env);
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  });
  return corsMiddleware(c, next);
});

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api/auth", authRoutes);
app.route("/api/announcements", announcementRoutes);
app.route("/api/news", newsRoutes);
app.route("/api/events", eventRoutes);
app.route("/api/documents", documentRoutes);
app.route("/api/upload", uploadRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/dashboard", dashboardRoutes);

export default app;
