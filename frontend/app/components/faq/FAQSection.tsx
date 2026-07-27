"use client";

import { FAQItem } from "./FAQItem";

interface FAQSectionProps {
  title: string;
  items: { question: string; answer: string }[];
}

export function FAQSection({ title, items }: FAQSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-extrabold text-white mr-4">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <FAQItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}
