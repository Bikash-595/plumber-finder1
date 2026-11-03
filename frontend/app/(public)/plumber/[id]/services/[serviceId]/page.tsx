import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { fetchLiveProfile, fetchServicePage, plumberHref } from "@/components/find/companyListing";
import { serviceIdFrom, serviceSegment } from "@/components/find/serviceLinks";
import BookingPanel from "@/components/plumber/booking-panel/BookingPanel";
import RelatedServices from "@/components/plumber/service-page/RelatedServices";
import ServiceFaqs from "@/components/plumber/service-page/ServiceFaqs";
import ServiceGallery from "@/components/plumber/service-page/ServiceGallery";
import ServiceHero from "@/components/plumber/service-page/ServiceHero";
import ServiceJsonLd from "@/components/plumber/service-page/ServiceJsonLd";
import ServiceOverview from "@/components/plumber/service-page/ServiceOverview";
import ServiceProcess from "@/components/plumber/service-page/ServiceProcess";
import ServiceProviderCard from "@/components/plumber/service-page/ServiceProviderCard";
import ServiceAreasCovered from "@/components/plumber/service-page/ServiceAreasCovered";
import ServiceBookingSteps from "@/components/plumber/service-page/ServiceBookingSteps";
import ServiceKeyFacts from "@/components/plumber/service-page/ServiceKeyFacts";
import ServicePricing from "@/components/plumber/service-page/ServicePricing";
import ServiceSectionNav from "@/components/plumber/service-page/ServiceSectionNav";
import ServiceWhyUs from "@/components/plumber/service-page/ServiceWhyUs";
import ServiceProblems from "@/components/plumber/service-page/ServiceProblems";
import { replyTime } from "@/components/plumber/service-page/sectionIds";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; serviceId: string }> };

/** The provider and the service, or null when either doesn't exist (or the provider is hidden). */
async function load({ id, serviceId }: { id: string; serviceId: string }) {
  const key = serviceIdFrom(serviceId);
  const plumber = key ? await fetchLiveProfile(id) : null;
  const service = plumber && key ? await fetchServicePage(plumber, key) : null;
  return plumber && service ? { plumber, service } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(await params);
  if (!found) return { title: "Service not found", robots: { index: false } };
  const { plumber, service } = found;
  const where = plumber.location ? ` in ${plumber.location}` : "";
  const description = (service.description || service.overview || `${service.name} by ${plumber.companyName}${where}.`).slice(0, 160);
  const image = service.images.find((src) => src.startsWith("http"));
  return {
    // The root layout appends " | Plumber Finder".
    title: `${service.name} by ${plumber.companyName}${where}`,
    description,
    alternates: { canonical: `${plumberHref(plumber)}/services/${serviceSegment(service.name, service.id)}` },
    openGraph: { title: `${service.name} — ${plumber.companyName}`, description, type: "website", images: image ? [image] : undefined },
  };
}

/**
 * A service's own page: photos and videos, the summary and price, then everything a customer needs to decide —
 * at a glance, about the job and what's included, how it works, pricing, why this provider, areas covered,
 * how booking works and FAQs — with booking beside it (or in the bottom bar on phones).
 */
export default async function ServiceDetailPage({ params }: Props) {
  const found = await load(await params);
  if (!found) notFound();
  const { plumber, service } = found;
  const profileHref = plumberHref(plumber);
  const url = `${profileHref}/services/${serviceSegment(service.name, service.id)}`;
  const hasReasons = Boolean(plumber.isVerified || plumber.licenseNumber || plumber.insurance || plumber.yearsInBusiness > 0 || plumber.reviewCount > 0 || service.warranty || replyTime(plumber.responseTime));
  const hasAreas = Boolean(plumber.serviceAreaDetails?.length || plumber.serviceAreas?.length || plumber.location);
  // Only sections with something real in them (the provider's own content, or facts from their details).
  const sections = [
    "facts",
    (service.overview || service.includes.length > 0) && "overview",
    service.problems.length > 0 && "problems",
    service.process.length > 0 && "process",
    "pricing",
    (hasReasons || service.highlights.length > 0) && "why",
    service.prepare.length > 0 && "prepare",
    hasAreas && "areas",
    "faqs",
  ].filter(Boolean) as ("facts" | "overview" | "problems" | "process" | "pricing" | "why" | "prepare" | "areas" | "faqs")[];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-gray-900">
      <ServiceJsonLd plumber={plumber} service={service} url={url} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href={`${profileHref}#services`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-[#f7672c]"><FaArrowLeft className="h-3.5 w-3.5" aria-hidden /> All services from {plumber.companyName}</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-8">
            {/* The name, subheading and price first; then the photos and videos. */}
            <ServiceHero plumber={plumber} service={service} profileHref={profileHref} />
            <ServiceGallery images={service.images} videos={service.videos} name={service.name} />
            <ServiceSectionNav sections={sections} />
            <ServiceKeyFacts plumber={plumber} service={service} />
            <ServiceOverview service={service} />
            <ServiceProblems service={service} />
            <ServiceProcess service={service} />
            <ServicePricing plumber={plumber} service={service} />
            <ServiceWhyUs plumber={plumber} service={service} />
            <ServiceBookingSteps plumber={plumber} service={service} />
            <ServiceAreasCovered plumber={plumber} service={service} />
            <ServiceFaqs plumber={plumber} service={service} />
            <RelatedServices services={plumber.serviceDetails ?? []} current={service.id} category={service.category} profileHref={profileHref} />
          </div>
          <aside className="space-y-6">
            <ServiceProviderCard plumber={plumber} profileHref={profileHref} />
            <BookingPanel plumber={plumber} initialService={plumber.services.includes(service.name) ? service.name : "other"} />
          </aside>
        </div>
      </div>
    </main>
  );
}
