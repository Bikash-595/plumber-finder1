import Link from "next/link";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { toneClasses, type Tone } from "./tones";

type Props = { label: string; value: ReactNode; hint?: ReactNode; icon: IconType; tone?: Tone; href?: string; loading?: boolean };

/** One number with a label and icon. Links to its page when `href` is given. */
export default function StatCard({ label, value, hint, icon: Icon, tone = "brand", href, loading }: Props) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone].icon}`}><Icon className="h-[18px] w-[18px]" aria-hidden /></span>
      </div>
      {loading ? <span className="mt-1 block h-8 w-20 animate-pulse rounded-md bg-gray-100" /> : <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900 sm:text-3xl">{value}</p>}
      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </>
  );
  const className = "block rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm";
  return href ? <Link href={href} className={`${className} transition hover:-translate-y-0.5 hover:border-[#FFD60A] hover:shadow-md`}>{body}</Link> : <div className={className}>{body}</div>;
}
