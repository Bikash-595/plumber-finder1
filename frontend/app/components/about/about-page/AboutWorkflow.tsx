import Link from "next/link";
import { workflow } from "./aboutContent";

/** How Plumber Finder works. */
export default function AboutWorkflow() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">How Plumber Finder works</h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
            Designed for both urgent issues and planned plumbing jobs, our process keeps everything clear from the
            first search to final booking.
          </p>
          <div className="mt-6 space-y-4">
            {workflow.map((item) => (
              <article key={item.step} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#FFD60A]/20 text-sm font-bold text-[#b59a00]">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside className="rounded-3xl bg-[#0f2a4d] p-6 text-white sm:p-8">
          <h3 className="text-xl font-bold">Our mission</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            We are building the most trusted local plumbing marketplace where customers get quality outcomes and
            plumbing professionals get consistent opportunities to grow.
          </p>
          <div className="mt-6 border-t border-white/15 pt-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/80">Need help right now?</h4>
            <p className="mt-2 text-sm text-white/80">Browse verified plumbers near you and get quotes quickly.</p>
            <Link
              href="/find"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold !text-black transition hover:bg-gray-100"
            >
              Start Searching
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
