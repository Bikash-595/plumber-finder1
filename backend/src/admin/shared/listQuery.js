// Pagination + safe text search shared by the admin list endpoints.
export const MAX_PAGE_SIZE = 100;

export function pagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

/** Case-insensitive "contains" search over the given fields; regex characters in the input are escaped. */
export function searchFilter(search, fields) {
  const text = typeof search === "string" ? search.trim().slice(0, 100) : "";
  if (!text) return {};
  const pattern = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return { $or: fields.map((field) => ({ [field]: pattern })) };
}

/** Runs a paginated find and returns { data, page, limit, total }. */
export async function paginatedList(Model, filter, query, { sort = { createdAt: -1 }, select } = {}) {
  const { page, limit, skip } = pagination(query);
  const [data, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(skip).limit(limit).select(select ?? "").lean(),
    Model.countDocuments(filter),
  ]);
  return { data, page, limit, total };
}
