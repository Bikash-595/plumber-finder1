import Link from "next/link";

const trustStats = [
  { label: "Verified Plumbers", value: "1,200+" },
  { label: "Cities Covered", value: "200+" },
  { label: "Average Match Time", value: "< 60 sec" },
  { label: "Customer Satisfaction", value: "4.8/5" },
];

const principles = [
  {
    title: "Verified Professionals",
    description:
      "Every listed plumber is screened for licensing, experience, and service quality before appearing on the platform.",
  },
  {
    title: "Transparent Pricing",
    description:
      "We focus on upfront estimates and clear scope details so homeowners know what they are paying for before booking.",
  },
  {
    title: "Faster Help",
    description:
      "From emergency repairs to planned installations, we make it easy to compare options and connect with pros quickly.",
  },
];

const workflow = [
  {
    step: "1",
    title: "Tell us what you need",
    description: "Share your plumbing issue, service type, and location in seconds.",
  },
  {
    step: "2",
    title: "Compare trusted options",
    description: "Review ratings, response time, and pricing details from verified local plumbers.",
  },
  {
    step: "3",
    title: "Book with confidence",
    description: "Choose the right pro, schedule quickly, and track your service with clear updates.",
  },
];

const timeline = [
  {
    year: "2021",
    title: "Plumber Finder launched",
    detail:
      "Started with a simple goal: make it easier for homeowners to find trustworthy plumbers without calling five different companies.",
  },
  {
    year: "2022",
    title: "Verification-first growth",
    detail:
      "Introduced stricter vetting and profile quality standards so every listing provides reliable business and service details.",
  },
  {
    year: "2024",
    title: "Faster matching and richer profiles",
    detail:
      "Expanded coverage and improved matching so users can compare response time, service strengths, and ratings in seconds.",
  },
  {
    year: "Today",
    title: "Built for dependable outcomes",
    detail:
      "Focused on quality connections between customers and local professionals that lead to faster, better service experiences.",
  },
];

const qualityStandards = [
  {
    title: "Business profile checks",
    description:
      "We review profile completeness, service details, contact consistency, and local coverage before a listing becomes visible.",
  },
  {
    title: "Trust signal monitoring",
    description:
      "Ratings, service consistency, and user feedback patterns are monitored to surface reliable professionals and identify risk signals.",
  },
  {
    title: "Performance-driven visibility",
    description:
      "Plumbers who maintain better response quality, clearer pricing, and stronger service outcomes earn better visibility over time.",
  },
  {
    title: "Platform integrity",
    description:
      "We continuously improve data quality standards so users can compare providers with confidence and less uncertainty.",
  },
];

const audienceBenefits = [
  {
    title: "For homeowners",
    points: [
      "Find nearby verified plumbers quickly",
      "Compare ratings, response speed, and scope",
      "Reduce guesswork with clearer service context",
      "Book the right professional with confidence",
    ],
  },
  {
    title: "For plumbing businesses",
    points: [
      "Reach high-intent local customers",
      "Showcase strengths through rich profiles",
      "Build trust through verified reputation",
      "Grow with better quality leads",
    ],
  },
];

const aboutFaq = [
  {
    question: "How does Plumber Finder verify professionals?",
    answer:
      "We evaluate listing quality, service details, and trust signals to maintain a reliable marketplace experience and reduce uncertainty for customers.",
  },
  {
    question: "Is Plumber Finder only for emergency plumbing?",
    answer:
      "No. The platform supports both urgent requests and planned work such as installations, maintenance, and remodeling-related plumbing.",
  },
  {
    question: "Why do profiles show different response times and pricing ranges?",
    answer:
      "Every business operates differently based on team size, service area, and job type. Showing these differences helps users choose what fits them best.",
  },
  {
    question: "Do plumbers benefit from joining?",
    answer:
      "Yes. Verified profiles can improve local visibility, build trust, and connect businesses with customers who are ready to book services.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
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

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What makes our platform different</h2>
          <p className="mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            We are focused on trust, speed, and clarity. The goal is straightforward: help customers make better
            plumbing decisions and help quality pros get matched with real jobs.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {principles.map((item) => (
              <article key={item.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {audienceBenefits.map((group) => (
            <article key={group.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">{group.title}</h2>
              <div className="mt-4 space-y-2">
                {group.points.map((point) => (
                  <p key={point} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#FFD60A]" />
                    <span>{point}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

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
    </main>
  );
}
