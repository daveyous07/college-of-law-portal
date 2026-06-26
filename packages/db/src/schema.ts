import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["super_admin", "administrator", "editor"] }).notNull().default("editor"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type", { enum: ["news", "memorandum", "document"] }).notNull(),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority", { enum: ["normal", "important", "urgent"] }).notNull().default("normal"),
  featuredImage: text("featured_image"),
  attachmentUrl: text("attachment_url"),
  publishDate: text("publish_date").notNull(),
  expiryDate: text("expiry_date"),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
  viewCount: integer("view_count").notNull().default(0),
  createdBy: text("created_by").references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const newsArticles = sqliteTable("news_articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  categoryId: text("category_id").references(() => categories.id),
  authorId: text("author_id").references(() => users.id),
  tags: text("tags"),
  relatedLinks: text("related_links"),
  publishedAt: text("published_at"),
  status: text("status", { enum: ["draft", "published", "archived"] }).notNull().default("draft"),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: text("event_date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  venue: text("venue"),
  registrationLink: text("registration_link"),
  featuredImage: text("featured_image"),
  status: text("status", { enum: ["upcoming", "archived"] }).notNull().default("upcoming"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull().default(0),
  visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("public"),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const mediaFiles = sqliteTable("media_files", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  storageKey: text("storage_key").notNull(),
  uploadedBy: text("uploaded_by").references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export type User = typeof users.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Document = typeof documents.$inferSelect;
