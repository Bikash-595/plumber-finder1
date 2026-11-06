import { trustStats } from "./aboutContent";

/** Trust numbers. */
export default function AboutTrustStats() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {trustStats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-extrabold text-gray-900">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-gray-600">{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
