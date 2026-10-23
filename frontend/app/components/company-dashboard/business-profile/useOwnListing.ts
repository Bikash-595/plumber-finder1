"use client";

import { useEffect, useState } from "react";
import { companyApi } from "./companyApi";

type OwnListing = { _id: string; slug: string; companyName: string; isPublished: boolean };

/** The signed-in company's public listing (null if it has none yet, undefined while loading). */
export function useOwnListing(): OwnListing | null | undefined {
  const [listing, setListing] = useState<OwnListing | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    companyApi<{ listing: OwnListing | null }>("/companies/onboarding")
      .then(({ data }) => { if (!cancelled) setListing(data.listing); })
      .catch(() => { if (!cancelled) setListing(null); });
    return () => { cancelled = true; };
  }, []);
  return listing;
}
