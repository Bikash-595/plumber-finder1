// Links to the documents Plumber Finder uses to verify the company. Private: never on the public profile.
const documentUrl = { type: "string", max: 500, pattern: /^https?:\/\/[^\s]+$/i, patternMessage: "must be a full link starting with https://" };

export const verificationConfig = {
  label: "Verification documents",
  fields: {
    license: documentUrl,
    insurance: documentUrl,
    panVat: documentUrl,
    registrationCertificate: documentUrl,
    notes: { type: "text", max: 1000 },
  },
};
