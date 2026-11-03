import { FaBolt, FaListUl, FaShieldAlt, FaTag } from "react-icons/fa";
import type { ServiceDetail } from "@/components/find/types";
import { splitPrice } from "./serviceVisuals";

/** At-a-glance facts above the cards: lowest price, how many services, 24/7, guarantees. */
export default function ServicesSummary({ services }: { services: ServiceDetail[] }) {
  const amounts = services.map((service) => splitPrice(service.price)?.amount).filter((value): value is number => typeof value === "number" && value > 0);
  const facts = [
    amounts.length > 0 && { icon: FaTag, label: "Prices from", value: `$${Math.min(...amounts).toLocaleString("en-US")}` },
    { icon: FaListUl, label: "Services", value: String(services.length) },
    services.some((s) => s.emergency) && { icon: FaBolt, label: "Emergency", value: "24/7", tone: "text-red-600" },
    services.some((s) => s.warranty) && { icon: FaShieldAlt, label: "Guaranteed", value: `${services.filter((s) => s.warranty).length} service${services.filter((s) => s.warranty).length === 1 ? "" : "s"}`, tone: "text-emerald-600" },
  ].filter(Boolean) as { icon: typeof FaTag; label: string; value: string; tone?: string }[];
  return (
    <dl className="grid grid-cols-2 gap-2 @2xl:grid-cols-4">
      {facts.map(({ icon: Icon, label, value, tone }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 ring-1 ring-inset ring-gray-100">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white shadow-sm"><Icon className={`h-3.5 w-3.5 ${tone ?? "text-[#0b1f3b]"}`} aria-hidden /></span>
          <span className="min-w-0"><dt className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</dt><dd className="truncate text-sm font-extrabold text-[#0b1f3b]">{value}</dd></span>
        </div>
      ))}
    </dl>
  );
}
