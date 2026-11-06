import { fetchDirectorySitemap, type RankingScope } from "@/components/directory/directoryApi";

// Directory sitemaps, one per page design: /sitemaps/usa.xml, /sitemaps/states.xml, /sitemaps/cities.xml.
// They list only the Top 10 / Top 50 pages the backend says are worth indexing (published, enough premium
// providers). robots.txt points search engines here as well as to /sitemap.xml.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";
const FILES: Record<string, RankingScope> = { "usa.xml": "usa", "states.xml": "state", "cities.xml": "city" };

export const revalidate = 3600;

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const scope = FILES[(await params).file];
  if (!scope) return new Response("Not found", { status: 404 });
  const pages = await fetchDirectorySitemap(scope);
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((page) => `<url><loc>${escape(`${siteUrl}${page.path}`)}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>${scope === "usa" ? "0.9" : "0.8"}</priority></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
