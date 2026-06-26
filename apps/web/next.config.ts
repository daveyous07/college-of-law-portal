import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve /public files directly — required for static assets on Cloudflare Workers (no Node image optimizer).
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "cotsu.edu.ph" }],
  },
};

export default nextConfig;
