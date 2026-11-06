type DetailProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function Detail({ icon, label, value }: DetailProps) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-[#b59a00]">{icon}</span>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium leading-5 text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}
