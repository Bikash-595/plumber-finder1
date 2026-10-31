import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa, FaCreditCard, FaTrash } from "react-icons/fa";
import type { PaymentMethod } from "@/components/utils/userApi";

export const brandLabel: Record<PaymentMethod["brand"], string> = { visa: "Visa", mastercard: "Mastercard", amex: "American Express", discover: "Discover", other: "Card" };
const brandIcon = { visa: FaCcVisa, mastercard: FaCcMastercard, amex: FaCcAmex, discover: FaCcDiscover, other: FaCreditCard };

/** A saved card drawn like a card: brand, last 4 digits, expiry, default badge and actions. */
export default function PaymentMethodCard({ method, busy, onMakeDefault, onRemove }: { method: PaymentMethod; busy: boolean; onMakeDefault: () => void; onRemove: () => void }) {
  const Icon = brandIcon[method.brand];
  const now = new Date();
  const expired = method.expYear < now.getFullYear() || (method.expYear === now.getFullYear() && method.expMonth < now.getMonth() + 1);
  return (
    <div>
      <article className={`relative flex aspect-[1.7/1] max-h-52 flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-md ${method.isDefault ? "bg-gradient-to-br from-[#0b1f3b] via-[#17345a] to-[#24507f]" : "bg-gradient-to-br from-gray-700 to-gray-900"}`}>
        <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />
        <div className="flex items-start justify-between">
          <Icon className="h-9 w-9" aria-label={brandLabel[method.brand]} />
          <div className="flex items-center gap-2">
            {method.isDefault && <span className="rounded-full bg-[#FFD60A] px-2.5 py-0.5 text-xs font-bold text-[#0b1f3b]">Default</span>}
            {expired && <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold">Expired</span>}
          </div>
        </div>
        <p className="font-mono text-lg tracking-[0.2em]">•••• •••• •••• {method.last4}</p>
        <div className="flex items-end justify-between gap-3 text-xs">
          <div className="min-w-0">
            <p className="uppercase text-white/60">Card holder</p>
            <p className="truncate font-semibold">{method.holderName || brandLabel[method.brand]}</p>
          </div>
          <div className="text-right">
            <p className="uppercase text-white/60">Expires</p>
            <p className="font-semibold">{String(method.expMonth).padStart(2, "0")}/{String(method.expYear).slice(-2)}</p>
          </div>
        </div>
      </article>
      <div className="mt-2 flex items-center justify-end gap-1">
        {!method.isDefault && <button type="button" disabled={busy} onClick={onMakeDefault} className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#0b1f3b] hover:bg-[#FFD60A]/20 disabled:opacity-60">Make default</button>}
        <button type="button" disabled={busy} onClick={onRemove} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"><FaTrash className="h-3 w-3" /> Remove</button>
      </div>
    </div>
  );
}
