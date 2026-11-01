"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Composer from "./Composer";
import { messagesApi, type MessagesBase, type Thread } from "./messagesApi";

const REFRESH_MS = 10_000;
const time = (value: string) => new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

/**
 * One conversation: the booking it's about, the messages (oldest first, older ones on demand), and the composer.
 * New messages are fetched every 10 seconds while it's open; opening it marks it read.
 */
export default function ThreadView({ base, id, onBack, onActivity }: { base: MessagesBase; id: string; onBack?: () => void; onActivity: () => void }) {
  const [thread, setThread] = useState<{ id: string; data: Thread } | null>(null);
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const current = thread?.id === id ? thread.data : null;

  useEffect(() => {
    let cancelled = false;
    const load = () => messagesApi.thread(base, id).then(({ data }) => {
      if (cancelled) return;
      // Keep any older messages already loaded.
      setThread((prev) => (prev?.id === id ? { id, data: { ...data, messages: [...prev.data.messages.filter((m) => !data.messages.some((n) => n._id === m._id) && m._id < (data.messages[0]?._id ?? "")), ...data.messages], hasOlder: prev.data.hasOlder && data.hasOlder } } : { id, data }));
      setError("");
      if (data.conversation.unreadForMe) messagesApi.read(base, id).then(onActivity).catch(() => undefined);
    }).catch((caught: Error) => { if (!cancelled) setError(caught.message); });
    load();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") load(); }, REFRESH_MS);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [base, id, onActivity]);

  const count = current?.messages.length ?? 0;
  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [count]);

  const older = async () => {
    if (!current?.messages.length) return;
    try {
      const { data } = await messagesApi.thread(base, id, current.messages[0]._id);
      setThread((prev) => prev && prev.id === id ? { id, data: { ...prev.data, messages: [...data.messages, ...prev.data.messages], hasOlder: data.hasOlder } } : prev);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load older messages."); }
  };
  const send = async (body: string) => {
    try {
      const { data } = await messagesApi.send(base, id, body);
      setThread((prev) => prev && prev.id === id ? { id, data: { ...prev.data, messages: [...prev.data.messages, data] } } : prev);
      onActivity();
      return true;
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Message not sent."); return false; }
  };

  const me = current?.me ?? "customer";
  const name = current ? (me === "provider" ? current.conversation.customerName : current.conversation.providerName) ?? "Conversation" : "";
  return (
    <section className="flex h-full min-h-0 flex-col bg-gray-50/50" aria-label={`Conversation with ${name}`}>
      <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        {onBack && <button type="button" onClick={onBack} aria-label="Back to conversations" className="grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"><FaArrowLeft className="h-4 w-4" /></button>}
        <div className="min-w-0">
          <p className="truncate font-bold text-gray-900">{name || "Loading…"}</p>
          {current?.booking && <p className="truncate text-xs text-gray-500">{current.booking.service}{current.booking.reference ? ` · ${current.booking.reference}` : ""}{current.booking.scheduledDate ? ` · ${new Date(current.booking.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}` : ""} · <span className="capitalize">{current.booking.status.replace("_", " ")}</span></p>}
        </div>
      </header>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {current?.hasOlder && <div className="text-center"><button type="button" onClick={older} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50">Load earlier messages</button></div>}
        {current && current.messages.length === 0 && <p className="py-10 text-center text-sm text-gray-500">No messages yet. Say hello — {me === "provider" ? "ask about access, parking or the problem." : "share details about the job or ask a question."}</p>}
        {current?.messages.map((message) => {
          const mine = message.from === me;
          return (
            <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${mine ? "rounded-br-md bg-[#0b1f3b] text-white" : "rounded-bl-md bg-white text-gray-900 ring-1 ring-gray-100"}`}>
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                <p className={`mt-1 text-[11px] ${mine ? "text-white/60" : "text-gray-400"}`}>{time(message.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      {error && <p role="alert" className="bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}
      <Composer onSend={send} disabled={!current} />
      <p className="bg-white px-4 pb-2 text-[11px] text-gray-400">For your safety, never share card details or passwords in messages.</p>
    </section>
  );
}
