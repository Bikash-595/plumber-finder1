import nodemailer from "nodemailer";

// Sends email through any SMTP server (Gmail with an App Password, SendGrid, Mailgun, Amazon SES, ...):
//   SMTP_HOST, SMTP_PORT (465 = TLS, 587 = STARTTLS), SMTP_USER, SMTP_PASS, MAIL_FROM.
// Without SMTP settings, development prints the email to the server console and keeps it in
// `devOutbox` (read by the automated tests); production refuses to pretend it sent anything.

export const devOutbox = [];
let transport;

const isConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  }
  return transport;
}

export class EmailNotSentError extends Error {
  constructor(message) { super(message); this.status = 503; this.expose = true; }
}

export async function sendMail({ to, subject, text, html }) {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === "production") throw new EmailNotSentError("Email sending is not set up on the server yet. Please try again later.");
    devOutbox.push({ to, subject, text, sentAt: new Date() });
    if (devOutbox.length > 50) devOutbox.shift();
    if (process.env.NODE_ENV !== "test") console.log(`\n[email not sent — SMTP is not configured] To: ${to}\n${subject}\n${text}\n`);
    return;
  }
  try {
    await getTransport().sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text, html });
  } catch (error) {
    console.error("Email delivery failed:", error.message);
    throw new EmailNotSentError("We couldn't send the email right now. Please try again in a minute.");
  }
}
