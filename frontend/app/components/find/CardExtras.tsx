import { FaBlog, FaTag } from "react-icons/fa";
import type { Plumber } from "./types";

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

/** Card row: the current special offer, team members, and published blog posts. */
export default function CardExtras({ plumber, compact = false }: { plumber: Plumber; compact?: boolean }) {
  const team = plumber.teamMembers ?? [];
  const blogCount = plumber.blogs?.length ?? plumber.blogCount ?? 0;
  const offer = plumber.discount;
  if (!team.length && !blogCount && !offer) return null;
  // "Sam Rivera +2": the first member by name, everyone else as a count.
  const extraTeam = Math.max(0, Math.max(plumber.teamSize || 0, team.length) - 1);

  return (
    <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-gray-600 ${compact ? "" : "sm:text-xs"}`}>
      {offer && (
        <span className="inline-flex max-w-full items-center gap-1 truncate rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700" title={plumber.promoCode ? `Code ${plumber.promoCode}` : undefined}>
          <FaTag className="h-2.5 w-2.5 shrink-0" /> <span className="truncate">{offer}{plumber.promoCode && !compact ? ` · ${plumber.promoCode}` : ""}{(plumber.couponCount ?? 0) > 1 ? ` +${plumber.couponCount! - 1} code${plumber.couponCount! > 2 ? "s" : ""}` : ""}</span>
        </span>
      )}
      {team.length > 0 && (
        <span className="inline-flex min-w-0 items-center gap-1.5" title={team.map((member) => `${member.name}${member.role ? ` (${member.role})` : ""}`).join(", ")}>
          <span className="flex -space-x-1.5" aria-hidden>
            {team.slice(0, 3).map((member) => (
              <span key={member.id} className="grid h-5 w-5 place-items-center rounded-full border border-white bg-[#0b1f3b] text-[9px] font-bold text-white">{initials(member.name)}</span>
            ))}
          </span>
          <span className="truncate">{team[0].name}{extraTeam > 0 ? ` +${extraTeam}` : ""}</span>
        </span>
      )}
      {blogCount > 0 && (
        <span className="inline-flex items-center gap-1"><FaBlog className="h-3 w-3" /> {blogCount} blog post{blogCount === 1 ? "" : "s"}</span>
      )}
    </div>
  );
}
