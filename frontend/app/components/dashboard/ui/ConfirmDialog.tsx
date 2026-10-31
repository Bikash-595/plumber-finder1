"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  tone?: "danger" | "primary";
  /** Show a text box (e.g. a cancellation reason) and pass its value to onConfirm. */
  reasonLabel?: string;
  busy?: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

/** Accessible confirmation dialog (native <dialog>), used instead of window.confirm/prompt. */
export default function ConfirmDialog({ open, title, message, confirmLabel, tone = "danger", reasonLabel, busy, onConfirm, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => { setReason(""); onClose(); };

  return (
    <dialog ref={ref} onClose={close} onCancel={close} className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border-0 p-0 shadow-2xl backdrop:bg-black/40">
      <form method="dialog" onSubmit={(event) => { event.preventDefault(); onConfirm(reason.trim()); setReason(""); }} className="space-y-4 p-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {message && <p className="text-sm text-gray-600">{message}</p>}
        {reasonLabel && (
          <label className="block text-sm font-medium text-gray-700">{reasonLabel}
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} maxLength={500} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={close} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">Keep it</button>
          <button type="submit" disabled={busy} className={`rounded-full px-5 py-2 text-sm font-bold text-white disabled:opacity-60 ${tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#0b1f3b] hover:bg-[#17345a]"}`}>{busy ? "Working…" : confirmLabel}</button>
        </div>
      </form>
    </dialog>
  );
}
