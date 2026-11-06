import Link from "next/link";
import { aboutFaq } from "./aboutContent";

/** Common questions, then the call to action. */
export default function AboutFaqCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-[#0f2a4d] p-6 text-white sm:p-8 lg:p-10">
        <h2 className="text-2xl font-bold sm:text-3xl">About Plumber Finder: common questions</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {aboutFaq.map((item) => (
            <article key={item.question} className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <h3 className="text-sm font-semibold sm:text-base">{item.question}</h3>
              <p className="mt-2 text-sm text-white/80">{item.answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/find"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold !text-[#0f2a4d] transition hover:bg-gray-100"
          >
            Find Verified Plumbers
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold !text-white transition hover:bg-white/10"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  );
}
