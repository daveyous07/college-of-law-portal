import Link from "next/link";
import { Menu, Phone, Mail, MapPin } from "lucide-react";
import { CsuLogo } from "@/components/csu-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/memoranda", label: "Memoranda" },
  { href: "/documents", label: "Documents" },
  { href: "/search", label: "Search" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 shadow-md">
      <div className="bg-csu-aqua-dark text-white text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> (064) 421-5146</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> info@cotsu.edu.ph</span>
          </div>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Sinsuat Ave., Cotabato City 9600</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <CsuLogo size="sm" priority />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-csu-aqua">Republic of the Philippines</p>
              <p className="text-lg font-bold leading-tight text-csu-maroon md:text-xl">Cotabato State University</p>
              <p className="text-sm font-medium text-csu-slate">College of Law — Information Portal</p>
            </div>
          </Link>
          <Link href="/admin" className="csu-btn-accent hidden sm:inline-flex">
            Admin Portal
          </Link>
        </div>
      </div>

      <div className="bg-csu-maroon text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
          <nav className="hidden items-center md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b-2 border-transparent px-4 py-3 text-sm font-medium hover:border-csu-gold hover:bg-csu-maroon-dark transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <details className="md:hidden relative w-full">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3">
              <span className="text-sm font-medium">Menu</span>
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute left-0 right-0 top-full z-50 border-t border-white/20 bg-csu-maroon-dark p-3 shadow-xl">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="block rounded px-3 py-2 text-sm hover:bg-white/10">
                  {l.label}
                </Link>
              ))}
              <Link href="/admin" className="mt-2 block rounded bg-csu-gold px-3 py-2 text-sm font-semibold text-csu-maroon-dark">
                Admin Portal
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-csu-gold bg-csu-maroon-dark text-white/90">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <CsuLogo size="lg" className="mb-3" />
          <p className="font-bold text-white">Cotabato State University</p>
          <p className="text-sm mt-1">College of Law</p>
          <p className="text-xs mt-2 text-white/70">Official information portal for announcements, news, events, memoranda, and documents.</p>
        </div>
        <div>
          <h3 className="text-csu-gold font-semibold mb-3 uppercase text-sm tracking-wide">Quick Links</h3>
          <div className="grid gap-1.5 text-sm">
            {links.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-csu-gold transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-csu-gold font-semibold mb-3 uppercase text-sm tracking-wide">About CSU</h3>
          <p className="text-sm leading-relaxed">
            Cotabato State University is Cotabato City&apos;s first state university, committed to instruction, research, extension, and production.
          </p>
          <a href="https://cotsu.edu.ph" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-csu-gold hover:underline">
            Visit cotsu.edu.ph →
          </a>
        </div>
        <div>
          <h3 className="text-csu-gold font-semibold mb-3 uppercase text-sm tracking-wide">Contact Us</h3>
          <div className="text-sm space-y-2">
            <p>Sinsuat Avenue<br />Cotabato City, Philippines 9600</p>
            <p>Tel: (064) 421-5146<br />(064) 557-2693</p>
            <p>Email: info@cotsu.edu.ph<br />op@cotsu.edu.ph</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/20 text-center text-xs py-4 text-white/60">
        © {new Date().getFullYear()} Cotabato State University — College of Law. All rights reserved.
      </div>
    </footer>
  );
}

export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-csu-maroon text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-csu-maroon via-csu-maroon/95 to-csu-aqua-dark/80" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
        <p className="text-csu-gold text-sm font-semibold uppercase tracking-widest mb-1">Cotabato State University</p>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-white/85 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
