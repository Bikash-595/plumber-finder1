import { timeline } from "./aboutContent";

/** Our story: the timeline. */
export default function AboutTimeline() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our story</h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Plumber Finder was created to solve a common problem: when plumbing issues happen, most people do not
            know which company to trust, how quickly help can arrive, or what to expect from pricing and service
            quality. We built this platform to replace confusion with clarity.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Today, we continue improving the experience with better profile quality, clearer comparisons, and a
            faster path from search to booking so users can make confident decisions when it matters most.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            In the early days, we heard the same concerns again and again from homeowners: they were tired of
            endless calls, unclear quotes, and uncertainty about who would actually show up. At the same time,
            skilled local plumbers told us they wanted a better way to connect with serious customers instead of
            competing in noisy listing spaces. Those conversations shaped the foundation of Plumber Finder.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Our approach is practical and customer-first. We focus on making profiles more informative, comparisons
            more honest, and decisions easier to make. Instead of overwhelming users with too many unknowns, we aim
            to surface trustworthy information that helps them move quickly and choose confidently.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Looking ahead, we are investing in smarter matching, stronger trust signals, and better service
            transparency across every city we support. The long-term vision is simple: become the most dependable
            local marketplace for plumbing services, where customers get better outcomes and professionals get fair,
            consistent opportunities to grow.
          </p>
        </div>
        <div className="space-y-3">
          {timeline.map((item) => (
            <article key={item.year} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-[#b59a00]">{item.year}</p>
              <h3 className="mt-1 text-base font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
