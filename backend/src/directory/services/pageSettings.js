import { DirectoryPage } from "../models/DirectoryPage.js";

// Admin settings for landing pages and locations (models/DirectoryPage.js). There are only as many documents as
// pages an admin changed, so all of them are kept in memory: read at most every CACHE_MS, and at once after a save.

const CACHE_MS = 30_000;
let cached = null;
let version = 0;

/** "usa", "state:TX", "city:TX/austin" — the key of a whole location. */
export const locationKey = (stateCode, citySlug) => (!stateCode ? "usa" : citySlug ? `city:${stateCode}/${citySlug}` : `state:${stateCode}`);

async function all() {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.byKey;
  const docs = await DirectoryPage.find().select("key kind published title description intro updatedBy updatedAt").lean();
  cached = { at: Date.now(), byKey: new Map(docs.map((doc) => [doc.key, doc])) };
  return cached.byKey;
}

/**
 * Whether a page can be shown and the admin's wording for it. A page is hidden when it, its city, its state or
 * (for USA pages) the USA location is unpublished. `stateCode` null = a USA page.
 */
export async function pageSettings(path, stateCode, citySlug) {
  const byKey = await all();
  const keys = [locationKey(stateCode, null), ...(citySlug ? [locationKey(stateCode, citySlug)] : [])];
  const hiddenBy = keys.find((key) => byKey.get(key)?.published === false) ?? (byKey.get(path)?.published === false ? path : null);
  const page = byKey.get(path);
  return {
    published: !hiddenBy,
    hiddenBy,
    title: page?.title || null,
    description: page?.description || null,
    intro: page?.intro || null,
  };
}

/** Every stored setting (admin lists). */
export async function storedPageSettings() {
  return [...(await all()).values()];
}

/** Saves an admin's change; a page back at every default is deleted, so only real overrides are stored. */
export async function savePageSetting({ key, kind, published, title, description, intro }, adminName) {
  const isDefault = published !== false && !title && !description && !intro;
  if (isDefault) await DirectoryPage.deleteOne({ key });
  else await DirectoryPage.updateOne({ key }, { $set: { kind, published: published !== false, title: title || "", description: description || "", intro: intro || "", updatedBy: adminName ?? "" } }, { upsert: true });
  cached = null;
  version += 1;
}

/** A number that changes when page settings change (result caches key on it). */
export const pageSettingsVersion = () => version;

/** Test helper. */
export const resetPageSettings = () => { cached = null; version += 1; };
