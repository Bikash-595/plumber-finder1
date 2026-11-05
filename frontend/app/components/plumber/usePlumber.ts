"use client";

import { useEffect, useState } from "react";
import { plumbers } from "@/data/plumbers";
import { fetchLiveProfile } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";

// Profiles already opened in this tab (profile → a service page → back is instant). A remembered profile is shown
// at once and always re-checked in the background, so changes made in a dashboard still appear.
const MAX_REMEMBERED = 30;
const remembered = new Map<string, Plumber | null>();
const pending = new Map<string, Promise<Plumber | null>>();

function loadProfile(id: string): Promise<Plumber | null> {
  if (!pending.has(id)) {
    pending.set(id, fetchLiveProfile(id).then((plumber) => {
      remembered.delete(id);
      remembered.set(id, plumber);
      if (remembered.size > MAX_REMEMBERED) remembered.delete(remembered.keys().next().value!);
      return plumber;
    }).finally(() => pending.delete(id)));
  }
  return pending.get(id)!;
}

/**
 * A plumber by id: a built-in demo plumber, or a live company's full profile from the backend.
 * `plumber` is undefined while loading and null when it doesn't exist.
 */
export function usePlumber(id: string): Plumber | null | undefined {
  const staticPlumber = plumbers.find((item) => item.id === id);
  const [remote, setRemote] = useState<{ id: string; plumber: Plumber | null } | undefined>(() => (remembered.has(id) ? { id, plumber: remembered.get(id)! } : undefined));

  useEffect(() => {
    if (staticPlumber) return;
    let cancelled = false;
    loadProfile(id).then((plumber) => { if (!cancelled) setRemote({ id, plumber }); });
    return () => { cancelled = true; };
  }, [id, staticPlumber]);

  if (staticPlumber) return staticPlumber;
  if (remote?.id === id) return remote.plumber;
  return remembered.has(id) ? remembered.get(id) : undefined;
}
