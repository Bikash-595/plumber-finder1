"use client";

import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaListUl, FaTimes } from "react-icons/fa";
import ReviewForm, { type Provider } from "./ReviewForm";
import { formatReviewDate, type PFReview, type Viewer } from "./reviewsApi";

type Choice = { kind: "verified"; bookingId: string } | { kind: "directory" };

/**
 * "Write a review": offers a Verified Booking review for each completed booking not reviewed yet, or a Directory
 * review (one per plumber), explains the difference, then shows the form. `initialBooking` preselects a booking
 * (from a review-request link). `editing` opens the form for an existing review instead.
 */
export default function WriteReviewModal({ open, provider, viewer, categories, initialBooking, editing, onSaved, onClose }: {
  open: boolean; provider: Provider; viewer: Viewer; categories: string[]; initialBooking?: string | null; editing?: PFReview | null;
  onSaved: (review: PFReview, message: string) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const eligible = viewer.eligibleBookings;
  const preset = eligible.find((booking) => booking._id === initialBooking);
  const [choice, setChoice] = useState<Choice | null>(() => (preset ? { kind: "verified", bookingId: preset._id } : null));
  // Straight to the form when there's nothing to choose (a preset booking, an edit, or no completed bookings to verify).
  const [step, setStep] = useState<"choose" | "form">(() => (preset || editing || !eligible.length ? "form" : "choose"));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const directoryTaken = Boolean(viewer.directoryReview);
  const selected = choice?.kind === "verified" ? eligible.find((booking) => booking._id === choice.bookingId) ?? null : null;
  const nothingLeft = !eligible.length && directoryTaken;

  return (
    <dialog ref={ref} onClose={onClose} onCancel={onClose} aria-labelledby="write-review-title" className="m-auto max-h-[90dvh] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border-0 p-0 shadow-2xl backdrop:bg-black/40">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
        <h2 id="write-review-title" className="text-lg font-bold text-gray-900">{editing ? "Edit your review" : `Review ${provider.name}`}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"><FaTimes className="h-4 w-4" /></button>
      </div>
      <div className="p-5">
        {editing ? (
          <ReviewForm provider={provider} categories={categories} existing={editing} onSaved={onSaved} onCancel={onClose} />
        ) : step === "form" && (choice || !eligible.length) ? (
          <ReviewForm key={choice?.kind === "verified" ? choice.bookingId : "directory"} provider={provider} categories={categories} booking={selected} onSaved={onSaved} onCancel={() => (eligible.length ? setStep("choose") : onClose())} />
        ) : nothingLeft ? (
          <p className="text-sm text-gray-700">You&apos;ve already reviewed {provider.name}, and every completed booking with them has a review. You can edit your reviews from the Reviews section.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Which kind of review?</p>
            {eligible.map((booking) => (
              <label key={booking._id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${choice?.kind === "verified" && choice.bookingId === booking._id ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" name="review-kind" className="mt-1 accent-emerald-600" checked={choice?.kind === "verified" && choice.bookingId === booking._id} onChange={() => setChoice({ kind: "verified", bookingId: booking._id })} />
                <span>
                  <span className="flex items-center gap-1.5 font-semibold text-gray-900"><FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> Verified Booking review</span>
                  <span className="block text-sm text-gray-600">{booking.service} · <span className="font-mono">{booking.reference}</span>{booking.completedAt ? ` · completed ${formatReviewDate(booking.completedAt)}` : ""}</span>
                  <span className="block text-xs text-gray-500">For a job you booked and completed through PlumberFinder. Shows a Verified Booking label.</span>
                </span>
              </label>
            ))}
            <label className={`flex gap-3 rounded-xl border p-3 ${directoryTaken ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${choice?.kind === "directory" ? "border-[#0b1f3b] ring-1 ring-[#0b1f3b]" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="review-kind" className="mt-1" disabled={directoryTaken} checked={choice?.kind === "directory"} onChange={() => setChoice({ kind: "directory" })} />
              <span>
                <span className="flex items-center gap-1.5 font-semibold text-gray-900"><FaListUl className="h-3.5 w-3.5 text-[#8a7300]" aria-hidden /> Directory review</span>
                <span className="block text-xs text-gray-500">{directoryTaken ? "You've already written one — edit it from the Reviews section." : "Your experience with this plumber, even if you didn't book through PlumberFinder. One per plumber; no Verified label."}</span>
              </span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
              <button type="button" disabled={!choice} onClick={() => setStep("form")} className="rounded-full bg-[#0b1f3b] px-5 py-2 text-sm font-bold text-white disabled:opacity-40">Continue</button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
