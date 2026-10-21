import { emailAuthConfig } from "../config/emailAuthConfig.js";

const isFilledString = (value) => typeof value === "string" && value.trim() !== "";
const { passwordMinLength, passwordMaxBytes, emailMaxLength, emailPattern } = emailAuthConfig;

function checkEmail(email) {
  if (!isFilledString(email)) return "Email is required.";
  const normalized = email.trim().toLowerCase();
  if (normalized.length > emailMaxLength || !emailPattern.test(normalized)) return "Please enter a valid email address.";
  return null;
}

/** Signup needs a valid email, a password within bcrypt's limits, and the account's name field. */
export function validateEmailSignup({ nameField }) {
  return (req, res, next) => {
    const { email, password } = req.body ?? {};
    if (!isFilledString(email) || typeof password !== "string" || !password || !isFilledString(req.body[nameField])) {
      return res.status(400).json({ message: `email, password, and ${nameField} are required.` });
    }
    const emailError = checkEmail(email);
    if (emailError) return res.status(400).json({ message: emailError });
    if (password.length < passwordMinLength) return res.status(400).json({ message: `Password must be at least ${passwordMinLength} characters.` });
    if (Buffer.byteLength(password) > passwordMaxBytes) return res.status(400).json({ message: `Password must be at most ${passwordMaxBytes} bytes.` });
    req.body.email = email.trim().toLowerCase();
    next();
  };
}

/** Login only needs a non-empty email and password (no format hints for attackers). */
export function validateEmailLogin(req, res, next) {
  const { email, password } = req.body ?? {};
  if (!isFilledString(email) || typeof password !== "string" || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  req.body.email = email.trim().toLowerCase();
  next();
}
