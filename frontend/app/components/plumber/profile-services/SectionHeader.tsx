"use client";

import { FaBolt } from "react-icons/fa";

export default function SectionHeader({ title, subtitle, emergency, action }: { title: string; subtitle: string; emergency?: boolean; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#b39200]">What we do</p>
        <h2 id="services-heading" className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b1f3b] sm:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        {emergency && <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 ring-1 ring-red-100"><span className="inline-flex h-2 w-2 rounded-full bg-red-600" aria-hidden /><FaBolt className="h-3 w-3" aria-hidden /> Emergency service available</span>}
      </div>
      {action}
    </div>
  );
}
