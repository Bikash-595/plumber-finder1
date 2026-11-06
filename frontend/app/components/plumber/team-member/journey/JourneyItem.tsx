type JourneyItemProps = {
  year: string | number;
  title: string;
  detail: string;
  last?: boolean;
};

export default function JourneyItem({
  year,
  title,
  detail,
  last = false,
}: JourneyItemProps) {
  return (
    <div className="relative pb-7 pl-24 last:pb-0">
      <span className="absolute left-0 top-0.5 text-sm font-bold text-[#b59a00]">
        {year}
      </span>

      {!last && (
        <span className="absolute left-[77px] top-7 h-[calc(100%-8px)] w-px bg-slate-200" />
      )}

      <span className="absolute left-[72px] top-1.5 h-3 w-3 rounded-full bg-[#FFD60A] ring-4 ring-[#FFD60A]/20" />

      <h3 className="font-bold text-slate-800">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {detail}
      </p>
    </div>
  );
}
