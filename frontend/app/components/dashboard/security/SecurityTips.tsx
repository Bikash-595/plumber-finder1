import { FaShieldAlt } from "react-icons/fa";

const tips = [
  "Use a password you don't use on any other site.",
  "Plumber Finder will never ask for your password by email or phone.",
  "Pay only through your invoices — never send card numbers in messages.",
  "Two-factor authentication is coming soon.",
];

export default function SecurityTips() {
  return (
    <aside className="rounded-2xl border border-[#FFD60A]/50 bg-[#FFD60A]/10 p-5">
      <p className="flex items-center gap-2 font-bold text-gray-900"><FaShieldAlt className="h-4 w-4 text-[#8a7300]" /> Staying safe</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-700">{tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
    </aside>
  );
}
