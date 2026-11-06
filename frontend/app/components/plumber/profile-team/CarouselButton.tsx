"use client";

export default function CarouselButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-700 transition hover:border-[#FFD60A] hover:bg-[#FFD60A]/10">{children}</button>;
}
