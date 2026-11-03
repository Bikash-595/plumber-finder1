import { notFound } from "next/navigation";
import { findFreelancerSection, freelancerProfileSections } from "@/components/freelancer-dashboard/business-profile/freelancerProfileSections";

export function generateStaticParams() {
  return freelancerProfileSections.map(({ slug }) => ({ section: slug }));
}

/** /freelancer/business-profile/<section> — the section's own form (see freelancerProfileSections). */
export default async function FreelancerProfileSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const entry = findFreelancerSection((await params).section);
  if (!entry) notFound();
  return <entry.Form />;
}
