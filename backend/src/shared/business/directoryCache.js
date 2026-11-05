import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";

// The public directories (GET /api/companies/public, /api/freelancers/public) are the busiest reads on the site and
// the same for every visitor. Each one is built once, kept as ready-to-send JSON (plain and gzipped), and shared by
// every request until it is older than MAX_AGE_MS or something that shows on a card changes (see invalidateDirectories).
// Requests that arrive while it is being rebuilt wait for that one build instead of starting their own.
// With several API servers each keeps its own copy; MAX_AGE_MS bounds how stale another server's copy can be.

const MAX_AGE_MS = 30_000;
const entries = new Map(); // name -> { at, generation, json, gzip, etag } | { pending: Promise }
let generation = 0;

/** Marks every cached directory as out of date (called after any change that a directory card shows). */
export function invalidateDirectories() {
  generation += 1;
}

/** A number that changes whenever directory data changes (rankings use it to know when to rebuild). */
export const directoryVersion = () => generation;

async function build(name, load) {
  const startedAt = generation;
  const json = Buffer.from(JSON.stringify({ data: await load() }));
  const entry = { at: Date.now(), generation: startedAt, json, gzip: gzipSync(json, { level: 6 }), etag: `"${createHash("sha1").update(json).digest("base64url")}"` };
  entries.set(name, entry);
  return entry;
}

function current(name, load) {
  const entry = entries.get(name);
  if (entry?.json && entry.generation === generation && Date.now() - entry.at < MAX_AGE_MS) return entry;
  if (entry?.pending && entry.generation === generation) return entry.pending;
  const pending = build(name, load).catch((error) => { entries.delete(name); throw error; });
  entries.set(name, { pending, generation });
  return pending;
}

/** Express handler that answers with the cached directory `name`, built by `load()` (which returns the data array). */
export function cachedDirectory(name, load) {
  return async (req, res, next) => {
    try {
      const entry = await current(name, load);
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
export function clearDirectoryCache() {
  entries.clear();
}
