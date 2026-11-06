"use client";

import { FaCheck } from "react-icons/fa";
import { steps } from "./wizardSteps";

/** The wizard's title, progress text and a numbered button per step (saved steps are ticked). */
export default function StepNav({ stepIndex, completedSteps, isLive, isLoading, onStep }: { stepIndex: number; completedSteps: string[]; isLive: boolean; isLoading: boolean; onStep: (index: number) => void }) {
  const step = steps[stepIndex];
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#0b1f3b]">{isLive ? "Your Listing Is Live" : "Company Onboarding"}</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">{isLive ? "Edit Company Listing" : "Add Company Listing"}</h2>
        <p className="mt-2 text-sm text-gray-500">Step {stepIndex + 1} of {steps.length}: {step.title}</p>
        <p className="mt-1 text-xs text-gray-400">{isLoading ? "Loading your saved details…" : isLive ? "Edit any step and save — changes update your public listing right away." : `${completedSteps.length} of ${steps.length} steps saved. Each step is saved when you continue.`}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {steps.map((item, index) => {
          const saved = completedSteps.includes(item.id);
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onStep(index)}
              title={`${item.title}${saved ? " (saved)" : ""}`}
              aria-label={`Step ${index + 1}: ${item.title}${saved ? ", saved" : ""}`}
              aria-current={index === stepIndex ? "step" : undefined}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                index === stepIndex ? "bg-[#0b1f3b] text-white" : saved ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-gray-100 text-gray-600 hover:bg-[#FFD60A]/20"
              }`}
            >
              {saved && index !== stepIndex && <FaCheck className="h-2.5 w-2.5" aria-hidden />}
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
