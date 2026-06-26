"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

const CATEGORIES = ["Enrollment", "Academic Policies", "Examinations", "Student Affairs", "Faculty Affairs", "Administrative Notices", "Scholarships", "Legal Education Updates"];

export default function AdminDocumentsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0], fileUrl: "", fileType: "application/pdf", fileSize: 0 });
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => { api("/api/auth/me").catch(() => router.push("/admin")); }, [router]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/upload/document`, {
        method: "POST", credentials: "include", body: fd,
      });
      const data = await res.json();
      setForm({ ...form, fileUrl: data.url, fileType: file.type, fileSize: file.size });
    } catch { setMsg("Upload failed"); }
    setUploading(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/api/documents", { method: "POST", body: JSON.stringify(form) });
      setMsg("Document uploaded!");
    } catch { setMsg("Error saving document"); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-law-gold hover:underline mb-4 inline-block">← Dashboard</Link>
      <h1 className="text-2xl font-bold text-law-navy mb-6">Upload Document</h1>
      {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PDF / DOCX / XLSX File</label>
          <input type="file" accept=".pdf,.docx,.xlsx" onChange={handleFile} className="w-full" />
          {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
          {form.fileUrl && <p className="text-sm text-green-600 mt-1">File uploaded</p>}
        </div>
        <button type="submit" disabled={!form.fileUrl} className="rounded-lg bg-law-navy text-white px-6 py-2.5 font-medium hover:bg-law-navy/90 disabled:opacity-50">Save Document</button>
      </form>
    </div>
  );
}
