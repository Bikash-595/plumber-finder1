"use client";

const badgeTones: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200", verified: "bg-emerald-50 text-emerald-700 ring-emerald-200", completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200", scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  suspended: "bg-red-50 text-red-700 ring-red-200", rejected: "bg-red-50 text-red-700 ring-red-200", cancelled: "bg-gray-100 text-gray-600 ring-gray-200", declined: "bg-red-50 text-red-700 ring-red-200",
  user: "bg-sky-50 text-sky-700 ring-sky-200", company: "bg-indigo-50 text-indigo-700 ring-indigo-200", freelancer: "bg-violet-50 text-violet-700 ring-violet-200",
};

/** Coloured status pill; `label` replaces the raw value (e.g. "scheduled" shown as "Confirmed"). */
export default function StatusBadge({ value, label }: { value: string; label?: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${badgeTones[value] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`}>{label ?? value}</span>;
}
