type HeroStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function HeroStat({ icon, label, value }: HeroStatProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 sm:px-10">
      <span className="text-[#FFD60A]">{icon}</span>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/55">
          {label}
        </p>

        <p className="mt-0.5 font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
