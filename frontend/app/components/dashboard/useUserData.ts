"use client";

import { useCallback, useEffect, useEffectEvent, useState, useSyncExternalStore } from "react";
import { isCustomerSignedIn, USER_DATA_EVENT, type Page } from "@/components/utils/userApi";
import { fetchShared, isFresh, readCache, writeCache } from "./dataCache";

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

const message = (caught: unknown) => (caught instanceof Error ? caught.message : "Something went wrong.");

/**
 * Loads customer data once a customer is signed in. `load` must be a stable function (e.g. userApi.cart);
 * it is also the cache key, so every screen using the same `load` shares one cached answer and one request.
 * Shows cached data instantly, refreshes when stale, after any change, and when the tab regains focus.
 */
export function useUserData<T>(load: () => Promise<{ data: T }>) {
  const signedIn = useCustomerSignedIn();
  const [state, setState] = useState<{ data?: T; error: string }>(() => ({ data: signedIn ? readCache<T>(load) : undefined, error: "" }));

  const request = useCallback(() => fetchShared(load, () => load().then(({ data }) => data)), [load]);
  const apply = useEffectEvent((data: T) => setState({ data, error: "" }));
  const fail = useEffectEvent((caught: unknown) => setState((current) => ({ ...current, error: message(caught) })));

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    const sync = (force: boolean) => {
      const pending = !force && isFresh(load) ? Promise.resolve(readCache<T>(load) as T) : request();
      pending.then((data) => { if (!cancelled) apply(data); }).catch((caught) => { if (!cancelled) fail(caught); });
    };
    sync(false);
    const onChange = () => sync(true);
    const onFocus = () => { if (!isFresh(load)) sync(true); };
    window.addEventListener(USER_DATA_EVENT, onChange);
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener(USER_DATA_EVENT, onChange);
      window.removeEventListener("focus", onFocus);
    };
  }, [signedIn, load, request]);

  const setData = useCallback((data: T | undefined) => {
    setState((current) => ({ ...current, data }));
    writeCache(load, data);
  }, [load]);
  const setError = useCallback((error: string) => setState((current) => ({ ...current, error })), []);
  const reload = useCallback(() => request().then((data) => setState({ data, error: "" })).catch((caught) => setError(message(caught))), [request, setError]);

  return { signedIn, data: state.data, setData, error: state.error, setError, loading: signedIn && state.data === undefined && !state.error, reload };
}

type PagedState<T, Extra> = { key: string; items: T[]; extra: Partial<Extra>; nextCursor: string | null; loaded: boolean; loadingMore: boolean; error: string };
const blank = <T, Extra>(key: string): PagedState<T, Extra> => ({ key, items: [], extra: {}, nextCursor: null, loaded: false, loadingMore: false, error: "" });
const fromPage = <T, Extra>(key: string, { data, nextCursor, ...extra }: Page<T, Extra>): PagedState<T, Extra> => ({ key, items: data, extra: extra as Partial<Extra>, nextCursor, loaded: true, loadingMore: false, error: "" });

/**
 * A long list read one page at a time (newest first) with "Load more".
 *  - `key` names the list and its filters (e.g. "bookings?status=pending"); changing it starts again at page one.
 *  - `fetchPage(cursor)` loads one page; null is the first page.
 * The first page is cached per key, so returning to a list (or a filter tab) is instant while it refreshes.
 * Only one page (20–50 rows) is ever requested at a time, however long the customer's history grows.
 */
export function usePagedList<T, Extra = object>(key: string, fetchPage: (cursor: string | null) => Promise<Page<T, Extra>>) {
  const signedIn = useCustomerSignedIn();
  const cacheKey = `page:${key}`;
  const [state, setState] = useState<PagedState<T, Extra>>(() => blank(key));
  const loadPage = useEffectEvent((cursor: string | null) => fetchPage(cursor));

  // While a new key loads, show its cached first page (or an empty, loading list) instead of the old key's rows.
  const cached = readCache<Page<T, Extra>>(cacheKey);
  const current: PagedState<T, Extra> = state.key === key ? state : cached ? fromPage(key, cached) : blank(key);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    fetchShared(cacheKey, () => loadPage(null))
      .then((page) => { if (!cancelled) setState(fromPage(key, page)); })
      .catch((caught) => { if (!cancelled) setState({ ...blank<T, Extra>(key), loaded: true, error: message(caught) }); });
    return () => { cancelled = true; };
  }, [signedIn, key, cacheKey]);

  const loadMore = async () => {
    if (!current.nextCursor || current.loadingMore) return;
    setState({ ...current, loadingMore: true });
    try {
      const page = await fetchPage(current.nextCursor);
      setState((latest) => (latest.key === key ? { ...latest, items: [...latest.items, ...page.data], nextCursor: page.nextCursor, loadingMore: false } : latest));
    } catch (caught) {
      setState((latest) => ({ ...latest, loadingMore: false, error: message(caught) }));
    }
  };

  const reload = async () => {
    try { setState(fromPage(key, await fetchShared(cacheKey, () => fetchPage(null)))); } catch (caught) { setState((latest) => ({ ...latest, error: message(caught) })); }
  };

  /** Change the rows already on screen (optimistic updates). */
  const update = (change: (items: T[]) => T[], extra?: Partial<Extra>) => setState((latest) => ({ ...(latest.key === key ? latest : current), items: change((latest.key === key ? latest : current).items), extra: { ...(latest.key === key ? latest : current).extra, ...extra } }));
  const setError = (error: string) => setState((latest) => ({ ...latest, error }));

  return {
    signedIn,
    items: current.items,
    extra: current.extra,
    hasMore: Boolean(current.nextCursor),
    loading: signedIn && !current.loaded && !current.error,
    loadingMore: current.loadingMore,
    error: current.error,
    setError,
    loadMore,
    reload,
    update,
  };
}
