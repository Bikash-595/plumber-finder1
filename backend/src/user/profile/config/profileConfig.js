// What a customer can change on their own account. Email changes are not allowed here
// (they would need re-verification); the password is changed under /security.
export const profileConfig = {
  label: "Profile",
  fields: {
    name: { type: "string", required: true, max: 120 },
    phone: { type: "string", max: 40 },
    address: { type: "string", max: 300 },
    avatarUrl: { type: "image", max: 1_250_000 },
  },
};
