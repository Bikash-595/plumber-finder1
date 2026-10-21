// Shared by Google and Apple sign-in: find the account for a verified provider identity,
// link it to an existing email account, or create a new account.

const isFilledString = (value) => typeof value === "string" && value.trim() !== "";
const httpError = (status, message) => Object.assign(new Error(message), { status });

/** Copies only the profile fields an account type allows (never status, googleId, _id, ...). */
export const pickProfile = (profileFields, body) =>
  Object.fromEntries(profileFields.filter((field) => typeof body?.[field] === "string").map((field) => [field, body[field]]));

/**
 * @param account  { Model, accountType, nameField, profileFields }
 * @param identity { providerField: "googleId" | "appleId", providerId, email?, name?, avatarUrl? }
 * @param body     request body (may carry the display name and allowed profile fields for new accounts)
 */
export async function findOrCreateSocialAccount({ Model, accountType, nameField, profileFields = [] }, identity, body = {}) {
  const { providerField, providerId, email, name, avatarUrl } = identity;

  let account = await Model.findOne({ [providerField]: providerId });
  if (!account && email) {
    account = await Model.findOne({ email });
    if (account) {
      // The provider verified this email, so it is safe to link — unless the account is
      // already linked to a different identity at the same provider.
      if (account[providerField] && account[providerField] !== providerId) {
        throw httpError(409, "This email is already linked to a different account at this provider.");
      }
      account[providerField] = providerId;
      if (!account.avatarUrl && avatarUrl) account.avatarUrl = avatarUrl;
      await account.save();
    }
  }
  if (account) return { account, created: false };

  if (!email) throw httpError(400, "Your sign-in provider did not share an email address, so a new account cannot be created.");
  const displayName = [body[nameField], name, email.split("@")[0]].find(isFilledString).trim();
  account = await Model.create({
    ...pickProfile(profileFields, body),
    [nameField]: displayName,
    email,
    [providerField]: providerId,
    ...(avatarUrl ? { avatarUrl } : {}),
    role: accountType,
    accountType,
  });
  return { account, created: true };
}
