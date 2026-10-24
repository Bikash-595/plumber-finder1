export const userAuthConfig = {
  accountType: "user",
  nameField: "name",
  // Fields a user may set on their own account. Everything else in the request body is ignored.
  profileFields: ["phone", "address", "zipCode", "city", "state", "latitude", "longitude"],
  // Google/Apple signups skip the ZIP check, so they can't set the location fields.
  socialProfileFields: ["phone", "address"],
};
