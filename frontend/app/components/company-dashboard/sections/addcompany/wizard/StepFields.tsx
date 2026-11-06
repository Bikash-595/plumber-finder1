"use client";

import type { ChangeEvent } from "react";
import { inputClass } from "./inputClass";
import type { steps } from "./wizardSteps";

type Field = (typeof steps)[number]["fields"][number] & { rows?: number; options?: string[] };

/** The plain fields of one step (text, textarea or select), two per row. */
export default function StepFields({ fields, values, onChange }: { fields: readonly Field[]; values: Record<string, string>; onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className={`${field.type === "textarea" ? "md:col-span-2" : ""}`}>
          <span className="block text-sm font-bold text-gray-700">{field.label}</span>
          {field.type === "textarea" ? (
            <textarea name={field.name} value={values[field.name]} onChange={onChange} rows={field.rows ?? 4} placeholder={field.placeholder} className={inputClass} />
          ) : field.type === "select" ? (
            <select name={field.name} value={values[field.name]} onChange={onChange} className={inputClass}>
              <option value="">Choose an option</option>
              {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input name={field.name} type={field.type} value={values[field.name]} onChange={onChange} placeholder={field.placeholder} className={inputClass} />
          )}
        </label>
      ))}
    </div>
  );
}
