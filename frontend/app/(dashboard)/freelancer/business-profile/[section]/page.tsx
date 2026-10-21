import { notFound } from "next/navigation";
import { freelancerProfileSections } from "@/components/freelancer-dashboard/business-profile/FreelancerProfileForms";

export function generateStaticParams() {
  return freelancerProfileSections.map(({ slug }) => ({ section: slug }));
}

export default async function FreelancerProfileSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = freelancerProfileSections.find(({ slug }) => slug === section);
  if (!entry) notFound();
  return <entry.Form />;
}
