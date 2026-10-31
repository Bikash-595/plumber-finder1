import mongoose from "mongoose";

/**
 * Keyset ("cursor") pagination for a customer's lists, newest first.
 * Pages are read with `_id < cursor` on an index that starts with the owner field and ends in `_id`
 * (e.g. { user: 1, _id: -1 }), so every page costs O(log n + limit) however long the list grows —
 * unlike skip/offset, which re-reads every earlier row.
 *
 * Query: ?limit=1-50 (default 20) &cursor=<_id of the last item on the previous page>
 * Returns { data, nextCursor } — nextCursor is null on the last page.
 */
export function pageParams(query, { defaultLimit = 20, maxLimit = 50 } = {}) {
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  const cursor = typeof query.cursor === "string" && mongoose.isValidObjectId(query.cursor) ? new mongoose.Types.ObjectId(query.cursor) : null;
  return { limit, cursor };
}

export async function findPage(Model, filter, { limit, cursor }, select) {
  // One extra row tells us whether another page exists without a separate count.
  const rows = await Model.find(cursor ? { ...filter, _id: { $lt: cursor } } : filter).sort({ _id: -1 }).limit(limit + 1).select(select ?? "").lean();
  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;
  return { data, nextCursor: hasMore ? String(data.at(-1)._id) : null };
}

export const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

/** Case-insensitive "contains" match on a few fields, with the search text escaped (no regex injection). */
export function textFilter(text, fields) {
  const value = typeof text === "string" ? text.trim().slice(0, 80) : "";
  if (!value) return {};
  const pattern = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return { $or: fields.map((field) => ({ [field]: pattern })) };
}

/** { pending: 2, completed: 5, ... } from a $group on `status`, with every known status present. */
export function countsByStatus(groups, statuses) {
  const counts = Object.fromEntries(statuses.map((status) => [status, 0]));
  for (const { _id, count } of groups) if (_id in counts) counts[_id] = count;
  return counts;
}
