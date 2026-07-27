"use client";

import { useMemo, useState } from "react";
import { Plumber } from "@/components/find/types";
import { FaChevronDown } from "react-icons/fa";

interface ProfileFaqProps {
  plumber: Plumber;
}

function buildFallbackFaqs(plumber: Plumber) {
  const service = plumber.services[0] ?? "plumbing";
  const specialization = plumber.specializations[0] ?? "home plumbing";
  return [
    {
      question: `What services does ${plumber.companyName} offer?`,
      answer: `${plumber.companyName} offers ${plumber.services.slice(0, 5).join(", ")}${plumber.services.length > 5 ? ", and more" : ""}.`,
    },
    {
      question: `Do you provide emergency ${service.toLowerCase()} support?`,
      answer: plumber.isEmergency
        ? `${plumber.companyName} provides emergency support and is available for urgent ${service.toLowerCase()} requests.`
        : `${plumber.companyName} focuses on scheduled service, but you can contact them to confirm same-day availability for urgent ${service.toLowerCase()} issues.`,
    },
    {
      question: `What areas does ${plumber.companyName} serve?`,
      answer: `${plumber.companyName} serves ${plumber.location} and nearby service areas including ${plumber.serviceAreas.slice(0, 3).join(", ")}.`,
    },
    {
      question: `Is ${plumber.companyName} licensed and insured?`,
      answer: `${plumber.companyName} is listed as ${plumber.licenseNumber ? `license ${plumber.licenseNumber}` : "licensed"} and carries ${plumber.insurance}.`,
    },
    {
      question: `What makes ${plumber.companyName} a good fit for ${specialization.toLowerCase()} work?`,
      answer: `${plumber.companyName} specializes in ${plumber.specializations.slice(0, 3).join(", ")} and has ${plumber.yearsInBusiness}+ years in business.`,
    },
  ];
}

export default function ProfileFaq({ plumber }: ProfileFaqProps) {
  const faqs = useMemo(() => plumber.faqs?.length ? plumber.faqs : buildFallbackFaqs(plumber), [plumber]);
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs.length) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Company FAQs</h2>
          <p className="mt-1 text-sm text-gray-600">Answers specific to {plumber.companyName}.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question} className="rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <FaChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <div className="px-4 pb-4 text-sm leading-relaxed text-gray-700">{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
