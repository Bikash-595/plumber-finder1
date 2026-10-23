import { publishedBlogs } from "./publicFilters.js";

// Card details shared by company and freelancer directory cards: where they are (for "x mi away")
// and how many published blog posts they have.

const validPoint = (lat, lng) => {
  const latitude = Number(lat), longitude = Number(lng);
  return lat !== undefined && lat !== null && lat !== "" && lng !== undefined && lng !== null && lng !== "" && Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
    ? { lat: latitude, lng: longitude }
    : null;
};

/** The first usable coordinate pair from candidates like { lat, lng }. */
export function firstPoint(...candidates) {
  for (const candidate of candidates) {
    const point = candidate && validPoint(candidate.lat, candidate.lng);
    if (point) return point;
  }
  return undefined;
}

/** Published blog post counts per owner id. */
export async function publishedBlogCounts(BlogModel, ownerField, owners) {
  const counts = await BlogModel.aggregate([{ $match: { [ownerField]: { $in: owners }, ...publishedBlogs() } }, { $group: { _id: `$${ownerField}`, count: { $sum: 1 } } }]);
  return new Map(counts.map((row) => [String(row._id), row.count]));
}
