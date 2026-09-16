"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { hasGoogleWebClientId } from "./googleClientId";

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return hasGoogleWebClientId(clientId) ? <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider> : children;
}
