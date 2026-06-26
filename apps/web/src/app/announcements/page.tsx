import Link from "next/link";
import { api, formatDate, priorityColors } from "@/lib/api";
import { PageBanner } from "@/components/layout";

type Announcement = { id: string; title: string; content: string; priority: string; publishDate: string; status: string };

export default async function AnnouncementsPage() {
  let items: Announcement[] = [];
  try { items = await api<Announcement[]>("/api/announcements"); } catch { /* empty */ }

  return (
    <div>
      <PageBanner title="Announcements" subtitle="Official announcements from the CSU College of Law." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4">
          {items.map((a) => (
            <article key={a.id} className="csu-card p-6 border-l-4 border-l-csu-maroon">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColors[a.priority]}`}>{a.priority}</span>
                  <h2 className="text-xl font-semibold mt-2 text-csu-maroon">{a.title}</h2>
                  <p className="text-csu-slate mt-2 line-clamp-3">{a.content}</p>
                  <p className="text-sm text-gray-400 mt-3">{formatDate(a.publishDate)}</p>
                </div>
                <Link href={`/announcements/${a.id}`} className="csu-btn-primary shrink-0">View details</Link>
              </div>
            </article>
          ))}
          {items.length === 0 && <p className="text-csu-slate">No announcements available.</p>}
        </div>
      </div>
    </div>
  );
}
