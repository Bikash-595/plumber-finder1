import { DIRECTORY_SERVICES, offersService, serviceBySlug } from "../config/directoryServices.js";
import { US_STATES, findState } from "../config/usStates.js";
import { combinedRating } from "./rankingEngine.js";
import { rankingEntries, rankingIndexVersion } from "./rankingIndex.js";

// Site search over every published company and freelancer profile, like a shop's search box:
//   • every word must match (name, services, SEO keywords, city/state/service areas, description) — but words are
//     matched by prefix ("kin" → Kings) and with typos ("plumbng", "draine", "huston"), and service words also match
//     providers offering that service ("clog" → drain cleaning, "toilet" → bathroom plumbing)
//   • results are ordered by how well they match (name > services/keywords > place > description), then quality
//     (rating, reviews, verified, complete profile)
//   • a misspelled search is corrected ("Showing results for …") and, when few profiles match every word,
//     related profiles (matching some of the words, or the same services and places) are offered below.
// An inverted index (word → profiles) is built from the ranking index and rebuilt whenever that is.

const FIELD_WEIGHTS = { name: 10, service: 6, keyword: 6, place: 4, text: 2 };
// Words that don't narrow a plumbing search on their own ("best plumbers near me").
const STOP_WORDS = new Set(["a", "an", "the", "in", "near", "me", "my", "for", "of", "and", "to", "at", "on", "by", "with", "around", "best", "top", "good", "great", "local", "cheap", "affordable", "find", "plumber", "plumbers", "plumbing", "company", "companies", "service", "services", "pro", "pros", "contractor", "contractors", "llc", "inc", "co"]);
const MAX_RESULTS = 500;
const RELATED = 12;

const normalize = (value) => String(value ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
/** Light stemming so "leaks" finds "leak" and "heaters" finds "heater". */
const stem = (word) => (word.length > 4 && word.endsWith("ies") ? `${word.slice(0, -3)}y` : word.length > 3 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word);
const words = (value) => normalize(value).split(" ").filter(Boolean).map(stem);
/** Remembers how each indexed word is spelled in full ("king" → "kings"), for corrected queries. */
const spellings = (value, into) => { for (const word of normalize(value).split(" ")) if (word && !into.has(stem(word))) into.set(stem(word), word); };

/** Typos allowed for a word of this length: none for short words, one up to 7 letters, two after. */
const allowedTypos = (length) => (length <= 3 ? 0 : length <= 7 ? 1 : 2);

/** Edit distance (with swapped neighbours as one edit), giving up once it exceeds `max`. */
function distance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let previous2 = null, previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + cost);
      if (previous2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, previous2[j - 2] + 1);
      row.push(value);
      best = Math.min(best, value);
    }
    if (best > max) return max + 1;
    previous2 = previous;
    previous = row;
  }
  return previous[b.length];
}

/** How well a typed word matches an indexed word: 1 exact, 0.85 prefix (still typing), 0.6 one/two typos, else 0. */
function wordMatch(typed, indexed) {
  if (typed === indexed) return 1;
  if (typed.length >= 2 && indexed.startsWith(typed)) return 0.85;
  if (indexed.length >= 4 && typed.startsWith(indexed)) return 0.7; // "cleaning" vs a provider's "clean"
  const max = allowedTypos(typed.length);
  if (max && distance(typed, indexed, max) <= max) return 0.6;
  // A typo while still typing: "plumbng" / "kigns" against the start of a longer word.
  if (max && indexed.length > typed.length && distance(typed, indexed.slice(0, typed.length), 1) <= 1 && typed.length >= 5) return 0.5;
  return 0;
}

const STATE_WORDS = new Map(US_STATES.map((state) => [state.code, [...words(state.name), state.code.toLowerCase()]]));
const SERVICE_WORDS = DIRECTORY_SERVICES.map((service) => ({ service, words: new Set([...words(service.name), ...service.keywords.flatMap(words)]) }));

