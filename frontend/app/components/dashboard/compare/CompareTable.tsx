import Link from "next/link";
import { FaStar, FaTimes, FaTrophy } from "react-icons/fa";
import { bestColumn, compareSections, type Column } from "./compareRows";

/** Side-by-side table; the first column sticks while the plumbers scroll sideways on small screens. */
export default function CompareTable({ columns, busy, onRemove }: { columns: Column[]; busy: boolean; onRemove: (column: Column) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-44 bg-white p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-gray-500">Compare</th>
            {columns.map((column) => (
              <th key={column.item._id} scope="col" className="min-w-52 border-l border-gray-100 p-4 text-left align-top font-normal">
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- logos may be uploads or any allowed host */}
                  <img src={column.profile?.logo || column.item.image || "/Plumber.png"} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/plumber/${encodeURIComponent(column.item.providerId)}`} className="line-clamp-2 font-bold text-gray-900 hover:underline">{column.item.name}</Link>
                    {(column.profile?.rating ?? column.item.rating) !== undefined && <p className="flex items-center gap-1 text-xs text-gray-600"><FaStar className="h-3 w-3 text-[#FFD60A]" />{(column.profile?.rating ?? column.item.rating)?.toFixed(1)}</p>}
                  </div>
                  <button type="button" disabled={busy} onClick={() => onRemove(column)} aria-label={`Remove ${column.item.name} from comparison`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"><FaTimes className="h-3 w-3" /></button>
                </div>
                <Link href={`/book-plumber?plumber=${encodeURIComponent(column.item.providerId)}`} className="mt-3 block rounded-full bg-[#FFD60A] px-3 py-2 text-center text-sm font-bold text-[#0b1f3b] hover:brightness-95">Book</Link>
              </th>
            ))}
          </tr>
        </thead>
        {compareSections.map((section) => (
          <tbody key={section.title}>
            <tr><th colSpan={columns.length + 1} scope="colgroup" className="sticky left-0 bg-gray-50 px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{section.title}</th></tr>
            {section.rows.map((row) => {
              const best = bestColumn(row, columns);
              return (
                <tr key={row.label} className="border-t border-gray-100">
                  <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-3 text-left font-medium text-gray-600">{row.label}</th>
                  {columns.map((column, index) => (
                    <td key={column.item._id} className={`border-l border-gray-100 px-4 py-3 align-top text-gray-900 ${index === best ? "bg-emerald-50/60" : ""}`}>
                      {column.profile === undefined ? <span className="block h-4 w-20 animate-pulse rounded bg-gray-100" /> : row.value(column)}
                      {index === best && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase text-emerald-700"><FaTrophy className="h-2.5 w-2.5" />Best</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
