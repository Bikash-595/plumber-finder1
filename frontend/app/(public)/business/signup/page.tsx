"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignupChooseType from "@/components/signup/SignupChooseType";
import SignupCompanyForm from "@/components/signup/SignupCompanyForm";
import SignupFreelancerForm from "@/components/signup/SignupFreelancerForm";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import { readStoredUser, storeUser } from "@/components/utils/auth";

type BusinessType = "company" | "freelancer";
const isBusinessType = (value: string | null): value is BusinessType => value === "company" || value === "freelancer";

/** Business signup ("List Company"): company or freelancer → form (or Google / Apple) → email code. */
function BusinessSignup() {
  const params = useSearchParams();
  const preset = params.get("type");
  const [accountType, setAccountType] = useState<BusinessType | null>(isBusinessType(preset) ? preset : null);
  const [step, setStep] = useState<"choose" | "form" | "verify">(isBusinessType(preset) ? "form" : "choose");
  const [pendingEmail, setPendingEmail] = useState("");
  const router = useRouter();

  const complete = (name: string, email: string) => {
    const type = accountType ?? "company";
    storeUser({ ...readStoredUser(), name, email, avatarUrl: readStoredUser()?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, accountType: type });
    router.push(type === "company" ? "/company-dashboard" : "/freelancer");
  };
  const needsCode = (email: string) => { setPendingEmail(email); setStep("verify"); };

  return (
    <AuthLayout wide={step === "form"}>
      {step === "choose" || !accountType ? (
        <SignupChooseType types={["company", "freelancer"]} title="List your plumbing business" loginHref="/business/login" accountType={accountType} onSelectType={(type) => setAccountType(type as BusinessType)} onContinue={() => accountType && setStep("form")} />
      ) : step === "verify" ? (
        <VerifyEmailForm email={pendingEmail} accountType={accountType} onVerified={complete} onBack={() => setStep("form")} />
      ) : accountType === "freelancer" ? (
        <SignupFreelancerForm onBack={() => setStep("choose")} onComplete={complete} onVerificationRequired={needsCode} />
      ) : (
        <SignupCompanyForm onBack={() => setStep("choose")} onComplete={complete} onVerificationRequired={needsCode} />
      )}
    </AuthLayout>
  );
}

export default function BusinessSignupPage() {
  return <Suspense fallback={null}><BusinessSignup /></Suspense>;
}
