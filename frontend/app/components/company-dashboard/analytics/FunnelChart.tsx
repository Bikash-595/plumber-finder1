import type { CompanyAnalytics } from "../companyApi";

/** From profile visitor to completed job: each step's count and how many carried on from the step before. */
export default function FunnelChart({ steps }: { steps: CompanyAnalytics["funnel"] }) {
  const top = Math.max(...steps.map((step) => step.value), 1);
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => {
        const before = index ? steps[index - 1].value : null;
        // Only a real drop-off is shown (people can book without calling first, so a step can be bigger than the one before).
        const rate = before && step.value <= before ? Math.round((step.value / before) * 100) : null;
        return (
          <li key={step.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-gray-700">{step.label}</span>
              <span className="tabular-nums"><span className="font-bold text-gray-900">{step.value.toLocaleString()}</span>{rate !== null && <span className="ml-2 text-xs text-gray-500">{rate}% of previous step</span>}</span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#0b1f3b]" style={{ width: `${Math.max(step.value ? 2 : 0, (step.value / top) * 100)}%` }} /></div>
          </li>
        );
      })}
    </ol>
  );
}
