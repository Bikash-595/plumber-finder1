"use client";

import { FormEvent, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { AppleAuthButton } from "@/components/auth/AppleAuthButton";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import PasswordField from "@/components/auth/PasswordField";
import ZipLocationField from "@/components/auth/ZipLocationField";
import { emailHint } from "@/components/auth/emailHints";
import { authenticateAccount, VerificationRequiredError, type Place } from "@/components/utils/auth";

interface SignupSeekerFormProps {
  onBack?: () => void;
  onComplete?: (name: string, email: string) => void;
  /** The account was created; its email must be confirmed with the emailed code. */
  onVerificationRequired?: (email: string) => void;
}

const countryCodes = [
  { code: "+1", label: "🇺🇸 +1" }, { code: "+44", label: "🇬🇧 +44" }, { code: "+91", label: "🇮🇳 +91" }, { code: "+61", label: "🇦🇺 +61" },
  { code: "+977", label: "🇳🇵 +977" }, { code: "+49", label: "🇩🇪 +49" }, { code: "+33", label: "🇫🇷 +33" }, { code: "+971", label: "🇦🇪 +971" },
];
const inputClass = "mt-1.5 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#FFD60A] focus:ring-2 focus:ring-[#FFD60A]/30";

/** Customer signup: real ZIP code, confirmed email (6-digit code), or Google / Apple. */
export default function SignupSeekerForm({ onBack, onComplete, onVerificationRequired }: SignupSeekerFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hint = emailHint(email);

  const handlePlace = (found: Place | null) => {
    setPlace(found);
    if (found?.street && !address) setAddress(found.street);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!fullName.trim()) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (hint && !hint.startsWith("Did you mean")) return setError(hint);
    if (phoneNumber.replace(/\D/g, "").length < 6) return setError("Enter your phone number.");
    if (!place) return setError("Enter a valid ZIP code so we can show plumbers near you.");
    if (password.length < 8) return setError("Your password needs at least 8 characters.");
    if (password !== confirmPassword) return setError("The two passwords don't match.");
    if (!agreeTerms) return setError("Please accept the Terms and Privacy Policy.");
    setError("");
    setBusy(true);
    try {
      const account = await authenticateAccount("seeker", "signup", { name: fullName.trim(), email: email.trim(), password, phone: `${phoneCountryCode}${phoneNumber.replace(/\s/g, "")}`, zipCode, address: address.trim() });
      onComplete?.(account.name, account.email);
    } catch (caught) {
      if (caught instanceof VerificationRequiredError) onVerificationRequired?.(caught.email);
      else setError(caught instanceof Error ? caught.message : "Could not create your account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {onBack && <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0b1f3b]"><FaArrowLeft className="h-3 w-3" /> Change account type</button>}
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Find your plumber</h1>
      <p className="mt-1.5 text-sm text-gray-600">Create a free customer account. We&apos;ll email you a code to confirm it&apos;s really you.</p>

      <div className="mt-2 space-y-2">
        <GoogleAuthButton accountType="seeker" onComplete={(name, accountEmail) => onComplete?.(name, accountEmail)} />
        <AppleAuthButton accountType="seeker" onComplete={(name, accountEmail) => onComplete?.(name, accountEmail)} />
      </div>

      <div className="relative my-6" aria-hidden>
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">or with email</span></div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full name <span className="text-red-500">*</span></label>
          <input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Jordan Lee" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address <span className="text-red-500">*</span></label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" aria-invalid={Boolean(hint)} className={inputClass} />
          {hint && <p className="mt-1.5 text-xs font-medium text-amber-700">{hint.startsWith("Did you mean") ? <button type="button" onClick={() => setEmail(hint.replace("Did you mean ", "").replace("?", ""))} className="underline">{hint}</button> : hint}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone number <span className="text-red-500">*</span></label>
          <div className="mt-1.5 flex gap-2">
            <select aria-label="Country code" value={phoneCountryCode} onChange={(e) => setPhoneCountryCode(e.target.value)} className="rounded-xl border border-gray-300 bg-white px-2 py-3 text-sm outline-none focus:border-[#FFD60A]">
              {countryCodes.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
            <input id="phone" type="tel" autoComplete="tel-national" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="(555) 123-4567" className={`${inputClass} mt-0 flex-1`} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
          <ZipLocationField zipCode={zipCode} onZipChange={setZipCode} onPlace={handlePlace} />
          <div>
            <label htmlFor="address" className="text-sm font-semibold text-gray-700">Street address <span className="font-normal text-gray-400">(optional)</span></label>
            <input id="address" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" className={inputClass} />
          </div>
        </div>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" showStrength />
        <PasswordField id="confirmPassword" label="Confirm password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" />
        <label className="flex items-start gap-3 text-sm text-gray-600">
          <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0b1f3b]" />
          <span>I agree to the <span className="font-semibold text-gray-800">Terms of Service</span> and <span className="font-semibold text-gray-800">Privacy Policy</span>.</span>
        </label>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-60">{busy ? "Creating your account…" : "Create account"}</button>
      </form>
    </>
  );
}
