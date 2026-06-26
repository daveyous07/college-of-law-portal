import { api, formatDate } from "@/lib/api";
import { FileText } from "lucide-react";
import { PageBanner } from "@/components/layout";

const CATEGORIES = ["Enrollment", "Academic Policies", "Examinations", "Student Affairs", "Faculty Affairs", "Administrative Notices", "Scholarships", "Legal Education Updates"];

type Document = { id: string; title: string; description?: string; category: string; fileUrl: string; createdAt: string };

export default async function MemorandaPage() {
  let items: Document[] = [];
  try { items = await api<Document[]>("/api/documents"); } catch { /* empty */ }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((d) => d.category === cat);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div>
      <PageBanner title="Memoranda & Advisories" subtitle="Official downloadable documents and advisories from CSU College of Law." />
      <div className="mx-auto max-w-7xl px-4 py-10">
        {CATEGORIES.map((cat) => {
          const docs = grouped[cat];
          if (!docs?.length) return null;
          return (
            <section key={cat} className="mb-8">
              <h2 className="csu-section-title mb-3">{cat}</h2>
              <div className="csu-card divide-y">
                {docs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-4 hover:bg-csu-cream">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-csu-maroon" />
                      <div>
                        <p className="font-medium text-csu-maroon">{d.title}</p>
                        {d.description && <p className="text-sm text-csu-slate">{d.description}</p>}
                        <p className="text-xs text-gray-400">{formatDate(d.createdAt)}</p>
                      </div>
                    </div>
                    <a href={d.fileUrl} className="text-sm csu-link shrink-0 ml-4">Download PDF →</a>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {items.length === 0 && <p className="text-csu-slate">No memoranda available.</p>}
      </div>
    </div>
  );
}
