import crypto from "node:crypto";

// AES-256-GCM for Google refresh tokens at rest. The key comes from GOOGLE_TOKEN_SECRET (or, failing that, JWT_SECRET).
const key = () => crypto.createHash("sha256").update(process.env.GOOGLE_TOKEN_SECRET || process.env.JWT_SECRET || "").digest();

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((part) => part.toString("base64")).join(".");
}

export function decrypt(value) {
  const [iv, tag, data] = String(value).split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
