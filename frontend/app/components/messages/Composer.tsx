"use client";

import { useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MAX = 2000;

/** Message box: Enter sends, Shift+Enter adds a line. */
/** `tools(insert)` renders extra buttons (e.g. saved replies) that can add text to the box. */
export default function Composer({ onSend, disabled, tools }: { onSend: (body: string) => Promise<boolean>; disabled?: boolean; tools?: (insert: (text: string) => void) => ReactNode }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    if (await onSend(text)) setBody("");
    setBusy(false);
  };
  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } };
  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-gray-100 bg-white p-3">
      {tools?.((text) => setBody((current) => (current.trim() ? `${current.trimEnd()}\n${text}` : text).slice(0, MAX)))}
      <label className="min-w-0 flex-1">
        <span className="sr-only">Message</span>
        <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, MAX))} onKeyDown={onKey} rows={1} disabled={disabled} placeholder="Write a message…" className="max-h-40 min-h-11 w-full resize-y rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30 disabled:bg-gray-50" />
      </label>
      <button type="submit" disabled={disabled || busy || !body.trim()} aria-label="Send" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0b1f3b] text-white hover:bg-[#17345a] disabled:opacity-40"><FaPaperPlane className="h-4 w-4" /></button>
    </form>
  );
}
