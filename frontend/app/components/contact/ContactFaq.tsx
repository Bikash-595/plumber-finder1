"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    q: "How quickly can I expect a response?",
    a: "For general inquiries, we reply within 24 hours. For emergency plumbing, we respond within 15 minutes and dispatch a plumber immediately.",
  },
  {
    q: "Do you offer emergency services on weekends?",
    a: "Yes, our emergency line is available 24/7, including weekends and holidays. Call us at +1 (800) 555-PLUM for immediate assistance.",
  },
  {
    q: "Can I get a quote before booking?",
    a: "Absolutely. Fill out the form or call us, and we’ll provide a free, no-obligation estimate based on your project details.",
  },
  {
    q: "Are your plumbers licensed and insured?",
    a: "Every plumber in our network undergoes rigorous background checks, license verification, and insurance validation. You’re always in safe hands.",
  },
  {
    q: "What areas do you serve?",
    a: "We currently serve all major cities in the US and Canada, with plans to expand globally. Enter your zip code on the homepage to see local pros.",
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-lg p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Frequently Asked Questions</h2>
        <p className="mt-1 text-gray-500">Quick answers about contacting us.</p>
      </div>
      <div className="mt-6 space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
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
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <p className="text-gray-700">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}