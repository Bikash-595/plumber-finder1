import jwt from "jsonwebtoken";
import { getJwtExpiresIn, getJwtSecret } from "../config/jwtConfig.js";

export function createAccessToken(account) {
  // `tv` (token version) lets an account end all its sessions — see sessions.js.
  return jwt.sign({ sub: account.id, role: account.role, accountType: account.accountType, tv: account.tokenVersion ?? 0 }, getJwtSecret(), { expiresIn: getJwtExpiresIn(), algorithm: "HS256" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
}