function buildIndex(entries) {
  const docs = entries.filter((entry) => !entry.blocked);
  const postings = new Map(); // word → Map(doc index → best field weight)
  const add = (word, doc, weight) => {
    if (!word) return;
    let list = postings.get(word);
    if (!list) postings.set(word, (list = new Map()));
    if ((list.get(doc) ?? 0) < weight) list.set(doc, weight);
  };
  const spelled = new Map();
  docs.forEach((entry, doc) => {
    for (const text of [entry.name, entry.city, ...entry.services, ...(entry.keywords ?? [])]) spellings(text, spelled);
    for (const word of words(entry.name)) add(word, doc, FIELD_WEIGHTS.name);
    for (const word of entry.services.flatMap(words)) add(word, doc, FIELD_WEIGHTS.service);
    for (const word of (entry.keywords ?? []).flatMap(words)) add(word, doc, FIELD_WEIGHTS.keyword);
    for (const word of [entry.city, ...(entry.serviceAreas ?? [])].flatMap(words)) add(word, doc, FIELD_WEIGHTS.place);
    for (const word of STATE_WORDS.get(entry.stateCode) ?? []) add(word, doc, FIELD_WEIGHTS.place);
    for (const word of words(entry.description)) add(word, doc, FIELD_WEIGHTS.text);
  });
  // Quality 0–1, used after relevance: rating (with confidence), reviews, verified, complete profile.
  const quality = docs.map((entry) => {
    const { average, count } = combinedRating(entry);
    return 0.45 * ((3 * 5 + average * count) / (5 + count)) / 5 + 0.15 * Math.min(1, Math.log10(1 + count) / 2) + 0.2 * Number(entry.verified) + 0.2 * entry.completeness;
  });
  const services = docs.map((entry) => DIRECTORY_SERVICES.filter((service) => offersService(entry, service)).map((service) => service.slug));
  return { docs, postings, quality, services, spelled, vocabulary: [...postings.keys()] };
}

let cached = { version: null, index: null };
async function searchIndex() {
  const entries = await rankingEntries();
  const version = rankingIndexVersion();
  if (cached.version !== version || !cached.index) cached = { version, index: buildIndex(entries) };
  return cached.index;
}

/** The indexed words a typed word matches, with how well (cached per word for the current index). */
function expand(index, typed) {
  index.expansions ??= new Map();
  if (index.expansions.has(typed)) return index.expansions.get(typed);
  const matches = new Map();
  if (index.postings.has(typed)) matches.set(typed, 1);
  for (const word of index.vocabulary) {
    if (word === typed || (Math.abs(word.length - typed.length) > 2 && !word.startsWith(typed) && !typed.startsWith(word))) continue;
    const quality = wordMatch(typed, word);
    if (quality) matches.set(word, quality);
  }
  if (index.expansions.size > 5000) index.expansions.clear();
  index.expansions.set(typed, matches);
  return matches;
}

/** The services a typed word stands for ("clog" → drain cleaning, "tankless" → water heater repair). */
const servicesFor = (typed) => typed.length < 3 ? [] : SERVICE_WORDS.filter(({ words: list }) => [...list].some((word) => wordMatch(typed, word) >= 0.85 || (typed.length >= 5 && wordMatch(typed, word) >= 0.6))).map(({ service }) => service.slug);

/** The best spelling for a typed word that matches nothing exactly ("plumbng" → "plumbing"), else null. */
function correction(index, typed) {
  if (index.postings.has(typed) || typed.length < 4) return null;
  if (index.vocabulary.some((word) => word.startsWith(typed))) return null;
  let best = null;
  for (const word of index.vocabulary) {
    const max = allowedTypos(typed.length);
    const d = distance(typed, word, max);
    if (d > max) continue;
    const frequency = index.postings.get(word).size;
    if (!best || d < best.d || (d === best.d && frequency > best.frequency)) best = { word, d, frequency };
  }
  return best ? index.spelled.get(best.word) ?? best.word : null;
}

