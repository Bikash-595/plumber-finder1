import Link from "next/link";

const frame = "relative block aspect-[16/11] overflow-hidden bg-[#0b1f3b]";

/** The photo area: a link to the service's page when it has one (hidden from screen readers; the name links too). */
export default function MediaFrame({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? <Link href={href} tabIndex={-1} aria-hidden className={frame}>{children}</Link> : <div className={frame}>{children}</div>;
}
