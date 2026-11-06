"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";
import { inputClass } from "./inputClass";

export type RowField<T> = { key: keyof T & string; label: string; placeholder: string; textarea?: boolean; rows?: number; wide?: boolean };

/**
 * A list the company can add rows to and remove rows from (services, locations, gallery images and videos), each row
 * a small form. `surface` sets the card colours: "gray" (gray panel, white rows) or "white" (white panel, gray rows).
 * `extra` renders more controls under a row's fields (e.g. the map picker for a location).
 */
export default function RepeatableList<T extends Record<string, string>>({ title, description, addLabel, itemLabel, rows, setRows, blank, fields, surface = "gray", extra }: {
  title: string; description: string; addLabel: string; itemLabel: string;
  rows: T[]; setRows: Dispatch<SetStateAction<T[]>>; blank: T; fields: RowField<T>[];
  surface?: "gray" | "white"; extra?: (row: T, update: (key: keyof T & string, value: string) => void) => ReactNode;
}) {
  // Functional updates, so two changes in a row (e.g. latitude then longitude) both apply.
  const update = (index: number, key: keyof T & string, value: string) => setRows((current) => current.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  const add = () => setRows((current) => [...current, { ...blank }]);
  const remove = (index: number) => setRows((current) => current.filter((_, i) => i !== index));

  return (
    <div className={`rounded-3xl border border-gray-200 p-5 ${surface === "gray" ? "bg-gray-50" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-3 pb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f3b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#111b35]">
          <FaPlus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className={`rounded-3xl border border-gray-200 p-4 ${surface === "gray" ? "bg-white" : "bg-gray-50"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-gray-900">{itemLabel} {index + 1}</p>
              <button type="button" onClick={() => remove(index)} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className={field.wide ? "md:col-span-2" : undefined}>
                  <span className="block text-sm font-semibold text-gray-700">{field.label}</span>
                  {field.textarea
                    ? <textarea value={row[field.key]} onChange={(event) => update(index, field.key, event.target.value)} rows={field.rows ?? 3} placeholder={field.placeholder} className={inputClass} />
                    : <input value={row[field.key]} onChange={(event) => update(index, field.key, event.target.value)} placeholder={field.placeholder} className={inputClass} />}
                </label>
              ))}
              {extra && <div className="md:col-span-2">{extra(row, (key, value) => update(index, key, value))}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
