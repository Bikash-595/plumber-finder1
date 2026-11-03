import { Company } from "../../company/models/Company.js";
import { Freelancer } from "../../freelancer/models/Freelancer.js";

// Revocable sessions. Access tokens carry the account's `tokenVersion` (as `tv`); "Sign out everywhere" and a
// password change bump it, which ends every older token. Checked for business accounts (company and freelancer
// dashboards); other account types can opt in by adding their model here.
const models = { company: Company, freelancer: Freelancer };
const CACHE_MS = 15_000; // a revoked token stops working within 15 seconds on every server
const cache = new Map();

export const sessionChecked = (accountType) => Boolean(models[accountType]);

/** The account's current token version, or null if the account no longer exists. Cached briefly. */
export async function currentTokenVersion(accountType, id) {
  const key = `${accountType}:${id}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.version;
  const account = await models[accountType].findById(id).select("tokenVersion").lean();
  const version = account ? account.tokenVersion ?? 0 : null;
  cache.set(key, { version, at: Date.now() });
  if (cache.size > 50_000) cache.clear();
  return version;
}

/** Ends every session of the account (this server forgets its cached version at once). Returns the new version. */
export async function revokeSessions(accountType, id) {
  const account = await models[accountType].findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } }, { new: true }).select("tokenVersion role accountType");
  cache.set(`${accountType}:${id}`, { version: account.tokenVersion, at: Date.now() });
  return account;
}
