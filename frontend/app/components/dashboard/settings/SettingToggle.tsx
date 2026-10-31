/** One on/off preference row with a switch. */
export default function SettingToggle({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] focus-visible:ring-offset-2 ${checked ? "bg-[#0b1f3b]" : "bg-gray-300"} disabled:cursor-not-allowed disabled:opacity-50`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full shadow transition-all ${checked ? "left-6 bg-[#FFD60A]" : "left-1 bg-white"}`} />
      </button>
    </div>
  );
}
