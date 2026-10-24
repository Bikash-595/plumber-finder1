"use client";

import { FormEvent, useEffect, useState } from "react";
import { FaArrowLeft, FaEnvelopeOpenText } from "react-icons/fa";
import { resendVerificationCode, verifyEmailCode, type AccountType } from "@/components/utils/auth";
import OtpInput from "./OtpInput";

type Props = {
  email: string;
  accountType: AccountType;
  onVerified: (name: string, email: string, accountType: AccountType) => void;
  onBack?: () => void;
};

/** "Check your email": enter the 6-digit code to confirm the address and sign in. */
export default function VerifyEmailForm({ email, accountType, onVerified, onBack }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const submit = async (event?: FormEvent, value = code) => {
    event?.preventDefault();
    if (value.length !== 6) return setError("Enter all 6 digits.");
    setBusy(true);
    setError("");
    try {
      const account = await verifyEmailCode(email, accountType, value);
      onVerified(account.name, account.email, account.accountType);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That code didn't work.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  // Submit as soon as the sixth digit is in.
  const changeCode = (value: string) => {
    setCode(value);
    setError("");
    if (value.length === 6 && !busy) submit(undefined, value);
  };

  const resend = async () => {
    setError("");
    setInfo("");
    try {
      setInfo((await resendVerificationCode(email, accountType)) ?? "A new code is on its way.");
      setCooldown(60);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't send a new code.");
    }
  };

  return (
    <div>
      {onBack && <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0b1f3b]"><FaArrowLeft className="h-3 w-3" /> Back</button>}
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FFD60A]/15 text-[#0b1f3b]"><FaEnvelopeOpenText className="h-6 w-6" /></span>
        <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Check your email</h1>
        <p className="mt-2 text-sm text-gray-600">We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>. It expires in 10 minutes.</p>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <OtpInput value={code} onChange={changeCode} disabled={busy} />
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
        {info && !error && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{info}</p>}
        <button type="submit" disabled={busy || code.length !== 6} className="w-full rounded-xl bg-[#0b1f3b] py-3 text-sm font-bold text-white transition hover:bg-[#17345a] disabled:opacity-50">{busy ? "Checking…" : "Verify email"}</button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Didn&apos;t get it? Check spam, or{" "}
        {cooldown > 0 ? <span className="text-gray-400">resend in {cooldown}s</span> : <button type="button" onClick={resend} className="font-semibold text-[#0b1f3b] underline">send a new code</button>}
      </p>
    </div>
  );
}
