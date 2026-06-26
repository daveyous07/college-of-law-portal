import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { notFound } from "next/navigation";
import { PageBanner } from "@/components/layout";

type News = { title: string; slug: string; content: string; publishedAt?: string };

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let item: News;
  try { item = await api<News>(`/api/news/${slug}`); } catch { notFound(); }

  return (
    <div>
      <PageBanner title={item.title} subtitle={item.publishedAt ? formatDate(item.publishedAt) : undefined} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/news" className="csu-link text-sm mb-4 inline-block">← Back to News</Link>
        <article className="csu-card p-8">
          <div className="prose max-w-none text-csu-slate whitespace-pre-wrap">{item.content}</div>
        </article>
      </div>
    </div>
  );
}
