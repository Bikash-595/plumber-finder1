"use client";

import Link from "next/link";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { formatAddress, userApi, type Address } from "@/components/utils/userApi";
import { useUserData } from "../useUserData";

/**
 * Chips under a booking/checkout form's address field: one per saved address (default first) and the
 * profile phone. Tapping fills the form; nothing is filled without the customer choosing it.
 */
export default function SavedAddressPicker({ onAddress, onPhone, currentAddress, currentPhone }: { onAddress: (address: string, saved: Address) => void; onPhone?: (phone: string) => void; currentAddress?: string; currentPhone?: string }) {
  const addresses = useUserData(userApi.addresses);
  const profile = useUserData(userApi.profile);
  if (!addresses.signedIn) return null;
  const list = [...(addresses.data ?? [])].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  const phone = profile.data?.phone;
  if (!list.length && !phone) {
    return addresses.data ? <p className="mt-1.5 text-xs text-gray-500"><Link href="/dashboard/profile" className="font-semibold text-[#0b1f3b] underline">Save your address</Link> to fill this in next time.</p> : null;
  }
  const chip = (active: boolean) => `inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${active ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-[#0b1f3b]"}`;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Use saved details">
      {list.map((address) => {
        const text = formatAddress(address);
        return (
          <button key={address._id} type="button" onClick={() => onAddress(text, address)} title={text} className={chip(currentAddress === text)}>
            <FaMapMarkerAlt className="h-2.5 w-2.5 shrink-0" /><span className="truncate">{address.label}{address.isDefault ? " (default)" : ""}</span>
          </button>
        );
      })}
      {phone && onPhone && <button type="button" onClick={() => onPhone(phone)} className={chip(currentPhone === phone)}><FaPhoneAlt className="h-2.5 w-2.5" />Use {phone}</button>}
    </div>
  );
}
