// Config-driven validation shared by every profile section (company and freelancer).
// Only fields declared in a section's config are accepted; anything else in the body is ignored,
// so clients can never set `company`, `_id`, or other server-owned fields.

// SVG is deliberately excluded: it can carry scripts. The dashboard uploader converts photos to WebP.
const DATA_IMAGE = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;
const DATA_MEDIA = /^data:(image\/(png|jpe?g|webp|gif)|video\/(mp4|webm|quicktime));base64,[A-Za-z0-9+/=]+$/;
const HTTP_URL = /^https?:\/\/\S+$/i;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})(T[\d:.]+(Z|[+-]\d{2}:?\d{2})?)?$/;
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const DEFAULT_MAX = { string: 300, text: 5000, image: 1_300_000, media: 6_000_000 };

export const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function coerce(spec, raw) {
  switch (spec.type) {
    case "string":
    case "text": {
      if (typeof raw !== "string") return { error: "must be text" };
      const value = raw.trim();
      const max = spec.max ?? DEFAULT_MAX[spec.type];
      if (value.length > max) return { error: `must be ${max} characters or fewer` };
      if (spec.pattern && !spec.pattern.test(value)) return { error: spec.patternMessage ?? "has an invalid format" };
      if (spec.uppercase) return { value: value.toUpperCase() };
      return { value };
    }
    case "image":
    case "media": {
      if (typeof raw !== "string") return { error: "must be an image URL or uploaded file" };
      const value = raw.trim();
      const max = spec.max ?? DEFAULT_MAX[spec.type];
      if (value.length > max) return { error: "file is too large" };
      const pattern = spec.type === "image" ? DATA_IMAGE : DATA_MEDIA;
      if (!pattern.test(value) && !HTTP_URL.test(value)) return { error: `must be an http(s) URL or an uploaded ${spec.type === "image" ? "image" : "image or video"}` };
      return { value };
    }
    case "boolean": {
      if (typeof raw === "boolean") return { value: raw };
      if (raw === "true" || raw === "false") return { value: raw === "true" };
      return { error: "must be true or false" };
    }
    case "number": {
      const value = typeof raw === "number" ? raw : typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
      if (!Number.isFinite(value)) return { error: "must be a number" };
      if (spec.integer && !Number.isInteger(value)) return { error: "must be a whole number" };
      const max = typeof spec.max === "function" ? spec.max() : spec.max;
      if (spec.min !== undefined && value < spec.min) return { error: `must be at least ${spec.min}` };
      if (max !== undefined && value > max) return { error: `must be at most ${max}` };
      return { value };
    }
    case "date": {
      const match = typeof raw === "string" ? raw.trim().match(ISO_DATE) : null;
      const value = match ? new Date(raw.trim()) : null;
      // Reject impossible calendar dates such as 2026-02-30 (JavaScript would roll it over to March 2).
      const [, year, month, day] = (match ?? []).map(Number);
      const daysInMonth = month >= 1 && month <= 12 ? new Date(Date.UTC(year, month, 0)).getUTCDate() : 0;
      if (!value || Number.isNaN(value.getTime()) || day < 1 || day > daysInMonth) {
        return { error: "must be a valid date (YYYY-MM-DD)" };
      }
      if (year < MIN_YEAR || year > MAX_YEAR) return { error: `must be between ${MIN_YEAR} and ${MAX_YEAR}` };
      return { value };
    }
    case "enum": {
      if (!spec.values.includes(raw)) return { error: `must be one of: ${spec.values.join(", ")}` };
      return { value: raw };
    }
    case "list": {
      // Accepts ["a", "b"] or "a, b" and stores a clean array of strings.
      const items = Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(",") : null;
      if (!items || !items.every((item) => typeof item === "string")) return { error: "must be a list of text values" };
      const value = [...new Set(items.map((item) => item.trim()).filter(Boolean))];
      if (value.length > (spec.maxItems ?? 50)) return { error: `must have ${spec.maxItems ?? 50} items or fewer` };
      if (value.some((item) => item.length > (spec.max ?? 80))) return { error: `items must be ${spec.max ?? 80} characters or fewer` };
      return { value };
    }
    case "objects": {
      // A list of small records, each validated against `spec.fields` (e.g. service areas with their services).
      if (!Array.isArray(raw) || !raw.every(isPlainObject)) return { error: "must be a list of objects" };
      if (raw.length > (spec.maxItems ?? 50)) return { error: `must have ${spec.maxItems ?? 50} items or fewer` };
      const value = [];
      for (const [index, item] of raw.entries()) {
        const result = validateFields(spec.fields, item);
        const [field, problem] = Object.entries(result.errors)[0] ?? [];
        if (field) return { error: `item ${index + 1}: ${field} ${problem}` };
        value.push(result.values);
      }
      return { value };
    }
    default:
      throw new Error(`Unknown field type: ${spec.type}`);
  }
}

/**
 * Validates `body` against a field map. With `partial: true` (updates), missing fields are left alone;
 * otherwise required fields must be present. Empty strings / null clear optional fields, falling back to
 * the field's `default` when it has one (e.g. a blog status reverts to "draft", not null).
 */
export function validateFields(fields, body, { partial = false } = {}) {
  if (!isPlainObject(body)) return { values: {}, errors: { body: "must be a JSON object" } };
  const values = {};
  const errors = {};

  for (const [name, spec] of Object.entries(fields)) {
    const raw = body[name];
    if (raw === undefined) {
      if (spec.required && !partial) errors[name] = "is required";
      continue;
    }
    const isEmpty = raw === null || (typeof raw === "string" && raw.trim() === "") || (Array.isArray(raw) && raw.length === 0);
    if (isEmpty) {
      if (spec.required) errors[name] = "is required";
      else values[name] = spec.default !== undefined ? spec.default : spec.type === "list" || spec.type === "objects" ? [] : null;
      continue;
    }
    const result = coerce(spec, raw);
    if (result.error) errors[name] = result.error;
    else values[name] = result.value;
  }

  return { values, errors };
}
