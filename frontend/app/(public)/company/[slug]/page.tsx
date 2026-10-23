import type { Metadata } from "next";
import { fetchLiveProfile } from "@/components/find/companyListing";
import PlumberProfilePage from "../../plumber/[id]/page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// Search-friendly title, description, and canonical URL for each company page.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await fetchLiveProfile(slug);
  if (!company) return { title: "Company not found", robots: { index: false } };
  const where = company.location ? ` in ${company.location}` : "";
  const description = (company.description || `${company.companyName} offers ${company.services.slice(0, 4).join(", ") || "plumbing services"}${where}.`).slice(0, 160);
  return {
    // The root layout appends " | Plumber Finder".
    title: `${company.companyName} – Plumber${where}`,
    description,
    alternates: { canonical: `/company/${company.slug ?? slug}` },
    openGraph: { title: company.companyName, description, type: "profile", images: company.logo?.startsWith("http") ? [company.logo] : undefined },
  };
}

/** A company's public profile at /company/<slug>, e.g. /company/abc-plumbing. */
export default async function CompanyProfilePage({ params }: Props) {
  const { slug } = await params;
  return <PlumberProfilePage params={Promise.resolve({ id: slug })} />;
}
