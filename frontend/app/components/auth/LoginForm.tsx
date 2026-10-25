"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authenticateAccount, findAccountType, readStoredUser, storeUser, syncSessionCookie, VerificationRequiredError, type AccountType } from "@/components/utils/auth";
import { dashboardAreaFor, isExpired, readTokenClaims, type DashboardArea } from "@/components/utils/session";
import { AppleAuthButton } from "./AppleAuthButton";
import { GoogleAuthButton } from "./GoogleAuthButton";
import AuthLayout from "./AuthLayout";
import AccountTypeSwitch from "./AccountTypeSwitch";
import PasswordField from "./PasswordField";
import VerifyEmailForm from "./VerifyEmailForm";

/** "customer": /login (customers only). "business": /business/login (companies and freelancers only). */
export type Portal = "customer" | "business";

const dashboardFor = (type: AccountType) => (type === "company" ? "/company-dashboard" : type === "freelancer" ? "/freelancer" : "/dashboard");
const areaOf = (type: AccountType): DashboardArea => (type === "seeker" ? "user" : type);
const typesFor: Record<Portal, AccountType[]> = { customer: ["seeker"], business: ["company", "freelancer"] };
const portalOf = (type: AccountType): Portal => (type === "seeker" ? "customer" : "business");

/** Where to go after logging in: the page that sent them here (?next=), unless it's another account type's dashboard. */
function destination(next: string | null, type: AccountType) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return dashboardFor(type);
  const area = dashboardAreaFor(next.split("?")[0]);
  return area && area !== areaOf(type) ? dashboardFor(type) : next;
}

/** Login for one entrance. Each entrance only signs in its own account types. */
export default function LoginForm({ portal }: { portal: Portal }) {
  const params = useSearchParams();
  const next = params.get("next");
  const requestedType = params.get("type");
  const allowed = typesFor[portal];
  const [accountType, setAccountType] = useState<AccountType>(allowed.includes(requestedType as AccountType) ? (requestedType as AccountType) : allowed[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  // Credentials that belong to the other entrance (a company on the customer login, or the reverse).
  const [wrongPortal, setWrongPortal] = useState<AccountType | null>(null);
  const [verify, setVerify] = useState<{ email: string; accountType: AccountType } | null>(null);
  const router = useRouter();

  // Sent here from a dashboard but already signed in (e.g. a session from before the login cookie): go straight back.
  useEffect(() => {
    if (!next) return;
    const stored = readStoredUser();
    const claims = readTokenClaims(stored?.accessToken);
    if (!stored?.accessToken || !claims || isExpired(claims)) return;
    const type: AccountType = claims.accountType === "user" ? "seeker" : claims.accountType;
    if (!allowed.includes(type)) return;
    syncSessionCookie(stored.accessToken);
    router.replace(destination(next, type));
  }, [next, router, allowed]);

  const goToDashboard = (name: string, accountEmail: string, detectedAccountType: AccountType = accountType) => {
    storeUser({ ...readStoredUser(), name, email: accountEmail, avatarUrl: readStoredUser()?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, accountType: detectedAccountType });
    router.push(destination(next, detectedAccountType));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) return setFormError("Enter your email and password.");
    setFormError("");
    setWrongPortal(null);
    setIsSubmitting(true);
    try {
      // Type-specific login: the customer entrance can only sign in customers, and so on.
      const account = await authenticateAccount(accountType, "login", { email: email.trim(), password });
      goToDashboard(account.name, account.email, accountType);
    } catch (error) {
      if (error instanceof VerificationRequiredError) return setVerify({ email: error.email, accountType: error.accountType });
      const message = error instanceof Error ? error.message : "Unable to log in.";
      // Wrong password for this type — maybe these are the details of another kind of account?
      const otherType = /incorrect/i.test(message) ? await findAccountType(email, password) : null;
      if (otherType && otherType !== accountType) {
        if (allowed.includes(otherType)) { setAccountType(otherType); setFormError(`This is a ${otherType} account — we switched the form to ${otherType === "company" ? "Company" : "Freelancer"}. Press Log in again.`); }
        else setWrongPortal(otherType);
      } else {
        setFormError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verify) {
    return <AuthLayout><VerifyEmailForm email={verify.email} accountType={verify.accountType} onVerified={goToDashboard} onBack={() => setVerify(null)} /></AuthLayout>;
  }

  const business = portal === "business";
  const forgotHref = `/forgot-password?type=${accountType}${email ? `&email=${encodeURIComponent(email.trim())}` : ""}`;

  return (
    <AuthLayout>
      {business && <p className="mb-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">For plumbing businesses</p>}
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{business ? "Log in to your business" : "Welcome back"}</h1>
      <p className="mt-1.5 text-sm text-gray-600">{next ? "Please log in to continue." : business ? "Manage your company or freelancer profile, leads, and jobs." : "Log in to book plumbers, save favourites, and track your requests."}</p>

      {business && <div className="mt-6"><AccountTypeSwitch types={allowed} value={accountType} onChange={(type) => { setAccountType(type); setFormError(""); setWrongPortal(null); }} /></div>}

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
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">{business ? "Business email" : "Email address"}</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={business ? "you@yourcompany.com" : "you@example.com"} className="mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30" />
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" right={<Link href={forgotHref} className="text-xs font-semibold text-[#0b1f3b] hover:underline">Forgot password?</Link>} />
        {formError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{formError}</p>}
        {wrongPortal && (
          <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            {portalOf(wrongPortal) === "business"
              ? <>This is a {wrongPortal} account. Businesses log in through <Link href={`/business/login?type=${wrongPortal}`} className="font-bold underline">List Company → Log in</Link>.</>
              : <>This is a customer account. Customers log in on the <Link href="/login" className="font-bold underline">customer login</Link>.</>}
          </p>
        )}
        <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-60">{isSubmitting ? "Logging in…" : "Log in"}</button>
      </form>

      {business ? (
        <>
          <p className="mt-6 text-center text-sm text-gray-600">New here? <Link href="/business/signup" className="font-bold text-[#0b1f3b] hover:underline">List your company or freelance business</Link></p>
          <p className="mt-2 text-center text-xs text-gray-500">Looking for a plumber? <Link href="/login" className="font-semibold underline">Customer login</Link></p>
        </>
      ) : (
        <>
          <p className="mt-6 text-center text-sm text-gray-600">New to Plumber Finder? <Link href="/signup" className="font-bold text-[#0b1f3b] hover:underline">Create an account</Link></p>
          <p className="mt-2 text-center text-xs text-gray-500">Plumbing company or freelancer? <Link href="/business/login" className="font-semibold underline">List Company / business login</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
