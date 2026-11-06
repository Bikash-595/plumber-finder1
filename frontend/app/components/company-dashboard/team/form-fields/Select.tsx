"use client";

import { months } from "./months";

export default function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[]; placeholder?: string }) { return <label><span className="text-sm font-semibold text-gray-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFD60A]"><option value="">{placeholder ?? "Select an option"}</option>{options.map((option, index) => <option key={option} value={options === months ? index + 1 : option}>{option}</option>)}</select></label>; }
