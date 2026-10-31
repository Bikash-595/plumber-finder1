import { FaCheck } from "react-icons/fa";
import type { Address, Profile } from "@/components/utils/userApi";

/** How complete the profile is, and the next things to add (each step makes booking faster). */
export default function ProfileCompleteness({ profile, addresses }: { profile: Profile; addresses?: Address[] }) {
  const steps = [
    { label: "Add your name", done: Boolean(profile.name?.trim()) },
    { label: "Verify your email", done: profile.emailVerified !== false },
    { label: "Add a mobile phone", done: Boolean(profile.phone) },
    { label: "Add a profile photo", done: Boolean(profile.avatarUrl) },
    { label: "Save a service address", done: Boolean(addresses?.length) },
    { label: "Choose how to be contacted", done: Boolean(profile.preferredContact) },
  ];
  const done = steps.filter((step) => step.done).length;
  const percent = Math.round((done / steps.length) * 100);
  return (
    <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-gray-900">Profile strength</h2>
        <span className="text-sm font-bold tabular-nums text-gray-900">{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness">
        <div className={`h-full rounded-full transition-all ${percent === 100 ? "bg-emerald-500" : "bg-[#FFD60A]"}`} style={{ width: `${percent}%` }} />
      </div>
      {percent === 100 ? <p className="mt-3 text-sm text-emerald-700">All set — plumbers have everything they need.</p> : (
        <ul className="mt-4 space-y-2 text-sm">
          {steps.map((step) => (
            <li key={step.label} className={`flex items-center gap-2 ${step.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${step.done ? "bg-emerald-100 text-emerald-600" : "border border-gray-300"}`}>{step.done && <FaCheck className="h-2.5 w-2.5" />}</span>
              {step.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
