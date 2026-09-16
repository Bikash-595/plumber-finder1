import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePageComponents } from "@/components/services/ServicePages";
import { serviceBySlug, serviceDefinitions } from "@/components/services/serviceData";

type ServicePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return serviceDefinitions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: service.seoTitle, description: service.seoDescription, url: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const ServiceComponent = servicePageComponents[slug as keyof typeof servicePageComponents];
  if (!ServiceComponent) notFound();
  return <ServiceComponent />;
}
