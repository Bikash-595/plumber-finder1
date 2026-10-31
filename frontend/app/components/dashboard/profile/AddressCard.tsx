import { FaBuilding, FaHome, FaKey, FaMapMarkerAlt } from "react-icons/fa";
import { formatAddress, type Address } from "@/components/utils/userApi";
import { ownershipLabels, propertyTypes } from "./profileOptions";

/** One saved address with its property details and actions. */
export default function AddressCard({ address, busy, onEdit, onMakeDefault, onRemove }: { address: Address; busy: boolean; onEdit: () => void; onMakeDefault: () => void; onRemove: () => void }) {
  const Icon = address.propertyType === "commercial" || address.propertyType === "apartment" ? FaBuilding : address.propertyType ? FaHome : FaMapMarkerAlt;
  const facts = [address.propertyType && propertyTypes[address.propertyType], address.ownership && ownershipLabels[address.ownership], address.yearBuilt && `Built ${address.yearBuilt}`].filter(Boolean);
  return (
    <article className={`flex flex-col rounded-2xl border p-4 ${address.isDefault ? "border-[#0b1f3b] ring-1 ring-[#0b1f3b]" : "border-gray-200"}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${address.isDefault ? "bg-[#0b1f3b] text-[#FFD60A]" : "bg-gray-100 text-gray-500"}`}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-bold text-gray-900">{address.label}{address.isDefault && <span className="rounded-full bg-[#FFD60A] px-2 py-0.5 text-[11px] font-bold text-[#0b1f3b]">Default</span>}</p>
          <p className="text-sm text-gray-600">{formatAddress(address)}</p>
          {facts.length > 0 && <p className="mt-1 text-xs text-gray-500">{facts.join(" · ")}</p>}
        </div>
      </div>
      {address.accessNotes && <p className="mt-3 flex gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-700"><FaKey className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" /><span className="line-clamp-2">{address.accessNotes}</span></p>}
      <div className="mt-auto flex flex-wrap gap-1 pt-3">
        <button type="button" disabled={busy} onClick={onEdit} className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#0b1f3b] hover:bg-gray-100 disabled:opacity-50">Edit</button>
        {!address.isDefault && <button type="button" disabled={busy} onClick={onMakeDefault} className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#0b1f3b] hover:bg-[#FFD60A]/20 disabled:opacity-50">Make default</button>}
        <button type="button" disabled={busy} onClick={onRemove} className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">Remove</button>
      </div>
    </article>
  );
}
