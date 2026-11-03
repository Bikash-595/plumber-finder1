import { FaCrown, FaGem } from "react-icons/fa";

/**
 * The public premium badge: "Premium" (gold outline) or "Top Pro" (Premium Plus, solid gold).
 * `size="sm"` for directory cards, "md" for the profile header.
 */
export default function PremiumBadge({ tier, size = "sm" }: { tier?: "premium" | "elite"; size?: "sm" | "md" }) {
  if (!tier) return null;
  const elite = tier === "elite";
  const Icon = elite ? FaCrown : FaGem;
  const sizes = size === "md" ? "px-2.5 py-1 text-[11px] sm:text-xs" : "px-2 py-0.5 text-[10px]";
  return (
    <span title={elite ? "Premium Plus member" : "Premium member"} className={`inline-flex shrink-0 items-center gap-1 rounded-full font-extrabold uppercase tracking-wide ${sizes} ${elite ? "bg-gradient-to-r from-[#FFD60A] to-[#f5a300] text-[#0b1f3b] shadow" : "border border-[#e3c200] bg-[#fffbea] text-[#7a6400]"}`}>
      <Icon className="h-2.5 w-2.5" aria-hidden /> {elite ? "Top Pro" : "Premium"}
    </span>
  );
}

/** Card frame classes for premium listings in the directory. */
export const premiumCardClass = (tier?: "premium" | "elite") => (tier === "elite" ? "border-[#f5c400] ring-2 ring-[#FFD60A]/60" : tier === "premium" ? "border-[#e3c200]" : "border-gray-200");
