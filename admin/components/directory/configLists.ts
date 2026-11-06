import type { DirectoryConfig, Placement, RankingExclusion } from "@/lib/adminApi";

// The saved lists without the display names the API adds, ready to send back with a change.

export const plainExclusions = (config: DirectoryConfig): RankingExclusion[] =>
  config.settings.exclusions.map(({ providerType, listingId, reason }) => ({ providerType, listingId, reason }));

export const plainPlacements = (config: DirectoryConfig): Placement[] =>
  config.settings.placements.map(({ providerType, listingId, kind, stateCode, citySlug, until, note }) => ({ providerType, listingId, kind, stateCode, citySlug, until, note }));
