import { createHash } from "node:crypto";
import { Router } from "express";
import mongoose from "mongoose";
import { mediaSources } from "./mediaSources.js";

// GET /api/media/:kind/:id/:slot/:version — one uploaded picture as a real image file.
// The current version is cached for a year (`immutable`); an old version still answers, but must be revalidated.
// Decoded pictures are kept in a small in-memory cache (most recently used first) so popular ones skip the database.

const DATA_IMAGE = /^data:(image\/(?:png|jpe?g|webp|gif));base64,(.+)$/s;
const CACHE_LIMIT_BYTES = 64 * 1024 * 1024;
const cache = new Map(); // key -> { type, body, etag }
let cachedBytes = 0;

function remember(key, entry) {
  cache.set(key, entry);
  cachedBytes += entry.body.length;
  for (const [oldKey, old] of cache) {
    if (cachedBytes <= CACHE_LIMIT_BYTES) break;
    cache.delete(oldKey);
    cachedBytes -= old.body.length;
  }
}

async function load(source, id, field, index) {
  const doc = await source.Model.findById(id).select(`${field} updatedAt`).lean();
  if (!doc) return null;
  const value = index === undefined ? doc[field] : Array.isArray(doc[field]) ? doc[field][index] : undefined;
  const match = typeof value === "string" ? DATA_IMAGE.exec(value) : null;
  if (!match) return null;
  const body = Buffer.from(match[2], "base64");
  return { type: match[1], body, etag: `"${createHash("sha1").update(body).digest("base64url")}"`, version: doc.updatedAt ? new Date(doc.updatedAt).getTime().toString(36) : "0" };
}

export const mediaRouter = Router();

mediaRouter.get("/:kind/:id/:slot/:version", async (req, res, next) => {
  try {
    const source = mediaSources[req.params.kind];
    const [, field, rawIndex] = /^([a-zA-Z]+)(?:-(\d{1,2}))?$/.exec(req.params.slot) ?? [];
    if (!source || !field || !source.fields.includes(field) || !mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Image not found." });
    const index = rawIndex === undefined ? undefined : Number(rawIndex);

    const key = `${req.params.kind}/${req.params.id}/${req.params.slot}/${req.params.version}`;
    let entry = cache.get(key);
    if (entry) { cache.delete(key); cache.set(key, entry); } // most recently used goes last
    else {
      entry = await load(source, req.params.id, field, index);
      if (!entry) return res.status(404).json({ message: "Image not found." });
      // Only the current version may be cached for good; an old link gets today's picture without the promise.
      entry.immutable = entry.version === req.params.version;
      if (entry.immutable) remember(key, entry);
    }

    res.set({
      "Content-Type": entry.type,
      ETag: entry.etag,
      "Cache-Control": entry.immutable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
      // The website shows these through its own /media/* address (same site), and image optimizers fetch them server-side.
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    if (req.headers["if-none-match"] === entry.etag) return res.status(304).end();
    res.send(entry.body);
  } catch (error) { next(error); }
});

/** Test helper. */
export function clearMediaCache() {
  cache.clear();
  cachedBytes = 0;
}
