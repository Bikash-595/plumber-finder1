"use client";

import { readStoredUser } from "@/components/utils/auth";
import { USER_DATA_EVENT } from "@/components/utils/userApi";

/**
 * A tiny in-memory cache for the signed-in customer's data (stale-while-revalidate):
 *  - pages render instantly from the last answer when you come back to them, then refresh in the background;
 *  - identical requests made at the same time (navbar badge + dashboard home + sidebar) share one network call;
 *  - any change (USER_DATA_EVENT, sent by every userApi mutation) marks everything stale;
 *  - signing out or switching account empties it, so one customer never sees another's data.
 * Lookups are O(1) Map reads; the cache only ever holds one customer's handful of entries.
 */
type Entry = { value?: unknown; at: number; version: number; promise?: Promise<unknown>; promiseVersion?: number };

const FRESH_FOR_MS = 30_000;
const entries = new Map<unknown, Entry>();
let owner = "";
let version = 0;

if (typeof window !== "undefined") window.addEventListener(USER_DATA_EVENT, () => { version += 1; });

function entryFor(key: unknown): Entry {
  const current = readStoredUser()?.accessToken ?? "";
  if (current !== owner) { entries.clear(); owner = current; }
  let entry = entries.get(key);
  if (!entry) entries.set(key, (entry = { at: 0, version: -1 }));
  return entry;
}

/** The last value loaded for `key`, or undefined. */
export function readCache<T>(key: unknown): T | undefined {
  return entryFor(key).value as T | undefined;
}

/** True when `key` was loaded recently and nothing has changed since. */
export function isFresh(key: unknown) {
  const entry = entryFor(key);
  return entry.value !== undefined && entry.version === version && Date.now() - entry.at < FRESH_FOR_MS;
}

/** Store a value (e.g. after an optimistic update) so other screens see it too. */
export function writeCache(key: unknown, value: unknown) {
  Object.assign(entryFor(key), { value, at: Date.now(), version });
}

/**
 * Load `key`, sharing one in-flight request between every caller that asks at the same time.
 * A request that started before the latest change is not reused, so callers never get pre-change data.
 */
export function fetchShared<T>(key: unknown, load: () => Promise<T>): Promise<T> {
  const entry = entryFor(key);
  if (entry.promise && entry.promiseVersion === version) return entry.promise as Promise<T>;
  const startedAt = version;
  const promise = load()
    // An older request that finishes late must not overwrite a newer answer.
    .then((value) => { if (startedAt >= entry.version) Object.assign(entry, { value, at: Date.now(), version: startedAt }); return value; })
    .finally(() => { if (entry.promise === promise) entry.promise = undefined; });
  Object.assign(entry, { promise, promiseVersion: startedAt });
  return promise;
}
