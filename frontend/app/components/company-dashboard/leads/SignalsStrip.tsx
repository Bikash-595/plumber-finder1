import { FaBalanceScale, FaEnvelope, FaGlobe, FaHeart, FaPhoneAlt, FaShareAlt } from "react-icons/fa";

const signals = [
  { key: "call_click", label: "Phone taps", icon: FaPhoneAlt },
  { key: "email_click", label: "Email clicks", icon: FaEnvelope },
  { key: "website_click", label: "Website visits", icon: FaGlobe },
  { key: "save", label: "Saves", icon: FaHeart },
  { key: "compare_add", label: "Compared", icon: FaBalanceScale },
  { key: "share", label: "Shares", icon: FaShareAlt },
];

/** Interest that didn't (yet) become a booking request, counted anonymously — who it was is never shown. */
export default function SignalsStrip({ values, days }: { values: Record<string, number>; days: number }) {
  return (
    <section aria-label="Interest signals" className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-gray-900">Interest in the last {days} days</h2>
        <p className="text-xs text-gray-500">Counted anonymously — customers who contact or book you appear as leads.</p>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {signals.map(({ key, label, icon: Icon }) => (
          <li key={key} className="rounded-xl bg-gray-50 px-3 py-2.5">
            <Icon className="h-3.5 w-3.5 text-[#b39200]" aria-hidden />
            <p className="mt-1 text-lg font-bold tabular-nums text-gray-900">{values[key] ?? 0}</p>
            <p className="text-[11px] text-gray-500">{label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
