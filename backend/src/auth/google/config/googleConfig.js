// Google Identity Services (web). Read lazily so tests and restarts pick up environment changes.
const GOOGLE_WEB_CLIENT_ID = /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/;

export const googleConfig = {
  get clientId() {
    return process.env.GOOGLE_CLIENT_ID || "";
  },
  get isConfigured() {
    return GOOGLE_WEB_CLIENT_ID.test(this.clientId);
  },
};
