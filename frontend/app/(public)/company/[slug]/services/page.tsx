import type { Metadata } from "next";
import AllServicesPage, { generateMetadata as servicesMetadata } from "../../../plumber/[id]/services/page";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return servicesMetadata({ params: Promise.resolve({ id: (await params).slug }) });
}

/** /company/<slug>/services — same page as /plumber/<id>/services. */
export default async function CompanyServicesPage({ params }: Props) {
  return <AllServicesPage params={Promise.resolve({ id: (await params).slug })} />;
}
