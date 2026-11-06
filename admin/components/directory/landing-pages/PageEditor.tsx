"use client";

import { useState } from "react";
import type { LandingPage } from "@/lib/adminApi";

const field = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm";

/** One page's SEO title, meta description and introduction (empty = the site's built-in wording). */
export default function PageEditor({ page, busy, onSave, onCancel }: {
  page: LandingPage; busy: boolean; onSave: (values: { title: string; description: string; intro: string }) => void; onCancel: () => void;
}) {
  const [values, setValues] = useState({ title: page.title, description: page.description, intro: page.intro });
  return (
    <div className="space-y-3 rounded-xl bg-gray-50 p-4">
      <label className="block text-sm">
        <span className="font-semibold text-gray-800">SEO title</span> <span className="text-xs text-gray-500">{values.title.length}/160 · aim for under 60</span>
        <input value={values.title} maxLength={160} onChange={(e) => setValues({ ...values, title: e.target.value })} placeholder="Built-in title" className={field} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-gray-800">Meta description</span> <span className="text-xs text-gray-500">{values.description.length}/320 · aim for 120–160</span>
        <textarea value={values.description} maxLength={320} rows={2} onChange={(e) => setValues({ ...values, description: e.target.value })} placeholder="Built-in description" className={field} />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-gray-800">Introduction</span> <span className="text-xs text-gray-500">shown under the heading · write something unique to this place</span>
        <textarea value={values.intro} maxLength={1500} rows={3} onChange={(e) => setValues({ ...values, intro: e.target.value })} placeholder="Built-in introduction" className={field} />
      </label>
      <div className="flex gap-2">
        <button type="button" disabled={busy} onClick={() => onSave(values)} className="rounded-full bg-[#0b1f3b] px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50">Save wording</button>
        <button type="button" disabled={busy} onClick={() => onSave({ title: "", description: "", intro: "" })} className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-700 disabled:opacity-50">Use built-in wording</button>
        <button type="button" onClick={onCancel} className="ml-auto text-sm font-semibold text-gray-500 hover:text-gray-800">Close</button>
      </div>
    </div>
  );
}
