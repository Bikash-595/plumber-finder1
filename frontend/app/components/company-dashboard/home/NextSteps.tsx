import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Panel from "@/components/dashboard/ui/Panel";
import type { StrengthItem } from "../companyApi";
import { dashBase } from "@/components/utils/providerSide";

/** The three improvements that add the most to profile strength. */
export default function NextSteps({ items }: { items: StrengthItem[] }) {
  return (
    <Panel title="Grow your profile" action={<Link href={`${dashBase()}/profile`} className="text-sm font-semibold text-[#8a7300] hover:underline">Full checklist →</Link>} bodyClassName="">
      {items.length === 0 ? <p className="px-5 py-6 text-sm text-emerald-700 sm:px-6">Your profile is complete — great work.</p> : (
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className="group flex items-center gap-3 px-5 py-3 transition hover:bg-gray-50 sm:px-6">
                <span className="rounded-full bg-[#FFD60A]/25 px-2 py-0.5 text-xs font-bold tabular-nums text-[#5c4d00]">+{item.weight}%</span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-gray-900">{item.label}</span><span className="block truncate text-xs text-gray-500">{item.tip}</span></span>
                <FaArrowRight className="h-3 w-3 text-gray-300 group-hover:text-gray-600" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
