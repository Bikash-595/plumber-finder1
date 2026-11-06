"use client";

import { type ActivityItem } from "@/lib/adminApi";
import { eventLabels, eventTone, when } from "./activityFormat";

export default function ActivityList({ items, showPlumber }: { items: ActivityItem[]; showPlumber: boolean }) {
  if (!items.length) return <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">No activity yet.</p>;
  return (
    <ol className="divide-y divide-gray-100">
      {items.map((item) => (
        <li key={item._id} className="flex flex-wrap items-start gap-x-3 gap-y-1 py-2.5 text-sm">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${eventTone[item.event]}`}>{eventLabels[item.event]}</span>
          <span className="min-w-0 flex-1 text-gray-700">
            <span className="font-semibold text-gray-900">{item.actor.name}</span>
            {item.actor.type === "guest" ? <span className="text-gray-400"> ({item.actor.guestId})</span> : item.actor.email ? <span className="text-gray-500"> · {item.actor.email}</span> : null}
            {item.actor.type !== "user" && item.actor.type !== "guest" && <span className="ml-1 rounded bg-gray-100 px-1.5 text-[10px] font-semibold uppercase text-gray-600">{item.actor.type}</span>}
            {showPlumber && <span className="text-gray-500"> → {item.providerName ?? `Plumber ${item.providerId}`}</span>}
            {item.target?.title && <span className="block text-xs text-gray-500">“{item.target.title}”</span>}
          </span>
          <time className="shrink-0 text-xs text-gray-400">{when(item.createdAt)}</time>
        </li>
      ))}
    </ol>
  );
}
