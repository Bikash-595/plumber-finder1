import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Loads admin data and reloads whenever `key` changes (e.g. when the filters change).
 * `load` may change every render; the latest one is always used.
 */
export function useAdminQuery<T>(key: string, load: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState("");
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; });

  const reload = useCallback(() => loadRef.current()
    .then((result) => { setData(result); setError(""); setLoadedKey(key); })
    .catch((caught: Error) => { setError(caught.message); setLoadedKey(key); }), [key]);

  useEffect(() => {
    let cancelled = false;
    loadRef.current()
      .then((result) => { if (!cancelled) { setData(result); setError(""); setLoadedKey(key); } })
      .catch((caught: Error) => { if (!cancelled) { setError(caught.message); setLoadedKey(key); } });
    return () => { cancelled = true; };
  }, [key]);

  return { data, error, setError, loading: loadedKey !== key, reload };
}
