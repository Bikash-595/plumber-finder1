// Creates an admin account, or resets an existing admin's password.
//
//   npm run create-admin -- --email admin@example.com --name "Site Admin"
//   npm run create-admin            (uses ADMIN_EMAIL / ADMIN_NAME / ADMIN_PASSWORD from backend/.env)
//
// The password is read from ADMIN_PASSWORD, or asked for interactively (input hidden).
// Add --deactivate to revoke an admin's access instead.
import "dotenv/config";
import { createInterface } from "node:readline";
import mongoose from "mongoose";
import { Admin } from "../src/auth/admin/models/Admin.js";
import { emailAuthConfig } from "../src/auth/email/config/emailAuthConfig.js";

const args = process.argv.slice(2);
const option = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const email = (option("email") ?? process.env.ADMIN_EMAIL)?.trim().toLowerCase();
const name = (option("name") ?? process.env.ADMIN_NAME)?.trim();
const deactivate = args.includes("--deactivate");

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl._writeToOutput = (text) => { if (text.includes(question)) process.stdout.write(text); }; // hide typed characters
    rl.question(question, (answer) => { rl.close(); process.stdout.write("\n"); resolve(answer); });
  });
}

async function main() {
  if (!email || !emailAuthConfig.emailPattern.test(email)) throw new Error("Pass a valid --email (or set ADMIN_EMAIL in backend/.env).");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set (backend/.env).");
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Admin.findOne({ email });
  if (deactivate) {
    if (!existing) throw new Error(`No admin with email ${email}.`);
    existing.isActive = false;
    await existing.save();
    return console.log(`Admin ${email} deactivated.`);
  }

  const password = process.env.ADMIN_PASSWORD ?? await askHidden("Admin password (min 8 characters): ");
  if (password.length < emailAuthConfig.passwordMinLength || Buffer.byteLength(password) > emailAuthConfig.passwordMaxBytes) {
    throw new Error(`Password must be ${emailAuthConfig.passwordMinLength}–${emailAuthConfig.passwordMaxBytes} bytes.`);
  }

  if (existing) {
    existing.password = password;
    existing.isActive = true;
    if (name) existing.name = name;
    await existing.save();
    console.log(`Admin ${email} updated (password reset, access active).`);
  } else {
    await Admin.create({ email, name: name || email.split("@")[0], password });
    console.log(`Admin ${email} created.`);
  }
}

main()
  .catch((error) => { console.error(`create-admin failed: ${error.message}`); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
