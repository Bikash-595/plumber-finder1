import Link from "next/link";
import { freelancerProfileSections } from "@/components/freelancer-dashboard/business-profile/FreelancerProfileForms";

export default function FreelancerBusinessProfilePage() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {freelancerProfileSections.map(({ slug, label }) => (
        <Link key={slug} href={`/freelancer/business-profile/${slug}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FFD60A] hover:shadow-md">
          <h2 className="font-bold text-gray-900">{label}</h2>
          <p className="mt-1 text-sm text-gray-500">Edit your {label.toLowerCase()} →</p>
        </Link>
      ))}
    </section>
  );
}
