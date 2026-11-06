import { qualityStandards } from "./aboutContent";

/** Quality standards. */
export default function AboutQualityStandards() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Quality standards we operate by</h2>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
          Our marketplace is not just a directory. It is a quality-focused ecosystem designed to increase trust for
          customers and reward dependable professionals.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {qualityStandards.map((item) => (
            <article key={item.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
