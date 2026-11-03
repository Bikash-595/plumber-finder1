import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchLiveProfile, plumberHref } from "@/components/find/companyListing";
import { hasServicePage, serviceSegment } from "@/components/find/serviceLinks";
import ServicesDirectory from "@/components/plumber/services/ServicesDirectory";
import ServicesPageHeader from "@/components/plumber/services/directory/ServicesPageHeader";
import ServicesQuoteCta from "@/components/plumber/services/directory/ServicesQuoteCta";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plumber = await fetchLiveProfile((await params).id);
  if (!plumber?.serviceDetails?.length) return { title: "Services not found", robots: { index: false } };
  const where = plumber.location ? ` in ${plumber.location}` : "";
  return {
    title: `Services & prices — ${plumber.companyName}${where}`,
    description: `${plumber.serviceDetails.length} plumbing services from ${plumber.companyName}${where}: ${plumber.serviceDetails.slice(0, 5).map((s) => s.name).join(", ")}. Upfront prices, photos and online booking.`.slice(0, 160),
    alternates: { canonical: `${plumberHref(plumber)}/services` },
  };
}

/** Every service from one company or freelancer: header, filters, search and sort, the cards, and a quote prompt. */
export default async function AllServicesPage({ params }: Props) {
  const plumber = await fetchLiveProfile((await params).id);
  const services = [...(plumber?.serviceDetails ?? [])];
  if (!plumber || !services.length) notFound();
  const base = plumberHref(plumber);
  const hrefs = Object.fromEntries(services.map((service) => [service.id, hasServicePage(service.id) ? `${base}/services/${serviceSegment(service.name, service.id)}` : undefined]));
  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <ServicesPageHeader plumber={plumber} services={services} profileHref={base} />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ServicesDirectory services={services} hrefs={hrefs} />
        <ServicesQuoteCta name={plumber.companyName} profileHref={base} />
        <p className="text-center text-xs text-gray-400">Prices are a guide; the final price is confirmed by {plumber.companyName} before work starts.</p>
      </div>
    </main>
  );
}
