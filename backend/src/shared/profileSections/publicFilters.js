// What the public may see of a company's or freelancer's sections.

// Published posts whose publish date has arrived (a future date schedules the post).
export const publishedBlogs = () => ({ status: "published", publishDate: { $lte: new Date() } });

// Projects the owner hasn't hidden.
export const visibleProjects = () => ({ visible: true });

// Active offers within their dates; offers run through the whole of their end date (stored as midnight UTC).
export function currentOffers() {
  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return {
    active: true,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $gte: startOfToday } }] },
    ],
  };
}
