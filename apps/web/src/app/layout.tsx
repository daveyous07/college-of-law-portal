import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSU College of Law — Information Portal",
  description: "Official announcements, news, events, memoranda, and documents from the College of Law, Cotabato State University.",
  icons: { icon: "/csu-seal.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
