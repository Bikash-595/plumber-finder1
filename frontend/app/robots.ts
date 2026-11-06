import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/company-dashboard", "/freelancer", "/checkout", "/rankings/"],
      },
    ],
    // The main sitemap, and the Top 10 / Top 50 directory sitemaps (USA, states, cities).
    sitemap: [`${siteUrl}/sitemap.xml`, ...["usa", "states", "cities"].map((name) => `${siteUrl}/sitemaps/${name}.xml`)],
  };
}
