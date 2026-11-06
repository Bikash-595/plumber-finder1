import type { NextConfig } from "next";

// The backend API (same variable the browser code uses).
const apiBase = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300/api").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Uploaded pictures are served by the backend at /api/media/... and linked from public pages as /media/...
  // (same address as the site, so <Image> optimizes and caches them like local files).
  async rewrites() {
    return [
      { source: "/media/:path*", destination: `${apiBase}/media/:path*` },
      // Top 10 / Top 50 directory pages: /top-10-plumbers/texas, /top-50-drain-cleaning-companies/california/los-angeles
      // (rendered by app/(public)/rankings/...; the noun is checked by the backend, unknown ones are 404).
      // The noun needs its own pattern: after an escaped "-" the default one stops at the next hyphen.
      // USA-wide pages: /top-10-plumbers-usa, /top-50-drain-cleaning-companies-usa
      { source: "/top\\-:limit(10|50)\\-:noun([a-z][a-z\\-]*)\\-usa", destination: "/rankings/:limit/:noun/usa" },
      { source: "/top\\-:limit(10|50)\\-:noun([a-z][a-z\\-]*)/:state", destination: "/rankings/:limit/:noun/:state" },
      { source: "/top\\-:limit(10|50)\\-:noun([a-z][a-z\\-]*)/:state/:city", destination: "/rankings/:limit/:noun/:state/:city" },
    ];
  },
  // One address per page: /top-10-plumbers/usa is the USA page's other spelling.
  async redirects() {
    return [{ source: "/top\\-:limit(10|50)\\-:noun([a-z][a-z\\-]*)/usa", destination: "/top-:limit-:noun-usa", permanent: true }];
  },
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 1,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        pathname: "/api/portraits/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        // Google account profile photos (Sign in with Google).
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      { protocol: "https", hostname: "randomuser.me" },
    ],
  },
};

export default nextConfig;
