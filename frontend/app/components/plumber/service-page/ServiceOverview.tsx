import { FaCheckCircle } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import { serviceSectionIds } from "./sectionIds";

/** The full overview (paragraphs split on blank lines) and everything that's included. */
export default function ServiceOverview({ service }: { service: ServicePage }) {
  const paragraphs = (service.overview ?? "").split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
  if (!paragraphs.length && !service.includes.length) return null;
  return (
    <section id={serviceSectionIds.overview} aria-labelledby="service-overview" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="service-overview" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">About this service</h2>
      {paragraphs.length > 0 && <div className="mt-4 space-y-4 text-[15px] leading-8 text-gray-700">{paragraphs.map((text, i) => <p key={i} className="whitespace-pre-line">{text}</p>)}</div>}
      {service.includes.length > 0 && (
        <div className={paragraphs.length ? "mt-8" : "mt-4"}>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500">What&apos;s included</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-gray-800">
                <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden /> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
