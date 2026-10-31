/** Horizontal, scrollable filter chips with optional counts. */
export default function FilterTabs<V extends string>({ options, value, onChange, label }: { options: { value: V; label: string; count?: number }[]; value: V; onChange: (value: V) => void; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button key={option.value} type="button" role="tab" aria-selected={active} onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${active ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"}`}>
            {option.label}
            {option.count !== undefined && <span className={`rounded-full px-1.5 text-xs tabular-nums ${active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"}`}>{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
