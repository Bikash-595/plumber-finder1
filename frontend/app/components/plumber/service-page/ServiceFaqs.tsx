import { FaChevronDown } from "react-icons/fa";
import type { ServicePage } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import { serviceSectionIds } from "./sectionIds";

/** Answers built only from what the provider entered (price, time, guarantee, emergencies). */
function factFaqs(plumber: Plumber, service: ServicePage) {
  return [
    { question: `How much does ${service.name.toLowerCase()} cost?`, answer: service.price && service.price !== "Free quote" ? `${service.price}. ${plumber.companyName} confirms the final price with you before any work begins.` : `${plumber.companyName} gives you a free quote first, then confirms the price before any work begins.` },
    service.duration && { question: "How long does it take?", answer: `Typically ${service.duration}. Bigger or unusual jobs can take longer — your plumber will tell you up front.` },
    service.warranty && { question: "Is the work guaranteed?", answer: service.warranty },
    service.emergency && { question: "Can I get this in an emergency?", answer: `Yes — ${plumber.companyName} offers this service 24/7 for emergencies.` },
    { question: "How do I book?", answer: `Send a free booking request on this page with your preferred date and time. ${plumber.companyName} confirms it, and you can message them from your bookings.` },
  ].filter(Boolean) as { question: string; answer: string }[];
}

/** The provider's FAQs for this service first, then common questions answered from its details. */
export default function ServiceFaqs({ plumber, service }: { plumber: Plumber; service: ServicePage }) {
  const own = service.faqs;
  const seen = new Set(own.map((faq) => faq.question.trim().toLowerCase()));
  const faqs = [...own, ...factFaqs(plumber, service).filter((faq) => !seen.has(faq.question.toLowerCase()))];
  return (
    <section id={serviceSectionIds.faqs} aria-labelledby="service-faqs" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 id="service-faqs" className="text-xl font-extrabold text-[#0b1f3b] sm:text-2xl">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-gray-100 rounded-2xl border border-gray-200">
        {faqs.map((faq, i) => (
          <details key={i} name="service-faq" open={i === 0} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <FaChevronDown className="h-3 w-3 shrink-0 text-gray-400 group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
