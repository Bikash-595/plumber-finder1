type Point = { label: string; value: number; display: string };

/**
 * One measure per month as thin vertical bars (one hue, rounded top, baseline-anchored),
 * with a hover/focus tooltip and a hidden table for screen readers.
 */
export default function MonthlyBarChart({ title, points, barClass = "bg-[#0b1f3b]", empty = "Nothing in this period yet." }: { title: string; points: Point[]; barClass?: string; empty?: string }) {
  const max = Math.max(...points.map((point) => point.value), 0);
  if (max === 0) return <div className="flex h-52 items-center justify-center rounded-xl border border-dashed border-gray-200 text-sm text-gray-500">{empty}</div>;
  return (
    <figure>
      <p className="mb-2 text-[11px] tabular-nums text-gray-400" aria-hidden>Peak: {points.find((point) => point.value === max)?.display}</p>
      <div className="relative h-44" aria-hidden>
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-gray-200" />
        <div className="absolute inset-0 flex items-end gap-2 border-b border-gray-300 sm:gap-3">
          {points.map((point) => (
            <div key={point.label} tabIndex={0} className="group relative flex h-full flex-1 items-end justify-center outline-none">
              <div className={`w-full max-w-10 rounded-t ${point.value ? barClass : ""} transition group-hover:opacity-80 group-focus:opacity-80`} style={{ height: max ? `${Math.max(2, (point.value / max) * 100)}%` : 0 }} />
              <span className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs font-semibold text-white shadow group-hover:block group-focus:block">{point.label}: {point.display}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3" aria-hidden>
        {points.map((point) => <span key={point.label} className="flex-1 text-center text-[11px] text-gray-500">{point.label}</span>)}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>{points.map((point) => <tr key={point.label}><th scope="row">{point.label}</th><td>{point.display}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
