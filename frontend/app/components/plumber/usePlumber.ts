"use client";

import { useEffect, useState } from "react";
import { plumbers } from "@/data/plumbers";
import { fetchLiveProfile } from "@/components/find/companyListing";
import type { Plumber } from "@/components/find/types";

/**
 * A plumber by id: a built-in demo plumber, or a live company's full profile from the backend.
 * `plumber` is undefined while loading and null when it doesn't exist.
 */
export function usePlumber(id: string): Plumber | null | undefined {
  const staticPlumber = plumbers.find((item) => item.id === id);
  const [remote, setRemote] = useState<{ id: string; plumber: Plumber | null } | undefined>(undefined);

  useEffect(() => {
    if (staticPlumber) return;
    let cancelled = false;
    fetchLiveProfile(id).then((plumber) => { if (!cancelled) setRemote({ id, plumber }); });
    return () => { cancelled = true; };
  }, [id, staticPlumber]);

  if (staticPlumber) return staticPlumber;
  return remote?.id === id ? remote.plumber : undefined;
}
