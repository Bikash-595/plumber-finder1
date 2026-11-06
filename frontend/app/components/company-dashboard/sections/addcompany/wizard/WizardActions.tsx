"use client";

import { FaArrowRight, FaChevronLeft, FaSave, FaTrash } from "react-icons/fa";

const secondary = "inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A] hover:text-[#0b1f3b] disabled:cursor-not-allowed disabled:opacity-50";

/** Back, Clear step, Save, and Save & Continue / Submit (or Next Step once the listing is live). */
export default function WizardActions({ isFirstStep, isLastStep, isLive, disabled, submitting, canClear, onBack, onClear, onSave, onNext }: {
  isFirstStep: boolean; isLastStep: boolean; isLive: boolean; disabled: boolean; submitting: boolean; canClear: boolean;
  onBack: () => void; onClear: () => void; onSave: () => void; onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
      <button type="button" onClick={onBack} disabled={isFirstStep} className={secondary}>
        <FaChevronLeft className="mr-2 h-4 w-4" /> Back
      </button>
      {canClear && (
        <button type="button" onClick={onClear} disabled={disabled} className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:mr-auto">
          <FaTrash className="mr-2 h-3.5 w-3.5" /> Clear step
        </button>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onSave} disabled={disabled} className={secondary}>
          <FaSave className="mr-2 h-4 w-4" /> {isLive ? "Save Changes" : "Save"}
        </button>
        {isLive ? (
          !isLastStep && (
            <button type="button" onClick={onNext} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b1f3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111b35]">
              Next Step <FaArrowRight className="ml-2 h-4 w-4" />
            </button>
          )
        ) : (
          <button type="submit" disabled={disabled} className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isLastStep ? "bg-[#FFD60A] text-[#0b1f3b] hover:bg-[#e6c000]" : "bg-[#0b1f3b] text-white hover:bg-[#111b35]"}`}>
            {submitting ? (isLastStep ? "Publishing…" : "Saving…") : isLastStep ? "Save & Submit Listing" : <>Save & Continue <FaArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}
