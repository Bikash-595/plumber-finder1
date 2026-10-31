"use client";

import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

/**
 * Search input that reports its value 300 ms after typing stops, so a fast typist sends one
 * request instead of one per key press.
 */
export default function SearchBox({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  const [text, setText] = useState(value);
  useEffect(() => {
    if (text === value) return;
    const timer = window.setTimeout(() => onChange(text.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [text, value, onChange]);

  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{label}</span>
      <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden />
      <input type="search" value={text} onChange={(event) => setText(event.target.value)} placeholder={placeholder}
        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-9 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
      {text && (
        <button type="button" onClick={() => { setText(""); onChange(""); }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
          <FaTimes className="h-3.5 w-3.5" />
        </button>
      )}
    </label>
  );
}
