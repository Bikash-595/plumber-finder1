"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import BookingWidget from "../BookingWidget";
import MobileBookingBar from "./MobileBookingBar";

const isSmallScreen = () => window.matchMedia("(max-width: 1023px)").matches;

/**
 * The booking form, placed for each screen size. Laptops and desktops: a card in the sidebar that scrolls
 * with the page. Phones and tablets: a bar pinned to the bottom ("Book now") that opens the same form as a
 * sheet sliding up from the bottom. There is only ever one form on the page, so its id="booking" stays unique.
 * On small screens the sheet also opens from a service's Book button, any link to #booking, and applying a coupon.
 */
export default function BookingPanel({ plumber, initialService }: { plumber: Plumber; initialService?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openOnSmall = () => { if (isSmallScreen()) setOpen(true); };
    const onHash = () => { if (window.location.hash === "#booking") openOnSmall(); };
    // Any "Book now" link to #booking on this page (the header button, "Book this service" …), every time it's tapped.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href="#booking"]');
      if (link && isSmallScreen()) { event.preventDefault(); setOpen(true); }
    };
    const events = ["plumberfinder:book-service", "plumberfinder:apply-coupon"];
    events.forEach((name) => window.addEventListener(name, openOnSmall));
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    onHash(); // e.g. arriving from "Book" on the all-services page
    return () => {
      events.forEach((name) => window.removeEventListener(name, openOnSmall));
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // While the sheet is open: the page behind doesn't scroll, Escape closes it, and growing to desktop size closes it.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onResize = () => { if (!isSmallScreen()) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open]);

  return (
    <>
      {/* Phones: a dimmed backdrop (tap to close) and the sheet pinned to the bottom of the screen.
          mb-0: the sidebar's space-y spacing must not lift the sheet off the bottom edge. */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-[69] bg-[#06142a]/60 backdrop-blur-[2px] lg:hidden" aria-hidden />}
      <div role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? `Book ${plumber.companyName}` : undefined}
        className={open
          ? "fixed inset-x-0 bottom-0 z-[70] mb-0 max-h-[92dvh] animate-[sheet-up_.28s_ease-out] overflow-y-auto overscroll-contain rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl lg:static lg:z-auto lg:max-h-none lg:animate-none lg:overflow-visible lg:rounded-none lg:bg-transparent lg:pb-0 lg:shadow-none"
          : "mb-0 hidden lg:block"}>
        {open && (
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-3xl border-b border-gray-100 bg-white/95 px-5 pb-3 pt-2 backdrop-blur lg:hidden">
            <span className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-gray-300" aria-hidden />
            <p className="mt-3 min-w-0 truncate text-sm font-bold text-gray-900">Book {plumber.companyName}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close booking form" className="mt-3 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600"><FaTimes className="h-3.5 w-3.5" /></button>
          </div>
        )}
        <div className={open ? "p-3 lg:p-0" : ""}>
          <BookingWidget plumber={plumber} initialService={initialService} />
        </div>
      </div>
      {/* Room at the end of the page so the bottom bar never covers the last section. */}
      <div className="h-24 lg:hidden" aria-hidden />
      <MobileBookingBar plumber={plumber} onBook={() => setOpen(true)} hidden={open} />
    </>
  );
}
