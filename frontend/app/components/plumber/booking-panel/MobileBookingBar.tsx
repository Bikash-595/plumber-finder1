"use client";

import { FaCalendarCheck, FaCartPlus, FaPhoneAlt, FaStar } from "react-icons/fa";
import { useViewerType } from "@/components/dashboard/useUserData";
import { OPEN_ACTIONS_EVENT } from "../profile-actions/ActionsPanel";
import type { Plumber } from "@/components/find/types";
import { splitPrice } from "../services/serviceVisuals";

/** Lowest listed price, e.g. "From $89", or null. */
function startingPrice(plumber: Plumber) {
  const amounts = (plumber.serviceDetails ?? []).map((service) => splitPrice(service.price)?.amount).filter((value): value is number => typeof value === "number" && value > 0);
  return amounts.length ? `From $${Math.min(...amounts).toLocaleString("en-US")}` : null;
}

/**
 * Phones and tablets: a bar pinned to the bottom of the screen. Left: "Add to my cart" (opens Save / Compare /
 * Add to cart) for customers and guests, or the price and rating for company/freelancer accounts. Right: Call and Book now.
 */
export default function MobileBookingBar({ plumber, onBook, hidden }: { plumber: Plumber; onBook: () => void; hidden: boolean }) {
  const viewer = useViewerType();
  const price = startingPrice(plumber);
  const phone = plumber.phone?.replace(/[^\d+]/g, "");
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(11,31,59,0.12)] backdrop-blur transition-transform duration-300 lg:hidden ${hidden ? "translate-y-full" : "translate-y-0"}`} aria-hidden={hidden}>
      <div className="mx-auto flex max-w-xl items-center gap-2">
        {viewer === "business" ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-[#0b1f3b]">{price ?? plumber.companyName}</p>
            <p className="flex items-center gap-1 truncate text-xs text-gray-500">
              {plumber.reviewCount > 0 ? <><FaStar className="h-3 w-3 text-[#FFD60A]" aria-hidden /> {plumber.rating.toFixed(1)} · {plumber.reviewCount} review{plumber.reviewCount === 1 ? "" : "s"}</> : plumber.isEmergency ? "24/7 emergency service" : "Free booking request"}
            </p>
          </div>
        ) : (
          <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_ACTIONS_EVENT))} tabIndex={hidden ? -1 : undefined} className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3 text-left active:scale-[0.98]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#FFD60A]/25 text-[#0b1f3b]"><FaCartPlus className="h-3.5 w-3.5" aria-hidden /></span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-extrabold text-[#0b1f3b]">Add to my cart</span>
              <span className="block truncate text-[11px] text-gray-500">{price ?? "Save · Compare"}</span>
            </span>
          </button>
        )}
        {phone && <a href={`tel:${phone}`} tabIndex={hidden ? -1 : undefined} aria-label={`Call ${plumber.companyName}`} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gray-200 bg-white text-[#0b1f3b]"><FaPhoneAlt className="h-4 w-4" /></a>}
        <button type="button" onClick={onBook} tabIndex={hidden ? -1 : undefined} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FFD60A] to-[#f5c400] px-5 text-sm font-extrabold text-[#0b1f3b] shadow-md active:scale-[0.98]">
          <FaCalendarCheck className="h-4 w-4" aria-hidden /> Book now
        </button>
      </div>
    </div>
  );
}
