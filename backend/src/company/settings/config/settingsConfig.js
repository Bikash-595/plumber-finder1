// Company account settings: email preferences, the account's contact phone, and sign-in security.
export const settingsConfig = {
  preferences: {
    label: "notification settings",
    fields: {
      emailNewBooking: { type: "boolean" },
      emailBookingUpdates: { type: "boolean" },
      emailNewReview: { type: "boolean" },
    },
  },
  account: {
    label: "account",
    fields: {
      phone: { type: "string", max: 40, pattern: /^[+()\d\s.-]{7,25}$/, patternMessage: "must be a phone number" },
    },
  },
  password: {
    label: "password",
    fields: {
      currentPassword: { type: "string", max: 200 },
      newPassword: { type: "string", required: true, max: 200 },
    },
  },
};

/** Password rules: at least 10 characters, letters and numbers, and not built from the email address. */
export function passwordProblem(password, email) {
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/i.test(password) || !/\d/.test(password)) return "Use both letters and numbers.";
  const name = String(email ?? "").split("@")[0].toLowerCase();
  if (name.length >= 4 && password.toLowerCase().includes(name)) return "Don't use your email address in your password.";
  if (/^(.)\1+$/.test(password) || /^(password|qwerty|letmein|welcome)/i.test(password)) return "That password is too easy to guess.";
  return null;
}
