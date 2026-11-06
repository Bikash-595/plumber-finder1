export default function StateContentColumn({
  number,
  title,
  items,
  border = true,
}: {
  number: string;
  title: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div className={`p-6 sm:p-7 ${border ? "border-b border-slate-200 md:border-b-0 md:border-r" : ""}`}>
      <span className="text-sm font-extrabold text-[#756100]">{number}</span>
      <h3 className="mt-3 text-lg font-bold text-[#0f2a4d]">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD60A]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
