// Turns uploaded images (data URLs) in public responses into short links: /media/<kind>/<id>/<field>[-<n>]/<version>.
// The link is relative to the website, which forwards /media/* to GET /api/media/* (frontend next.config.ts).
// The version changes whenever the record is saved, so browsers and CDNs may cache each link forever.
// Links (http/https), videos and empty values are returned unchanged.

const DATA_IMAGE = /^data:image\//;

const versionOf = (doc) => (doc?.updatedAt ? new Date(doc.updatedAt).getTime().toString(36) : "0");

/** The public link for one image value, or the value itself when it isn't an uploaded image. */
export function mediaUrl(kind, doc, field, value, index) {
  if (typeof value !== "string" || !DATA_IMAGE.test(value) || !doc?._id) return value;
  return `/media/${kind}/${doc._id}/${index === undefined ? field : `${field}-${index}`}/${versionOf(doc)}`;
}

const MARKER = "data:image/";
const markerFor = (value) => ({ $cond: [{ $eq: [{ $substrCP: [{ $ifNull: [value, ""] }, 0, MARKER.length] }, MARKER] }, MARKER, value] });

/**
 * An aggregation stage that swaps uploaded images for a short marker inside MongoDB, so list queries don't send
 * megabytes of pictures to the server only to replace them with links. withMediaUrls() turns the marker into the link.
 * `listFields` hold arrays of images.
 */
export function mediaMarkers(fields, listFields = []) {
  return {
    $set: Object.fromEntries([
      ...fields.map((field) => [field, markerFor(`$${field}`)]),
      ...listFields.map((field) => [field, { $cond: [{ $isArray: `$${field}` }, { $map: { input: `$${field}`, as: "item", in: markerFor("$$item") } }, `$${field}`] }]),
    ]),
  };
}

/** A copy of `doc` with every listed image field (single values and lists) replaced by its link. */
export function withMediaUrls(kind, doc, fields) {
  if (!doc) return doc;
  const copy = { ...doc };
  for (const field of fields) {
    const value = copy[field];
    if (Array.isArray(value)) copy[field] = value.map((item, index) => mediaUrl(kind, doc, field, item, index));
    else if (value !== undefined) copy[field] = mediaUrl(kind, doc, field, value);
  }
  return copy;
}
