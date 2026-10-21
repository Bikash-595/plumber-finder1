"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBalanceScale, FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import { useUserData } from "@/components/dashboard/useUserData";
import { formatMoney, plumberToProvider, userApi } from "@/components/utils/userApi";

/** Save / Compare / Add-to-cart for a plumber profile. Guests are asked to log in. */
export default function ProfileActions({ plumber }: { plumber: Plumber }) {
  const provider = plumberToProvider(plumber);
  const saved = useUserData(userApi.saved);
  const compare = useUserData(userApi.compare);
  const [service, setService] = useState(plumber.services[0] ?? "Plumbing service");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const isSaved = saved.data?.some((item) => item.providerId === provider.providerId && item.providerType === provider.providerType) ?? false;
  const inCompare = compare.data?.some((item) => item.providerId === provider.providerId && item.providerType === provider.providerType) ?? false;
  const price = plumber.averageCost > 0 ? plumber.averageCost : 0;

  const act = async (action: () => Promise<unknown>, success: string, after?: () => Promise<unknown>) => {
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

  if (!saved.signedIn) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
        <Link href="/login" className="font-semibold text-[#0b1f3b] underline">Log in</Link> to save this plumber, compare it with others, or add services to your cart.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy}
          aria-pressed={isSaved}
          onClick={() => act(() => (isSaved ? userApi.unsave(provider) : userApi.save(provider)), isSaved ? "Removed from saved." : "Saved.", saved.reload)}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${isSaved ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          {isSaved ? <FaHeart aria-hidden /> : <FaRegHeart aria-hidden />} {isSaved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          disabled={busy}
          aria-pressed={inCompare}
          onClick={() => act(() => (inCompare ? userApi.removeFromCompare(provider) : userApi.addToCompare(provider)), inCompare ? "Removed from compare." : "Added to compare.", compare.reload)}
          className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${inCompare ? "border-[#0b1f3b] bg-[#0b1f3b] text-white" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
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
        <select id="cart-service" value={service} onChange={(event) => setService(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          {(plumber.services.length ? plumber.services : ["Plumbing service"]).map((name) => <option key={name}>{name}</option>)}
        </select>
        <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFD60A] px-4 py-2.5 text-sm font-bold text-[#0b1f3b] transition hover:brightness-95 disabled:opacity-60">
          <FaCartPlus aria-hidden /> Add to cart · {price ? formatMoney(price) : "Quote on visit"}
        </button>
      </form>

      {notice && (
        <p className={`rounded-lg px-3 py-2 text-sm ${notice.tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {notice.text}
          {notice.tone === "success" && notice.text.includes("cart") && <> <Link href="/checkout" className="font-semibold underline">View cart</Link></>}
          {notice.tone === "success" && notice.text.includes("compare") && !notice.text.startsWith("Removed") && <> <Link href="/dashboard/compare" className="font-semibold underline">Compare now</Link></>}
        </p>
      )}
    </div>
  );
}
