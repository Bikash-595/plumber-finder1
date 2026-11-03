import type { PremiumList } from "@/lib/adminApi";

const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** Active plans, monthly recurring revenue, the last 30 days of payments, and open requests. */
export default function PremiumSummary({ data }: { data: PremiumList }) {
  const cards = [
    { label: "Active plans", value: String(data.summary.activePlans) },
    { label: "Monthly recurring", value: money(data.summary.monthlyRecurring) },
    { label: "Paid in the last 30 days", value: money(data.summary.last30Days) },
    { label: "Requests waiting", value: String(data.counts.pending) },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
