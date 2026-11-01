import Link from "next/link";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { toneClasses, type Tone } from "@/components/dashboard/ui/tones";

/** "+12% vs previous 30 days" — green when up, red when down (inverted for things where lower is better). */
export function Delta({ change, lowerIsBetter, suffix = "vs previous period" }: { change: number | null | undefined; lowerIsBetter?: boolean; suffix?: string }) {
  if (change === null || change === undefined) return <span className="text-xs text-gray-400">No earlier data</span>;
  const good = lowerIsBetter ? change < 0 : change > 0;
  const tone = change === 0 ? "bg-gray-100 text-gray-600" : good ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
      <span className={`rounded-full px-1.5 py-0.5 font-bold tabular-nums ${tone}`}>{change > 0 ? "▲" : change < 0 ? "▼" : "•"} {Math.abs(change)}%</span>
      {suffix}
    </span>
  );
}

/** One headline number with its icon, change against the previous period, and an optional link. */
export default function KpiCard({ label, value, icon: Icon, tone = "brand", change, lowerIsBetter, hint, href, loading }: { label: string; value: ReactNode; icon: IconType; tone?: Tone; change?: number | null; lowerIsBetter?: boolean; hint?: ReactNode; href?: string; loading?: boolean }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone].icon}`}><Icon className="h-4 w-4" aria-hidden /></span>
      </div>
      {loading ? <span className="mt-1 block h-8 w-24 animate-pulse rounded-md bg-gray-100" /> : <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-gray-900 sm:text-[1.75rem]">{value}</p>}
      <div className="mt-1.5 min-h-5">{loading ? null : change !== undefined ? <Delta change={change} lowerIsBetter={lowerIsBetter} /> : hint && <span className="text-xs text-gray-500">{hint}</span>}</div>
    </>
  );
  const className = "block rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm sm:p-5";
  return href ? <Link href={href} className={`${className} transition hover:-translate-y-0.5 hover:border-[#FFD60A] hover:shadow-md`}>{body}</Link> : <div className={className}>{body}</div>;
}
