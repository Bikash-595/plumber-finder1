import Link from "next/link";
import type { ServiceDefinition } from "./serviceData";

export default function ServicePageLayout({
  service,
}: {
  service: ServiceDefinition;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section className="bg-[#0f2a4d] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFD60A]">
            Local plumbing guide
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
            {service.seoTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            {service.intro}
          </p>
          <Link
            href={`/find?service=${encodeURIComponent(service.filter)}`}
            className="mt-8 inline-flex rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-bold text-[#0f2a4d]"
          >
            Find {service.name} plumbers
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-[#0f2a4d]">
            Signs you may need help
          </h2>
          <ul className="mt-5 space-y-3 text-slate-600">
            {service.signs.map((sign) => (
              <li key={sign} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#FFD60A]" />
                {sign}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-[#0f2a4d]">
            How to get started
          </h2>
          <ol className="mt-5 space-y-3 text-slate-600">
            {service.process.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#FFD60A] text-xs font-bold text-[#0f2a4d]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </article>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-[#0f2a4d]">
            Compare local {service.name.toLowerCase()} professionals
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Review services, availability, and customer feedback to make an
            informed choice. For urgent safety concerns, contact emergency
            services or your utility provider first when appropriate.
          </p>
        </div>
      </section>
    </main>
  );
}
