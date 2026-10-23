import type { MetadataRoute } from "next";
import { plumbers } from "@/data/plumbers";
import { fetchPublishedPlumbers } from "@/components/find/companyListing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Real company pages (/company/<slug>); the backend being offline just leaves them out.
  const live = await fetchPublishedPlumbers().catch(() => []);
  const companyRoutes = live.filter((plumber) => plumber.providerType === "company" && plumber.slug).map((plumber) => ({
    url: `${siteUrl}/company/${plumber.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/add-business",
    "/blogs",
    "/contact",
    "/faq",
    "/find",
    "/services",
    "/states",
  ];

  const plumberRoutes = plumbers.flatMap((plumber) => {
    const profile = {
      url: `${siteUrl}/plumber/${plumber.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };

    const blogs = (plumber.blogs ?? []).map((post) => ({
      url: `${siteUrl}/plumber/${plumber.id}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const projects = (plumber.projects ?? []).map((project, index) => ({
      url: `${siteUrl}/plumber/${plumber.id}/projects/${project.id ?? `project-${index + 1}`}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [profile, ...blogs, ...projects];
  });

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...companyRoutes,
    ...plumberRoutes,
  ];
}
