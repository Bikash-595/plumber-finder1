"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

/** A side panel (native <dialog>: focus is trapped, Escape closes) for details next to a list. */
export default function Drawer({ open, title, subtitle, onClose, children, footer }: { open: boolean; title: ReactNode; subtitle?: ReactNode; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose} onClick={(event) => { if (event.target === ref.current) onClose(); }}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-xl border-0 bg-transparent p-0 backdrop:bg-black/40">
      <div className="flex h-full flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="min-w-0"><h2 className="truncate text-lg font-bold text-gray-900">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}</div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"><FaTimes className="h-4 w-4" /></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <footer className="border-t border-gray-100 px-5 py-3 sm:px-6">{footer}</footer>}
      </div>
    </dialog>
  );
}
