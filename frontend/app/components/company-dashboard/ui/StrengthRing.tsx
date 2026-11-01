/** Profile strength as a ring (a meter, 0–100%), with the number in the middle. */
export default function StrengthRing({ percent, size = 112, label }: { percent: number; size?: number; label?: string }) {
  const stroke = Math.max(8, Math.round(size / 11));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = percent >= 90 ? "#059669" : percent >= 70 ? "#0b1f3b" : percent >= 40 ? "#d4a800" : "#dc2626";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="meter" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? `Profile strength ${percent}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percent / 100)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-extrabold tabular-nums text-gray-900" style={{ fontSize: size / 4.2 }}>{percent}%</span>
      </span>
    </div>
  );
}
