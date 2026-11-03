"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBalanceScale, FaCartPlus, FaHeart, FaLock, FaRegHeart } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import { useUserData, useViewerType } from "@/components/dashboard/useUserData";
import { loginPathFor } from "@/components/utils/session";
import { formatMoney, plumberToProvider, userApi } from "@/components/utils/userApi";

/**
 * Save / Compare / Add-to-cart for a plumber profile.
 *  - Customers: the actions work right away.
 *  - Guests: they see the same section; any action takes them to the customer login and back to this page.
 *  - Company and freelancer accounts: not shown (these are customer tools).
 */
export default function ProfileActions({ plumber }: { plumber: Plumber }) {
  const viewer = useViewerType();
  const router = useRouter();
  const pathname = usePathname();
  const provider = plumberToProvider(plumber);
  const saved = useUserData(userApi.saved);
  const compare = useUserData(userApi.compare);
  const options = plumber.services.length ? plumber.services : ["Plumbing service"];
  const [picked, setService] = useState(options[0]);
  // The profile can load its services after this mounts, so fall back to the first one listed.
  const service = options.includes(picked) ? picked : options[0];
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  if (viewer === "business") return null;
  const guest = viewer === "guest";
  const toLogin = () => router.push(loginPathFor("user", pathname));

  const isSaved = saved.data?.some((item) => item.providerId === provider.providerId && item.providerType === provider.providerType) ?? false;
  const inCompare = compare.data?.some((item) => item.providerId === provider.providerId && item.providerType === provider.providerType) ?? false;
  const price = plumber.averageCost > 0 ? plumber.averageCost : 0;

  const act = async (action: () => Promise<unknown>, success: string, after?: () => Promise<unknown>) => {
    if (guest) return toLogin();
    setBusy(true);
    setNotice(null);
    try {
      await action();
      await after?.();
      setNotice({ tone: "success", text: success });
    } catch (caught) {
      setNotice({ tone: "error", text: caught instanceof Error ? caught.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  const pill = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:opacity-60";
  return (
    <section aria-labelledby="profile-actions-heading" className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 id="profile-actions-heading" className="text-base font-bold text-gray-900">Save, compare &amp; add to cart</h2>
        <p className="mt-0.5 text-xs text-gray-500">Keep {plumber.companyName} for later, compare plumbers side by side, or add a service to your cart.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy}
          aria-pressed={guest ? undefined : isSaved}
          onClick={() => act(() => (isSaved ? userApi.unsave(provider) : userApi.save(provider)), isSaved ? "Removed from saved." : "Saved.", saved.reload)}
          className={`${pill} ${isSaved ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          {isSaved ? <FaHeart aria-hidden /> : <FaRegHeart aria-hidden />} {isSaved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          disabled={busy}
          aria-pressed={guest ? undefined : inCompare}
          onClick={() => act(() => (inCompare ? userApi.removeFromCompare(provider) : userApi.addToCompare(provider)), inCompare ? "Removed from compare." : "Added to compare.", compare.reload)}
          className={`${pill} ${inCompare ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          <FaBalanceScale aria-hidden /> {inCompare ? "Comparing" : "Compare"}
        </button>
      </div>

      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          act(() => userApi.addToCart({ providerType: provider.providerType, providerId: provider.providerId, providerName: plumber.companyName, name: service, price, image: provider.image }), `${service} added to your cart.`);
        }}
      >
        <label htmlFor="cart-service" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Add a service to your cart</label>
        <select id="cart-service" value={service} onChange={(event) => setService(event.target.value)} className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          {options.map((name) => <option key={name}>{name}</option>)}
        </select>
        <button type="submit" disabled={busy} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:brightness-95 disabled:opacity-60">
          <FaCartPlus aria-hidden /> Add to cart · {price ? formatMoney(price) : "Quote on visit"}
        </button>
      </form>

      {guest && (
        <p className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-600">
          <FaLock className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" aria-hidden />
          <span><Link href={loginPathFor("user", pathname)} className="font-semibold text-[#0b1f3b] underline">Log in</Link> or <Link href="/signup" className="font-semibold text-[#0b1f3b] underline">create a free account</Link> to save, compare and use your cart.</span>
        </p>
      )}

      {notice && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {notice.text}
          {notice.tone === "success" && notice.text.includes("cart") && <> <Link href="/checkout" className="font-semibold underline">View cart</Link></>}
          {notice.tone === "success" && notice.text.includes("compare") && !notice.text.startsWith("Removed") && <> <Link href="/dashboard/compare" className="font-semibold underline">Compare now</Link></>}
        </p>
      )}
    </section>
  );
}
