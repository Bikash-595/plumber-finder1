"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { freelancerProfileSections } from "./FreelancerProfileForms";

export default function FreelancerProfileMenu() {
  const pathname = usePathname();
  return (
    <nav aria-label="Profile sections" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {freelancerProfileSections.map(({ slug, label }) => {
        const href = `/freelancer/business-profile/${slug}`;
        const active = pathname === href;
        return (
          <Link
            key={slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${active ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-[#FFD60A] hover:bg-[#FFD60A]/10"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
