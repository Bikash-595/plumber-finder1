// How customers reach the company. Saved in the same record as the sign-up wizard's contact step,
// and the main phone, email and website are copied to the public listing (cards and profile header).
const phone = { type: "string", max: 40, pattern: /^[+()\d\s.-]{7,40}$/, patternMessage: "must be a phone number" };
const email = { type: "string", max: 200, pattern: /^\S+@\S+\.\S+$/, patternMessage: "must be a valid email" };

export const contactConfig = {
  label: "Contact information",
  fields: {
    primaryPhone: phone,
    secondaryPhone: phone,
    whatsapp: phone,
    emergencyHotline: phone,
    email,
    supportEmail: email,
    salesEmail: email,
    website: { type: "string", max: 300, pattern: /^https?:\/\/[^\s]+$/i, patternMessage: "must be a full link starting with https://" },
    contactPerson: { type: "string", max: 120 },
    contactPersonRole: { type: "string", max: 120 },
  },
};
