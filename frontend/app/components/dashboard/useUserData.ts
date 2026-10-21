"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { isCustomerSignedIn, USER_DATA_EVENT } from "@/components/utils/userApi";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);
  window.addEventListener(USER_DATA_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
    window.removeEventListener(USER_DATA_EVENT, onChange);
  };
}

/** Whether a customer is signed in. False during server rendering, so hydration stays consistent. */
export function useCustomerSignedIn() {
  return useSyncExternalStore(subscribe, isCustomerSignedIn, () => false);
}

/**
 * Loads customer data once a customer is signed in. `load` must be a stable function
 * (e.g. userApi.cart). Returns the data plus helpers to replace it after a change.
 */
export function useUserData<T>(load: () => Promise<{ data: T }>) {
  const signedIn = useCustomerSignedIn();
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    load()
      .then(({ data: loaded }) => { if (!cancelled) { setData(loaded); setError(""); } })
      .catch((caught: Error) => { if (!cancelled) setError(caught.message); });
    return () => { cancelled = true; };
  }, [signedIn, load]);

  const reload = useCallback(() => load().then(({ data: loaded }) => { setData(loaded); setError(""); }).catch((caught: Error) => setError(caught.message)), [load]);

  return { signedIn, data, setData, error, setError, loading: signedIn && data === undefined && !error, reload };
}
