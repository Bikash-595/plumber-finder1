import type { AccountType } from "@/components/utils/auth";

const options: { label: string; value: AccountType }[] = [
  { label: "Customer", value: "seeker" },
  { label: "Company", value: "company" },
  { label: "Freelancer", value: "freelancer" },
];

/** Customer / Company / Freelancer segmented control. */
export default function AccountTypeSwitch({ value, onChange }: { value: AccountType; onChange: (value: AccountType) => void }) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1">
      {options.map((option) => (
        <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)} className={`rounded-lg px-2 py-2 text-sm font-semibold transition ${value === option.value ? "bg-white text-[#0b1f3b] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
