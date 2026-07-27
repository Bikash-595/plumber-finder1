import Link from "next/link";

export const profileLinks = [
  ["Header Profile", "header-profile"], ["Company Overview", "company-overview"], ["Services Offered", "services"], ["Media Gallery", "media"], ["Previous Projects", "projects"], ["FAQs", "faqs"], ["Customer Reviews", "reviews"], ["Service Areas", "service-areas"], ["Google Maps", "maps"], ["Blogs", "blogs"], ["Special Offers", "offers"], ["Booking Settings", "booking"], ["Contact Information", "contact"], ["Social Links", "social-links"], ["Business Hours", "business-hours"], ["Team Members", "team"], ["Branches", "branches"], ["Documents & Verification", "verification"], ["Preview Profile", "preview"],
];

export default function ProfileMenu() {
  return <nav className="flex flex-wrap gap-2">{profileLinks.map(([label, slug]) => <Link key={slug} href={`/company-dashboard/business-profile/${slug}`} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">{label}</Link>)}</nav>;
}
