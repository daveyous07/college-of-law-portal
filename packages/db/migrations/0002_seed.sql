-- Seed categories
INSERT OR IGNORE INTO categories (id, name, slug, type) VALUES
  ('cat-news-1', 'Academic Updates', 'academic-updates', 'news'),
  ('cat-news-2', 'Student Activities', 'student-activities', 'news'),
  ('cat-news-3', 'Faculty News', 'faculty-news', 'news'),
  ('cat-news-4', 'Research', 'research', 'news'),
  ('cat-news-5', 'Achievements', 'achievements', 'news'),
  ('cat-news-6', 'Community Outreach', 'community-outreach', 'news'),
  ('cat-news-7', 'Bar Examination News', 'bar-examination-news', 'news'),
  ('cat-news-8', 'Legal Conferences', 'legal-conferences', 'news');

-- Default admin (password: admin123) SHA-256 hash
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('admin-1', 'Super Admin', 'admin@law.edu', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'super_admin');

-- Sample announcements
INSERT OR IGNORE INTO announcements (id, title, content, priority, publish_date, status, created_by) VALUES
  ('ann-1', 'Enrollment for Academic Year 2025-2026 Now Open', 'The College of Law announces the opening of enrollment for the upcoming academic year. All qualified applicants are encouraged to submit their requirements before the deadline.', 'urgent', '2025-06-01', 'published', 'admin-1'),
  ('ann-2', 'Bar Review Program Schedule Released', 'The official schedule for the Bar Review Program has been released. Please check the memoranda section for the complete timetable.', 'important', '2025-06-10', 'published', 'admin-1'),
  ('ann-3', 'Library Extended Hours During Finals Week', 'The law library will extend operating hours during finals week to support student preparation.', 'normal', '2025-06-15', 'published', 'admin-1');

-- Sample news
INSERT OR IGNORE INTO news_articles (id, title, slug, content, excerpt, category_id, author_id, published_at, status) VALUES
  ('news-1', 'College of Law Ranks Top 10 in National Bar Passage Rate', 'college-law-top-10-bar-passage', 'The College of Law has achieved a remarkable milestone by ranking among the top 10 law schools in the country for bar examination passage rate...', 'Our college celebrates another year of outstanding bar examination results.', 'cat-news-7', 'admin-1', '2025-06-05', 'published'),
  ('news-2', 'Moot Court Team Wins National Championship', 'moot-court-national-championship', 'The College of Law Moot Court Team brought home the national championship trophy after defeating 32 competing universities...', 'Our moot court team makes history with a national victory.', 'cat-news-5', 'admin-1', '2025-06-12', 'published');

-- Sample events
INSERT OR IGNORE INTO events (id, title, description, event_date, start_time, end_time, venue, registration_link, status) VALUES
  ('evt-1', 'Legal Ethics Symposium 2025', 'Annual symposium on contemporary legal ethics issues featuring distinguished speakers from the judiciary and academia.', '2025-07-15', '09:00', '17:00', 'College of Law Auditorium', 'https://forms.example.com/ethics-symposium', 'upcoming'),
  ('evt-2', 'Bar Orientation Week', 'Orientation activities for graduating students preparing for the bar examination.', '2025-08-01', '08:00', '16:00', 'Main Campus', NULL, 'upcoming');

-- Sample documents
INSERT OR IGNORE INTO documents (id, title, description, category, file_url, file_type, file_size, visibility) VALUES
  ('doc-1', 'Academic Calendar 2025-2026', 'Official academic calendar for the College of Law.', 'Academic Policies', '/api/upload/media/documents/sample-calendar.pdf', 'application/pdf', 245000, 'public'),
  ('doc-2', 'Enrollment Guidelines SY 2025-2026', 'Complete enrollment procedures and requirements.', 'Enrollment', '/api/upload/media/documents/sample-enrollment.pdf', 'application/pdf', 180000, 'public'),
  ('doc-3', 'Scholarship Application Form', 'Application form for merit-based scholarships.', 'Scholarships', '/api/upload/media/documents/sample-scholarship.pdf', 'application/pdf', 95000, 'public');
