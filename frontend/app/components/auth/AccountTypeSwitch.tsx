import type { AccountType } from "@/components/utils/auth";

const options: { label: string; value: AccountType }[] = [
  { label: "Customer", value: "seeker" },
  { label: "Company", value: "company" },
  { label: "Freelancer", value: "freelancer" },
];

/** Customer / Company / Freelancer segmented control (or only some of them, e.g. the business login). */
export default function AccountTypeSwitch({ value, onChange, types }: { value: AccountType; onChange: (value: AccountType) => void; types?: AccountType[] }) {
  const shown = types ? options.filter((option) => types.includes(option.value)) : options;
  return (
    <div role="radiogroup" aria-label="Account type" className={`grid gap-1 rounded-xl bg-gray-100 p-1 ${shown.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {shown.map((option) => (
        <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)} className={`rounded-lg px-2 py-2 text-sm font-semibold transition ${value === option.value ? "bg-white text-[#0b1f3b] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
