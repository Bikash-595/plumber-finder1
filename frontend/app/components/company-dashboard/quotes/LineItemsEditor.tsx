"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { formatMoney } from "../companyApi";
import type { QuoteLine } from "../growthApi";

const field = "w-full rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** Editable quote lines: description, quantity, unit price; the line amount updates as you type. */
export default function LineItemsEditor({ items, onChange }: { items: QuoteLine[]; onChange: (items: QuoteLine[]) => void }) {
  const set = (index: number, change: Partial<QuoteLine>) => onChange(items.map((item, i) => (i === index ? { ...item, ...change } : item)));
  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[1fr_80px_110px_90px_32px] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid"><span>Description</span><span>Qty</span><span>Unit price</span><span className="text-right">Amount</span><span /></div>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border border-gray-100 p-2 sm:grid-cols-[1fr_80px_110px_90px_32px] sm:border-0 sm:p-0">
          <input aria-label={`Line ${index + 1} description`} value={item.description} maxLength={200} onChange={(e) => set(index, { description: e.target.value })} placeholder="e.g. Replace kitchen tap" className={`${field} col-span-2 sm:col-span-1`} />
          <input aria-label={`Line ${index + 1} quantity`} type="number" min={0.01} step="any" value={item.quantity} onChange={(e) => set(index, { quantity: Number(e.target.value) })} className={field} />
          <input aria-label={`Line ${index + 1} unit price`} type="number" min={0} step="0.01" value={item.unitPrice} onChange={(e) => set(index, { unitPrice: Number(e.target.value) })} className={field} />
          <span className="self-center text-right text-sm font-semibold tabular-nums text-gray-900">{formatMoney((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</span>
          <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} disabled={items.length === 1} aria-label={`Remove line ${index + 1}`} className="grid h-8 w-8 place-items-center self-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"><FaTrash className="h-3 w-3" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { description: "", quantity: 1, unitPrice: 0 }])} disabled={items.length >= 30} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-gray-400 disabled:opacity-40"><FaPlus className="h-3 w-3" /> Add line</button>
    </div>
  );
}
