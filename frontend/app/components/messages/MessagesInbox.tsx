"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaComments, FaLock, FaSearch } from "react-icons/fa";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Notice from "@/components/dashboard/ui/Notice";
import ConversationList from "./ConversationList";
import ThreadView from "./ThreadView";
import { messagesApi, type Conversation, type MessagesBase } from "./messagesApi";

type Filter = "all" | "unread";

/**
 * Two-pane inbox (list + conversation) for customers, companies and freelancers. On phones the list and the
 * conversation take turns. `?c=<conversation>` opens one directly (links in notifications use it).
 */
export default function MessagesInbox({ base }: { base: MessagesBase }) {
  const router = useRouter();
  const selected = useSearchParams().get("c");
  const [items, setItems] = useState<Conversation[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const me = base === "/users" ? "customer" : "provider";

  const refresh = useCallback(() => messagesApi.list(base).then((res) => { setItems(res.data); setUnread(res.unread); setError(""); }).catch((caught: Error) => setError(caught.message)), [base]);
  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 20_000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  const select = (id: string | null) => router.replace(id ? `?c=${id}` : "?", { scroll: false });

  // Search by the other person's name, the service, the booking code or the last message.
  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (items ?? []).filter((c) => (filter === "all" || c.unreadForMe > 0)
      && (!text || [me === "provider" ? c.customerName : c.providerName, c.service, c.reference, c.lastMessage?.body].some((value) => value?.toLowerCase().includes(text))));
  }, [items, query, filter, me]);

  return (
    <div className="space-y-5">
      <PageHeader icon={FaComments} title="Messages" description={me === "provider" ? "Every conversation with your customers, one per booking." : "Every conversation with the plumbers you've booked, one per booking."} />
      <Notice>{error}</Notice>
      <div className="grid h-[calc(100dvh-15rem)] min-h-[32rem] overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] md:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr]">
        <aside className={`min-h-0 flex-col border-r border-gray-100 bg-white ${selected ? "hidden md:flex" : "flex"}`} aria-label="Conversations">
          <div className="space-y-3 border-b border-gray-100 px-4 pb-3 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold tracking-tight text-[#0b1f3b]">Inbox</h2>
              {unread > 0 && <span className="rounded-full bg-[#FFD60A] px-2.5 py-0.5 text-xs font-bold text-[#0b1f3b]">{unread} unread</span>}
            </div>
            <label className="relative block">
              <span className="sr-only">Search conversations</span>
              <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={me === "provider" ? "Search customers, services, BK- codes" : "Search plumbers, services, BK- codes"} className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#FFD60A] focus:bg-white focus:ring-2 focus:ring-[#FFD60A]/30" />
            </label>
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 text-sm font-semibold" role="tablist" aria-label="Show">
              {(["all", "unread"] as const).map((value) => (
                <button key={value} type="button" role="tab" aria-selected={filter === value} onClick={() => setFilter(value)} className={`flex-1 rounded-lg px-3 py-1.5 transition ${filter === value ? "bg-white text-[#0b1f3b] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {value === "all" ? "All" : `Unread${unread ? ` (${unread})` : ""}`}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {!items
              ? <div className="space-y-1 p-3">{[0, 1, 2, 3].map((i) => <div key={i} className="flex items-center gap-3 rounded-2xl p-3"><div className="h-11 w-11 animate-pulse rounded-full bg-gray-100" /><div className="flex-1 space-y-2"><div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" /><div className="h-3 w-full animate-pulse rounded bg-gray-100" /></div></div>)}</div>
              : <ConversationList items={shown} total={items.length} filtered={Boolean(query.trim()) || filter === "unread"} selected={selected} me={me} onSelect={select} />}
          </div>
        </aside>
        <div className={`min-h-0 ${selected ? "" : "hidden md:block"}`}>
          {selected ? <ThreadView key={selected} base={base} id={selected} onBack={() => select(null)} onActivity={refresh} />
            : (
              <div className="hidden h-full flex-col items-center justify-center bg-[#f7f8fa] px-8 text-center md:flex">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#0b1f3b] shadow-sm ring-1 ring-gray-100"><FaComments className="h-7 w-7" /></span>
                <p className="mt-4 text-lg font-bold text-[#0b1f3b]">Select a conversation</p>
                <p className="mt-1 max-w-sm text-sm text-gray-500">{me === "provider" ? "Confirm visit details, share arrival times and answer questions — all tied to the booking." : "Ask about the visit, share access details or photos of the problem — all tied to your booking."}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-gray-400"><FaLock className="h-3 w-3" aria-hidden />Messages are shared only with the other side of the booking.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
