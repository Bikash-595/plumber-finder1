import { useCallback, useEffect, useState } from "react";
import { companyApi } from "../companyApi";

export type Item = Record<string, unknown> & { _id: string };

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
