"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupChooseType from "@/components/signup/SignupChooseType";
import SignupSeekerForm from "@/components/signup/SignupSeekerForm";
import SignupCompanyForm from "@/components/signup/SignupCompanyForm";
import SignupFreelancerForm from "@/components/signup/SignupFreelancerForm";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { readStoredUser, storeUser, type AccountType } from "@/components/utils/auth";

const dashboardFor = (type: AccountType) => (type === "company" ? "/company-dashboard" : type === "freelancer" ? "/freelancer" : "/dashboard");

/** Signup: choose the account type → fill the form (or Google / Apple) → confirm the email with the 6-digit code. */
export default function SignupPage() {
  const [step, setStep] = useState<"choose" | "form" | "verify">("choose");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const router = useRouter();

  const handleSignupComplete = (name: string, email: string, type: AccountType = accountType ?? "seeker") => {
    storeUser({ ...readStoredUser(), name, email, avatarUrl: readStoredUser()?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, accountType: type });
    router.push(dashboardFor(type));
  };
  const needsCode = (email: string) => { setPendingEmail(email); setStep("verify"); };
  const back = () => { setStep("choose"); };

  return (
    <AuthLayout wide={step === "form" && accountType !== "seeker"}>
      {step === "choose" ? (
        <SignupChooseType accountType={accountType} onSelectType={setAccountType} onContinue={() => accountType && setStep("form")} />
      ) : step === "verify" && accountType ? (
        <VerifyEmailForm email={pendingEmail} accountType={accountType} onVerified={handleSignupComplete} onBack={() => setStep("form")} />
      ) : accountType === "seeker" ? (
        <SignupSeekerForm onBack={back} onComplete={(name, email) => handleSignupComplete(name, email)} onVerificationRequired={needsCode} />
      ) : accountType === "freelancer" ? (
        <SignupFreelancerForm onBack={back} onComplete={(name, email) => handleSignupComplete(name, email)} onVerificationRequired={needsCode} />
      ) : (
        <SignupCompanyForm onBack={back} onComplete={(name, email) => handleSignupComplete(name, email)} onVerificationRequired={needsCode} />
      )}
    </AuthLayout>
  );
}
