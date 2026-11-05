"use client";

import { useState } from "react";
import { FaBolt } from "react-icons/fa";
import Link from "next/link";
import { growthApi, type SavedReply } from "../growthApi";
import { dashBase } from "@/components/utils/providerSide";

/** "Saved replies" button next to the message box: pick one to insert its text. */
export default function SavedReplyPicker({ onPick }: { onPick: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<SavedReply[] | null>(null);
  const toggle = () => {
    setOpen(!open);
    if (!replies) growthApi.savedReplies().then(setReplies).catch(() => setReplies([]));
  };
  return (
    <div className="relative">
      <button type="button" onClick={toggle} aria-expanded={open} aria-label="Insert a saved reply" title="Saved replies" className={`grid h-11 w-11 place-items-center rounded-xl text-[#b39200] transition hover:bg-[#FFD60A]/15 ${open ? "bg-[#FFD60A]/15" : ""}`}><FaBolt className="h-4 w-4" /></button>
      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <p className="border-b border-gray-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">Saved replies</p>
          {!replies ? <p className="p-3 text-sm text-gray-500">Loading…</p> : replies.length === 0 ? <p className="p-3 text-sm text-gray-500">None yet. <Link href={`${dashBase()}/saved-replies`} className="font-semibold text-[#0b1f3b] underline">Create one</Link></p> : (
            <ul className="max-h-64 overflow-y-auto">{replies.map((r) => <li key={r._id}><button type="button" onClick={() => { onPick(r.body); setOpen(false); }} className="block w-full px-3 py-2 text-left hover:bg-gray-50"><span className="block text-sm font-semibold text-gray-900">{r.title}</span><span className="block truncate text-xs text-gray-500">{r.body}</span></button></li>)}</ul>
          )}
        </div>
      )}
    </div>
  );
}
