import Image from "next/image";
import Link from "next/link";

/** The Plumber Finder logo and name, linking home. */
export default function Logo({ compactTagline = false }: { compactTagline?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Plumber Finder home">
      <span className="relative h-9 w-9 sm:h-11 sm:w-11">
        <Image src="/Plumber%20(1).png" alt="" fill sizes="44px" className="object-contain" priority />
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-tight text-[#0b1f3b] sm:text-xl">
          Plumber<span className="text-[#d4ad00]">Finder</span>
        </span>
        <span className={`mt-1 text-[11px] font-medium text-slate-500 ${compactTagline ? "hidden sm:block md:hidden xl:block" : "block"}`}>
          Trusted local plumbers
        </span>
      </span>
    </Link>
  );
}
