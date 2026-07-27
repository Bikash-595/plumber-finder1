import Link from "next/link";
import { profileLinks } from "@/components/company-dashboard/business-profile/ProfileMenu";

export default function BusinessProfilePage() {
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{profileLinks.map(([label, slug]) => <Link key={slug} href={`/company-dashboard/business-profile/${slug}`} className="rounded-xl border border-gray-200 bg-white p-5 font-bold text-gray-800 shadow-sm transition hover:border-[#FFD60A] hover:shadow-md">{label}<span className="mt-2 block text-sm font-normal text-gray-500">Configure this customer-facing profile section.</span></Link>)}</section>;
}
