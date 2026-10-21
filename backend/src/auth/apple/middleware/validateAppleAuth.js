/**
 * The browser sends the Apple `identityToken` (authorization.id_token). Apple shares the user's name only
 * on the first sign-in, so the client may also send `name` (string or { firstName, lastName }).
 */
export function validateAppleAuth(req, res, next) {
  const { identityToken, name, nonce } = req.body ?? {};
  if (typeof identityToken !== "string" || !identityToken.trim()) return res.status(400).json({ message: "Apple identity token is required." });
  if (nonce !== undefined && typeof nonce !== "string") return res.status(400).json({ message: "nonce must be a string." });
  if (name && typeof name === "object") {
    req.body.name = [name.firstName, name.lastName].filter((part) => typeof part === "string" && part.trim()).join(" ").slice(0, 120);
  } else if (name !== undefined && typeof name !== "string") {
    return res.status(400).json({ message: "name must be text." });
  }
  next();
}
