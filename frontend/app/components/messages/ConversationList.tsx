import { FaComments, FaSearch } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import { shortTime, type Conversation } from "./messagesApi";

/** The inbox: one row per booking conversation; unread ones bold, with a count and a dot on the avatar. */
export default function ConversationList({ items, total, filtered, selected, me, onSelect }: { items: Conversation[]; total: number; filtered: boolean; selected: string | null; me: "customer" | "provider"; onSelect: (id: string) => void }) {
  if (!items.length) {
    const nothingYet = total === 0 || !filtered;
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-100 text-gray-400">{nothingYet ? <FaComments className="h-5 w-5" /> : <FaSearch className="h-4 w-4" />}</span>
        <p className="mt-3 text-sm font-bold text-gray-800">{nothingYet ? "No conversations yet" : "Nothing matches"}</p>
        <p className="mt-1 text-sm text-gray-500">{nothingYet ? (me === "provider" ? "Open any booking and choose Message to start one." : "Open any of your bookings and choose Message to start one.") : "Try another name, service or booking code."}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-0.5 p-2">
      {items.map((c) => {
        const name = (me === "provider" ? c.customerName : c.providerName) ?? "Conversation";
        const unread = c.unreadForMe > 0;
        const active = selected === c._id;
        return (
          <li key={c._id}>
            <button type="button" onClick={() => onSelect(c._id)} aria-current={active ? "true" : undefined}
              className={`relative flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? "bg-[#0b1f3b]/[0.05] ring-1 ring-[#0b1f3b]/10" : "hover:bg-gray-50"}`}>
              {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-[#FFD60A]" aria-hidden />}
              <span className="relative">
                <UserAvatar name={name} size={44} />
                {unread && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#FFD60A]" aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={`truncate text-[15px] ${unread ? "font-extrabold text-gray-900" : "font-semibold text-gray-800"}`}>{name}</span>
                  {c.lastMessage?.at && <time dateTime={c.lastMessage.at} className={`shrink-0 text-xs ${unread ? "font-bold text-[#0b1f3b]" : "text-gray-400"}`}>{shortTime(c.lastMessage.at)}</time>}
                </span>
                <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                  {c.service && <span className="truncate">{c.service}</span>}
                  {c.reference && <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-px font-mono text-[10px] font-semibold text-gray-600">{c.reference}</span>}
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className={`min-w-0 flex-1 truncate text-sm ${unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                    {c.lastMessage ? <>{c.lastMessage.from === me && <span className="text-gray-400">You: </span>}{c.lastMessage.body}</> : <span className="italic text-gray-400">No messages yet</span>}
                  </span>
                  {unread && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#0b1f3b] px-1.5 text-[11px] font-bold text-white" aria-label={`${c.unreadForMe} unread`}>{c.unreadForMe}</span>}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
