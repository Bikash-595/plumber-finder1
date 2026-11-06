import { rankingHref, type RankingPage } from "../directoryApi";
import { heading } from "../directorySeo";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumberfinder.com";

/** Home › USA › State › City — each level is the same kind of ranking one level up. */
export function breadcrumbs(data: RankingPage) {
  const { page } = data;
  return [
    { label: "Home", href: "/" },
    ...(page.state ? [{ label: `Top ${page.limit} in the USA`, href: rankingHref(page.limit, page.noun, null) }] : []),
    ...(page.city && page.state ? [{ label: `Top ${page.limit} in ${page.state.name}`, href: rankingHref(page.limit, page.noun, page.state.slug) }] : []),
    { label: heading(data), href: page.path },
  ];
}
