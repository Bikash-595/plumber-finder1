import { serviceSectionIds as ids } from "./sectionIds";

/** Jump links to the sections this service has (scrolls sideways on phones). */
export default function ServiceSectionNav({ sections }: { sections: (keyof typeof ids)[] }) {
  const labels: Record<keyof typeof ids, string> = { facts: "At a glance", overview: "About", process: "How it works", pricing: "Pricing", why: "Why us", areas: "Areas covered", booking: "Booking", faqs: "FAQs" };
  return (
    <nav aria-label="On this page" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {sections.map((key) => (
        <a key={key} href={`#${ids[key]}`} className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0b1f3b] hover:border-[#0b1f3b]">{labels[key]}</a>
      ))}
    </nav>
  );
}
