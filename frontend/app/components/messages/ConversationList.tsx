import { FaComments } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import { shortTime, type Conversation } from "./messagesApi";

/** The inbox: one row per booking conversation, unread ones bold with a count. */
export default function ConversationList({ items, selected, me, onSelect }: { items: Conversation[]; selected: string | null; me: "customer" | "provider"; onSelect: (id: string) => void }) {
  if (!items.length) {
    return <div className="flex h-full flex-col items-center justify-center p-8 text-center text-sm text-gray-500"><FaComments className="h-8 w-8 text-gray-300" /><p className="mt-3 font-semibold text-gray-700">No conversations yet</p><p className="mt-1">{me === "provider" ? "Message a customer from any booking." : "Message a plumber from any of your bookings."}</p></div>;
  }
  return (
    <ul className="divide-y divide-gray-100">
      {items.map((c) => {
        const name = (me === "provider" ? c.customerName : c.providerName) ?? "Conversation";
        const unread = c.unreadForMe > 0;
        return (
          <li key={c._id}>
            <button type="button" onClick={() => onSelect(c._id)} aria-current={selected === c._id} className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${selected === c._id ? "bg-[#FFD60A]/15" : "hover:bg-gray-50"}`}>
              <UserAvatar name={name} size={40} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2"><span className={`truncate text-sm ${unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>{name}</span>{c.lastMessage?.at && <time className="shrink-0 text-xs text-gray-400">{shortTime(c.lastMessage.at)}</time>}</span>
                <span className="block truncate text-xs text-gray-500">{c.service}{c.reference ? ` · ${c.reference}` : ""}</span>
                <span className="mt-0.5 flex items-center gap-2"><span className={`min-w-0 flex-1 truncate text-sm ${unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>{c.lastMessage ? `${c.lastMessage.from === me ? "You: " : ""}${c.lastMessage.body}` : "No messages yet"}</span>{unread && <span className="rounded-full bg-[#0b1f3b] px-1.5 text-[11px] font-bold text-white">{c.unreadForMe}</span>}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
