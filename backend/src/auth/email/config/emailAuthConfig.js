// Rules for normal email + password accounts.
export const emailAuthConfig = {
  passwordMinLength: 8,
  // bcrypt only uses the first 72 bytes of a password; longer ones would be silently truncated.
  passwordMaxBytes: 72,
  emailMaxLength: 254,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
