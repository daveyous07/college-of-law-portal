import type { Env } from "./db";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'editor',
    created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, type TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, priority TEXT NOT NULL DEFAULT 'normal',
    featured_image TEXT, attachment_url TEXT, publish_date TEXT NOT NULL, expiry_date TEXT,
    status TEXT NOT NULL DEFAULT 'draft', view_count INTEGER NOT NULL DEFAULT 0,
    created_by TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS news_articles (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, content TEXT NOT NULL,
    excerpt TEXT, featured_image TEXT, category_id TEXT, author_id TEXT, tags TEXT, related_links TEXT,
    published_at TEXT, status TEXT NOT NULL DEFAULT 'draft', view_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, event_date TEXT NOT NULL,
    start_time TEXT, end_time TEXT, venue TEXT, registration_link TEXT, featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming', created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT NOT NULL,
    file_url TEXT NOT NULL, file_type TEXT NOT NULL, file_size INTEGER NOT NULL DEFAULT 0,
    visibility TEXT NOT NULL DEFAULT 'public', download_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS media_files (
    id TEXT PRIMARY KEY, filename TEXT NOT NULL, file_type TEXT NOT NULL, storage_key TEXT NOT NULL,
    uploaded_by TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

let bootPromise: Promise<void> | null = null;

export function ensureDb(env: Env) {
  if (!bootPromise) {
    bootPromise = bootstrap(env);
  }
  return bootPromise;
}

async function bootstrap(env: Env) {
  for (const sql of TABLES) {
    await env.DB.prepare(sql).run();
  }
  const admin = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind("admin@law.edu").first();
  if (!admin) {
    const stmts = [
      env.DB.prepare(`INSERT OR IGNORE INTO categories (id,name,slug,type) VALUES ('cat-news-1','Academic Updates','academic-updates','news'),('cat-news-7','Bar Examination News','bar-examination-news','news'),('cat-news-5','Achievements','achievements','news')`),
      env.DB.prepare(`INSERT INTO users (id,name,email,password_hash,role) VALUES ('admin-1','Super Admin','admin@law.edu','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','super_admin')`),
      env.DB.prepare(`INSERT INTO announcements (id,title,content,priority,publish_date,status,created_by) VALUES ('ann-1','Enrollment for Academic Year 2025-2026 Now Open','The College of Law announces the opening of enrollment for the upcoming academic year.','urgent','2025-06-01','published','admin-1'),('ann-2','Bar Review Program Schedule Released','The official schedule for the Bar Review Program has been released.','important','2025-06-10','published','admin-1'),('ann-3','Library Extended Hours During Finals Week','The law library will extend operating hours during finals week.','normal','2025-06-15','published','admin-1')`),
      env.DB.prepare(`INSERT INTO news_articles (id,title,slug,content,excerpt,category_id,author_id,published_at,status) VALUES ('news-1','College of Law Ranks Top 10 in National Bar Passage Rate','college-law-top-10-bar-passage','The College of Law has achieved a remarkable milestone by ranking among the top 10 law schools in the country for bar examination passage rate.','Our college celebrates another year of outstanding bar examination results.','cat-news-7','admin-1','2025-06-05','published'),('news-2','Moot Court Team Wins National Championship','moot-court-national-championship','The College of Law Moot Court Team brought home the national championship trophy.','Our moot court team makes history with a national victory.','cat-news-5','admin-1','2025-06-12','published')`),
      env.DB.prepare(`INSERT INTO events (id,title,description,event_date,start_time,end_time,venue,registration_link,status) VALUES ('evt-1','Legal Ethics Symposium 2025','Annual symposium on contemporary legal ethics issues.','2025-07-15','09:00','17:00','College of Law Auditorium','https://forms.example.com/ethics-symposium','upcoming'),('evt-2','Bar Orientation Week','Orientation activities for graduating students.','2025-08-01','08:00','16:00','Main Campus',NULL,'upcoming')`),
      env.DB.prepare(`INSERT INTO documents (id,title,description,category,file_url,file_type,file_size,visibility) VALUES ('doc-1','Academic Calendar 2025-2026','Official academic calendar.','Academic Policies','#','application/pdf',245000,'public'),('doc-2','Enrollment Guidelines SY 2025-2026','Complete enrollment procedures.','Enrollment','#','application/pdf',180000,'public'),('doc-3','Scholarship Application Form','Merit-based scholarship application.','Scholarships','#','application/pdf',95000,'public')`),
    ];
    await env.DB.batch(stmts);
  }
}
