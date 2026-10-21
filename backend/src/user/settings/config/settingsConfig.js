// Customer preferences.
export const settingsConfig = {
  label: "Settings",
  fields: {
    emailNotifications: { type: "boolean", default: true },
    smsNotifications: { type: "boolean", default: false },
    pushNotifications: { type: "boolean", default: false },
    marketingEmails: { type: "boolean", default: false },
    bookingReminders: { type: "boolean", default: true },
    publicProfile: { type: "boolean", default: true },
  },
};
