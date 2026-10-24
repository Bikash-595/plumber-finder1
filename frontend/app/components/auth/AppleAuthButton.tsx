"use client";

import { useState } from "react";
import { FaApple } from "react-icons/fa6";
import { authenticateAccount, type AccountType } from "@/components/utils/auth";

type AppleSignInResponse = {
  authorization: { id_token: string; code: string; state?: string };
  user?: { email?: string; name?: { firstName?: string; lastName?: string } };
};

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: { clientId: string; scope: string; redirectURI: string; usePopup: boolean; state?: string; nonce?: string }) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}

const APPLE_SCRIPT = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
// Your Apple Services ID and a Return URL registered for it in the Apple Developer portal.
const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

let scriptPromise: Promise<void> | null = null;
function loadAppleScript() {
  if (window.AppleID) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = APPLE_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { scriptPromise = null; reject(new Error("Could not load Sign in with Apple.")); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

const randomToken = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");

type Props = {
  accountType: AccountType;
  onComplete: (name: string, email: string) => void;
  companyName?: string;
};

/**
 * "Continue with Apple" — always shown next to Google. It works once NEXT_PUBLIC_APPLE_CLIENT_ID and
 * NEXT_PUBLIC_APPLE_REDIRECT_URI are set (and the site runs on HTTPS, which Apple requires);
 * until then a click explains what is missing instead of failing silently.
 */
export function AppleAuthButton({ accountType, companyName, onComplete }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    if (!clientId || !redirectURI) {
      setError(process.env.NODE_ENV === "production"
        ? "Sign in with Apple isn't available yet. Please use Google or your email."
        : "Sign in with Apple isn't set up yet: add NEXT_PUBLIC_APPLE_CLIENT_ID and NEXT_PUBLIC_APPLE_REDIRECT_URI to frontend/.env and APPLE_CLIENT_ID to backend/.env.");
      return;
    }
    if (window.location.protocol !== "https:") {
      setError("Apple only allows Sign in with Apple on a secure (https://) website, so it can't run on localhost. It will work on your live site.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await loadAppleScript();
      // The nonce is embedded in Apple's token and checked by the backend, so a token can't be replayed.
      const nonce = randomToken();
      window.AppleID!.auth.init({ clientId, scope: "name email", redirectURI, usePopup: true, state: randomToken(), nonce });
      const { authorization, user } = await window.AppleID!.auth.signIn();
      // Apple only shares the user's name the first time they sign in.
      const account = await authenticateAccount(accountType, "apple", { identityToken: authorization.id_token, nonce, name: user?.name, companyName });
      onComplete(account.name, account.email);
    } catch (caught) {
      const code = (caught as { error?: string })?.error;
      if (code !== "popup_closed_by_user" && code !== "user_cancelled_authorize") {
        setError(caught instanceof Error ? caught.message : "Apple sign-in could not be completed.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col items-center">
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="inline-flex h-10 w-[320px] max-w-full items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-60"
      >
        <FaApple className="h-4 w-4" aria-hidden />
        {busy ? "Connecting…" : "Continue with Apple"}
      </button>
      {error && <p role="alert" className="mt-2 max-w-[320px] text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}
