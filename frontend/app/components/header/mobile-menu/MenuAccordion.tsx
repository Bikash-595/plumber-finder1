import type { ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa6";

/** A collapsible group in the phone menu (Services, States). */
export default function MenuAccordion({ title, count, open, onToggle, className = "", children }: { title: string; count: number; open: boolean; onToggle: () => void; className?: string; children: ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 ${className}`}>
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center justify-between px-4 py-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-50">
        <span>{title} <span className="ml-1 text-xs font-medium text-slate-400">{count}</span></span>
        <FaChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && children}
    </div>
  );
}
