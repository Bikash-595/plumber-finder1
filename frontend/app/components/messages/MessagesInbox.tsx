"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";
import PageHeader from "@/components/dashboard/ui/PageHeader";
import Notice from "@/components/dashboard/ui/Notice";
import ConversationList from "./ConversationList";
import ThreadView from "./ThreadView";
import { messagesApi, type Conversation, type MessagesBase } from "./messagesApi";

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
  const me = base === "/users" ? "customer" : "provider";

  const refresh = useCallback(() => messagesApi.list(base).then((res) => { setItems(res.data); setUnread(res.unread); setError(""); }).catch((caught: Error) => setError(caught.message)), [base]);
  useEffect(() => {
    refresh();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 20_000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  const select = (id: string | null) => router.replace(id ? `?c=${id}` : "?", { scroll: false });

  return (
    <div className="space-y-5">
      <PageHeader icon={FaComments} title="Messages" description={unread ? `${unread} unread message${unread === 1 ? "" : "s"}.` : me === "provider" ? "Talk to customers about their bookings." : "Talk to the plumbers you've booked."} />
      <Notice>{error}</Notice>
      <div className="grid h-[calc(100dvh-16rem)] min-h-[28rem] overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm md:grid-cols-[320px_1fr]">
        <div className={`min-h-0 overflow-y-auto border-r border-gray-100 ${selected ? "hidden md:block" : ""}`}>
          {!items ? <div className="space-y-2 p-4">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div> : <ConversationList items={items} selected={selected} me={me} onSelect={select} />}
        </div>
        <div className={`min-h-0 ${selected ? "" : "hidden md:block"}`}>
          {selected ? <ThreadView key={selected} base={base} id={selected} onBack={() => select(null)} onActivity={refresh} />
            : <div className="hidden h-full flex-col items-center justify-center text-center text-sm text-gray-500 md:flex"><FaComments className="h-10 w-10 text-gray-300" /><p className="mt-3">Choose a conversation.</p></div>}
        </div>
      </div>
    </div>
  );
}
