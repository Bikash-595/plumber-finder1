import { FaClipboardCheck } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { serviceSectionIds } from "./sectionIds";

/** "Before your visit": the provider's own tips for this service (shown only when they added some). */
export default function ServiceBookingSteps({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  if (!service.prepare.length) return null;
  return (
    <section id={serviceSectionIds.prepare} aria-labelledby="prepare-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="prepare-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">Before your visit</h2>
      <p className="mt-1 text-sm text-gray-600">A few things {plumber.companyName} asks, so the job goes quickly.</p>
      <ul className="mt-4 space-y-2">
        {service.prepare.map((tip) => <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-700"><FaClipboardCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />{tip}</li>)}
      </ul>
    </section>
  );
}
