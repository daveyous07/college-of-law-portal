import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout";

type Event = { id: string; title: string; description: string; eventDate: string; startTime?: string; endTime?: string; venue?: string; registrationLink?: string };

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item: Event;
  try { item = await api<Event>(`/api/events/${id}`); } catch { notFound(); }

  return (
    <div>
      <PageBanner title={item.title} subtitle={`${formatDate(item.eventDate)}${item.venue ? ` · ${item.venue}` : ""}`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/events" className="csu-link text-sm mb-4 inline-block">← Back to Events</Link>
        <article className="csu-card p-8">
          {item.startTime && <p className="text-sm text-csu-aqua font-medium mb-4">🕐 {item.startTime}{item.endTime ? ` – ${item.endTime}` : ""}</p>}
          <div className="prose max-w-none text-csu-slate whitespace-pre-wrap">{item.description}</div>
          {item.registrationLink && (
            <a href={item.registrationLink} target="_blank" rel="noopener" className="inline-block mt-6 csu-btn-accent">Register Now</a>
          )}
        </article>
      </div>
    </div>
  );
}
