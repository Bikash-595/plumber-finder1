"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MAX = 2000;
const WARN_AT = MAX - 200;

/**
 * Message box: Enter sends, Shift+Enter adds a line, and the box grows with the text (up to a few lines).
 * `tools(insert)` renders extra buttons (e.g. saved replies) that can add text to the box;
 * `suggestions` are tap-to-use first lines shown above it (for a conversation with no messages yet).
 */
export default function Composer({ onSend, disabled, tools, suggestions }: { onSend: (body: string) => Promise<boolean>; disabled?: boolean; tools?: (insert: (text: string) => void) => ReactNode; suggestions?: string[] }) {
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  // Bumped when text is inserted (a suggestion or saved reply), so the box gets the focus afterwards.
  const [inserted, setInserted] = useState(0);
  useEffect(() => { if (inserted) box.current?.focus(); }, [inserted]);

  // Grow to fit the text (the CSS max-height caps it; beyond that the box scrolls).
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [body]);

  const insert = (text: string) => { setBody((current) => (current.trim() ? `${current.trimEnd()}\n${text}` : text).slice(0, MAX)); setInserted((n) => n + 1); };
  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    if (await onSend(text)) setBody("");
    setBusy(false);
    setInserted((n) => n + 1);
  };
  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } };
  const ready = !disabled && !busy && Boolean(body.trim());

  return (
    <form onSubmit={submit} className="border-t border-gray-100 bg-white px-3 pb-2 pt-3 sm:px-4">
      {suggestions?.length ? (
        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1" aria-label="Suggested messages">
          {suggestions.map((text) => <button key={text} type="button" onClick={() => insert(text)} className="shrink-0 rounded-full border border-[#FFD60A]/60 bg-[#FFD60A]/10 px-3 py-1.5 text-xs font-semibold text-[#6b5900] transition hover:bg-[#FFD60A]/25">{text}</button>)}
        </div>
      ) : null}
      <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 transition focus-within:border-[#FFD60A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FFD60A]/30">
        {tools?.(insert)}
        <label className="min-w-0 flex-1">
          <span className="sr-only">Message</span>
          <textarea ref={box} value={body} onChange={(e) => setBody(e.target.value.slice(0, MAX))} onKeyDown={onKey} rows={1} disabled={disabled} placeholder="Write a message…"
            className="block max-h-40 min-h-11 w-full resize-none bg-transparent px-2.5 py-2.5 text-[14.5px] leading-6 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed" />
        </label>
        <button type="submit" disabled={!ready} aria-label="Send message"
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${ready ? "bg-[#FFD60A] text-[#0b1f3b] shadow-sm hover:bg-[#f5c800]" : "bg-gray-200 text-gray-400"}`}>
          <FaPaperPlane className={`h-4 w-4 ${busy ? "animate-pulse" : ""}`} />
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-gray-400">
        <span className="hidden sm:inline"><kbd className="font-sans font-semibold text-gray-500">Enter</kbd> to send · <kbd className="font-sans font-semibold text-gray-500">Shift + Enter</kbd> for a new line</span>
        {body.length >= WARN_AT && <span className={body.length >= MAX ? "font-semibold text-red-600" : ""}>{body.length}/{MAX}</span>}
      </div>
    </form>
  );
}
