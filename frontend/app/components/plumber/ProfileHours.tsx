"use client";

import { FaClock } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import { openNowLabel } from "@/components/find/companyListing";

const dayLabels = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" } as const;
const todayKey = () => (["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const)[new Date().getDay()];

/** "08:00" → "8:00 AM". */
function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/** Weekly opening hours set in the company's Add Company wizard. */
export default function ProfileHours({ plumber }: { plumber: Plumber }) {
  const hours = plumber.openingHours;
  if (!hours || (!hours.weekly.length && !hours.notes.length)) return null;
  const status = openNowLabel(hours.weekly);
  const today = todayKey();

  return (
    <section id="hours" className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900"><FaClock className="text-[#FFD60A]" aria-hidden /> Opening Hours</h2>
        {status && <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "Open now" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{status}</span>}
      </div>
      {hours.weekly.length > 0 && (
        <dl className="mt-4 divide-y divide-gray-100">
          {(Object.keys(dayLabels) as (keyof typeof dayLabels)[]).map((day) => {
            const entry = hours.weekly.find((item) => item.day === day);
            return (
              <div key={day} className={`flex items-center justify-between gap-4 py-2.5 text-sm ${day === today ? "font-bold text-[#0b1f3b]" : "text-gray-700"}`}>
                <dt>{dayLabels[day]}{day === today && <span className="ml-2 text-xs font-semibold text-gray-400">Today</span>}</dt>
                <dd>{entry?.isOpen ? `${formatTime(entry.opensAt)} – ${formatTime(entry.closesAt)}` : <span className="text-gray-400">{entry ? "Closed" : "Not listed"}</span>}</dd>
              </div>
            );
          })}
        </dl>
      )}
      {hours.notes.length > 0 && (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {hours.notes.map((note) => (
            <div key={note.label} className="rounded-xl bg-gray-50 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{note.label}</dt>
              <dd className="mt-1 whitespace-pre-line text-sm text-gray-800">{note.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
