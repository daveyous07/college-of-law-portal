"use client";

import { useState } from "react";
import Link from "next/link";
import { api, formatDate } from "@/lib/api";
import { Search, Megaphone, Newspaper, FileText } from "lucide-react";
import { PageBanner } from "@/components/layout";

type Results = {
  announcements: { id: string; title: string; publishDate: string }[];
  news: { id: string; title: string; slug: string; publishedAt?: string }[];
  documents: { id: string; title: string; category: string; createdAt: string }[];
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      setResults(await api<Results>(`/api/search?q=${encodeURIComponent(q)}`));
    } catch { setResults({ announcements: [], news: [], documents: [] }); }
    setLoading(false);
  }

  return (
    <div>
      <PageBanner title="Search" subtitle="Search announcements, news, and documents across the CSU College of Law portal." />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search announcements, news, documents..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-csu-aqua"
          />
          <button type="submit" className="csu-btn-primary px-6">
            {loading ? "..." : "Search"}
          </button>
        </form>

        {results && (
          <div className="space-y-8">
            {results.announcements.length > 0 && (
              <section>
                <h2 className="csu-section-title mb-3 flex items-center gap-2 text-lg"><Megaphone className="h-5 w-5" /> Announcements</h2>
                <div className="csu-card divide-y">
                  {results.announcements.map((a) => (
                    <Link key={a.id} href={`/announcements/${a.id}`} className="block p-4 hover:bg-csu-cream">
                      <p className="font-medium text-csu-maroon">{a.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(a.publishDate)}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {results.news.length > 0 && (
              <section>
                <h2 className="csu-section-title mb-3 flex items-center gap-2 text-lg"><Newspaper className="h-5 w-5" /> News</h2>
                <div className="csu-card divide-y">
                  {results.news.map((n) => (
                    <Link key={n.id} href={`/news/${n.slug}`} className="block p-4 hover:bg-csu-cream">
                      <p className="font-medium text-csu-maroon">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.publishedAt ? formatDate(n.publishedAt) : ""}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {results.documents.length > 0 && (
              <section>
                <h2 className="csu-section-title mb-3 flex items-center gap-2 text-lg"><FileText className="h-5 w-5" /> Documents</h2>
                <div className="csu-card divide-y">
                  {results.documents.map((d) => (
                    <div key={d.id} className="p-4">
                      <p className="font-medium text-csu-maroon">{d.title}</p>
                      <p className="text-xs text-gray-400">{d.category} · {formatDate(d.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {!results.announcements.length && !results.news.length && !results.documents.length && (
              <p className="text-csu-slate">No results found for &ldquo;{q}&rdquo;.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
