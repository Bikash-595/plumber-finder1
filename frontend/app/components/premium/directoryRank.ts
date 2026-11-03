import type { Plumber } from "@/components/find/types";

const rankOf = (plumber: Plumber) => (plumber.premiumTier === "elite" ? 2 : plumber.premiumTier === "premium" ? 1 : 0);

/**
 * Directory order: Premium Plus first, then Premium, then free — keeping the order inside each group
 * (e.g. nearest first). Stable, so distance sorting still works within each tier.
 */
export function premiumFirst<T extends Plumber>(plumbers: T[]): T[] {
  return plumbers.map((plumber, index) => ({ plumber, index })).sort((a, b) => rankOf(b.plumber) - rankOf(a.plumber) || a.index - b.index).map(({ plumber }) => plumber);
}
