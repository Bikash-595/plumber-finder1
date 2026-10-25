"use client";

import Link from "next/link";
import { FaBuilding, FaCheckCircle, FaHardHat, FaHome } from "react-icons/fa";

type AccountChoice = "seeker" | "company" | "freelancer";

interface SignupChooseTypeProps {
  accountType: AccountChoice | null;
  onSelectType: (type: AccountChoice) => void;
  onContinue: () => void;
  /** Which choices to offer (the business signup only offers company and freelancer). */
  types?: AccountChoice[];
  title?: string;
  loginHref?: string;
}

const choices = [
  { value: "seeker" as const, icon: FaHome, title: "I need a plumber", text: "Find, compare, and book verified plumbers near you." },
  { value: "company" as const, icon: FaBuilding, title: "I run a plumbing company", text: "List your business, show your team, and get customer leads." },
  { value: "freelancer" as const, icon: FaHardHat, title: "I'm an independent plumber", text: "Create your profile and get booked for jobs in your area." },
];

/** Step 1 of signup: which kind of account. */
export default function SignupChooseType({ accountType, onSelectType, onContinue, types, title = "Create your account", loginHref = "/login" }: SignupChooseTypeProps) {
  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm text-gray-600">Already have one? <Link href={loginHref} className="font-bold text-[#0b1f3b] hover:underline">Log in</Link></p>

      <div role="radiogroup" aria-label="Account type" className="mt-6 space-y-3">
        {choices.filter((choice) => !types || types.includes(choice.value)).map(({ value, icon: Icon, title, text }) => {
          const selected = accountType === value;
          return (
            <button key={value} type="button" role="radio" aria-checked={selected} onClick={() => onSelectType(value)} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${selected ? "border-[#0b1f3b] bg-[#FFD60A]/10" : "border-gray-200 bg-white hover:border-gray-300"}`}>
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${selected ? "bg-[#0b1f3b] text-[#FFD60A]" : "bg-gray-100 text-gray-500"}`}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block font-bold text-gray-900">{title}</span><span className="block text-sm text-gray-600">{text}</span></span>
              <FaCheckCircle className={`h-5 w-5 shrink-0 ${selected ? "text-[#0b1f3b]" : "text-gray-200"}`} aria-hidden />
            </button>
          );
        })}
      </div>

      <button type="button" onClick={onContinue} disabled={!accountType} className="mt-6 w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:cursor-not-allowed disabled:opacity-40">Continue</button>
    </>
  );
}
