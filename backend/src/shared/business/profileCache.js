import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";

// Public profile pages (GET /api/{companies|freelancers}/public/:id/profile) take ~35 database reads each.
// The built answer is kept (plain and gzipped) for MAX_AGE_MS and shared by every visitor of that profile.
// It is dropped at once when its owner saves anything (invalidateProfiles(owner)) or an admin, a review or a
// payment changes something (invalidateProfiles() with no owner). Other API servers' copies expire after MAX_AGE_MS.

const MAX_AGE_MS = 15_000;
const MAX_BYTES = 64 * 1024 * 1024;
const entries = new Map(); // "type:key" -> { at, startedTick, owner, json, gzip, etag } | { pending }
// A counter that moves on every change. A copy is valid only if it was started at or after its owner's (and the
// global) last change, so a save that lands while a profile is being built is never marked as included.
let tick = 0;
let globalChangedAt = 0;
const ownerChangedAt = new Map();
let bytes = 0;

/** Ends the cached profiles of one owner ("company:<id>" / "freelancer:<id>"), or of everyone when no owner is given. */
export function invalidateProfiles(owner) {
  tick += 1;
  if (owner) ownerChangedAt.set(owner, tick);
  else globalChangedAt = tick;
}

function forget(key) {
  const old = entries.get(key);
  if (old?.json) bytes -= old.json.length + old.gzip.length;
  entries.delete(key);
}

function store(key, entry) {
  forget(key);
  entries.set(key, entry);
  bytes += entry.json.length + entry.gzip.length;
  for (const oldKey of entries.keys()) {
    if (bytes <= MAX_BYTES) break;
    forget(oldKey);
  }
}

const isFresh = (entry) => entry.startedTick >= globalChangedAt && entry.startedTick >= (ownerChangedAt.get(entry.owner) ?? 0) && Date.now() - entry.at < MAX_AGE_MS;

async function build(key, load, req) {
  const startedTick = tick;
  const result = await load(req); // { owner, data } or null (not found)
  if (!result) return null;
  const json = Buffer.from(JSON.stringify({ data: result.data }));
  const entry = { at: Date.now(), startedTick, owner: result.owner, json, gzip: gzipSync(json, { level: 6 }), etag: `"${createHash("sha1").update(json).digest("base64url")}"` };
  store(key, entry);
  return entry;
}

/**
 * Express handler for a cached public profile. `load(req)` returns { owner: "company:<id>", data } or null;
 * `notFound` is the 404 message.
 */
export function cachedProfile(type, load, notFound) {
  return async (req, res, next) => {
    try {
      const key = `${type}:${String(req.params.id).toLowerCase()}`;
      let entry = entries.get(key);
      if (entry?.json && isFresh(entry)) { entries.delete(key); entries.set(key, entry); } // most recently used goes last
      else if (entry?.pending) entry = await entry.pending;
      else {
        const pending = build(key, load, req).finally(() => { if (entries.get(key)?.pending === pending) entries.delete(key); });
        entries.set(key, { pending });
        entry = await pending;
      }
      if (!entry) return res.status(404).json({ message: notFound });
      res.set({ "Content-Type": "application/json; charset=utf-8", ETag: entry.etag, Vary: "Accept-Encoding", "Cache-Control": "public, max-age=0, must-revalidate" });
      if (req.headers["if-none-match"] === entry.etag) return res.status(304).end();
      if (/\bgzip\b/.test(String(req.headers["accept-encoding"] ?? ""))) {
        res.set("Content-Encoding", "gzip");
        return res.send(entry.gzip);
      }
      res.send(entry.json);
    } catch (error) { next(error); }
  };
}

/** Test helper. */
export function clearProfileCache() {
  entries.clear();
  ownerChangedAt.clear();
  bytes = 0;
}
