"use client";

import Link from "next/link";
import { useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";

const PREVIEW = 260;

/** Keywords to show: the provider's own, or (if they haven't written any) their services and main place. */
function keywordsFor(plumber: Plumber) {
  if (plumber.seo?.keywords?.length) return plumber.seo.keywords;
  const place = plumber.location?.split(",")[0]?.trim();
  return [...plumber.services.slice(0, 6).map((service) => (place ? `${service} ${place}` : service)), place && `Plumber in ${place}`].filter(Boolean) as string[];
}

/**
 * The provider's own "about" card under the booking form: their heading and text (Read more for long text),
 * popular searches linking to the directory, and the areas they serve. Plain text only.
 */
export default function ProfileSeoCard({ plumber }: { plumber: Plumber }) {
  const [expanded, setExpanded] = useState(false);
  const seo = plumber.seo;
  const heading = seo?.sidebarHeading || `About ${plumber.companyName}`;
  const content = seo?.sidebarContent?.trim() || "";
  const keywords = keywordsFor(plumber);
  const areas = (plumber.serviceAreaDetails?.map((area) => area.name) ?? plumber.serviceAreas ?? []).filter(Boolean).slice(0, 8);
  if (!content && !keywords.length && !areas.length) return null;
  const long = content.length > PREVIEW;
  const shown = long && !expanded ? `${content.slice(0, PREVIEW).replace(/\s+\S*$/, "")}…` : content;

  return (
    <section aria-labelledby="profile-seo-heading" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 id="profile-seo-heading" className="text-base font-extrabold text-[#0b1f3b]">{heading}</h2>
      {content && (
        <div className="mt-2">
          <p className="whitespace-pre-line text-sm leading-6 text-gray-600">{shown}</p>
          {long && <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="mt-1 text-xs font-bold text-[#0b1f3b] underline">{expanded ? "Show less" : "Read more"}</button>}
        </div>
      )}
      {keywords.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Popular searches</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {keywords.map((keyword) => (
              <li key={keyword}>
                <Link href={`/find?search=${encodeURIComponent(keyword)}`} className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">
                  <FaSearch className="h-2.5 w-2.5 text-gray-400" aria-hidden /> {keyword}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {areas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Areas served</h3>
          <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">{areas.map((area) => <span key={area} className="inline-flex items-center gap-1"><FaMapMarkerAlt className="h-2.5 w-2.5 text-[#a68600]" aria-hidden />{area}</span>)}</p>
        </div>
      )}
    </section>
  );
}
