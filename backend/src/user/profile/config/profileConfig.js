// What a customer can change on their own account. Email changes are not allowed here
// (they would need re-verification); the password is changed under /security.
// Service addresses have their own section (../addresses); `address` is kept in step with the default one.
const PHONE = { pattern: /^[+()\d\s.-]{7,25}(\s*(x|ext\.?)\s*\d{1,6})?$/i, patternMessage: "must be a phone number" };

export const CONTACT_METHODS = ["phone", "sms", "email"];
export const CONTACT_TIMES = ["anytime", "morning", "afternoon", "evening"];
export const LANGUAGES = ["English", "Spanish", "French", "Chinese", "Vietnamese", "Tagalog", "Arabic", "Korean", "Russian", "Hindi", "Portuguese", "Other"];

export const profileConfig = {
  label: "Profile",
  fields: {
    name: { type: "string", required: true, max: 120 },
    phone: { type: "string", max: 40, ...PHONE },
    altPhone: { type: "string", max: 40, ...PHONE },
    address: { type: "string", max: 300 },
    avatarUrl: { type: "image", max: 1_250_000 },
    // How plumbers should get in touch about a booking.
    preferredContact: { type: "enum", values: CONTACT_METHODS },
    contactTime: { type: "enum", values: CONTACT_TIMES },
    language: { type: "enum", values: LANGUAGES },
    // Someone who can let the plumber in (a family member, tenant or property manager).
    alternateContactName: { type: "string", max: 120 },
    alternateContactPhone: { type: "string", max: 40, ...PHONE },
  },
};
