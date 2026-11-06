"use client";

/** Demo content shown until the first real record exists; it is never saved. */
export default function ExampleCard({ itemName, children }: { itemName: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-[#FFD60A] bg-[#FFD60A]/5 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#b59a00]">Example {itemName} — disappears when you start adding your own</p>
      <div className="opacity-80">{children}</div>
    </div>
  );
}
