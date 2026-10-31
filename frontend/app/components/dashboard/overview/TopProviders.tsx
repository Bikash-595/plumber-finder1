import Link from "next/link";
import type { DashboardInsights } from "@/components/utils/userApi";
import { formatDate } from "@/components/utils/userApi";

/** The plumbers this customer books most, with a quick "book again". */
export default function TopProviders({ providers }: { providers: DashboardInsights["topProviders"] }) {
  if (!providers.length) return <p className="text-sm text-gray-500">Plumbers you book will appear here.</p>;
  return (
    <ol className="space-y-3">
      {providers.map((provider, index) => (
        <li key={`${provider.providerType}:${provider.providerId}`} className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b1f3b] text-xs font-bold text-[#FFD60A]">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <Link href={`/plumber/${encodeURIComponent(provider.providerId)}`} className="block truncate text-sm font-semibold text-gray-900 hover:underline">{provider.name}</Link>
            <p className="text-xs text-gray-500">{provider.bookings} booking{provider.bookings === 1 ? "" : "s"} · {provider.completed} completed · last {formatDate(provider.lastBooked)}</p>
          </div>
          <Link href={`/book-plumber?plumber=${encodeURIComponent(provider.providerId)}`} className="shrink-0 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#0b1f3b]">Book again</Link>
        </li>
      ))}
    </ol>
  );
}
