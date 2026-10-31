import Link from "next/link";
import { FaBalanceScale, FaFileInvoice, FaSearch, FaStar } from "react-icons/fa";

const actions = [
  { label: "Find plumbers", text: "Search verified pros near you", href: "/find", icon: FaSearch },
  { label: "Compare", text: "Up to 3 side by side", href: "/dashboard/compare", icon: FaBalanceScale },
  { label: "Invoices", text: "Download for your records", href: "/dashboard/invoices", icon: FaFileInvoice },
  { label: "My reviews", text: "See replies from plumbers", href: "/dashboard/reviews", icon: FaStar },
];

export default function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {actions.map(({ label, text, href, icon: Icon }) => (
        <Link key={href} href={href} className="group flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:border-[#FFD60A] hover:shadow-md">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[#0b1f3b] transition group-hover:bg-[#FFD60A]"><Icon className="h-4 w-4" /></span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-gray-900">{label}</span>
            <span className="hidden truncate text-xs text-gray-500 sm:block">{text}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
