import Link from "next/link";

export default function FilterLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} scroll={false}
      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? "bg-[#0b1f3b] text-white" : "text-slate-700 hover:bg-slate-100"}`}>
      {children}
    </Link>
  );
}
