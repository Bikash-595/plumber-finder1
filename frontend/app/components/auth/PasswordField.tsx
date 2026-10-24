"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete: string; showStrength?: boolean; right?: React.ReactNode };

function strength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}
const labels = ["Too short", "Weak", "Okay", "Good", "Strong"];
const colors = ["bg-red-400", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];

/** Password input with a show/hide toggle and an optional strength meter. */
export default function PasswordField({ id, label, value, onChange, autoComplete, showStrength = false, right }: Props) {
  const [visible, setVisible] = useState(false);
  const score = value.length < 8 ? 0 : strength(value);
  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
        {right}
      </div>
      <div className="relative mt-1.5">
        <input id={id} type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} placeholder="At least 8 characters" className="block w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
        <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700">{visible ? <FaEyeSlash /> : <FaEye />}</button>
      </div>
      {showStrength && value && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex flex-1 gap-1" aria-hidden>{[0, 1, 2, 3].map((index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index < score ? colors[score] : "bg-gray-200"}`} />)}</div>
          <span className="text-xs font-medium text-gray-500">{labels[score]}</span>
        </div>
      )}
    </div>
  );
}
