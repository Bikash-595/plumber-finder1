"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const popularFaqs = [
  {
    q: "How does PlumberFinder vet its professionals?",
    a: "We conduct a rigorous 5-step screening including license verification, background checks, master technician interviews, and on-site performance reviews. Only the top 3% of trade professionals make it onto our platform.",
  },
  {
    q: "Are emergency services available 24/7?",
    a: "Yes, our emergency network operates 24 hours a day, 7 days a week, including holidays. You can expect a response within 30 minutes.",
  },
  {
    q: "What are the benefits of the Elite Partnership?",
    a: "Elite Partners receive priority placement in search results, a dedicated account manager, waived booking fees for 6 months, and access to premium leads.",
  },
  {
    q: "Is there a commission fee on bookings?",
    a: "Standard listings have a 10% service fee on completed bookings. Elite Partners pay only 5% and enjoy no commission for the first 3 months.",
  },
];

export default function FaqPopularQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-3xl bg-white border border-gray-200 shadow-lg p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">🔥 Popular Questions</h2>
        <p className="text-gray-500">Most frequently asked by our community</p>
      </div>
      <div className="mt-6 space-y-3">
        {popularFaqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/30 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <FaChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${openIndex === idx ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === idx && (
              <div className="border-t border-gray-200 p-4 bg-white">
                <p className="text-gray-700">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}