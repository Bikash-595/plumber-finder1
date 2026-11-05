import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DirectoryRankingPage from "@/components/directory/DirectoryRankingPage";
import { fetchRankingPage } from "@/components/directory/directoryApi";
import { pageDescription, pageTitle } from "@/components/directory/directorySeo";

// Every Top 10 / Top 50 page. Visitors and search engines use the clean addresses, e.g. /top-10-plumbers/texas,
// /top-50-drain-cleaning-companies/california/los-angeles; next.config.ts rewrites them to this route.

type Props = { params: Promise<{ limit: string; noun: string; state: string; city?: string[] }>; searchParams: Promise<{ sort?: string }> };

async function load({ params, searchParams }: Props) {
  const { limit, noun, state, city } = await params;
  const { sort } = await searchParams;
  if ((city?.length ?? 0) > 1) notFound();
  return { result: await fetchRankingPage(limit, noun, state, city?.[0], typeof sort === "string" ? sort : undefined), sorted: typeof sort === "string" && sort !== "top-rated" };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { result, sorted } = await load(props);
  if (result.status === "missing") return { title: "Page not found", robots: { index: false } };
  if (result.status === "unavailable") return { title: "Plumber rankings", robots: { index: false } };
  const { data } = result;
  const title = pageTitle(data);
  const description = pageDescription(data);
  // A Top 50 page with no more than 10 providers repeats the Top 10 page, so it points search engines there.
  const canonical = data.seo.duplicateOfTop10 ? data.page.top10Path : data.page.path;
  const index = data.seo.isIndexable && !sorted && !data.seo.duplicateOfTop10;
  return {
    title, description,
    alternates: { canonical },
    robots: { index, follow: true },
    openGraph: { title, description, type: "website", url: data.page.path },
    twitter: { card: "summary", title, description },
  };
}

export default async function RankingRoute(props: Props) {
  const { result } = await load(props);
  if (result.status === "missing") notFound();
  if (result.status === "unavailable") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#0b1f3b]">Rankings are temporarily unavailable</h1>
        <p className="mt-2 text-slate-600">Please try again in a minute.</p>
      </main>
    );
  }
  return <DirectoryRankingPage data={result.data} />;
}
