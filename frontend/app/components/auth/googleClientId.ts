const GOOGLE_WEB_CLIENT_ID = /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/;

export function hasGoogleWebClientId(clientId: string | undefined) {
  return Boolean(clientId && GOOGLE_WEB_CLIENT_ID.test(clientId));
}
