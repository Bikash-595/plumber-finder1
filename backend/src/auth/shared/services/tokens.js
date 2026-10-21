import jwt from "jsonwebtoken";
import { getJwtExpiresIn, getJwtSecret } from "../config/jwtConfig.js";

export function createAccessToken(account) {
  return jwt.sign({ sub: account.id, role: account.role, accountType: account.accountType }, getJwtSecret(), { expiresIn: getJwtExpiresIn(), algorithm: "HS256" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
}
