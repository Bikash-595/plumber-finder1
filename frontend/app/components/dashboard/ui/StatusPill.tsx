import type { ReactNode } from "react";
import { toneClasses, type Tone } from "./tones";

/** Small rounded status label, e.g. "Confirmed" or "Paid". */
export default function StatusPill({ tone = "neutral", icon, children }: { tone?: Tone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses[tone].pill}`}>
      {icon}
      {children}
    </span>
  );
}
