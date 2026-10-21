import { createPublicKey } from "node:crypto";
import { appleConfig } from "../config/appleConfig.js";

let cache = { fetchedAt: 0, keys: new Map() };

async function fetchKeys() {
  let response;
  try {
    response = await fetch(appleConfig.keysUrl, { signal: AbortSignal.timeout(5000) });
  } catch {
    throw Object.assign(new Error("Apple sign-in is temporarily unavailable. Please try again."), { status: 503, expose: true });
  }
  if (!response.ok) throw Object.assign(new Error("Apple sign-in is temporarily unavailable. Please try again."), { status: 503, expose: true });
  const { keys = [] } = await response.json();
  cache = { fetchedAt: Date.now(), keys: new Map(keys.map((jwk) => [jwk.kid, createPublicKey({ key: jwk, format: "jwk" })])) };
}

// Unknown key ids trigger at most one refresh per minute, so forged tokens cannot make us hammer Apple.
const MIN_REFRESH_MS = 60 * 1000;

/** Returns Apple's public key for `kid`, refreshing the cached key set when it is stale or the kid is new (key rotation). */
export async function getAppleSigningKey(kid) {
  const age = Date.now() - cache.fetchedAt;
  if (age > appleConfig.keysCacheMs || (!cache.keys.has(kid) && age > MIN_REFRESH_MS)) await fetchKeys();
  return cache.keys.get(kid) ?? null;
}

/** Test helper: forget cached keys. */
export function clearAppleKeyCache() {
  cache = { fetchedAt: 0, keys: new Map() };
}
