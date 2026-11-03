import { FaCalendarCheck } from "react-icons/fa";
import { bookService, serviceIcon } from "./serviceVisuals";

/** Providers that only listed service names (no prices yet): tidy tiles with a Book button. */
export default function ServiceNameGrid({ names }: { names: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @4xl:grid-cols-3">
      {names.map((name) => (
        <li key={name} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:border-[#FFD60A]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0b1f3b] to-[#17345a]">{serviceIcon(name, "h-4 w-4 text-[#FFD60A]")}</span>
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-gray-900">{name}</span><span className="text-xs text-gray-500">Price on request</span></span>
          <button type="button" onClick={() => bookService(name)} aria-label={`Book ${name}`} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0b1f3b] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#17345a]"><FaCalendarCheck className="h-3 w-3" aria-hidden /> Book</button>
        </li>
      ))}
    </ul>
  );
}
