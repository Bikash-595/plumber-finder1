import mongoose from "mongoose";
import { PAGE_TEMPLATES, RANKING_FACTORS, rankingDefaults } from "../config/rankingDefaults.js";
import { stateByCode } from "../config/usStates.js";
import { RankingConfiguration } from "../models/RankingConfiguration.js";

// The ranking settings in use: the admin's saved values over the defaults. Read at most every CACHE_MS
// (and at once on this server after a save).

const CACHE_MS = 30_000;
let cached = null;
let version = 0;

const NUMBER_RULES = {
  ratingConfidenceReviews: [0, 100], jobsForFullScore: [1, 10_000], engagementForFullScore: [1, 1_000_000],
  newBusinessDays: [0, 730], newBusinessPenalty: [0, 0.9], minimumQualifyingCompanies: [1, 50], defaultResultLimit: [10, 50], sponsoredSlots: [0, 5],
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const freshTemplates = () => Object.fromEntries(PAGE_TEMPLATES.map(({ key }) => [key, { ...rankingDefaults.templates[key] }]));

function merge(doc) {
  const settings = { ...rankingDefaults, weights: { ...rankingDefaults.weights }, templates: freshTemplates() };
  if (!doc) return settings;
  for (const factor of RANKING_FACTORS) if (Number.isFinite(doc.weights?.[factor.key])) settings.weights[factor.key] = doc.weights[factor.key];
  for (const key of Object.keys(NUMBER_RULES)) if (Number.isFinite(doc[key])) settings[key] = doc[key];
  settings.exclusions = (doc.exclusions ?? []).map((item) => ({ providerType: item.providerType, listingId: String(item.listingId), reason: item.reason ?? "" }));
  settings.placements = (doc.placements ?? []).map((item) => ({ providerType: item.providerType, listingId: String(item.listingId), kind: item.kind ?? "sponsored", stateCode: item.stateCode ?? null, citySlug: item.citySlug ?? null, until: item.until ?? null, note: item.note ?? "" }));
  for (const { key } of PAGE_TEMPLATES) {
    const saved = doc.templates?.[key];
    if (!saved) continue;
    for (const field of ["title", "description"]) if (typeof saved[field] === "string") settings.templates[key][field] = saved[field];
    for (const field of ["showMap", "showFaq"]) if (typeof saved[field] === "boolean") settings.templates[key][field] = saved[field];
  }
  return settings;
}

export async function rankingConfig() {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.settings;
  const doc = await RankingConfiguration.findOne({ key: "default" }).lean();
  cached = { at: Date.now(), settings: merge(doc), history: (doc?.history ?? []).slice(-20).reverse(), updatedAt: doc?.updatedAt ?? null };
  return cached.settings;
}

export async function rankingConfigWithHistory() {
  await rankingConfig();
  return { settings: cached.settings, history: cached.history, updatedAt: cached.updatedAt };
}

/** A number that changes when the settings change (ranking result caches key on it). */
export const rankingConfigVersion = () => version;

/** Checks a change from the admin; returns { values } or { errors }. Only the fields sent are changed. */
export function validateConfigChange(body) {
  const errors = {};
  const values = {};
  if (body?.weights !== undefined) {
    if (!body.weights || typeof body.weights !== "object") errors.weights = "must be an object";
    else {
      values.weights = {};
      for (const factor of RANKING_FACTORS) {
        const value = body.weights[factor.key];
        if (value === undefined) continue;
        if (!Number.isInteger(value) || value < 0 || value > 100) errors[`weights.${factor.key}`] = "must be a whole number from 0 to 100";
        else values.weights[factor.key] = value;
      }
    }
  }
  for (const [key, [min, max]] of Object.entries(NUMBER_RULES)) {
    if (body?.[key] === undefined) continue;
    const value = body[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) errors[key] = `must be a number from ${min} to ${max}`;
    else values[key] = value;
  }
  if (body?.defaultResultLimit !== undefined && ![10, 50].includes(body.defaultResultLimit)) errors.defaultResultLimit = "must be 10 or 50";
  if (body?.exclusions !== undefined) {
    if (!Array.isArray(body.exclusions) || body.exclusions.length > 500) errors.exclusions = "must be a list of up to 500 listings";
    else {
      values.exclusions = [];
      for (const [index, item] of body.exclusions.entries()) {
        if (!["company", "freelancer"].includes(item?.providerType) || !mongoose.isValidObjectId(item?.listingId)) { errors[`exclusions.${index}`] = "needs providerType (company or freelancer) and a listing id"; continue; }
        if (item.reason !== undefined && (typeof item.reason !== "string" || item.reason.length > 300)) { errors[`exclusions.${index}`] = "reason must be text up to 300 characters"; continue; }
        values.exclusions.push({ providerType: item.providerType, listingId: item.listingId, reason: item.reason?.trim() ?? "" });
      }
    }
  }
  if (body?.placements !== undefined) {
    if (!Array.isArray(body.placements) || body.placements.length > 300) errors.placements = "must be a list of up to 300 placements";
    else {
      values.placements = [];
      for (const [index, item] of body.placements.entries()) {
        const stateCode = item?.stateCode ? String(item.stateCode).toUpperCase() : null;
        const citySlug = item?.citySlug ? String(item.citySlug).toLowerCase() : null;
        const until = item?.until ? new Date(item.until) : null;
        if (!["company", "freelancer"].includes(item?.providerType) || !mongoose.isValidObjectId(item?.listingId)) errors[`placements.${index}`] = "needs providerType (company or freelancer) and a listing id";
        else if (!["featured", "sponsored"].includes(item.kind ?? "sponsored")) errors[`placements.${index}`] = "kind must be featured or sponsored";
        else if (stateCode && !stateByCode.has(stateCode)) errors[`placements.${index}`] = "unknown state";
        else if (citySlug && (!stateCode || !SLUG.test(citySlug))) errors[`placements.${index}`] = "a city needs a state and a URL slug such as los-angeles";
        else if (until && Number.isNaN(until.getTime())) errors[`placements.${index}`] = "until must be a date";
        else if (item.note !== undefined && (typeof item.note !== "string" || item.note.length > 300)) errors[`placements.${index}`] = "note must be text up to 300 characters";
        else values.placements.push({ providerType: item.providerType, listingId: item.listingId, kind: item.kind ?? "sponsored", stateCode, citySlug, until, note: item.note?.trim() ?? "" });
      }
    }
  }
  if (body?.templates !== undefined) {
    if (!body.templates || typeof body.templates !== "object") errors.templates = "must be an object";
    else {
      values.templates = {};
      for (const { key } of PAGE_TEMPLATES) {
        const item = body.templates[key];
        if (item === undefined) continue;
        const clean = {};
        for (const [field, max] of [["title", 160], ["description", 320]]) {
          if (item[field] === undefined) continue;
          if (typeof item[field] !== "string" || item[field].length > max) errors[`templates.${key}.${field}`] = `must be text up to ${max} characters`;
          else clean[field] = item[field].trim();
        }
        for (const field of ["showMap", "showFaq"]) {
          if (item[field] === undefined) continue;
          if (typeof item[field] !== "boolean") errors[`templates.${key}.${field}`] = "must be true or false";
          else clean[field] = item[field];
        }
        values.templates[key] = clean;
      }
    }
  }
  return Object.keys(errors).length ? { errors } : { values };
}

/** Saves a validated change and notes who changed what. */
export async function saveConfigChange(values, admin) {
  const before = await rankingConfig();
  const changes = [];
  for (const [key, value] of Object.entries(values)) {
    if (key === "weights") for (const [factor, weight] of Object.entries(value)) { if (before.weights[factor] !== weight) changes.push(`weight ${factor}: ${before.weights[factor]} → ${weight}`); }
    else if (key === "exclusions") changes.push(`exclusions: ${before.exclusions.length} → ${value.length}`);
    else if (key === "placements") changes.push(`placements: ${before.placements.length} → ${value.length}`);
    else if (key === "templates") for (const [name, fields] of Object.entries(value)) { for (const [field, next] of Object.entries(fields)) if (before.templates[name][field] !== next) changes.push(`${name} template ${field} changed`); }
    else if (before[key] !== value) changes.push(`${key}: ${before[key]} → ${value}`);
  }
  const set = {
    ...Object.fromEntries(Object.entries(values).filter(([key]) => key !== "weights" && key !== "templates")),
    ...Object.fromEntries(Object.entries(values.weights ?? {}).map(([factor, weight]) => [`weights.${factor}`, weight])),
    ...Object.fromEntries(Object.entries(values.templates ?? {}).flatMap(([name, fields]) => Object.entries(fields).map(([field, value]) => [`templates.${name}.${field}`, value]))),
  };
  await RankingConfiguration.updateOne({ key: "default" }, { $set: set, ...(changes.length ? { $push: { history: { $each: [{ at: new Date(), admin: admin?._id, adminName: admin?.name, changes }], $slice: -200 } } } : {}) }, { upsert: true });
  cached = null;
  version += 1;
  return rankingConfigWithHistory();
}

/** Test helper. */
export const resetRankingConfigCache = () => { cached = null; version += 1; };
