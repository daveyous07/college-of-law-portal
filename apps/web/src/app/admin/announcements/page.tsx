"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", priority: "normal", publishDate: new Date().toISOString().split("T")[0], status: "published" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/api/auth/me").catch(() => router.push("/admin"));
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/api/announcements", { method: "POST", body: JSON.stringify(form) });
      setMsg("Announcement created!");
      setForm({ title: "", content: "", priority: "normal", publishDate: new Date().toISOString().split("T")[0], status: "published" });
    } catch { setMsg("Error creating announcement"); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-law-gold hover:underline mb-4 inline-block">← Dashboard</Link>
      <h1 className="text-2xl font-bold text-law-navy mb-6">Create Announcement</h1>
      {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full rounded-lg border px-3 py-2">
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Publish Date</label>
            <input type="date" required value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <button type="submit" className="rounded-lg bg-law-navy text-white px-6 py-2.5 font-medium hover:bg-law-navy/90">Publish</button>
      </form>
    </div>
  );
}
