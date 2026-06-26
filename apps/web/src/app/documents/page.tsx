"use client";

import { useState, useEffect } from "react";
import { api, formatDate } from "@/lib/api";
import { FileText } from "lucide-react";
import { PageBanner } from "@/components/layout";

const CATEGORIES = ["Enrollment", "Academic Policies", "Examinations", "Student Affairs", "Faculty Affairs", "Administrative Notices", "Scholarships", "Legal Education Updates"];

type Doc = { id: string; title: string; category: string; createdAt: string; fileUrl: string };

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(cat?: string) {
    setLoading(true);
    try {
      const url = cat ? `/api/documents?category=${encodeURIComponent(cat)}` : "/api/documents";
      setDocs(await api<Doc[]>(url));
    } catch { setDocs([]); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <PageBanner title="Document Repository" subtitle="Searchable repository of official CSU College of Law documents." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => { setCategory(""); load(); }} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${!category ? "bg-csu-maroon text-white border-csu-maroon" : "bg-white text-csu-slate"}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setCategory(c); load(c); }} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${category === c ? "bg-csu-maroon text-white border-csu-maroon" : "bg-white text-csu-slate"}`}>{c}</button>
          ))}
        </div>
        {loading ? <p className="text-csu-slate">Loading...</p> : (
          <div className="csu-card divide-y">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 hover:bg-csu-cream">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-csu-aqua" />
                  <div>
                    <p className="font-medium text-csu-maroon">{d.title}</p>
                    <p className="text-xs text-gray-400">{d.category} · {formatDate(d.createdAt)}</p>
                  </div>
                </div>
                <a href={d.fileUrl} className="text-sm csu-link">Download →</a>
              </div>
            ))}
            {docs.length === 0 && <p className="p-4 text-csu-slate">No documents found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
