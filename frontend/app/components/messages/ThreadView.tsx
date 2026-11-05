"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaCheckDouble, FaExternalLinkAlt, FaShieldAlt } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import { toneClasses } from "@/components/dashboard/ui/tones";
import SavedReplyPicker from "@/components/company-dashboard/saved-replies/SavedReplyPicker";
import Composer from "./Composer";
import { messageStatus } from "./messageStatus";
import { bookingHref, clockTime, dayLabel, messagesApi, type ChatMessage, type MessagesBase, type Thread } from "./messagesApi";

const REFRESH_MS = 10_000;
// Messages from the same person within this gap share one group (one time stamp, one avatar).
const GROUP_GAP_MS = 5 * 60_000;

// First lines to get a new conversation going (tapping one puts it in the message box).
const starters = {
  provider: ["Hi! Thanks for booking — I'm confirming your visit.", "Could you share a photo of the problem?", "Is there parking or anything I should know about access?"],
  customer: ["Hi! Is there anything you need from me before the visit?", "Can you confirm the arrival time?", "I can send a photo of the problem if that helps."],
};

const sameDay = (a: string, b: string) => new Date(a).toDateString() === new Date(b).toDateString();
const startsGroup = (message: ChatMessage, previous?: ChatMessage) => !previous || previous.from !== message.from || !sameDay(previous.createdAt, message.createdAt) || new Date(message.createdAt).getTime() - new Date(previous.createdAt).getTime() > GROUP_GAP_MS;

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
      setThread((prev) => {
        if (!prev || prev.id !== id) return prev;
        // The other side hasn't read this one yet (so it shows "Sent" until they open the conversation).
        const other = prev.data.me === "customer" ? "provider" : "customer";
        const unread = { customer: prev.data.conversation.unread?.customer ?? 0, provider: prev.data.conversation.unread?.provider ?? 0, [other]: (prev.data.conversation.unread?.[other] ?? 0) + 1 };
        return { id, data: { ...prev.data, conversation: { ...prev.data.conversation, unread }, messages: [...prev.data.messages, data] } };
      });
      onActivity();
      return true;
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Message not sent."); return false; }
  };

  const me = current?.me ?? (base === "/users" ? "customer" : "provider");
  const other = me === "customer" ? "provider" : "customer";
  const name = current ? (me === "provider" ? current.conversation.customerName : current.conversation.providerName) ?? "Conversation" : "";
  const booking = current?.booking;
  const status = booking ? messageStatus[booking.status] ?? { label: booking.status.replace(/_/g, " "), tone: "neutral" as const } : null;
  const messages = current?.messages ?? [];
  const last = messages.at(-1);
  const seen = last?.from === me && current?.conversation.unread?.[other] === 0;

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#f7f8fa]" aria-label={name ? `Conversation with ${name}` : "Conversation"}>
      <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 sm:px-5">
        {onBack && <button type="button" onClick={onBack} aria-label="Back to conversations" className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-gray-600 hover:bg-gray-100 md:hidden"><FaArrowLeft className="h-4 w-4" /></button>}
        {current ? <UserAvatar name={name} size={42} /> : <span className="h-[42px] w-[42px] shrink-0 animate-pulse rounded-full bg-gray-100" />}
        <div className="min-w-0 flex-1">
          {current ? <p className="truncate text-[15px] font-extrabold text-[#0b1f3b]">{name}</p> : <span className="block h-4 w-40 animate-pulse rounded bg-gray-100" />}
          {booking && (
            <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
              {status && <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ring-1 ring-inset ${toneClasses[status.tone].pill}`}><span className={`h-1.5 w-1.5 rounded-full ${toneClasses[status.tone].dot}`} />{status.label}</span>}
              <span className="truncate">{booking.service}</span>
              {booking.scheduledDate && <span className="inline-flex items-center gap-1 whitespace-nowrap"><FaCalendarAlt className="h-3 w-3 text-gray-400" aria-hidden />{new Date(booking.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })}{booking.timeSlot ? ` · ${booking.timeSlot}` : ""}</span>}
            </p>
          )}
        </div>
        {current && (
          <Link href={bookingHref(base, current.conversation.booking, booking?.reference ?? current.conversation.reference)} className="hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-[#0b1f3b] transition hover:border-[#0b1f3b]/30 hover:bg-gray-50 sm:inline-flex">
            {booking?.reference ?? current.conversation.reference ?? "Booking"}<FaExternalLinkAlt className="h-2.5 w-2.5 text-gray-400" aria-hidden />
          </Link>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6" aria-live="polite">
        {current?.hasOlder && <div className="mb-4 text-center"><button type="button" onClick={older} className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50">Load earlier messages</button></div>}
        {!current && !error && <div className="space-y-3">{["w-2/3", "ml-auto w-1/2", "w-3/5"].map((w) => <div key={w} className={`h-12 animate-pulse rounded-2xl bg-white ${w}`} />)}</div>}
        {current && messages.length === 0 && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <UserAvatar name={name} size={56} className="mx-auto" />
            <p className="mt-3 font-bold text-[#0b1f3b]">Start the conversation with {name}</p>
            <p className="mt-1 text-sm text-gray-500">{me === "provider" ? "Confirm the visit, ask about access or parking, or request a photo of the problem." : "Share details about the job, access instructions, or ask a question."}</p>
          </div>
        )}

        <ol className="space-y-0.5">
          {messages.map((message, index) => {
            const previous = messages[index - 1];
            const next = messages[index + 1];
            const mine = message.from === me;
            const first = startsGroup(message, previous);
            const lastOfGroup = !next || startsGroup(next, message);
            const newDay = !previous || !sameDay(previous.createdAt, message.createdAt);
            return (
              <Fragment key={message._id}>
                {newDay && (
                  <li className="flex items-center gap-3 py-3" aria-label={dayLabel(message.createdAt)}>
                    <span className="h-px flex-1 bg-gray-200" /><span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-500 shadow-sm ring-1 ring-gray-100">{dayLabel(message.createdAt)}</span><span className="h-px flex-1 bg-gray-200" />
                  </li>
                )}
                <li className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"} ${first && !newDay ? "pt-3" : ""}`}>
                  {/* Their avatar sits beside the last bubble of a group (above the time stamp row). */}
                  {!mine && <span className={`w-7 shrink-0 ${lastOfGroup ? "mb-5" : ""}`}>{lastOfGroup && <UserAvatar name={name} size={28} />}</span>}
                  <div className={`flex max-w-[78%] flex-col sm:max-w-[68%] ${mine ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2.5 text-[14.5px] leading-relaxed shadow-sm ${mine
                      ? `bg-[#0b1f3b] text-white ${first ? "rounded-t-2xl" : "rounded-t-lg"} rounded-l-2xl ${lastOfGroup ? "rounded-br-md" : "rounded-br-lg"}`
                      : `bg-white text-gray-900 ring-1 ring-gray-100 ${first ? "rounded-t-2xl" : "rounded-t-lg"} rounded-r-2xl ${lastOfGroup ? "rounded-bl-md" : "rounded-bl-lg"}`}`}>
                      <p className="whitespace-pre-wrap break-words">{message.body}</p>
                    </div>
                    {lastOfGroup && (
                      <p className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-gray-400 ${mine ? "flex-row-reverse" : ""}`}>
                        <time dateTime={message.createdAt}>{clockTime(message.createdAt)}</time>
                        {mine && message === last && (seen
                          ? <span className="inline-flex items-center gap-1 font-semibold text-[#0b8a5a]"><FaCheckDouble className="h-3 w-3" aria-hidden />Seen</span>
                          : <span className="inline-flex items-center gap-1"><FaCheck className="h-2.5 w-2.5" aria-hidden />Sent</span>)}
                      </p>
                    )}
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>
        <div ref={bottom} />
      </div>

      {error && <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs font-medium text-red-700">{error}</p>}
      <Composer onSend={send} disabled={!current} suggestions={current && messages.length === 0 ? starters[me] : undefined}
        tools={base !== "/users" ? (insert) => <SavedReplyPicker onPick={insert} /> : undefined} />
      <p className="flex items-center justify-center gap-1.5 bg-white px-4 pb-3 text-[11px] text-gray-400"><FaShieldAlt className="h-3 w-3" aria-hidden />For your safety, never share card details or passwords in messages.</p>
    </section>
  );
}
