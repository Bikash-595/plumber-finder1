import Link from "next/link";
import { FaBolt, FaHeadset, FaShieldHalved, FaStar } from "react-icons/fa6";
import type { dashboardLink } from "@/components/utils/accountLinks";

/** The thin dark bar above the header (scrolls away so the sticky header stays compact). Tablet and up. */
export default function UtilityBar({ signedIn, dashboard }: { signedIn: boolean; dashboard: ReturnType<typeof dashboardLink> }) {
  return (
    <div className="site-nav hidden bg-[#0b1f3b] text-xs text-white/75 md:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <ul className="flex items-center gap-5">
          <li>
            <Link href="/services/emergency-plumbing" className="inline-flex items-center gap-1.5 font-medium text-white hover:text-[#FFD60A]">
              <FaBolt className="h-3 w-3 text-[#FFD60A]" aria-hidden /> 24/7 emergency plumbers
            </Link>
          </li>
          <li className="hidden items-center gap-1.5 lg:inline-flex">
            <FaShieldHalved className="h-3 w-3 text-[#FFD60A]" aria-hidden /> Licensed &amp; verified pros
          </li>
          <li className="hidden items-center gap-1.5 xl:inline-flex">
            <FaStar className="h-3 w-3 text-[#FFD60A]" aria-hidden /> Rated by real customers
          </li>
        </ul>
        <ul className="flex items-center gap-5">
          <li>
            <Link href="/faq" className="inline-flex items-center gap-1.5 hover:text-white">
              <FaHeadset className="h-3 w-3" aria-hidden /> Help Center
            </Link>
          </li>
          <li aria-hidden className="h-3.5 w-px bg-white/20" />
          <li>
            {signedIn ? (
              <Link href={dashboard?.href ?? "/account"} className="font-semibold text-[#FFD60A] hover:underline">{dashboard?.label ?? "My account"}</Link>
            ) : (
              <Link href="/signup" className="font-semibold text-[#FFD60A] hover:underline">Sign up free</Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
