"use client";

import { useState, type KeyboardEvent } from "react";
import { FaTimes } from "react-icons/fa";

/** Keywords as chips: type and press Enter or comma; ✕ removes one. Up to `max`, no duplicates. */
export default function KeywordsInput({ value, onChange, max = 20, suggestions = [] }: { value: string[]; onChange: (keywords: string[]) => void; max?: number; suggestions?: string[] }) {
  const [text, setText] = useState("");
  const add = (raw: string) => {
    const items = raw.split(",").map((item) => item.trim().toLowerCase()).filter((item) => item && item.length <= 40);
    const next = [...value];
    for (const item of items) if (!next.includes(item) && next.length < max) next.push(item);
    onChange(next);
    setText("");
  };
  const onKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") { event.preventDefault(); add(text); }
    if (event.key === "Backspace" && !text && value.length) onChange(value.slice(0, -1));
  };
  const unused = suggestions.filter((s) => !value.includes(s.toLowerCase())).slice(0, 8);
  return (
    <div>
      <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2 py-2 focus-within:border-[#FFD60A] focus-within:ring-2 focus-within:ring-[#FFD60A]/30">
        {value.map((keyword) => (
          <span key={keyword} className="inline-flex items-center gap-1 rounded-full bg-[#0b1f3b] py-1 pl-2.5 pr-1 text-xs font-semibold text-white">
            {keyword}
            <button type="button" onClick={() => onChange(value.filter((k) => k !== keyword))} aria-label={`Remove ${keyword}`} className="grid h-5 w-5 place-items-center rounded-full hover:bg-white/20"><FaTimes className="h-2 w-2" /></button>
          </span>
        ))}
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} onBlur={() => text.trim() && add(text)} disabled={value.length >= max} maxLength={80} placeholder={value.length ? "" : "e.g. emergency plumber austin — press Enter"} aria-label="Add a keyword" className="min-w-40 flex-1 border-0 bg-transparent px-1 text-sm outline-none" />
      </div>
      <p className="mt-1 text-xs text-gray-500">{value.length}/{max} keywords · Use what customers would type into Google.</p>
      {unused.length > 0 && value.length < max && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-500">Ideas:</span>
          {unused.map((s) => <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs text-gray-600 hover:border-[#0b1f3b]">+ {s.toLowerCase()}</button>)}
        </div>
      )}
    </div>
  );
}
