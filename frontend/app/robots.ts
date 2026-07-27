import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/company-dashboard", "/freelancer"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
