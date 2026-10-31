"use client";

import { useEffect, useState } from "react";
import { fetchLiveProfile } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";
import type { ListItem } from "@/components/utils/userApi";
import { fetchShared } from "../dataCache";

/**
 * Full profiles for the (at most 3) plumbers being compared, fetched in parallel and cached by id.
 * Only those few profiles are loaded — never the whole directory. The demo data is code-split and
 * only downloaded when a demo plumber is in the comparison.
 */
async function loadProfile(id: string): Promise<Plumber | null> {
  const live = await fetchLiveProfile(id);
  if (live) return live;
  const { plumbers } = await import("@/data/plumbers");
  return plumbers.find((plumber) => plumber.id === id) ?? null;
}

export function useCompareDetails(items: ListItem[] | undefined) {
  const ids = (items ?? []).map((item) => item.providerId);
  const idsKey = ids.join("|");
  const [profiles, setProfiles] = useState<Record<string, Plumber | null>>({});

  useEffect(() => {
    if (!idsKey) return;
    let cancelled = false;
    Promise.all(idsKey.split("|").map(async (id) => [id, await fetchShared(`profile:${id}`, () => loadProfile(id)).catch(() => null)] as const))
      .then((entries) => { if (!cancelled) setProfiles((current) => ({ ...current, ...Object.fromEntries(entries) })); });
    return () => { cancelled = true; };
  }, [idsKey]);

  return { profiles, loading: ids.some((id) => !(id in profiles)) };
}
