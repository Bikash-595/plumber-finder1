"use client";

export default function SkeletonRows({ count, tall }: { count: number; tall?: boolean }) {
  return (
    <div className="space-y-2 px-2" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className={`${tall ? "h-11 w-11" : "h-8 w-8"} shrink-0 animate-pulse rounded-xl bg-slate-100`} />
          <span className="flex-1 space-y-1.5">
            <span className="block h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            {tall && <span className="block h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />}
          </span>
        </div>
      ))}
    </div>
  );
}
