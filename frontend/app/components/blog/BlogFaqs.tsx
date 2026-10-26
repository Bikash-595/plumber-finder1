import { FaQuestionCircle } from "react-icons/fa";

type Faq = { question: string; answer: string };

/** The article's own questions and answers, plus FAQ structured data so search engines can show them. */
export default function BlogFaqs({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
  return (
    <section id="faqs" className="mt-8 scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="faqs-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <h2 id="faqs-heading" className="flex items-center gap-3 text-2xl font-black text-slate-950 sm:text-3xl"><FaQuestionCircle className="text-[#f7672c]" aria-hidden /> Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-slate-200">
        {faqs.map((faq, index) => (
          <details key={`${index}-${faq.question}`} className="group py-4" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-bold text-slate-950 transition group-open:text-[#f7672c] sm:text-lg">
              {faq.question}
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-sm text-slate-600 transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
