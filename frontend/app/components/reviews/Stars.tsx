"use client";

import { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

/** Read-only stars (halves for averages like 4.5). */
export function Stars({ value, size = "h-4 w-4", label }: { value: number; size?: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#FFD60A]" role="img" aria-label={label ?? `${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (value >= star ? <FaStar key={star} className={size} /> : value >= star - 0.5 ? <FaStarHalfAlt key={star} className={size} /> : <FaRegStar key={star} className={`${size} text-gray-300`} />))}
    </span>
  );
}

const words = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Pick 1–5 stars (keyboard: arrow keys move, like radio buttons). */
export function StarPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" role="radio" aria-checked={value === star} aria-label={`${star} star${star === 1 ? "" : "s"} — ${words[star]}`} tabIndex={value === star || (!value && star === 1) ? 0 : -1}
            onMouseEnter={() => setHover(star)} onClick={() => onChange(star)}
            onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); onChange(Math.min(5, (value || 0) + 1)); } if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); onChange(Math.max(1, (value || 2) - 1)); } }}
            className="p-0.5 text-3xl transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]">
            {shown >= star ? <FaStar className="text-[#FFD60A]" /> : <FaRegStar className="text-gray-300" />}
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700">{words[shown] ?? ""}</span>
    </div>
  );
}
