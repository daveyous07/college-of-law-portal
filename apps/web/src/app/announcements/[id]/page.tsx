import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout";

type Announcement = { id: string; title: string; content: string; priority: string; publishDate: string; expiryDate?: string; attachmentUrl?: string };

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let item: Announcement;
  try { item = await api<Announcement>(`/api/announcements/${id}`); } catch { notFound(); }

  return (
    <div>
      <PageBanner title={item.title} subtitle={`Published ${formatDate(item.publishDate)}`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/announcements" className="csu-link text-sm mb-4 inline-block">← Back to Announcements</Link>
        <article className="csu-card p-8">
          <span className="text-xs font-bold px-2 py-0.5 rounded border bg-amber-100 text-amber-800 uppercase">{item.priority}</span>
          <div className="prose max-w-none text-csu-slate whitespace-pre-wrap mt-6">{item.content}</div>
          {item.attachmentUrl && (
            <a href={item.attachmentUrl} className="inline-block mt-6 csu-link font-medium">Download Attachment →</a>
          )}
        </article>
      </div>
    </div>
  );
}
