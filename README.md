# College of Law Information Portal

Official platform for publishing announcements, news, events, memoranda, and downloadable documents. Built for deployment entirely on Cloudflare's free tier.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS |
| API | Cloudflare Workers, Hono |
| Database | Cloudflare D1, Drizzle ORM |
| Storage | Cloudflare R2 |
| Auth | JWT + HttpOnly cookies |

## Project Structure

```
college-of-law-portal/
├── apps/
│   ├── api/          # Cloudflare Worker API
│   └── web/          # Next.js frontend
└── packages/
    └── db/           # Drizzle schema + migrations
```

## Quick Start

```bash
# Install dependencies
npm install

# Start API (terminal 1)
cd apps/api
npx wrangler d1 migrations apply col-law-db --local
npm run dev

# Start frontend (terminal 2)
cd apps/web
cp .env.local.example .env.local
npm run dev
```

- **Website:** http://localhost:3000
- **API:** http://localhost:8787
- **Admin login:** `admin@law.edu` / `admin123`

## Features

### Public
- University-style homepage with hero, featured content, quick links
- Announcements with priority levels (Normal, Important, Urgent)
- News articles with categories and slugs
- Events calendar with upcoming/archive views
- Memoranda & advisories by category
- Searchable document repository
- Full-text search across content

### Admin Dashboard
- Statistics (totals, most viewed, most downloaded)
- Create announcements, news, events, documents
- Role-based access (super_admin, administrator, editor)
- File upload to R2 (images, PDFs, DOCX, XLSX)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/announcements` | List/create |
| GET/POST | `/api/news` | List/create |
| GET/POST | `/api/events` | List/create |
| GET/POST | `/api/documents` | List/create |
| GET | `/api/search?q=` | Search |
| GET | `/api/dashboard/stats` | Dashboard stats |
| POST | `/api/upload/image` | Upload image |
| POST | `/api/upload/document` | Upload document |

## Cloudflare Deployment

### 1. Create resources

```bash
# D1 database
npx wrangler d1 create col-law-db

# R2 bucket
npx wrangler r2 bucket create col-law-media
```

Update `apps/api/wrangler.jsonc` with your D1 `database_id`.

### 2. Deploy API

```bash
cd apps/api
npx wrangler d1 migrations apply col-law-db --remote
npx wrangler secret put JWT_SECRET
npm run deploy
```

### 3. Deploy frontend (Workers Builds)

Connect the GitHub repo to **Workers Builds** (or Cloudflare Workers CI). Use these settings:

| Setting | Value |
|---------|--------|
| Root directory | *(repo root)* |
| Build command | `npm run build` |
| **Deploy command** | `npm run deploy` or `npx wrangler deploy` |

The web app uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) — `build` produces `.open-next/` and `deploy` runs `wrangler deploy` from `apps/web`. Do **not** run bare `npx wrangler deploy` from the monorepo root.

Set environment variable `NEXT_PUBLIC_API_URL` to your Worker URL (e.g. `https://col-law-api.<account>.workers.dev`) in **Build variables and secrets**.

The API (`apps/api`) deploys separately: `cd apps/api && npm run deploy`.

### 4. Configure CORS

Set `CORS_ORIGIN` in Worker vars to your Pages domain.

## Security

- JWT tokens in HttpOnly, Secure, SameSite cookies
- Role-based route protection
- Zod input validation on all write endpoints
- File type and size validation (10MB max)
- SHA-256 password hashing

## License

MIT
