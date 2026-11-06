"use client";

export default function Counter({ value, max, ideal }: { value: string; max: number; ideal?: [number, number] }) {
  const n = value.trim().length;
  const good = ideal ? n >= ideal[0] && n <= ideal[1] : true;
  return <span className={`font-normal ${n > max ? "text-red-600" : good ? "text-emerald-600" : "text-gray-400"}`}>{n}/{max}</span>;
}
