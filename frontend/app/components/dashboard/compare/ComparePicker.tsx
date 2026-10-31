import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";
import type { ListItem } from "@/components/utils/userApi";
import Panel from "../ui/Panel";

/** Add plumbers to the comparison from the customer's saved list (or go and find more). */
export default function ComparePicker({ saved, slotsLeft, busy, onAdd }: { saved: ListItem[]; slotsLeft: number; busy: boolean; onAdd: (item: ListItem) => void }) {
  return (
    <Panel title="Add plumbers" description={slotsLeft > 0 ? `Choose up to ${slotsLeft} more from your saved plumbers.` : "You're comparing the maximum of 3. Remove one to add another."}
      action={<Link href="/find" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#8a7300] hover:underline"><FaSearch className="h-3 w-3" /> Find plumbers</Link>}>
      {saved.length === 0 ? <p className="text-sm text-gray-500">Save plumbers from their profiles, or use the Compare button on a profile, and they&apos;ll show up here.</p> : (
        <div className="flex flex-wrap gap-2">
          {saved.map((item) => (
            <button key={item._id} type="button" disabled={busy || slotsLeft === 0} onClick={() => onAdd(item)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-semibold text-gray-800 transition hover:border-[#0b1f3b] disabled:cursor-not-allowed disabled:opacity-50">
              {/* eslint-disable-next-line @next/next/no-img-element -- snapshot images come from any allowed host */}
              <img src={item.image || "/Plumber.png"} alt="" className="h-7 w-7 rounded-full object-cover" />
              <span className="max-w-40 truncate">{item.name}</span>
              <FaPlus className="h-2.5 w-2.5 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </Panel>
  );
}
