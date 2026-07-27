"use client";

import { GoogleLogin } from "@react-oauth/google";
import { authenticateAccount, type AccountType } from "@/components/utils/auth";

type Props = {
  accountType: AccountType;
  onComplete: (name: string, email: string) => void;
  companyName?: string;
};

export function GoogleAuthButton({ accountType, companyName, onComplete }: Props) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return <p className="mt-3 text-center text-xs text-gray-500">Google sign-in is available after `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is configured.</p>;
  }

  return (
    <div className="mt-6 flex justify-center">
      <GoogleLogin
        onSuccess={async ({ credential }) => {
          if (!credential) return;
          try {
            const account = await authenticateAccount(accountType, "google", { credential, companyName });
            onComplete(account.name, account.email);
          } catch (error) {
            alert(error instanceof Error ? error.message : "Google sign-in failed.");
          }
        }}
        onError={() => alert("Google sign-in was cancelled or could not be completed.")}
        text="continue_with"
        shape="pill"
        width="320"
      />
    </div>
  );
}
