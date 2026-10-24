"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaKey } from "react-icons/fa";
import { requestPasswordReset, resetPasswordWithCode, type AccountType } from "@/components/utils/auth";
import AuthLayout from "@/components/auth/AuthLayout";
import AccountTypeSwitch from "@/components/auth/AccountTypeSwitch";
import OtpInput from "@/components/auth/OtpInput";
import PasswordField from "@/components/auth/PasswordField";

const dashboardFor = (type: AccountType) => (type === "company" ? "/company-dashboard" : type === "freelancer" ? "/freelancer" : "/dashboard");
const isAccountType = (value: string | null): value is AccountType => value === "seeker" || value === "company" || value === "freelancer";

/** Forgot password: email a 6-digit code, then set a new password with it. */
function ForgotPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>(isAccountType(params.get("type")) ? (params.get("type") as AccountType) : "seeker");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [step, setStep] = useState<"email" | "reset">("email");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter the email you signed up with.");
    setBusy(true);
    setError("");
    try {
      setInfo((await requestPasswordReset(email, accountType)) ?? "Check your email for a code.");
      setStep("reset");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't send the code.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (event: FormEvent) => {
    event.preventDefault();
    if (code.length !== 6) return setError("Enter the 6-digit code from the email.");
    if (password.length < 8) return setError("Your new password needs at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      const account = await resetPasswordWithCode(email, accountType, code, password);
      router.push(dashboardFor(account.accountType));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't reset the password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <Link href="/login" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0b1f3b]"><FaArrowLeft className="h-3 w-3" /> Back to log in</Link>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFD60A]/15 text-[#0b1f3b]"><FaKey className="h-5 w-5" /></span>
      <h1 className="mt-4 text-2xl font-extrabold text-gray-900">{step === "email" ? "Forgot your password?" : "Set a new password"}</h1>
      <p className="mt-1.5 text-sm text-gray-600">{step === "email" ? "We'll email you a 6-digit code to reset it." : <>Enter the code sent to <span className="font-semibold text-gray-900">{email}</span> and choose a new password.</>}</p>

      {step === "email" ? (
        <form onSubmit={sendCode} noValidate className="mt-6 space-y-4">
          <AccountTypeSwitch value={accountType} onChange={setAccountType} />
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Sending…" : "Email me a code"}</button>
        </form>
      ) : (
        <form onSubmit={reset} noValidate className="mt-6 space-y-4">
          {info && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{info}</p>}
          <OtpInput value={code} onChange={(value) => { setCode(value); setError(""); }} disabled={busy} />
          <PasswordField id="new-password" label="New password" value={password} onChange={setPassword} autoComplete="new-password" showStrength />
          <PasswordField id="confirm-password" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white hover:bg-[#17345a] disabled:opacity-60">{busy ? "Saving…" : "Reset password and log in"}</button>
          <button type="button" onClick={() => { setStep("email"); setCode(""); setInfo(""); }} className="w-full text-center text-sm font-semibold text-gray-500 hover:text-[#0b1f3b]">Use a different email or send a new code</button>
        </form>
      )}
    </AuthLayout>
  );
}

export default function ForgotPasswordPage() {
  return <Suspense fallback={null}><ForgotPassword /></Suspense>;
}
