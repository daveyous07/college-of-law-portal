import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { Newspaper } from "lucide-react";
import { PageBanner } from "@/components/layout";

type News = { id: string; title: string; slug: string; excerpt?: string; publishedAt?: string };

export default async function NewsPage() {
  let items: News[] = [];
  try { items = await api<News[]>("/api/news"); } catch { /* empty */ }

  return (
    <div>
      <PageBanner title="News & Updates" subtitle="Latest news from the CSU College of Law." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <article key={n.id} className="csu-card overflow-hidden border-t-4 border-t-csu-aqua">
              <div className="h-36 bg-gradient-to-br from-csu-maroon to-csu-aqua-dark flex items-center justify-center">
                <Newspaper className="h-12 w-12 text-white/30" />
              </div>
              <div className="p-5">
                <h2 className="font-semibold text-lg mb-1 text-csu-maroon">{n.title}</h2>
                <p className="text-sm text-csu-slate line-clamp-3">{n.excerpt}</p>
                <p className="text-xs text-gray-400 mt-3">{n.publishedAt ? formatDate(n.publishedAt) : ""}</p>
                <Link href={`/news/${n.slug}`} className="inline-block mt-3 text-sm csu-link">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
