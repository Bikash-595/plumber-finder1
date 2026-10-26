"use client";

import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from "react-icons/fa";

export type FaqItem = { question: string; answer: string };
const input = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** Questions and answers for one article: add, edit, reorder, remove (up to `max`). */
export default function FaqListEditor({ value, onChange, max = 15 }: { value: FaqItem[]; onChange: (faqs: FaqItem[]) => void; max?: number }) {
  const set = (index: number, change: Partial<FaqItem>) => onChange(value.map((faq, i) => (i === index ? { ...faq, ...change } : faq)));
  const move = (index: number, delta: number) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-gray-900">Article FAQs <span className="font-normal text-gray-400">({value.length}/{max})</span></p>
          <p className="text-xs text-gray-500">Questions readers often ask about this topic. Shown under the article and in Google results.</p>
        </div>
        <button type="button" disabled={value.length >= max} onClick={() => onChange([...value, { question: "", answer: "" }])} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#0b1f3b] px-3 py-1.5 text-xs font-bold text-[#0b1f3b] hover:bg-gray-50 disabled:opacity-40"><FaPlus className="h-2.5 w-2.5" /> Add question</button>
      </div>
      {value.length === 0 && <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">No questions yet — e.g. “How long does a water heater last?”</p>}
      <ol className="mt-3 space-y-3">
        {value.map((faq, index) => (
          <li key={index} className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-start gap-2">
              <span className="mt-3 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0b1f3b] text-xs font-bold text-white">{index + 1}</span>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="block"><span className="text-xs font-semibold text-gray-700">Question</span><input value={faq.question} maxLength={300} onChange={(e) => set(index, { question: e.target.value })} placeholder="e.g. How often should I flush my water heater?" aria-label={`Question ${index + 1}`} className={input} /></label>
                <label className="block"><span className="text-xs font-semibold text-gray-700">Answer</span><textarea rows={2} value={faq.answer} maxLength={2000} onChange={(e) => set(index, { answer: e.target.value })} placeholder="A short, clear answer." aria-label={`Answer ${index + 1}`} className={input} /></label>
              </div>
              <div className="mt-6 flex flex-col gap-1">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move question ${index + 1} up`} className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 hover:bg-white disabled:opacity-30"><FaArrowUp className="h-3 w-3" /></button>
                <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label={`Move question ${index + 1} down`} className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 hover:bg-white disabled:opacity-30"><FaArrowDown className="h-3 w-3" /></button>
                <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove question ${index + 1}`} className="grid h-7 w-7 place-items-center rounded-lg text-red-600 hover:bg-white"><FaTrash className="h-3 w-3" /></button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Drops blank rows; returns an error message if a question has no answer (or the reverse). */
export function cleanFaqs(faqs: FaqItem[]): { faqs: FaqItem[]; error?: string } {
  const filled = faqs.map((faq) => ({ question: faq.question.trim(), answer: faq.answer.trim() })).filter((faq) => faq.question || faq.answer);
  const incomplete = filled.findIndex((faq) => !faq.question || !faq.answer);
  return incomplete >= 0 ? { faqs: filled, error: `FAQ ${incomplete + 1} needs both a question and an answer.` } : { faqs: filled };
}
