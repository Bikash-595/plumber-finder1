import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import { fetchLiveProfile, plumberHref } from "@/components/find/companyListing";
import { hasServicePage, serviceSegment } from "@/components/find/serviceLinks";
import ServicesDirectory from "@/components/plumber/services/ServicesDirectory";
import ServicesSummary from "@/components/plumber/services/ServicesSummary";

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

/** Every service from one provider, with categories and search. */
export default async function AllServicesPage({ params }: Props) {
  const plumber = await fetchLiveProfile((await params).id);
  const services = [...(plumber?.serviceDetails ?? [])];
  if (!plumber || !services.length) notFound();
  const base = plumberHref(plumber);
  const hrefs = Object.fromEntries(services.map((service) => [service.id, hasServicePage(service.id) ? `${base}/services/${serviceSegment(service.name, service.id)}` : undefined]));
  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <section className="relative overflow-hidden bg-[#0b1f3b] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgba(255,214,10,0.18),transparent_60%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white">Home</Link><FaChevronRight className="h-2 w-2" aria-hidden />
            <Link href={base} className="hover:text-white">{plumber.companyName}</Link><FaChevronRight className="h-2 w-2" aria-hidden />
            <span className="text-white" aria-current="page">Services</span>
          </nav>
          <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FFD60A]">Services &amp; pricing</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">Everything {plumber.companyName} can do for you</h1>
          <p className="mt-3 max-w-2xl text-white/70">{services.length} services with upfront prices{plumber.location ? ` in ${plumber.location}` : ""}. Open any service for photos, videos and FAQs, or book it straight away.</p>
          <Link href={base} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"><FaArrowLeft className="h-3 w-3" aria-hidden /> Back to profile</Link>
        </div>
      </section>
      <div className="@container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="-mt-14 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-gray-100 sm:p-5"><ServicesSummary services={services} /></div>
        <div className="mt-8"><ServicesDirectory services={services} hrefs={hrefs} /></div>
        <p className="mt-8 text-center text-xs text-gray-400">Prices are a guide; the final price is confirmed by {plumber.companyName} before work starts.</p>
      </div>
    </main>
  );
}
