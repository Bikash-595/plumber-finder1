export const userAuthConfig = {
  accountType: "user",
  nameField: "name",
  // Fields a user may set on their own account. Everything else in the request body is ignored.
  profileFields: ["phone", "address"],
};
