import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { Calendar } from "lucide-react";
import { PageBanner } from "@/components/layout";

type Event = { id: string; title: string; description: string; eventDate: string; startTime?: string; endTime?: string; venue?: string; registrationLink?: string };

export default async function EventsPage() {
  let upcoming: Event[] = [];
  let archived: Event[] = [];
  try {
    [upcoming, archived] = await Promise.all([
      api<Event[]>("/api/events?status=upcoming"),
      api<Event[]>("/api/events?status=archived"),
    ]);
  } catch { /* empty */ }

  return (
    <div>
      <PageBanner title="Events" subtitle="Upcoming and past events at the CSU College of Law." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="csu-section-title mb-4">Upcoming Events</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-12">
          {upcoming.map((e) => (
            <article key={e.id} className="csu-card p-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-16 h-16 rounded-lg bg-csu-maroon text-white flex flex-col items-center justify-center shadow">
                  <span className="text-xs uppercase">{new Date(e.eventDate).toLocaleString("en", { month: "short" })}</span>
                  <span className="text-xl font-bold">{new Date(e.eventDate).getDate()}</span>
                </div>
                <div>
                  <Link href={`/events/${e.id}`} className="font-semibold text-lg text-csu-maroon hover:text-csu-aqua">{e.title}</Link>
                  <p className="text-sm text-csu-slate mt-1">{e.venue}</p>
                  {e.registrationLink && <a href={e.registrationLink} target="_blank" rel="noopener" className="text-sm csu-link mt-2 inline-block">Register →</a>}
                </div>
              </div>
            </article>
          ))}
          {upcoming.length === 0 && <p className="text-csu-slate col-span-2">No upcoming events.</p>}
        </div>

        {archived.length > 0 && (
          <>
            <h2 className="csu-section-title mb-4">Event Archive</h2>
            <div className="csu-card divide-y">
              {archived.map((e) => (
                <div key={e.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-csu-maroon">{e.title}</p>
                    <p className="text-sm text-gray-400">{formatDate(e.eventDate)} · {e.venue}</p>
                  </div>
                  <Link href={`/events/${e.id}`} className="text-sm csu-link">Details →</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
