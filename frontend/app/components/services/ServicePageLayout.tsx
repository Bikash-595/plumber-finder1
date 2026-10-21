import Link from "next/link";
import ServiceSeoContent from "@/components/find/ServiceSeoContent";
import ServiceCompanies from "./ServiceCompanies";
import { ServiceIcon } from "./serviceIcons";
import type { ServiceDefinition } from "./serviceData";

export default function ServicePageLayout({
  service,
}: {
  service: ServiceDefinition;
}) {
  return (
    <main className="min-h-screen bg-gray-50 text-slate-800">
      <section className="bg-[#0f2a4d] px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li aria-hidden>/</li>
              <li className="font-semibold text-white" aria-current="page">{service.name}</li>
            </ol>
          </nav>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFD60A] text-[#0f2a4d]">
              <ServiceIcon slug={service.slug} className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFD60A]">
              Local plumbing guide
            </p>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {service.seoTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:mt-5 sm:text-lg sm:leading-8">
            {service.intro}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <a
              href="#service-companies-heading"
              className="inline-flex justify-center rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-bold text-[#0f2a4d]"
            >
              See {service.name.toLowerCase()} companies
            </a>
            <Link
              href={`/find?service=${encodeURIComponent(service.filter)}`}
              className="inline-flex justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
            >
              Search with more filters
            </Link>
          </div>
        </div>
      </section>

      <ServiceCompanies key={service.slug} service={service} />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
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
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
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

      <ServiceSeoContent service={service.filter} />
    </main>
  );
}
