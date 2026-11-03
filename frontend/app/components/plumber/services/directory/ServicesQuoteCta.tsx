import Link from "next/link";
import { FaCommentDots } from "react-icons/fa";

/** The end of the page: not sure which service? Ask for a free quote. */
export default function ServicesQuoteCta({ name, profileHref }: { name: string; profileHref: string }) {
  return (
    <section className="flex flex-col items-start gap-4 rounded-3xl bg-[#0b1f3b] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#FFD60A] text-[#0b1f3b]"><FaCommentDots className="h-5 w-5" aria-hidden /></span>
        <div>
          <h2 className="text-lg font-extrabold sm:text-xl">Not sure which service you need?</h2>
          <p className="mt-1 text-sm text-white/70">Describe the problem and {name} will tell you what&apos;s needed and what it costs — free, with no commitment.</p>
        </div>
      </div>
      <Link href={`${profileHref}#booking`} className="shrink-0 rounded-full bg-[#FFD60A] px-6 py-3 text-sm font-extrabold text-[#0b1f3b] hover:bg-[#f5c400]">Ask for a free quote</Link>
    </section>
  );
}
