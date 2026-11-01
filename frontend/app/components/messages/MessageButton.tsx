"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import { inboxPaths, messagesApi, type MessagesBase } from "./messagesApi";

/** "Message" on a booking: opens (or creates) its conversation and goes to it. */
export default function MessageButton({ base, bookingId, label = "Message", className }: { base: MessagesBase; bookingId: string; label?: string; className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const open = async () => {
    setBusy(true);
    setError("");
    try { const { data } = await messagesApi.open(base, bookingId); router.push(`${inboxPaths[base]}?c=${data._id}`); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not open messages."); setBusy(false); }
  };
  return (
    <span className="inline-flex flex-col">
      <button type="button" onClick={open} disabled={busy} className={className ?? "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#0b1f3b] hover:bg-gray-50 disabled:opacity-60"}><FaCommentDots className="h-3.5 w-3.5" />{busy ? "Opening…" : label}</button>
      {error && <span role="alert" className="mt-1 text-xs text-red-600">{error}</span>}
    </span>
  );
}
