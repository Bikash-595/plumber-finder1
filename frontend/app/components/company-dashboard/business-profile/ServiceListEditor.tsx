"use client";

import { useState, type KeyboardEvent } from "react";
import { FaArrowDown, FaArrowUp, FaPlus, FaTimes } from "react-icons/fa";

const input = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/**
 * A short list for a service's page (steps, signs you need it, highlights, before-your-visit tips):
 * type and press Enter or Add; reorder with the arrows; remove with ✕.
 */
export default function ServiceListEditor({ label, hint, placeholder, value, onChange, max, maxLength = 200, numbered = false }: {
  label: string; hint?: string; placeholder: string; value: string[]; onChange: (items: string[]) => void; max: number; maxLength?: number; numbered?: boolean;
}) {
  const [text, setText] = useState("");
  const add = () => {
    const item = text.trim();
    if (item && value.length < max && !value.includes(item)) onChange([...value, item]);
    setText("");
  };
  const onKey = (event: KeyboardEvent<HTMLInputElement>) => { if (event.key === "Enter") { event.preventDefault(); add(); } };
  const move = (index: number, delta: number) => { const next = [...value]; const [item] = next.splice(index, 1); next.splice(index + delta, 0, item); onChange(next); };
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700">{label} <span className="font-normal text-gray-400">({value.length}/{max})</span></p>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      <div className="mt-1.5 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} maxLength={maxLength} placeholder={placeholder} aria-label={label} className={input} />
        <button type="button" onClick={add} disabled={!text.trim() || value.length >= max} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b1f3b] px-3 text-sm font-bold text-white disabled:opacity-40"><FaPlus className="h-3 w-3" /> Add</button>
      </div>
      {value.length > 0 && (
        <ol className="mt-2 space-y-1.5">
          {value.map((item, index) => (
            <li key={`${index}-${item}`} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-800">
              {numbered && <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#FFD60A] text-xs font-bold text-[#0b1f3b]">{index + 1}</span>}
              <span className="min-w-0 flex-1">{item}</span>
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move "${item}" up`} className="grid h-6 w-6 place-items-center rounded-full text-gray-400 hover:bg-white disabled:opacity-30"><FaArrowUp className="h-2.5 w-2.5" /></button>
              <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label={`Move "${item}" down`} className="grid h-6 w-6 place-items-center rounded-full text-gray-400 hover:bg-white disabled:opacity-30"><FaArrowDown className="h-2.5 w-2.5" /></button>
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove "${item}"`} className="grid h-6 w-6 place-items-center rounded-full text-gray-400 hover:bg-white hover:text-red-600"><FaTimes className="h-2.5 w-2.5" /></button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
