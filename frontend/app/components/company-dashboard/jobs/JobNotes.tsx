"use client";

import { useState, type FormEvent } from "react";
import { FaLock, FaTrash } from "react-icons/fa";
import { operationsApi, type JobNote } from "../operationsApi";

/** Private notes on a job (parts, gate codes, follow-ups) — never shown to the customer. */
export default function JobNotes({ jobId, notes, onChange }: { jobId: string; notes: JobNote[]; onChange: (notes: JobNote[]) => void }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const add = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim()) return;
    try { const { data } = await operationsApi.addNote(jobId, body.trim()); onChange([data, ...notes]); setBody(""); setError(""); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save the note."); }
  };
  const remove = async (note: JobNote) => {
    try { await operationsApi.removeNote(jobId, note._id); onChange(notes.filter((n) => n._id !== note._id)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete."); }
  };
  return (
    <section>
      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500"><FaLock className="h-3 w-3" /> Private notes</h3>
      <form onSubmit={add} className="mt-2 flex gap-2">
        <input value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} placeholder="Add a note only your team sees" aria-label="New note" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
        <button type="submit" disabled={!body.trim()} className="rounded-xl bg-[#0b1f3b] px-3 text-sm font-bold text-white disabled:opacity-40">Add</button>
      </form>
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
      <ul className="mt-3 space-y-2">
        {notes.map((note) => (
          <li key={note._id} className="group flex gap-2 rounded-xl bg-[#FFD60A]/10 px-3 py-2 text-sm">
            <span className="min-w-0 flex-1"><span className="block whitespace-pre-wrap break-words text-gray-800">{note.body}</span><span className="text-[11px] text-gray-500">{new Date(note.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></span>
            <button type="button" onClick={() => remove(note)} aria-label="Delete note" className="self-start text-gray-400 hover:text-red-600"><FaTrash className="h-3 w-3" /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}
