"use client";

import { type Item } from "./useSavedItems";

/** Compact list of saved items with Edit / Delete actions. */
export default function SavedItemsList({ title, items, editingId, describe, onEdit, onDelete }: {
  title: string;
  items: Item[];
  editingId: string | null;
  describe: (item: Item) => { heading: string; meta?: string; badge?: string };
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-6 rounded-xl border border-gray-200">
      <h3 className="border-b border-gray-100 px-4 py-3 text-sm font-bold text-gray-900">{title} <span className="font-medium text-gray-400">({items.length})</span></h3>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => {
          const { heading, meta, badge } = describe(item);
          return (
            <li key={item._id} className={`flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${editingId === item._id ? "bg-[#FFD60A]/10" : ""}`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{heading}{badge && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{badge}</span>}</p>
                {meta && <p className="truncate text-xs text-gray-500">{meta}</p>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50">{editingId === item._id ? "Editing" : "Edit"}</button>
                <button type="button" onClick={() => { if (window.confirm(`Delete "${heading}"?`)) onDelete(item._id); }} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
