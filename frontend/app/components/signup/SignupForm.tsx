"use client";

import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface SignupFormProps {
  accountType: "seeker" | "company";
}

export default function SignupForm({ accountType }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || password.length < 6 || !agreeTerms) {
      return;
    }
    alert(`Account created as ${accountType === "seeker" ? "a customer" : "a plumbing company"}`);
  };

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
          📝
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
          Create Your Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Enter your details to access our executive network of master technicians.
        </p>
      </div>

      {/* Google Signup */}
      <button
        type="button"
        className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-[#FFD60A] hover:bg-[#FFD60A]/5 hover:shadow-md"
      >
        <FcGoogle className="h-5 w-5 transition-transform group-hover:scale-110" />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
          <span className="bg-white px-3 text-gray-500">OR JOIN WITH EMAIL</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            FULL NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Julian Montgomery"
            className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="julian@email.com"
            className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98785-43210"
            className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
            PASSWORD
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
              className="block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Checkboxes */}
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
              I agree to the{" "}
              <Link href="/terms" className="text-[#FFD60A] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#FFD60A] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={agreeSms}
              onChange={(e) => setAgreeSms(e.target.checked)}
              className="mt-0.5 rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
            />
            <span className="text-gray-700">
              I consent to receiving service updates via SMS.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-[#FFD60A] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-105 hover:shadow-[#FFD60A]/30 active:scale-[0.98]"
        >
          Create My Account →
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#FFD60A] hover:underline">
          Login here
        </Link>
      </div>
    </>
  );
}
