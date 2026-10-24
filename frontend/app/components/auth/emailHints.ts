// Instant hints while typing an email (the server checks again, and the emailed code is the proof).
const commonTypos: Record<string, string> = { "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gmail.co": "gmail.com", "gnail.com": "gmail.com", "yaho.com": "yahoo.com", "hotmial.com": "hotmail.com", "outlok.com": "outlook.com" };

export function emailHint(email: string): string | null {
  const value = email.trim().toLowerCase();
  if (!value.includes("@")) return null;
  const [local, domain = ""] = value.split("@");
  if (commonTypos[domain]) return `Did you mean ${local}@${commonTypos[domain]}?`;
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const name = local.split("+")[0];
    if (!/^[a-z0-9.]*$/.test(name)) return "Gmail addresses only use letters, numbers, and dots.";
    if (name.startsWith(".") || name.endsWith(".") || name.includes("..")) return "That isn't a valid Gmail address (check the dots).";
    const length = name.replace(/\./g, "").length;
    if (length > 0 && (length < 6 || length > 30)) return "Gmail addresses have 6–30 characters before @gmail.com.";
  }
  return null;
}
