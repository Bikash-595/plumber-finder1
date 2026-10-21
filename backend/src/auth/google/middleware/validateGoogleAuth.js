/** The browser must send the Google ID token as `credential`. */
export function validateGoogleAuth(req, res, next) {
  const credential = req.body?.credential;
  if (typeof credential !== "string" || !credential.trim()) return res.status(400).json({ message: "Google credential is required." });
  next();
}
