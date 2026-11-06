"use client";

import type { ProfileField } from "../SectionForm";

export const isUploadField = (field: ProfileField) => field.type === "image" || field.type === "video" || field.type === "media";

const isDisplayableMedia = (value: string) => value.startsWith("data:image/") || /^https?:\/\//.test(value) || value.startsWith("/");

/** A saved record as a compact card: picture, title, details, and yes/no flags. */
export default function RecordSummary({ record, fields }: { record: Record<string, unknown>; fields: ProfileField[] }) {
  const text = (value: unknown) => (Array.isArray(value) ? value.join(", ") : typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) ? value.slice(0, 10) : value === null || value === undefined ? "" : String(value));
  const media = fields.filter(isUploadField).map((field) => text(record[field.name])).find((value) => value && isDisplayableMedia(value) && !value.startsWith("data:video/"));
  const textFields = fields.filter((field) => !isUploadField(field) && field.type !== "checkbox" && text(record[field.name]));
  const [headingField, ...rest] = textFields;
  const flags = fields.filter((field) => field.type === "checkbox" && record[field.name] === true);

  return <div className="flex min-w-0 gap-3">
    {media && <img src={media} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
    <div className="min-w-0">
      <p className="break-words font-semibold text-gray-900">{headingField ? text(record[headingField.name]) : "Untitled"}</p>
      {rest.slice(0, 4).map((field) => <p key={field.name} className="mt-0.5 line-clamp-2 break-words text-xs text-gray-500"><span className="font-semibold text-gray-600">{field.label}:</span> {text(record[field.name])}</p>)}
      {flags.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{flags.map((field) => <span key={field.name} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">{field.label}</span>)}</div>}
    </div>
  </div>;
}
