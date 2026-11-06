"use client";

import { n } from "./activityFormat";

export default function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return <div className="rounded-xl bg-gray-50 p-3" title={hint}><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-gray-900">{typeof value === "number" ? n(value) : value}</p></div>;
}
