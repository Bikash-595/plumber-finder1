"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupSeekerForm from "@/components/signup/SignupSeekerForm";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { readStoredUser, storeUser } from "@/components/utils/auth";

/** Customer signup. Companies and freelancers sign up at /business/signup (the header's "List Company"). */
export default function SignupPage() {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const router = useRouter();

  const handleSignupComplete = (name: string, email: string) => {
    storeUser({ ...readStoredUser(), name, email, avatarUrl: readStoredUser()?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, accountType: "seeker" });
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      {pendingEmail ? (
        <VerifyEmailForm email={pendingEmail} accountType="seeker" onVerified={(name, email) => handleSignupComplete(name, email)} onBack={() => setPendingEmail(null)} />
      ) : (
        <>
          <SignupSeekerForm onComplete={handleSignupComplete} onVerificationRequired={setPendingEmail} />
          <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="font-bold text-[#0b1f3b] hover:underline">Log in</Link></p>
          <p className="mt-2 text-center text-xs text-gray-500">Plumbing company or freelancer? <Link href="/business/signup" className="font-semibold underline">List your business instead</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