const publicResult = (index, doc, score, matched) => {
  const entry = index.docs[doc];
  const { average, count } = combinedRating(entry);
  return {
    id: entry.listingId, providerType: entry.providerType, name: entry.name, url: entry.url, logo: entry.logo,
    city: entry.city, stateCode: entry.stateCode, rating: Math.round(average * 10) / 10, reviewCount: count,
    verified: entry.verified, isEmergency: entry.isEmergency, services: entry.services.slice(0, 6), description: entry.description,
    score: Math.round(score * 1000) / 1000, matched, doc,
  };
};
const withoutDoc = ({ doc, ...item }) => item;

const SORTS = {
  relevance: (a, b) => b.score - a.score,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount || b.score - a.score,
  reviews: (a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating || b.score - a.score,
  name: (a, b) => a.name.localeCompare(b.name),
};

/**
 * Search profiles. Returns { query, terms, correctedQuery, total, results, related, facets }:
 * `results` match every meaningful word (best first); `related` are suggestions when results are few or none.
 * Filters: service (slug), state (code/name), verified, emergency, minRating; sort: relevance|rating|reviews|name.
 */
export async function searchProviders({ q = "", sort = "relevance", service, state, verified, emergency, minRating, limit = MAX_RESULTS } = {}) {
  const index = await searchIndex();
  const typed = [...new Set(words(q))];
  // Misspelled general words ("plumbng", "compnay") are corrected and then ignored like the others.
  const fixes = new Map();
  for (const word of typed) if (!STOP_WORDS.has(word)) fixes.set(word, correction(index, word));
  const terms = typed.filter((word) => !STOP_WORDS.has(word) && !STOP_WORDS.has(fixes.get(word)));
  const filterService = service ? serviceBySlug.get(service) : null;
  const filterState = state ? findState(state) : null;
  const passes = (doc) => {
    const entry = index.docs[doc];
    return (!filterService || index.services[doc].includes(filterService.slug)) && (!filterState || entry.stateCode === filterState.code)
      && (!verified || entry.verified) && (!emergency || entry.isEmergency) && (!minRating || combinedRating(entry).average >= minRating);
  };

  // Per profile: the best score for each search word, and which words matched.
  const perDoc = new Map();
  const corrections = [];
  terms.forEach((term, position) => {
    corrections.push(fixes.get(term) ?? term);
    const matches = expand(index, term);
    const note = (doc, value) => {
      let row = perDoc.get(doc);
      if (!row) perDoc.set(doc, (row = new Array(terms.length).fill(0)));
      if (row[position] < value) row[position] = value;
    };
    for (const [word, quality] of matches) for (const [doc, weight] of index.postings.get(word)) note(doc, weight * quality);
    // Service words also match providers offering that service.
    const slugs = servicesFor(term);
    if (slugs.length) index.services.forEach((list, doc) => { if (list.some((slug) => slugs.includes(slug))) note(doc, FIELD_WEIGHTS.service * 0.8); });
  });

  const phrase = normalize(q);
  const best = FIELD_WEIGHTS.name;
  const scored = [];
  const partial = [];
  if (!terms.length) {
    // Only general words ("plumbers near me"): every profile, best quality first.
    index.docs.forEach((_, doc) => { if (passes(doc)) scored.push(publicResult(index, doc, index.quality[doc], [])); });
  } else {
    for (const [doc, row] of perDoc) {
      if (!passes(doc)) continue;
      const matchedCount = row.filter(Boolean).length;
      const relevance = row.reduce((sum, value) => sum + value, 0) / (best * terms.length);
      const nameBonus = phrase && normalize(index.docs[doc].name).includes(phrase) ? 0.5 : 0;
      const score = relevance + nameBonus + 0.25 * index.quality[doc];
      const matched = terms.filter((_, i) => row[i]);
      if (matchedCount === terms.length) scored.push(publicResult(index, doc, score, matched));
      else partial.push({ result: publicResult(index, doc, (matchedCount / terms.length) + 0.25 * index.quality[doc] + relevance * 0.1, matched), doc });
    }
  }
  scored.sort(SORTS[sort] ?? SORTS.relevance);

  // Related profiles when few match every word: those matching some words, then the same services and places as the
  // matches (or simply the best profiles), so a search never ends on an empty page.
  const related = [];
  if (scored.length < RELATED) {
    const seen = new Set(scored.map((item) => item.id));
    const push = (item) => { if (related.length < RELATED && !seen.has(item.id)) { seen.add(item.id); related.push(item); } };
    partial.sort((a, b) => b.result.score - a.result.score).forEach(({ result }) => push(result));
    const anchors = scored.slice(0, 5).map((item) => item.doc);
    const anchorServices = new Set(anchors.flatMap((doc) => index.services[doc] ?? []));
    const anchorStates = new Set(anchors.map((doc) => index.docs[doc]?.stateCode).filter(Boolean));
    const others = index.docs.map((_, doc) => doc).filter(passes)
      .map((doc) => ({ doc, affinity: index.services[doc].filter((slug) => anchorServices.has(slug)).length * 0.2 + (anchorStates.has(index.docs[doc].stateCode) ? 0.5 : 0) + index.quality[doc] }))
      .sort((a, b) => b.affinity - a.affinity);
    for (const { doc, affinity } of others) {
      if (related.length >= RELATED) break;
      push(publicResult(index, doc, affinity, []));
    }
  }

  // Counts for the filters, over the profiles that match every word.
  const facetDocs = scored.map((item) => item.doc);
  const count = (keys) => { const map = new Map(); for (const key of keys) if (key) map.set(key, (map.get(key) ?? 0) + 1); return [...map].sort((a, b) => b[1] - a[1]); };
  const facets = {
    services: count(facetDocs.flatMap((doc) => index.services[doc])).map(([slug, total]) => ({ slug, name: serviceBySlug.get(slug).name, count: total })),
    states: count(facetDocs.map((doc) => index.docs[doc].stateCode)).map(([code, total]) => ({ code, count: total })),
    verified: facetDocs.filter((doc) => index.docs[doc].verified).length,
    emergency: facetDocs.filter((doc) => index.docs[doc].isEmergency).length,
  };

  const correctedQuery = [...fixes.values()].some(Boolean) ? q.trim().split(/\s+/).map((word) => fixes.get(stem(normalize(word))) ?? word).join(" ") : null;

  return { query: q.trim(), terms, correctedQuery, total: scored.length, results: scored.slice(0, Math.max(1, Math.min(MAX_RESULTS, limit))).map(withoutDoc), related: related.map(withoutDoc), facets };
}

/**
 * What a search looks like to the profile index: whether some profile's name matches every word ("Bayou Drain Pros"),
 * and the words that are neither general nor service words ("houston" in "drain cleaning houston").
 */
export async function searchShape(q) {
  const index = await searchIndex();
  const terms = [...new Set(words(q))].filter((word) => !STOP_WORDS.has(word));
  const nameHit = terms.length > 0 && index.docs.some((entry) => {
    const nameWords = words(entry.name);
    return terms.every((term) => nameWords.some((word) => wordMatch(term, word) >= 0.85));
  });
  return { terms, nameHit, otherWords: terms.filter((term) => !servicesFor(term).length) };
}

/** Up to `limit` profiles for search-as-you-type (best match first). */
export async function profileSuggestions(q, limit = 4) {
  if (normalize(q).length < 2) return [];
  const { terms, results } = await searchProviders({ q, limit });
  return terms.length ? results : [];
}

/** Test helper. */
export function resetProviderSearch() {
  cached = { version: null, index: null };
}
