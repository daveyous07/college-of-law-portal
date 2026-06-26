import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "cotsu.edu.ph" }] },
};

export default nextConfig;
