import Link from "next/link";

/** [label, URL segment, what it controls] for every Business Profile section. */
export const profileLinks: [string, string, string][] = [
  ["Header Profile", "header-profile", "Name, logo, cover photos, tagline and credentials at the top of your page."],
  ["Company Overview", "company-overview", "The “Company at a Glance” facts: founded, team size, response time."],
  ["Services Offered", "services", "Each service with price, photos, what's included and its own page."],
  ["Media Gallery", "media", "Photos and videos of your work."],
  ["Previous Projects", "projects", "Before-and-after case studies with results."],
  ["FAQs", "faqs", "Answers to the questions customers ask before booking."],
  ["Customer Reviews", "reviews", "Read, reply to and report reviews; connect Google."],
  ["Service Areas", "service-areas", "The cities and neighbourhoods you cover, and what you offer in each."],
  ["Google Maps", "maps", "Your address, map pin and travel radius."],
  ["SEO & Keywords", "seo", "Your Google title and description, keywords, and the about card on your profile."],
  ["Blogs", "blogs", "Articles that show your expertise and bring in search traffic."],
  ["Special Offers", "offers", "Discounts and coupon codes customers can use when booking."],
  ["Booking Settings", "booking", "Instant booking, working days, time slots and cancellation policy."],
  ["Contact Information", "contact", "Phones, emails, WhatsApp, website and an emergency line."],
  ["Social Links", "social-links", "Facebook, Instagram, LinkedIn and more, shown in your header."],
  ["Business Hours", "business-hours", "Opening hours per day, 24/7 availability and holidays."],
  ["Team Members", "team", "The people customers will meet, with their skills and licenses."],
  ["Branches", "branches", "Your other offices or depots, shown as pins on your map."],
  ["Documents & Verification", "verification", "Private links to your license and insurance for verification."],
  ["Preview Profile", "preview", "See your public page exactly as customers will."],
];

export default function ProfileMenu() {
  return <nav className="flex flex-wrap gap-2">{profileLinks.map(([label, slug]) => <Link key={slug} href={`/company-dashboard/business-profile/${slug}`} className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">{label}</Link>)}</nav>;
}
