import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { sendMail } from "../../auth/verification/services/mailer.js";
import { CompanySettings } from "../../company/settings/models/CompanySettings.js";
import { FreelancerSettings } from "../../freelancer/settings/models/FreelancerSettings.js";

const accounts = { company: Company, freelancer: Freelancer };
const settings = { company: [CompanySettings, "company"], freelancer: [FreelancerSettings, "freelancer"] };

/**
 * Emails a company or freelancer about an event, unless they turned that email off (Settings → Notifications; `preference` is emailNewBooking, emailBookingUpdates or emailNewReview). Best effort: never throws.
 */
export async function emailProvider(providerType, accountId, preference, subject, lines) {
  try {
    if (!accountId || !accounts[providerType]) return false;
    const [Settings, ownerField] = settings[providerType];
    const saved = await Settings.findOne({ [ownerField]: accountId }).select(preference).lean();
    if (saved?.[preference] === false) return false;
    const account = await accounts[providerType].findById(accountId).select("email").lean();
    if (!account?.email) return false;
    await sendMail({ to: account.email, subject, text: [...lines, "", "— Plumber Finder"].join("\n") });
    return true;
  } catch {
    return false;
  }
}
