import { audienceBenefits } from "./aboutContent";

/** What each kind of visitor gets. */
export default function AboutAudience() {
  return (
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
  );
}
