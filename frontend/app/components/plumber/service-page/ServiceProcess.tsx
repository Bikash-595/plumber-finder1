import type { ServicePage } from "@/components/find/companyListing";
import { serviceSectionIds } from "./sectionIds";

/** "How it works": the steps of the job as a numbered timeline. */
export default function ServiceProcess({ service }: { service: ServicePage }) {
  if (!service.process.length) return null;
  return (
    <section id={serviceSectionIds.process} aria-labelledby="service-process" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="service-process" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">How it works</h2>
      <ol className="mt-6 space-y-0">
        {service.process.map((step, i) => (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {i < service.process.length - 1 && <span className="absolute left-5 top-11 h-[calc(100%-2.75rem)] w-0.5 bg-gradient-to-b from-[#FFD60A] to-gray-200" aria-hidden />}
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0b1f3b] text-sm font-extrabold text-[#FFD60A] shadow-md">{i + 1}</span>
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Step {i + 1}</p>
              <p className="mt-0.5 text-[15px] font-semibold leading-7 text-gray-800">{step}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
