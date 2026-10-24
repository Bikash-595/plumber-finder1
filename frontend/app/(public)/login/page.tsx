// app/login/page.tsx
"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithEmail, readStoredUser, storeUser, syncSessionCookie, VerificationRequiredError, type AccountType } from "@/components/utils/auth";
import { dashboardAreaFor, isExpired, readTokenClaims, type DashboardArea } from "@/components/utils/session";
import { AppleAuthButton } from "@/components/auth/AppleAuthButton";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import AuthLayout from "@/components/auth/AuthLayout";
import AccountTypeSwitch from "@/components/auth/AccountTypeSwitch";
import PasswordField from "@/components/auth/PasswordField";
import VerifyEmailForm from "@/components/auth/VerifyEmailForm";

const dashboardFor = (type: AccountType) => (type === "company" ? "/company-dashboard" : type === "freelancer" ? "/freelancer" : "/dashboard");
const areaOf = (type: AccountType): DashboardArea => (type === "seeker" ? "user" : type);

/** Where to go after logging in: the page that sent them here (?next=), unless it's another account type's dashboard. */
function destination(next: string | null, type: AccountType) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return dashboardFor(type);
  const area = dashboardAreaFor(next.split("?")[0]);
  return area && area !== areaOf(type) ? dashboardFor(type) : next;
}

export default function LoginPage() {
  return <Suspense fallback={null}><Login /></Suspense>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("seeker");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Set when the account's email isn't confirmed yet: show the code step.
  const [verify, setVerify] = useState<{ email: string; accountType: AccountType } | null>(null);
  const router = useRouter();
  const next = useSearchParams().get("next");

  // Sent here from a dashboard but already signed in (e.g. a session from before the login cookie): go straight back.
  useEffect(() => {
    if (!next) return;
    const stored = readStoredUser();
    const claims = readTokenClaims(stored?.accessToken);
    if (!stored?.accessToken || !claims || isExpired(claims)) return;
    syncSessionCookie(stored.accessToken);
    const type: AccountType = claims.accountType === "user" ? "seeker" : claims.accountType;
    router.replace(destination(next, type));
  }, [next, router]);

  const goToDashboard = (name: string, accountEmail: string, detectedAccountType: AccountType = accountType) => {
    storeUser({ ...readStoredUser(), name, email: accountEmail, avatarUrl: readStoredUser()?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, accountType: detectedAccountType });
    router.push(destination(next, detectedAccountType));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return setFormError("Enter your email and password.");
    setFormError("");
    setIsSubmitting(true);
    try {
      const account = await loginWithEmail(email, password, accountType);
      goToDashboard(account.name, account.email, account.accountType);
    } catch (error) {
      if (error instanceof VerificationRequiredError) setVerify({ email: error.email, accountType: error.accountType });
      else setFormError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verify) {
    return <AuthLayout><VerifyEmailForm email={verify.email} accountType={verify.accountType} onVerified={goToDashboard} onBack={() => setVerify(null)} /></AuthLayout>;
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Welcome back</h1>
      <p className="mt-1.5 text-sm text-gray-600">{next ? "Please log in to continue." : "Log in to book plumbers, manage jobs, and track your requests."}</p>

      <div className="mt-6"><AccountTypeSwitch value={accountType} onChange={(type) => { setAccountType(type); setFormError(""); }} /></div>

      <div className="mt-2 space-y-2">
        <GoogleAuthButton accountType={accountType} onComplete={goToDashboard} />
        <AppleAuthButton accountType={accountType} onComplete={goToDashboard} />
      </div>

      <div className="relative my-6" aria-hidden>
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">or with email</span></div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" right={<Link href={`/forgot-password?type=${accountType}${email ? `&email=${encodeURIComponent(email.trim())}` : ""}`} className="text-xs font-semibold text-[#0b1f3b] hover:underline">Forgot password?</Link>} />
        {formError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{formError}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-60">{isSubmitting ? "Logging in…" : "Log in"}</button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">New to Plumber Finder? <Link href="/signup" className="font-bold text-[#0b1f3b] hover:underline">Create an account</Link></p>
    </AuthLayout>
  );
}
