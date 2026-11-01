import { Company } from "../../auth/company/models/Company.js";
import { Freelancer } from "../../auth/freelancer/models/Freelancer.js";
import { sendMail } from "../../auth/verification/services/mailer.js";
import { CompanySettings } from "../../company/settings/models/CompanySettings.js";

const accounts = { company: Company, freelancer: Freelancer };

/**
 * Emails a company or freelancer about an event, unless they turned that email off (companies: Settings →
 * Notifications; `preference` is emailNewBooking, emailBookingUpdates or emailNewReview). Best effort: never throws.
 */
export async function emailProvider(providerType, accountId, preference, subject, lines) {
  try {
    if (!accountId || !accounts[providerType]) return false;
    if (providerType === "company") {
      const settings = await CompanySettings.findOne({ company: accountId }).select(preference).lean();
      if (settings?.[preference] === false) return false;
    }
    const account = await accounts[providerType].findById(accountId).select("email").lean();
    if (!account?.email) return false;
    await sendMail({ to: account.email, subject, text: [...lines, "", "— Plumber Finder"].join("\n") });
    return true;
  } catch {
    return false;
  }
}
