"use client";

import { useEffect, useState } from "react";
import { FaClock, FaPlus, FaTimes } from "react-icons/fa";
import { DEFAULT_SLOTS } from "@/components/booking/timeSlots";
import { companyApi } from "../companyApi";
import { NoticeMessage, type Notice } from "../SavedItems";

// Every half hour from 6:00 AM to 10:00 PM, as "8:00 AM".
const TIMES = Array.from({ length: 33 }, (_, i) => { const minutes = 6 * 60 + i * 30; const h = Math.floor(minutes / 60); const m = minutes % 60; return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; });
const toMinutes = (time: string) => { const [, h, m, ap] = time.match(/^(\d+):(\d+) (AM|PM)$/) ?? []; return ((Number(h) % 12) + (ap === "PM" ? 12 : 0)) * 60 + Number(m); };
const sortSlots = (slots: string[]) => [...slots].sort((a, b) => toMinutes(a.split(" – ")[0]) - toMinutes(b.split(" – ")[0]));
const PRESETS: { label: string; slots: string[] }[] = [
  { label: "Standard (2-hour windows)", slots: DEFAULT_SLOTS },
  { label: "Morning / afternoon / evening", slots: ["8:00 AM – 12:00 PM", "12:00 PM – 4:00 PM", "4:00 PM – 8:00 PM"] },
  { label: "All day", slots: ["8:00 AM – 6:00 PM"] },
];

/**
 * The visit times customers can pick when they book you (companies and freelancers). Saved to Booking
 * Settings (`slots`); booking forms show only these, and the server refuses any other time.
 */
export default function TimeSlotsEditor({ apiEndpoint }: { apiEndpoint: "/companies/booking" | "/freelancers/booking" }) {
  const [slots, setSlots] = useState<string[] | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [from, setFrom] = useState("8:00 AM");
  const [to, setTo] = useState("10:00 AM");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    companyApi<{ slots?: string[] } | null>(apiEndpoint).then(({ data }) => { const list = data?.slots ?? []; setSlots(list); setSaved(list); }).catch(() => { setSlots([]); setSaved([]); });
  }, [apiEndpoint]);

  if (!slots) return <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading your visit times…</section>;
  const dirty = JSON.stringify(slots) !== JSON.stringify(saved);
  const add = () => {
    if (toMinutes(to) <= toMinutes(from)) return setNotice({ tone: "error", text: "The end time must be after the start time." });
    const slot = `${from} – ${to}`;
    if (slots.includes(slot)) return setNotice({ tone: "error", text: "That time is already in your list." });
    if (slots.length >= 12) return setNotice({ tone: "error", text: "You can offer up to 12 time windows." });
    setNotice(null);
    setSlots(sortSlots([...slots, slot]));
  };
  const save = async () => {
    setBusy(true);
    setNotice(null);
    try {
      const { data } = await companyApi<{ slots?: string[] }>(apiEndpoint, { method: "PUT", body: { slots } });
      setSlots(data.slots ?? []); setSaved(data.slots ?? []);
      setNotice({ tone: "success", text: slots.length ? "Visit times saved. Booking forms now show these times." : "Saved. Customers see the standard times." });
    } catch (caught) { setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Could not save your times." }); } finally { setBusy(false); }
  };
  const field = "rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm";
  const shown = slots.length ? slots : DEFAULT_SLOTS;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-[#0b1f3b]">Booking</p>
      <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-gray-900"><FaClock className="h-5 w-5 text-[#b39200]" aria-hidden /> Visit times</h2>
      <p className="mt-2 max-w-3xl text-sm text-gray-500">The time windows customers can choose when they book you. Only these appear in your booking forms.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {PRESETS.map((preset) => <button key={preset.label} type="button" onClick={() => setSlots(sortSlots(preset.slots))} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#0b1f3b]">{preset.label}</button>)}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-xs font-semibold text-gray-600">From<select value={from} onChange={(e) => setFrom(e.target.value)} className={`${field} mt-1 block`}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <label className="text-xs font-semibold text-gray-600">To<select value={to} onChange={(e) => setTo(e.target.value)} className={`${field} mt-1 block`}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select></label>
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b1f3b] px-4 py-2.5 text-sm font-bold text-white"><FaPlus className="h-3 w-3" /> Add time</button>
      </div>

      {slots.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {slots.map((slot) => (
            <li key={slot} className="inline-flex items-center gap-2 rounded-full bg-[#FFD60A]/15 py-1.5 pl-3 pr-1.5 text-sm font-semibold text-[#0b1f3b]">
              {slot}
              <button type="button" onClick={() => setSlots(slots.filter((s) => s !== slot))} aria-label={`Remove ${slot}`} className="grid h-6 w-6 place-items-center rounded-full hover:bg-white"><FaTimes className="h-2.5 w-2.5" /></button>
            </li>
          ))}
        </ul>
      ) : <p className="mt-4 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600">No times of your own yet — customers see the standard times: {DEFAULT_SLOTS.join(", ")}.</p>}

      <div className="mt-5 rounded-xl border border-dashed border-gray-200 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">What customers see</p>
        <select aria-label="Preview of the booking form's time list" className={`${field} mt-2 w-full max-w-xs`} defaultValue=""><option value="">Select time</option>{shown.map((slot) => <option key={slot}>{slot}</option>)}</select>
      </div>

      <div className="mt-5"><NoticeMessage notice={notice} /></div>
      <div className="mt-4 flex gap-3">
        <button type="button" disabled={busy || !dirty} onClick={save} className="rounded-xl bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Save visit times"}</button>
        {dirty && <button type="button" onClick={() => setSlots(saved)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50">Discard changes</button>}
      </div>
    </section>
  );
}
