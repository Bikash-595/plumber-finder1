/** A short ranked list with a bar per row (one hue, labels and values written out). */
export default function LabeledBars({ rows, empty }: { rows: { label: string; value: number; display?: string }[]; empty: string }) {
  const max = Math.max(...rows.map((row) => row.value), 0);
  if (!max) return <p className="py-6 text-center text-sm text-gray-500">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex justify-between gap-3 text-sm"><span className="truncate text-gray-700">{row.label}</span><span className="font-semibold tabular-nums text-gray-900">{row.display ?? row.value.toLocaleString()}</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#b39200]" style={{ width: `${(row.value / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}
