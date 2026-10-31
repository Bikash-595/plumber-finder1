import Link from "next/link";
import type { IconType } from "react-icons";

/** Friendly "nothing here yet" box with an optional next step. */
export default function EmptyState({ icon: Icon, title, text, action }: { icon: IconType; title: string; text?: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"><Icon className="h-6 w-6" aria-hidden /></span>
      <p className="mt-4 font-semibold text-gray-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
      {action && <Link href={action.href} className="mt-5 rounded-full bg-[#FFD60A] px-5 py-2 text-sm font-semibold text-[#0b1f3b] transition hover:brightness-95">{action.label}</Link>}
    </div>
  );
}
