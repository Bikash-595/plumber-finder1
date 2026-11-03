import { FaExclamationCircle } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import { serviceSectionIds } from "./sectionIds";

/** "Signs you need this": the problems the provider fixes with this service (only when they listed some). */
export default function ServiceProblems({ service }: { service: ServicePage }) {
  if (!service.problems.length) return null;
  return (
    <section id={serviceSectionIds.problems} aria-labelledby="problems-heading" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="problems-heading" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">Signs you need {service.name.toLowerCase()}</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {service.problems.map((problem) => (
          <li key={problem} className="flex items-start gap-2.5 rounded-2xl bg-red-50/60 px-4 py-3 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-red-100">
            <FaExclamationCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" aria-hidden />{problem}
          </li>
        ))}
      </ul>
    </section>
  );
}
