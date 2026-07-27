"use client";

import { FaqItem } from '../../data/faqData';
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {items.map((faq) => (
        <div
          key={faq.id}
          className="rounded-xl border border-gray-200 bg-white overflow-hidden transition hover:shadow-sm"
        >
          <button
            onClick={() => toggle(faq.id)}
            className="flex w-full items-center justify-between p-4 text-left transition hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">{faq.question}</span>
            <FaChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${openId === faq.id ? "rotate-180" : ""}`}
            />
          </button>
          {openId === faq.id && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}