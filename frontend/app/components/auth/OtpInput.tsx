"use client";

import { useRef } from "react";

/** Six single-digit boxes: typing moves forward, Backspace moves back, pasting fills them all. */
export default function OtpInput({ value, onChange, disabled = false, length = 6 }: { value: string; onChange: (value: string) => void; disabled?: boolean; length?: number }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  };

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="6-digit code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { inputs.current[index] = element; }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => {
            const typed = event.target.value.replace(/\D/g, "");
            if (!typed) return setDigit(index, "");
            setDigit(index, typed.slice(-1));
            inputs.current[index + 1]?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit) inputs.current[index - 1]?.focus();
            if (event.key === "ArrowLeft") inputs.current[index - 1]?.focus();
            if (event.key === "ArrowRight") inputs.current[index + 1]?.focus();
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!pasted) return;
            event.preventDefault();
            onChange(pasted);
            inputs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className="h-14 w-full min-w-0 rounded-xl border border-gray-300 text-center text-2xl font-bold text-[#0b1f3b] outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/40 disabled:bg-gray-50"
        />
      ))}
    </div>
  );
}
