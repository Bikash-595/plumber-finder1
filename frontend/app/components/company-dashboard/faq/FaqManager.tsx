"use client";

import { useState } from "react";
import { saveProfileDraft } from "@/components/company-dashboard/business-profile/profileStore";

type Faq = {
  id: string;
  question: string;
  answer: string;
};

type FaqCategory = {
  id: string;
  name: string;
  faqs: Faq[];
};

const createFaq = (): Faq => ({ id: crypto.randomUUID(), question: "", answer: "" });

const initialCategories: FaqCategory[] = [
  {
    id: "general",
    name: "General",
    faqs: [
      { id: "why-us", question: "Why should customers choose your company?", answer: "We provide dependable service, clear pricing, and experienced technicians." },
    ],
  },
  {
    id: "services",
    name: "Services & Pricing",
    faqs: [
      { id: "emergency", question: "Do you offer emergency services?", answer: "Yes. Contact our team for urgent plumbing support." },
    ],
  },
  {
    id: "appointments",
    name: "Appointments",
    faqs: [
      { id: "booking", question: "How can a customer book an appointment?", answer: "Customers can call us or submit a booking request through our website." },
    ],
  },
];

export default function FaqManager() {
  const [categories, setCategories] = useState(initialCategories);
  const [notice, setNotice] = useState("");

  const updateCategoryName = (categoryId: string, name: string) => {
    setCategories((current) => current.map((category) => category.id === categoryId ? { ...category, name } : category));
  };

  const updateFaq = (categoryId: string, faqId: string, field: "question" | "answer", value: string) => {
    setCategories((current) => current.map((category) => category.id !== categoryId ? category : {
      ...category,
      faqs: category.faqs.map((faq) => faq.id === faqId ? { ...faq, [field]: value } : faq),
    }));
  };

  const addFaq = (categoryId: string) => {
    setCategories((current) => current.map((category) => category.id === categoryId ? { ...category, faqs: [...category.faqs, createFaq()] } : category));
  };

  const removeFaq = (categoryId: string, faqId: string) => {
    setCategories((current) => current.map((category) => category.id === categoryId ? { ...category, faqs: category.faqs.filter((faq) => faq.id !== faqId) } : category));
  };

  const addCategory = () => {
    setCategories((current) => [...current, { id: crypto.randomUUID(), name: "New category", faqs: [createFaq()] }]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories((current) => current.filter((category) => category.id !== categoryId));
  };

  const save = (event: { preventDefault: () => void }, draft = false) => {
    event.preventDefault();
    const hasIncompleteFaq = categories.some((category) => !category.name.trim() || category.faqs.some((faq) => !faq.question.trim() || !faq.answer.trim()));
    if (hasIncompleteFaq) {
      setNotice("Add a category name, question, and answer before saving.");
      return;
    }
    setNotice(saveProfileDraft("company-faqs", { categories }, draft));
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Company profile</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">Organize common customer questions by category. Each category can contain as many questions and answers as you need.</p>
        </div>
        <button type="button" onClick={addCategory} className="rounded-xl border border-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:bg-[#0b1f3b] hover:text-white">+ Add category</button>
      </div>

      <form onSubmit={save} className="mt-7 space-y-6">
        {categories.map((category, categoryIndex) => (
          <article key={category.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-5 py-4">
              <label className="flex-1">
                <span className="sr-only">FAQ category name</span>
                <input value={category.name} onChange={(event) => updateCategoryName(category.id, event.target.value)} placeholder="Category name" className="w-full max-w-xl bg-transparent text-xl font-bold text-[#0b57c2] outline-none placeholder:text-gray-400" />
              </label>
              {categories.length > 1 && <button type="button" onClick={() => removeCategory(category.id)} className="text-sm font-semibold text-red-600 hover:text-red-700">Remove category</button>}
            </div>

            <div className="divide-y divide-gray-200">
              {category.faqs.map((faq, faqIndex) => (
                <div key={faq.id} className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-gray-700">Question {faqIndex + 1}</p>
                    {category.faqs.length > 1 && <button type="button" onClick={() => removeFaq(category.id, faq.id)} className="text-sm font-semibold text-red-600 hover:text-red-700">Remove</button>}
                  </div>
                  <input value={faq.question} onChange={(event) => updateFaq(category.id, faq.id, "question", event.target.value)} placeholder="e.g. Do you offer emergency plumbing services?" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
                  <textarea value={faq.answer} onChange={(event) => updateFaq(category.id, faq.id, "answer", event.target.value)} rows={4} placeholder="Write a clear answer for customers." className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <button type="button" onClick={() => addFaq(category.id)} className="text-sm font-bold text-[#0b1f3b] hover:text-[#0b57c2]">+ Add question to {category.name || `category ${categoryIndex + 1}`}</button>
            </div>
          </article>
        ))}

        {notice && <p className={notice.startsWith("Add ") ? "rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700" : "rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700"}>{notice}</p>}
        <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
          <button type="submit" className="rounded-xl bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#17345a]">Save FAQs</button>
          <button type="button" onClick={(event) => save(event, true)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Save as draft</button>
        </div>
      </form>
    </section>
  );
}
