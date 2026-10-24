import dns from "node:dns/promises";

// "Is this a real email address?" before an account is created. The emailed code is the final
// proof; these checks catch typos and made-up addresses straight away.

const mxCache = new Map(); // domain -> { ok, at }
const CACHE_MS = 6 * 3600_000;
const GMAIL_DOMAINS = new Set(["gmail.com", "googlemail.com"]);

/** Gmail usernames: 6–30 letters, numbers, and dots (not at the start/end, no two in a row). */
function gmailProblem(local) {
  const name = local.split("+")[0];
  if (!/^[a-z0-9.]+$/.test(name)) return "Gmail addresses can only contain letters, numbers, and dots.";
  if (name.startsWith(".") || name.endsWith(".") || name.includes("..")) return "That isn't a valid Gmail address (check the dots).";
  const length = name.replace(/\./g, "").length;
  if (length < 6 || length > 30) return "Gmail addresses have 6 to 30 letters or numbers before @gmail.com.";
  return null;
}

async function domainAcceptsMail(domain) {
  const cached = mxCache.get(domain);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.ok;
  let ok;
  try {
    const records = await Promise.race([dns.resolveMx(domain), new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), 4000))]);
    ok = records.some((record) => record.exchange && record.exchange !== ".");
  } catch (error) {
    // The domain doesn't exist or has no mail servers. Network trouble shouldn't block signups.
    if (["ENOTFOUND", "ENODATA", "ESERVFAIL", "NXDOMAIN"].includes(error.code)) ok = false;
    else return true;
  }
  mxCache.set(domain, { ok, at: Date.now() });
  return ok;
}

/** null when the address looks deliverable, otherwise a message for the user. */
export async function emailDeliverabilityProblem(email) {
  const [local, domain] = email.split("@");
  if (GMAIL_DOMAINS.has(domain)) {
    const problem = gmailProblem(local);
    if (problem) return problem;
  }
  if (process.env.EMAIL_DOMAIN_CHECK === "off" && process.env.NODE_ENV !== "production") return null;
  if (!(await domainAcceptsMail(domain))) return `"${domain}" can't receive email. Please check the address.`;
  return null;
}
