import Link from "next/link";
import { api, formatDate, priorityColors } from "@/lib/api";
import { CsuLogo } from "@/components/csu-logo";
import { Megaphone, Newspaper, Calendar, FileText, ArrowRight } from "lucide-react";

type Announcement = { id: string; title: string; content: string; priority: string; publishDate: string };
type News = { id: string; title: string; slug: string; excerpt?: string; publishedAt?: string };
type Event = { id: string; title: string; eventDate: string; venue?: string; registrationLink?: string };
type Document = { id: string; title: string; category: string; createdAt: string; fileUrl: string };

async function getData() {
  try {
    const [announcements, news, events, documents] = await Promise.all([
      api<Announcement[]>("/api/announcements"),
      api<News[]>("/api/news"),
      api<Event[]>("/api/events"),
      api<Document[]>("/api/documents"),
    ]);
    return { announcements, news, events, documents };
  } catch {
    return { announcements: [], news: [], events: [], documents: [] };
  }
}

export default async function HomePage() {
  const { announcements, news, events, documents } = await getData();
  const featured = announcements.find((a) => a.priority === "urgent") || announcements[0];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-csu-maroon/95 via-csu-maroon/85 to-csu-aqua-dark/75" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <CsuLogo size="xl" className="drop-shadow-lg" priority />
            <div className="flex-1">
              <p className="text-csu-gold font-semibold uppercase tracking-widest text-sm mb-1">Republic of the Philippines</p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">Cotabato State University</h1>
              <p className="text-xl md:text-2xl font-medium text-white/90 mt-1">College of Law</p>
              <p className="text-white/80 max-w-2xl mt-3">
                Official information portal for announcements, news, events, memoranda, and downloadable documents.
              </p>
            </div>
          </div>

          {featured && (
            <div className="mt-8 rounded-lg border border-csu-gold/40 bg-white/10 backdrop-blur-sm p-5 max-w-3xl">
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border mb-2 ${priorityColors[featured.priority]}`}>
                {featured.priority.toUpperCase()}
              </span>
              <h2 className="text-xl font-semibold mb-1">{featured.title}</h2>
              <p className="text-white/80 text-sm line-clamp-2">{featured.content}</p>
              <Link href={`/announcements/${featured.id}`} className="inline-flex items-center gap-1 text-csu-gold text-sm mt-3 font-medium hover:underline">
                Read announcement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { href: "/announcements", label: "Announcements", icon: Megaphone },
              { href: "/news", label: "News", icon: Newspaper },
              { href: "/events", label: "Events", icon: Calendar },
              { href: "/memoranda", label: "Memoranda", icon: FileText },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-2 rounded bg-csu-gold px-4 py-2.5 text-sm font-semibold text-csu-maroon-dark hover:bg-csu-gold-light transition-colors shadow">
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-14">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="csu-section-title flex items-center gap-2"><Megaphone className="h-6 w-6 text-csu-aqua" /> Latest Announcements</h2>
            <Link href="/announcements" className="csu-link text-sm">View all →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {announcements.slice(0, 3).map((a) => (
              <article key={a.id} className="csu-card p-5 border-t-4 border-t-csu-maroon">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColors[a.priority]}`}>{a.priority}</span>
                <h3 className="font-semibold mt-2 mb-1 text-csu-maroon">{a.title}</h3>
                <p className="text-sm text-csu-slate line-clamp-2">{a.content}</p>
                <p className="text-xs text-gray-400 mt-3">{formatDate(a.publishDate)}</p>
                <Link href={`/announcements/${a.id}`} className="inline-block mt-3 text-sm csu-link">View details →</Link>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="csu-section-title flex items-center gap-2"><Newspaper className="h-6 w-6 text-csu-aqua" /> Latest News</h2>
            <Link href="/news" className="csu-link text-sm">View all →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {news.slice(0, 4).map((n) => (
              <article key={n.id} className="csu-card overflow-hidden flex">
                <div className="w-28 shrink-0 bg-gradient-to-b from-csu-maroon to-csu-aqua-dark flex items-center justify-center">
                  <Newspaper className="h-10 w-10 text-white/40" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1 text-csu-maroon">{n.title}</h3>
                  <p className="text-sm text-csu-slate line-clamp-2">{n.excerpt || ""}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.publishedAt ? formatDate(n.publishedAt) : ""}</p>
                  <Link href={`/news/${n.slug}`} className="inline-block mt-2 text-sm csu-link">Read more →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="csu-section-title flex items-center gap-2"><Calendar className="h-6 w-6 text-csu-aqua" /> Upcoming Events</h2>
            <Link href="/events" className="csu-link text-sm">View calendar →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {events.slice(0, 4).map((e) => (
              <article key={e.id} className="csu-card p-5 flex gap-4">
                <div className="shrink-0 w-16 h-16 rounded-lg bg-csu-maroon text-white flex flex-col items-center justify-center text-center shadow">
                  <span className="text-xs uppercase font-medium">{new Date(e.eventDate).toLocaleString("en", { month: "short" })}</span>
                  <span className="text-xl font-bold">{new Date(e.eventDate).getDate()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-csu-maroon">{e.title}</h3>
                  <p className="text-sm text-csu-slate">{e.venue}</p>
                  {e.registrationLink && (
                    <a href={e.registrationLink} target="_blank" rel="noopener" className="text-sm csu-link mt-1 inline-block">Register →</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="csu-section-title flex items-center gap-2"><FileText className="h-6 w-6 text-csu-aqua" /> Memoranda & Advisories</h2>
            <Link href="/memoranda" className="csu-link text-sm">View all →</Link>
          </div>
          <div className="csu-card divide-y">
            {documents.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 hover:bg-csu-cream transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-csu-maroon/10">
                    <FileText className="h-5 w-5 text-csu-maroon" />
                  </div>
                  <div>
                    <p className="font-medium text-csu-maroon">{d.title}</p>
                    <p className="text-xs text-gray-400">{d.category} · {formatDate(d.createdAt)}</p>
                  </div>
                </div>
                <a href={d.fileUrl} className="text-sm csu-link shrink-0 ml-4">Download</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
