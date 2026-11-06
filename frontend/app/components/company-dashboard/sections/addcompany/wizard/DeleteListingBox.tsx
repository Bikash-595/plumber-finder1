"use client";

import { FaTrash } from "react-icons/fa";

/** Shown once the listing is live: removes it from the directory and clears every wizard step. */
export default function DeleteListingBox({ disabled, onDelete }: { disabled: boolean; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-700"><span className="font-bold text-red-700">Delete listing.</span> Removes your company from the public directory and clears every wizard step.</p>
      <button type="button" onClick={onDelete} disabled={disabled} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50">
        <FaTrash className="mr-2 h-3.5 w-3.5" /> Delete listing
      </button>
    </div>
  );
}
