"use client";

import { useState } from "react";
import { FaPlaneDeparture, FaTrash } from "react-icons/fa";
import type { Availability } from "../growthApi";

const field = "rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (value: string) => new Date(value).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });

/** Days off (holidays, training, a full week): customers can't request those dates. */
export default function TimeOffList({ periods, onChange }: { periods: Availability["timeOff"]; onChange: (periods: Availability["timeOff"]) => void }) {
  const [draft, setDraft] = useState({ start: today(), end: today(), reason: "" });
  const add = () => { if (draft.end < draft.start) return; onChange([...periods, { start: draft.start, end: draft.end, reason: draft.reason.trim() || undefined }]); setDraft({ start: today(), end: today(), reason: "" }); };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-xs font-semibold text-gray-600">From<input type="date" min={today()} value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value, end: e.target.value > draft.end ? e.target.value : draft.end })} className={`${field} mt-1 block`} /></label>
        <label className="text-xs font-semibold text-gray-600">To<input type="date" min={draft.start} value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className={`${field} mt-1 block`} /></label>
        <label className="min-w-40 flex-1 text-xs font-semibold text-gray-600">Reason (private)<input value={draft.reason} maxLength={120} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} placeholder="e.g. Family holiday" className={`${field} mt-1 block w-full`} /></label>
        <button type="button" onClick={add} disabled={periods.length >= 50} className="rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Add days off</button>
      </div>
      {periods.length === 0 ? <p className="text-sm text-gray-500">No days off planned.</p> : (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {periods.map((period, index) => (
            <li key={`${period.start}-${index}`} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <FaPlaneDeparture className="h-3.5 w-3.5 shrink-0 text-[#b39200]" />
              <span className="min-w-0 flex-1"><span className="font-semibold text-gray-900">{fmt(period.start)}{period.end.slice(0, 10) !== period.start.slice(0, 10) ? ` – ${fmt(period.end)}` : ""}</span>{period.reason && <span className="ml-2 text-gray-500">{period.reason}</span>}</span>
              <button type="button" onClick={() => onChange(periods.filter((_, i) => i !== index))} aria-label="Remove days off" className="text-gray-400 hover:text-red-600"><FaTrash className="h-3 w-3" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
