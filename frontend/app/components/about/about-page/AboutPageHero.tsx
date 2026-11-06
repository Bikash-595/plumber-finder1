import Link from "next/link";

/** The dark hero with the headline and trust stats. */
export default function AboutPageHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_top_left,#123260,transparent_45%),radial-gradient(circle_at_top_right,#0f2a4d,transparent_40%),radial-gradient(circle_at_bottom_left,#0f2a4d,transparent_35%)]">
      <div className="absolute inset-0 bg-[#0b1f3b]/70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
          About Plumber Finder
        </span>
        <h1 className="mx-auto mt-5 max-w-6xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          Built to make finding a trusted plumber simple, fast, and transparent.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
          Plumber Finder helps homeowners and businesses connect with reliable local plumbers without the guesswork.
          Compare verified professionals, read real reviews, and book services with confidence.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/find"
            className="rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-semibold !text-black shadow-lg transition hover:brightness-105"
          >
            Find a Plumber
          </Link>
          <Link
            href="/add-business"
            className="rounded-full border border-emerald-700 bg-emerald-50 px-6 py-3 text-sm font-semibold !text-emerald-800 transition hover:bg-emerald-100"
          >
            Join as a Pro
          </Link>
        </div>
      </div>
    </section>
  );
}
