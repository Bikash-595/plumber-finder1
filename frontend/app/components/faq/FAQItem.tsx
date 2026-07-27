"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/20 bg-white/5 p-4 transition hover:border-white/30">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setIsOpen((open) => !open)}
      >
        <h3 className="text-lg font-bold text-white">{question}</h3>
        <span className="text-xl font-bold text-[color:var(--color-primary-blue)]">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <p className="mt-3 text-white/80">{answer}</p>}
    </div>
  );
}
