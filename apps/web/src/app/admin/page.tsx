"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { LayoutDashboard, Megaphone, Newspaper, Calendar, FileText, LogOut } from "lucide-react";
import { CsuLogo } from "@/components/csu-logo";

type User = { id: string; name: string; email: string; role: string };
type Stats = {
  totals: { announcements: number; news: number; documents: number; events: number };
  mostViewedNews: { title: string; viewCount: number }[];
  mostDownloaded: { title: string; downloadCount: number }[];
  recentUploads: { title: string; createdAt: string }[];
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ user: User }>("/api/auth/me").then((d) => {
      setUser(d.user);
      return api<Stats>("/api/dashboard/stats");
    }).then(setStats).catch(() => setUser(null));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      setUser(data.user);
      const s = await api<Stats>("/api/dashboard/stats");
      setStats(s);
    } catch { setError("Invalid email or password"); }
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    setStats(null);
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-sm csu-card p-8 border-t-4 border-t-csu-maroon">
          <div className="flex flex-col items-center gap-3 mb-6">
            <CsuLogo size="lg" className="mx-auto" />
            <p className="text-csu-maroon font-bold text-lg">CSU College of Law</p>
            <p className="text-sm text-csu-slate">Admin Portal</p>
          </div>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2 mb-4" required />
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2 mb-6" required />
          <button type="submit" className="w-full csu-btn-primary py-2.5">Sign In</button>
          <p className="text-xs text-gray-400 mt-4 text-center">Default: admin@law.edu / admin123</p>
        </form>
      </div>
    );
  }

  const actions = [
    { href: "/admin/announcements", label: "Create Announcement", icon: Megaphone },
    { href: "/admin/news", label: "Publish News", icon: Newspaper },
    { href: "/admin/events", label: "Create Event", icon: Calendar },
    { href: "/admin/documents", label: "Upload Document", icon: FileText },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-csu-maroon flex items-center gap-2"><LayoutDashboard className="h-8 w-8 text-csu-gold" /> Dashboard</h1>
          <p className="text-csu-slate">Welcome, {user.name} ({user.role}) — CSU College of Law</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600 hover:underline"><LogOut className="h-4 w-4" /> Logout</button>
      </div>

      {stats && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-10">
          {[
            { label: "Announcements", value: stats.totals.announcements },
            { label: "News Articles", value: stats.totals.news },
            { label: "Documents", value: stats.totals.documents },
            { label: "Events", value: stats.totals.events },
          ].map((s) => (
            <div key={s.label} className="csu-card p-5 border-t-4 border-t-csu-aqua">
              <p className="text-3xl font-bold text-csu-maroon">{s.value}</p>
              <p className="text-sm text-csu-slate">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="csu-section-title mb-4 text-lg">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {actions.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="csu-card flex items-center gap-3 p-5 hover:border-csu-maroon">
            <Icon className="h-6 w-6 text-csu-gold" />
            <span className="font-medium text-csu-maroon">{label}</span>
          </Link>
        ))}
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="csu-card p-5">
            <h3 className="font-semibold mb-3 text-csu-maroon">Most Viewed News</h3>
            {stats.mostViewedNews.map((n, i) => (
              <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                <span>{n.title}</span>
                <span className="text-gray-400">{n.viewCount} views</span>
              </div>
            ))}
          </div>
          <div className="csu-card p-5">
            <h3 className="font-semibold mb-3 text-csu-maroon">Most Downloaded</h3>
            {stats.mostDownloaded.map((d, i) => (
              <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
                <span>{d.title}</span>
                <span className="text-gray-400">{d.downloadCount} downloads</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
