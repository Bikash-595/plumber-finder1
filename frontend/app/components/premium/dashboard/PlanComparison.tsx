import { FaCheck, FaMinus } from "react-icons/fa";

const rows: [string, boolean, boolean, boolean][] = [
  ["Public profile, bookings, messages, quotes", true, true, true],
  ["Reviews and analytics", true, true, true],
  ["Premium badge on profile and cards", false, true, true],
  ["Listed above free plumbers", false, true, true],
  ["Highlighted directory card", false, true, true],
  ["Top Pro badge and gold card", false, false, true],
  ["Listed first — above Premium", false, false, true],
  ["Listed first on the home page and city pages", false, false, true],
  ["Priority support", false, true, true],
];

/** Free vs Premium vs Premium Plus, feature by feature. */
export default function PlanComparison() {
  const mark = (on: boolean) => (on ? <FaCheck className="mx-auto h-3.5 w-3.5 text-emerald-600" aria-label="Included" /> : <FaMinus className="mx-auto h-3 w-3 text-gray-300" aria-label="Not included" />);
  return (
    <section aria-labelledby="compare-heading" className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <h2 id="compare-heading" className="border-b border-gray-100 px-5 py-4 text-lg font-extrabold text-gray-900">Compare plans</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] text-sm">
          <thead><tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500"><th className="px-5 py-3 text-left font-bold">Feature</th><th className="px-3 py-3 font-bold">Free</th><th className="px-3 py-3 font-bold">Premium</th><th className="px-3 py-3 font-bold text-[#8a7300]">Premium Plus</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(([label, free, premium, plus]) => <tr key={label}><td className="px-5 py-3 text-gray-700">{label}</td><td className="px-3 py-3">{mark(free)}</td><td className="px-3 py-3">{mark(premium)}</td><td className="px-3 py-3">{mark(plus)}</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
