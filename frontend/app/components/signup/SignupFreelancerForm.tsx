"use client";

import Link from "next/link";
import { useState } from "react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { authenticateAccount } from "@/components/utils/auth";

interface SignupFreelancerFormProps {
  onBack?: () => void;
  onComplete?: (name: string, email: string) => void;
}

const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", example: "(555) 000-9999" },
  { code: "+44", country: "UK", flag: "🇬🇧", example: "7911 123456" },
  { code: "+91", country: "IN", flag: "🇮🇳", example: "98765 43210" },
  { code: "+61", country: "AU", flag: "🇦🇺", example: "412 345 678" },
  { code: "+49", country: "DE", flag: "🇩🇪", example: "151 12345678" },
  { code: "+33", country: "FR", flag: "🇫🇷", example: "6 12 34 56 78" },
  { code: "+81", country: "JP", flag: "🇯🇵", example: "90 1234 5678" },
  { code: "+86", country: "CN", flag: "🇨🇳", example: "138 1234 5678" },
];

export default function SignupFreelancerForm({ onBack, onComplete }: SignupFreelancerFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!agreeTerms) {
      setPasswordError("You must agree to the terms to continue");
      return;
    }

    setPasswordError("");
    try {
      const account = await authenticateAccount("freelancer", "signup", { name: fullName, email, password, phone: `${phoneCountryCode}${phoneNumber}` });
      onComplete?.(account.name, account.email);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Could not create the freelancer account.");
    }
  };

  const selectedCode = countryCodes.find((item) => item.code === phoneCountryCode);
  const phonePlaceholder = selectedCode?.example || "123456789";

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
          🧰
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
          Join as a Freelancer Plumber
        </h1>
        <p className="mt-2 text-gray-600">
          Build your profile, manage leads, and grow your freelance plumbing business.
        </p>
      </div>

      <GoogleAuthButton accountType="freelancer" onComplete={(name, accountEmail) => onComplete?.(name, accountEmail)} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
          <span className="bg-white px-3 text-gray-500">OR REGISTER WITH EMAIL</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            FULL NAME
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            PHONE NUMBER
          </label>
          <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={phoneCountryCode}
              onChange={(e) => setPhoneCountryCode(e.target.value)}
              className="rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white sm:w-32"
            >
              {countryCodes.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.flag} {item.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={phonePlaceholder}
              className="flex-1 rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
              PASSWORD
            </label>
            <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="Create a secure password"
              className="block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" aria-label="Toggle password visibility">
              {showPassword ? "🙈" : "👁️"}
            </button>
            </div>
          </div>


          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
              CONFIRM PASSWORD
            </label>
            <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError("");
              }}
              placeholder="Confirm your password"
              className="block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
              required
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700" aria-label="Toggle confirm password visibility">
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
              required
            />
            <span className="text-gray-700">
              I agree to the <Link href="/terms" className="text-[#FFD60A] hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-[#FFD60A] hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {passwordError && <p className="text-xs font-semibold text-red-500">{passwordError}</p>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#FFD60A] hover:text-[#0b1f3b]"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="rounded-full bg-[#FFD60A] px-6 py-2.5 text-sm font-semibold text-[#0b1f3b] transition hover:brightness-105"
          >
            Create Freelancer Account
          </button>
        </div>
      </form>
    </>
  );
}
