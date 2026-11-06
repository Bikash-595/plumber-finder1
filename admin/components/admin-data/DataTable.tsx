"use client";

import { type ReactNode } from "react";

/** Table wrapper that scrolls sideways on small screens and shows loading / empty / error states. */
export default function DataTable({ head, loading, error, empty, children }: { head: string[]; loading: boolean; error?: string; empty: boolean; children: ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto">
      {error && <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-gray-500">
            {head.map((heading) => <th key={heading} className="border-b border-gray-200 px-4 py-3 font-semibold">{heading}</th>)}
          </tr>
        </thead>
        <tbody className={loading ? "opacity-50" : ""}>
          {children}
          {!loading && empty && <tr><td colSpan={head.length} className="px-4 py-10 text-center text-gray-500">Nothing found.</td></tr>}
          {loading && empty && <tr><td colSpan={head.length} className="px-4 py-10 text-center text-gray-500">Loading…</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
