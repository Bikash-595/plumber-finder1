import Link from "next/link";
import { serviceDefinitions } from "@/components/services/serviceData";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,#123260,transparent_45%),radial-gradient(circle_at_top_right,#0f2a4d,transparent_40%),radial-gradient(circle_at_bottom_left,#0f2a4d,transparent_35%)]">
        <div className="absolute inset-0 bg-[#0b1f3b]/70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Services
          </span>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Plumbing services designed for urgent fixes and long-term reliability.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
            Explore verified service categories and quickly match with local professionals based on your exact needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/find"
              className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
            >
              Find Plumber
            </Link>
            <Link
              href="/quotes"
              className="rounded-full border border-emerald-700 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              Get Quotes
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceDefinitions.map((service) => (
            <article key={service.slug} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">{service.name}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{service.seoDescription}</p>
              <Link href={`/services/${service.slug}`} className="mt-5 inline-flex text-sm font-bold text-[#0f2a4d] underline decoration-[#FFD60A] decoration-2 underline-offset-4">Learn about {service.name}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Not sure which service you need?</h3>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Tell us your issue and compare nearby verified plumbers in minutes.
            </p>
          </div>
          <Link
            href="/find"
            className="mt-5 inline-flex rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 lg:mt-0"
          >
            Start Your Search
          </Link>
        </div>
      </section>
    </main>
  );
}
