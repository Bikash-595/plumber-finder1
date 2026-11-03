"use client";

import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import type { Plumber } from "@/components/find/types";
import { useViewerType } from "@/components/dashboard/useUserData";
import ProfileActions from "../ProfileActions";

export const OPEN_ACTIONS_EVENT = "plumberfinder:open-actions";
const isSmallScreen = () => window.matchMedia("(max-width: 1023px)").matches;

/**
 * Save / Compare / Add to cart, placed for each screen size. Laptops and desktops: a card in the sidebar.
 * Phones and tablets: hidden until "Add to my cart" in the bottom bar opens it as a sheet. Company and
 * freelancer accounts never see it.
 */
export default function ActionsPanel({ plumber }: { plumber: Plumber }) {
  const viewer = useViewerType();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => { if (isSmallScreen()) setOpen(true); };
    window.addEventListener(OPEN_ACTIONS_EVENT, show);
    return () => window.removeEventListener(OPEN_ACTIONS_EVENT, show);
  }, []);

  // While open: the page behind doesn't scroll, Escape closes it, and growing to desktop size closes it.
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

  if (viewer === "business") return null;
  return (
    <>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-[69] bg-[#06142a]/60 backdrop-blur-[2px] lg:hidden" aria-hidden />}
      {/* mb-0: the sidebar's space-y spacing must not lift the sheet off the bottom edge. */}
      <div role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label={open ? "Save, compare and add to cart" : undefined}
        className={open
          ? "fixed inset-x-0 bottom-0 z-[70] mb-0 max-h-[85dvh] animate-[sheet-up_.28s_ease-out] overflow-y-auto overscroll-contain rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl lg:static lg:z-auto lg:max-h-none lg:animate-none lg:overflow-visible lg:rounded-none lg:bg-transparent lg:pb-0 lg:shadow-none"
          : "hidden lg:block"}>
        {open && (
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-t-3xl border-b border-gray-100 bg-white/95 px-5 pb-3 pt-2 backdrop-blur lg:hidden">
            <span className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-gray-300" aria-hidden />
            <p className="mt-3 min-w-0 truncate text-sm font-bold text-gray-900">{plumber.companyName}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="mt-3 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600"><FaTimes className="h-3.5 w-3.5" /></button>
          </div>
        )}
        <div className={open ? "p-3 lg:p-0" : ""}><ProfileActions plumber={plumber} /></div>
      </div>
    </>
  );
}
