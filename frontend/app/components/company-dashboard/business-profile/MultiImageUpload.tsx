"use client";

import { useId, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from "react-icons/fa";
import { compressImage } from "./LocalMediaUpload";

type Props = {
  label: string;
  value: string[];
  onChange: (images: string[]) => void;
  max?: number;
  hint?: string;
};

// Saved together in one request, so the photos' total size is kept under the server's limit.
const MAX_TOTAL = 7_500_000;

/** Several photos (e.g. cover photos): add many at once, reorder with the arrows, remove. The first one leads. */
export default function MultiImageUpload({ label, value, onChange, max = 8, hint }: Props) {
  const id = useId();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const room = max - value.length;

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const chosen = [...files].slice(0, room);
    const added: string[] = [];
    const problems: string[] = [];
    for (const file of chosen) {
      const result = await compressImage(file, 1600);
      if ("error" in result) problems.push(result.error);
      else added.push(result.dataUrl);
    }
    const next = [...value, ...added];
    if (next.reduce((total, image) => total + image.length, 0) > MAX_TOTAL) problems.push("These photos are too large together — remove one or choose smaller photos.");
    else onChange(next);
    if (files.length > room) problems.push(`Only ${max} photos can be added; the extra ones were skipped.`);
    setError(problems.join(" "));
    setBusy(false);
  };

  const move = (index: number, delta: number) => {
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div>
      <span className="text-sm font-semibold text-gray-700">{label} <span className="font-normal text-gray-400">({value.length}/{max})</span></span>
      {hint && <p className="mt-0.5 text-xs text-gray-500">{hint}</p>}
      <input id={id} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => { add(event.target.files); event.target.value = ""; }} className="sr-only" disabled={busy || room <= 0} />
      <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {value.map((image, index) => (
          <li key={`${index}-${image.slice(-24)}`} className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- uploads are data URLs */}
            <img src={image} alt={`${label} ${index + 1}`} className="h-full w-full object-cover" />
            <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${index === 0 ? "bg-[#FFD60A] text-[#0b1f3b]" : "bg-black/60 text-white"}`}>{index === 0 ? "Main" : index + 1}</span>
            <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <div className="flex gap-1">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move photo ${index + 1} earlier`} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#0b1f3b] disabled:opacity-30"><FaArrowLeft className="h-2.5 w-2.5" /></button>
                <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} aria-label={`Move photo ${index + 1} later`} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-[#0b1f3b] disabled:opacity-30"><FaArrowRight className="h-2.5 w-2.5" /></button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label={`Remove photo ${index + 1}`} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-red-600"><FaTrash className="h-2.5 w-2.5" /></button>
            </div>
          </li>
        ))}
        {room > 0 && (
          <li>
            <label htmlFor={id} className={`flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center text-xs text-gray-500 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/5 ${busy ? "opacity-60" : ""}`}>
              <FaPlus className="h-4 w-4 text-[#0b1f3b]" />
              <span className="font-semibold text-[#0b1f3b]">{busy ? "Adding…" : value.length ? "Add more photos" : "Add photos"}</span>
              <span>Choose several at once</span>
            </label>
          </li>
        )}
      </ul>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
