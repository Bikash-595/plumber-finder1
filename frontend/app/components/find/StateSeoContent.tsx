import Link from "next/link";
import type { Plumber } from "./types";
import { getStateSeoContent } from "./stateData";

type StateSeoContentProps = {
  stateName: string;
  city?: string;
  plumbers: Plumber[];
};

export default function StateSeoContent({
  stateName,
  city,
  plumbers,
}: StateSeoContentProps) {
  const locationName = city ? `${city}, ${stateName}` : stateName;
  const content = getStateSeoContent(stateName, city);
  const emergencyCount = plumbers.filter((plumber) => plumber.isEmergency).length;
  const emergencyMessage = emergencyCount
    ? `${emergencyCount} listed ${emergencyCount === 1 ? "company offers" : "companies offer"} emergency service`
    : content.emergencyMessage;

  return (
    <section
      className="mt-12 border-y border-slate-200 bg-white"
      aria-labelledby="state-help-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#756100]">
            {content.eyebrow}
          </p>
          <h2
            id="state-help-heading"
            className="mt-3 text-3xl font-extrabold tracking-tight text-[#0f2a4d] sm:text-4xl"
          >
            {content.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            {content.description} {plumbers.length} local plumbing {plumbers.length === 1 ? "company is" : "companies are"} currently listed.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-3">
          <StateContentColumn
            number="01"
            title={content.servicesHeading}
            items={content.services}
          />
          <StateContentColumn
            number="02"
            title={content.areasHeading}
            items={content.areas}
          />
          <StateContentColumn
            number="03"
            title={content.bookingHeading}
            border={false}
            items={[
              ...content.bookingChecklist.slice(0, 3),
              emergencyMessage,
            ]}
          />
        </div>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-[#f8fafc] p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-bold text-[#0f2a4d]">
              {content.ctaTitle}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {content.ctaDescription}
            </p>
          </div>
          <Link
            href="/post-requirement"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-bold text-[#0f2a4d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:ring-offset-2"
          >
            {content.ctaLabel} <span aria-hidden="true" className="ml-2 text-base">→</span>
          </Link>
        </div>

        <p className="mt-5 max-w-4xl text-xs leading-5 text-slate-400">
          {content.disclaimer}
        </p>
      </div>
    </section>
  );
}

function StateContentColumn({
  number,
  title,
  items,
  border = true,
}: {
  number: string;
  title: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div className={`p-6 sm:p-7 ${border ? "border-b border-slate-200 md:border-b-0 md:border-r" : ""}`}>
      <span className="text-sm font-extrabold text-[#756100]">{number}</span>
      <h3 className="mt-3 text-lg font-bold text-[#0f2a4d]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD60A]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
