"use client";

import { useState, type FormEvent } from "react";
import { FaLock } from "react-icons/fa";
import type { PaymentMethod } from "@/components/utils/userApi";
import { brandLabel } from "./PaymentMethodCard";

type Values = { brand: PaymentMethod["brand"]; last4: string; expMonth: number; expYear: number; holderName?: string };
const blank = { brand: "visa" as PaymentMethod["brand"], last4: "", expMonth: "", expYear: "", holderName: "" };
const input = "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** Saves a card's display details only (brand, last 4, expiry) — never the full number. */
export default function AddCardForm({ busy, onSave, onCancel }: { busy: boolean; onSave: (values: Values) => Promise<boolean>; onCancel: () => void }) {
  const [card, setCard] = useState(blank);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (await onSave({ brand: card.brand, last4: card.last4, expMonth: Number(card.expMonth), expYear: Number(card.expYear), holderName: card.holderName || undefined })) setCard(blank);
  };
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:grid-cols-2">
      <label className="text-sm font-medium text-gray-700">Card brand
        <select value={card.brand} onChange={(e) => setCard({ ...card, brand: e.target.value as PaymentMethod["brand"] })} className={input}>
          {Object.entries(brandLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="text-sm font-medium text-gray-700">Last 4 digits
        <input required inputMode="numeric" pattern="\d{4}" maxLength={4} placeholder="4242" value={card.last4} onChange={(e) => setCard({ ...card, last4: e.target.value.replace(/\D/g, "") })} className={input} />
      </label>
      <label className="text-sm font-medium text-gray-700">Expiry month
        <input required type="number" min={1} max={12} placeholder="MM" value={card.expMonth} onChange={(e) => setCard({ ...card, expMonth: e.target.value })} className={input} />
      </label>
      <label className="text-sm font-medium text-gray-700">Expiry year
        <input required type="number" min={new Date().getFullYear()} max={2100} placeholder="YYYY" value={card.expYear} onChange={(e) => setCard({ ...card, expYear: e.target.value })} className={input} />
      </label>
      <label className="text-sm font-medium text-gray-700 sm:col-span-2">Name on card <span className="font-normal text-gray-400">(optional)</span>
        <input autoComplete="cc-name" value={card.holderName} onChange={(e) => setCard({ ...card, holderName: e.target.value })} className={input} />
      </label>
      <p className="flex items-center gap-2 text-xs text-gray-500 sm:col-span-2"><FaLock className="h-3 w-3" /> We only store the brand, last 4 digits and expiry — never your full card number.</p>
      <div className="flex gap-2 sm:col-span-2">
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : "Save card"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
      </div>
    </form>
  );
}
