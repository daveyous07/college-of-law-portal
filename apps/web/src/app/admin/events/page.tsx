"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminEventsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", eventDate: "", startTime: "", endTime: "", venue: "", registrationLink: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => { api("/api/auth/me").catch(() => router.push("/admin")); }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/api/events", { method: "POST", body: JSON.stringify(form) });
      setMsg("Event created!");
    } catch { setMsg("Error creating event"); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-law-gold hover:underline mb-4 inline-block">← Dashboard</Link>
      <h1 className="text-2xl font-bold text-law-navy mb-6">Create Event</h1>
      {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Event Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" required value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Registration Link</label>
          <input type="url" value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <button type="submit" className="rounded-lg bg-law-navy text-white px-6 py-2.5 font-medium hover:bg-law-navy/90">Create Event</button>
      </form>
    </div>
  );
}
