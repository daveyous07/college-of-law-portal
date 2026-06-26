import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  images: { remotePatterns: [{ protocol: "https", hostname: "cotsu.edu.ph" }] },
};

export default nextConfig;
