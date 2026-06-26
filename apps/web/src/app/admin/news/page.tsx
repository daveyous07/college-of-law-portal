"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", content: "", excerpt: "", status: "published", publishedAt: new Date().toISOString().split("T")[0] });
  const [msg, setMsg] = useState("");

  useEffect(() => { api("/api/auth/me").catch(() => router.push("/admin")); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/api/news", { method: "POST", body: JSON.stringify({ ...form, categoryId: "cat-news-1" }) });
      setMsg("News article published!");
    } catch { setMsg("Error publishing news"); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-law-gold hover:underline mb-4 inline-block">← Dashboard</Link>
      <h1 className="text-2xl font-bold text-law-navy mb-6">Publish News</h1>
      {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <button type="submit" className="rounded-lg bg-law-navy text-white px-6 py-2.5 font-medium hover:bg-law-navy/90">Publish</button>
      </form>
    </div>
  );
}
