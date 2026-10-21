// Admin accounts sign in to the separate admin app only. There is no public signup and no
// Google/Apple sign-in — admins are created with `npm run create-admin` (see scripts/createAdmin.js).
export const adminAuthConfig = {
  accountType: "admin",
  nameField: "name",
  profileFields: [],
  // Failed logins allowed per email + IP address before a cool-down.
  maxFailedLogins: 5,
  lockoutMinutes: 15,
};
