"use client";

import { FormEvent, useState } from "react";
import { MAX } from "./engagementApi";

/** A text box for a new comment, a reply, or an edit. */
export default function Composer({ initial = "", placeholder, submitLabel, onSubmit, onCancel, autoFocus = false }: { initial?: string; placeholder: string; submitLabel: string; onSubmit: (body: string) => Promise<boolean>; onCancel?: () => void; autoFocus?: boolean }) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    if (await onSubmit(text.trim())) setText("");
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, MAX))} rows={3} autoFocus={autoFocus} placeholder={placeholder} aria-label={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-[#f7672c] focus:ring-2 focus:ring-[#f7672c]/20" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-xs ${text.length > MAX - 100 ? "text-amber-700" : "text-slate-400"}`}>{text.length}/{MAX}</span>
        <div className="flex gap-2">
          {onCancel && <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>}
          <button type="submit" disabled={!text.trim() || busy} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white transition hover:bg-[#f7672c] disabled:opacity-40">{busy ? "Posting…" : submitLabel}</button>
        </div>
      </div>
    </form>
  );
}
