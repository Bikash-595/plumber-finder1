"use client";

import Link from "next/link";
import { FaBuilding, FaClock, FaImages, FaMapMarkedAlt, FaQuestionCircle, FaShareAlt, FaStar, FaTag, FaTools, FaUsers, FaBriefcase, FaPen } from "react-icons/fa";
import Notice from "@/components/dashboard/ui/Notice";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Panel from "@/components/dashboard/ui/Panel";
import { Skeleton } from "@/components/dashboard/ui/Skeleton";
import { companyApi, useCompanyData } from "../companyApi";
import StrengthChecklist from "../ui/StrengthChecklist";
import StrengthRing from "../ui/StrengthRing";
import PublicPageCard from "./PublicPageCard";
import { editorHref, isFreelancer } from "@/components/utils/providerSide";

const editors = [
  { label: "Header & logo", href: "header-profile", icon: FaPen },
  { label: "Company overview", href: "company-overview", icon: FaBuilding },
  { label: "Services", href: "services", icon: FaTools },
  { label: "Photos & videos", href: "media", icon: FaImages },
  { label: "Previous projects", href: "projects", icon: FaBriefcase },
  { label: "Team", href: "team", icon: FaUsers },
  { label: "Service areas", href: "service-areas", icon: FaMapMarkedAlt },
  { label: "Business hours", href: "business-hours", icon: FaClock },
  { label: "FAQs", href: "faqs", icon: FaQuestionCircle },
  { label: "Social links", href: "social-links", icon: FaShareAlt },
  { label: "Special offers", href: "offers", icon: FaTag },
  { label: "Reviews & ratings", href: "reviews", icon: FaStar },
];
// Freelancers have no team or overview-at-a-glance; they have Overview and Contact instead.
const freelancerEditors = [
  { label: "Your profile & photo", href: "header-profile", icon: FaPen },
  { label: "Overview", href: "overview", icon: FaBuilding },
  { label: "Services", href: "services", icon: FaTools },
  { label: "Work gallery", href: "gallery", icon: FaImages },
  { label: "Previous projects", href: "projects", icon: FaBriefcase },
  { label: "Service areas", href: "service-areas", icon: FaMapMarkedAlt },
  { label: "Opening hours", href: "opening-hours", icon: FaClock },
  { label: "Contact", href: "contact", icon: FaShareAlt },
  { label: "FAQs", href: "faqs", icon: FaQuestionCircle },
  { label: "Social links", href: "social-links", icon: FaShareAlt },
  { label: "Special offers", href: "offers", icon: FaTag },
  { label: "Reviews & ratings", href: "reviews", icon: FaStar },
];

const levelText: Record<string, string> = {
  Excellent: "Your profile has everything customers look for.",
  Strong: "A few more details will make your profile stand out.",
  "Getting there": "Complete profiles get noticeably more views and bookings.",
  "Just started": "Customers book plumbers they can learn about — start with the highlighted items.",
};

/** /company-dashboard/profile — the public profile at a glance: strength %, the checklist, and every editor. */
export default function CompanyProfileOverview() {
  const { data, error, loading } = useCompanyData("company-strength", companyApi.strength);
  const freelancer = isFreelancer();
  return (
    <div className="space-y-6">
      <PageHeader icon={FaBuilding} title={freelancer ? "My Profile" : "Company Profile"} description="What customers see in the directory, how complete it is, and where to improve it." />
      <Notice>{error}</Notice>
      {loading || !data ? <div className="space-y-4"><Skeleton className="h-24 rounded-2xl" /><Skeleton className="h-80 rounded-2xl" /></div> : (
        <>
          <PublicPageCard listing={data.listing} />
          <Panel>
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <StrengthRing percent={data.percent} size={136} />
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Profile strength</p>
                <p className="text-2xl font-bold text-gray-900">{data.level}</p>
                <p className="mt-1 max-w-xl text-sm text-gray-600">{levelText[data.level]}</p>
                <p className="mt-2 text-xs text-gray-500">{data.items.filter((item) => item.done).length} of {data.items.length} done · {data.extras.services} services · {data.extras.photos} photos · {data.extras.reviews} reviews · {data.extras.blogs} published posts</p>
              </div>
            </div>
          </Panel>
          <Panel title="Checklist" description="Each item links to where you fill it in, with the points it adds.">
            <StrengthChecklist items={data.items} />
          </Panel>
          <Panel title="Edit your profile">
            <nav aria-label="Profile editors" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {(freelancer ? freelancerEditors : editors).map(({ label, href, icon: Icon }) => (
                <Link key={`${label}-${href}`} href={freelancer ? `/freelancer/business-profile/${href}` : editorHref(href)} className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#b39200]" />{label}
                </Link>
              ))}
            </nav>
          </Panel>
        </>
      )}
    </div>
  );
}
