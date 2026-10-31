"use client";

import { useState, type FormEvent } from "react";
import type { Address, AddressInput, Ownership, PropertyType } from "@/components/utils/userApi";
import Notice from "../ui/Notice";
import { addressLabels, fieldClass, ownershipLabels, propertyTypes, US_STATES } from "./profileOptions";

type Draft = { label: string; line1: string; line2: string; city: string; state: string; zipCode: string; propertyType: PropertyType | ""; ownership: Ownership | ""; yearBuilt: string; accessNotes: string; isDefault: boolean };
const toDraft = (address?: Address): Draft => ({
  label: address?.label ?? "Home", line1: address?.line1 ?? "", line2: address?.line2 ?? "", city: address?.city ?? "", state: address?.state ?? "", zipCode: address?.zipCode ?? "",
  propertyType: address?.propertyType ?? "", ownership: address?.ownership ?? "", yearBuilt: address?.yearBuilt ? String(address.yearBuilt) : "", accessNotes: address?.accessNotes ?? "", isDefault: address?.isDefault ?? false,
});

/** Add or edit one service address with the property details a plumber needs before a visit. */
export default function AddressForm({ address, busy, error, onSave, onCancel }: { address?: Address; busy: boolean; error: string; onSave: (values: AddressInput) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(() => toDraft(address));
  const [problem, setProblem] = useState("");
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const thisYear = new Date().getFullYear();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{5}(-\d{4})?$/.test(draft.zipCode.trim())) return setProblem("Enter a 5-digit ZIP code.");
    const year = draft.yearBuilt ? Number(draft.yearBuilt) : null;
    if (year !== null && (!Number.isInteger(year) || year < 1800 || year > thisYear)) return setProblem(`Year built must be between 1800 and ${thisYear}.`);
    setProblem("");
    onSave({
      label: draft.label.trim() || "Home", line1: draft.line1.trim(), line2: draft.line2.trim(), city: draft.city.trim(), state: draft.state, zipCode: draft.zipCode.trim(),
      propertyType: draft.propertyType || null, ownership: draft.ownership || null, yearBuilt: year, accessNotes: draft.accessNotes.trim(),
      ...(address?.isDefault ? {} : { isDefault: draft.isDefault }),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#FFD60A] bg-[#FFD60A]/5 p-4 sm:p-5">
      <p className="font-bold text-gray-900">{address ? `Edit “${address.label}”` : "Add an address"}</p>
      <div>
        <span className="text-sm font-medium text-gray-700">Label</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {addressLabels.map((label) => (
            <button key={label} type="button" onClick={() => set("label", label)} aria-pressed={draft.label === label} className={`rounded-full border px-3 py-1 text-sm font-semibold ${draft.label === label ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>{label}</button>
          ))}
          <input aria-label="Custom label" maxLength={40} value={addressLabels.includes(draft.label) ? "" : draft.label} onChange={(e) => set("label", e.target.value)} placeholder="Other…" className="w-32 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm outline-none focus:border-[#FFD60A]" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <label className="block text-sm font-medium text-gray-700">Street address <span className="text-red-500">*</span>
          <input required maxLength={150} autoComplete="address-line1" value={draft.line1} onChange={(e) => set("line1", e.target.value)} placeholder="12 Oak St" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-gray-700">Apt / unit
          <input maxLength={100} autoComplete="address-line2" value={draft.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Apt 4B" className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <label className="block text-sm font-medium text-gray-700">City <span className="text-red-500">*</span>
          <input required maxLength={100} autoComplete="address-level2" value={draft.city} onChange={(e) => set("city", e.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-gray-700">State <span className="text-red-500">*</span>
          <select required autoComplete="address-level1" value={draft.state} onChange={(e) => set("state", e.target.value)} className={fieldClass}>
            <option value="">—</option>
            {US_STATES.map((state) => <option key={state}>{state}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">ZIP <span className="text-red-500">*</span>
          <input required inputMode="numeric" maxLength={10} autoComplete="postal-code" value={draft.zipCode} onChange={(e) => set("zipCode", e.target.value)} className={fieldClass} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-gray-700">Property type
          <select value={draft.propertyType} onChange={(e) => set("propertyType", e.target.value as PropertyType | "")} className={fieldClass}>
            <option value="">Not set</option>
            {Object.entries(propertyTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">You…
          <select value={draft.ownership} onChange={(e) => set("ownership", e.target.value as Ownership | "")} className={fieldClass}>
            <option value="">Not set</option>
            {Object.entries(ownershipLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">Year built
          <input type="number" min={1800} max={thisYear} value={draft.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} placeholder="e.g. 1995" className={fieldClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-gray-700">Access notes for the plumber
        <textarea rows={3} maxLength={500} value={draft.accessNotes} onChange={(e) => set("accessNotes", e.target.value)} placeholder="Gate code, parking, pets, where the water shut-off valve is…" className={fieldClass} />
        <span className="mt-1 block text-right text-xs text-gray-400">{draft.accessNotes.length}/500</span>
      </label>
      {draft.ownership === "renter" && <p className="rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-800">Renting? Your landlord may need to approve larger repairs — add their details as an alternate contact in Contact preferences.</p>}
      {!address?.isDefault && (
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <input type="checkbox" checked={draft.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="h-4 w-4 accent-[#0b1f3b]" /> Use as my default address for bookings
        </label>
      )}
      <Notice>{problem || error}</Notice>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b1f3b] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : address ? "Save address" : "Add address"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
      </div>
    </form>
  );
}
