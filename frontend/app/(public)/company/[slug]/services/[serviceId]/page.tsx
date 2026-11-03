import type { Metadata } from "next";
import ServiceDetailPage, { generateMetadata as serviceMetadata } from "../../../../plumber/[id]/services/[serviceId]/page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; serviceId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, serviceId } = await params;
  return serviceMetadata({ params: Promise.resolve({ id: slug, serviceId }) });
}

/** /company/<slug>/services/<name>-<id> — same page as /plumber/<id>/services/<name>-<id>. */
export default async function CompanyServicePage({ params }: Props) {
  const { slug, serviceId } = await params;
  return <ServiceDetailPage params={Promise.resolve({ id: slug, serviceId })} />;
}
