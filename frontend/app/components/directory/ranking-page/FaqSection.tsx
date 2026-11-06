import { FaChevronRight } from "react-icons/fa";

/** The page's questions as an accordion (also in the page text, so search engines read the answers). */
export default function FaqSection({ title = "Frequently asked questions", items }: { title?: string; items: { question: string; answer: string }[] }) {
  return (
    <section aria-labelledby="faq-heading" className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h2 id="faq-heading" className="text-xl font-extrabold text-[#0b1f3b]">{title}</h2>
      <div className="mt-3 divide-y divide-slate-100">
        {items.map((item) => (
          <details key={item.question} className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-slate-800 [&::-webkit-details-marker]:hidden">{item.question}<FaChevronRight className="h-3 w-3 shrink-0 text-slate-400 transition group-open:rotate-90" aria-hidden /></summary>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
