import { type RankingPage } from "../directoryApi";
import { heading } from "../directorySeo";
import { siteUrl, breadcrumbs } from "./rankingLinks";

/** Structured data: breadcrumbs and the ranked list (names and profile links only — no review markup). */
export default function JsonLd({ data }: { data: RankingPage }) {
  const crumbs = breadcrumbs(data);
  const graph = [
    { "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.label, item: `${siteUrl}${crumb.href}` })) },
    ...(data.items.length ? [{ "@type": "ItemList", name: heading(data), numberOfItems: data.items.length, itemListOrder: "https://schema.org/ItemListOrderDescending", itemListElement: data.items.map((item) => ({ "@type": "ListItem", position: item.position, name: item.name, url: `${siteUrl}${item.url}` })) }] : []),
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
