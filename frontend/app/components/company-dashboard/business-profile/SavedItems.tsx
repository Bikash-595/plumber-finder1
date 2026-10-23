"use client";

import { useCallback, useEffect, useState } from "react";
import { companyApi } from "./companyApi";

type Item = Record<string, unknown> & { _id: string };
export type Notice = { tone: "success" | "error"; text: string } | null;

/**
 * Loads a company's saved items for a one-item-at-a-time editor (projects, blogs) and
 * saves the item being edited: POST when new, PUT when editing an existing one.
 */
export function useSavedItems(apiEndpoint: string, labels: { singular: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => companyApi<Item[]>(apiEndpoint).then(({ data }) => setItems(data)), [apiEndpoint]);

  useEffect(() => {
    refresh().catch(() => undefined).finally(() => setLoading(false)); // Not signed in / backend offline: the editor still works for drafts.
  }, [refresh]);

  const save = async (values: Record<string, unknown>, successText: string) => {
    setSaving(true);
    setNotice(null);
    try {
      const { data } = editingId
        ? await companyApi<Item>(`${apiEndpoint}/${editingId}`, { method: "PUT", body: values })
        : await companyApi<Item>(apiEndpoint, { method: "POST", body: values });
      setEditingId(String(data._id));
      await refresh();
      setNotice({ tone: "success", text: successText });
      return data;
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : `Unable to save the ${labels.singular}.` });
      return null;
    } finally {
      setSaving(false);
    }
  };

  /** Changes some fields of a saved item (e.g. publish a scheduled post now) without opening it in the editor. */
  const patch = async (id: string, values: Record<string, unknown>, successText: string) => {
    try {
      await companyApi(`${apiEndpoint}/${id}`, { method: "PATCH", body: values });
      await refresh();
      setNotice({ tone: "success", text: successText });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : `Unable to update the ${labels.singular}.` });
    }
  };

  const remove = async (id: string) => {
    try {
      await companyApi(`${apiEndpoint}/${id}`, { method: "DELETE" });
      if (editingId === id) setEditingId(null);
      await refresh();
      setNotice({ tone: "success", text: `The ${labels.singular} was deleted.` });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : `Unable to delete the ${labels.singular}.` });
    }
  };

  return { items, loading, editingId, setEditingId, notice, setNotice, saving, save, patch, remove };
}

export function NoticeMessage({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return <p className={`rounded-lg px-3 py-2 text-sm font-medium ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{notice.text}</p>;
}

/** Demo content shown until the first real record exists; it is never saved. */
export function ExampleCard({ itemName, children }: { itemName: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-[#FFD60A] bg-[#FFD60A]/5 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#b59a00]">Example {itemName} — disappears when you start adding your own</p>
      <div className="opacity-80">{children}</div>
    </div>
  );
}

/** Compact list of saved items with Edit / Delete actions. */
export function SavedItemsList({ title, items, editingId, describe, onEdit, onDelete }: {
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
