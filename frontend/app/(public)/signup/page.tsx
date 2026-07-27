// // app/signup/page.tsx
// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function SignupPage() {
//   const [step, setStep] = useState<"choose" | "form">("choose");
//   const [accountType, setAccountType] = useState<"seeker" | "company" | null>(null);

//   // Form fields
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);
//   const [agreeSms, setAgreeSms] = useState(false);

//   const handleTypeSelect = (type: "seeker" | "company") => {
//     setAccountType(type);
//   };

//   const handleContinue = () => {
//     if (accountType) {
//       setStep("form");
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Signup attempt", { accountType, name, email, phone, password, agreeTerms, agreeSms });
//     alert(`Account created as ${accountType === "seeker" ? "a customer" : "a plumbing company"}`);
//   };

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} relative isolate min-h-screen overflow-hidden bg-white font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       {/* Light liquid glass background */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#FFD60A]/5 via-transparent to-[#FFD60A]/5" />
//         <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/10 blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/5 blur-[120px]" />
//       </div>

//       <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
//         <div className="w-full max-w-2xl transform transition-all duration-500">
//           <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl p-6 sm:p-8">
//             {step === "choose" ? (
//               // ========== STEP 1: CHOOSE ACCOUNT TYPE ==========
//               <>
//                 <div className="text-center">
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
//                     🔧
//                   </div>
//                   <h1
//                     className="text-3xl font-extrabold tracking-tight text-gray-900"
//                     style={{ fontFamily: "var(--font-plus-jakarta)" }}
//                   >
//                     Create Your Account
//                   </h1>
//                   <p className="mt-2 text-gray-600">
//                     Already have an account?{" "}
//                     <Link href="/login" className="font-semibold text-[#FFD60A] hover:underline">
//                       Log in →
//                     </Link>
//                   </p>
//                 </div>

//                 <div className="mt-8 grid gap-6 sm:grid-cols-2">
//                   {/* Seeker Card */}
//                   <button
//                     onClick={() => handleTypeSelect("seeker")}
//                     className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
//                       accountType === "seeker"
//                         ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
//                         : "border-gray-200 bg-white hover:border-[#FFD60A]"
//                     }`}
//                   >
//                     <div className="mb-4 text-4xl">🔧</div>
//                     <h2
//                       className="text-xl font-bold text-gray-900"
//                       style={{ fontFamily: "var(--font-plus-jakarta)" }}
//                     >
//                       I&apos;m Looking for a Plumber
//                     </h2>
//                     <p className="mt-2 text-sm text-gray-600">
//                       Find and compare verified plumber companies near you.
//                     </p>
//                   </button>

//                   {/* Company Card */}
//                   <button
//                     onClick={() => handleTypeSelect("company")}
//                     className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
//                       accountType === "company"
//                         ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
//                         : "border-gray-200 bg-white hover:border-[#FFD60A]"
//                     }`}
//                   >
//                     <div className="mb-4 text-4xl">🏢</div>
//                     <h2
//                       className="text-xl font-bold text-gray-900"
//                       style={{ fontFamily: "var(--font-plus-jakarta)" }}
//                     >
//                       I&apos;m a Plumbing Company
//                     </h2>
//                     <p className="mt-2 text-sm text-gray-600">
//                       List your business and get leads from thousands of users.
//                     </p>
//                   </button>
//                 </div>

//                 {/* Continue Button - enabled only when accountType is selected */}
//                 <div className="mt-8 text-center">
//                   <button
//                     onClick={handleContinue}
//                     disabled={!accountType}
//                     className={`rounded-full px-8 py-2.5 text-sm font-semibold transition-all ${
//                       accountType
//                         ? "bg-[#FFD60A] text-white shadow-md hover:brightness-105 hover:shadow-[#FFD60A]/30 active:scale-[0.98]"
//                         : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     }`}
//                   >
//                     Continue →
//                   </button>
//                 </div>

//                 {/* Footer */}
//                 <div className="mt-10 text-center text-xs text-gray-500">
//                   <p>
//                     By creating an account, you agree to The Industrial Meller&apos;s{" "}
//                     <Link href="/terms" className="underline hover:text-[#FFD60A]">
//                       Terms of Service
//                     </Link>{" "}
//                     and{" "}
//                     <Link href="/privacy" className="underline hover:text-[#FFD60A]">
//                       Privacy Policy
//                     </Link>
//                     .
//                   </p>
//                   <p className="mt-4">
//                     © 2023 THE INDUSTRIAL MILLER ALL RIGHTS RESERVED.
//                     <br />
//                     <Link href="/help" className="hover:text-[#FFD60A]">
//                       HELP CENTER
//                     </Link>{" "}
//                     |{" "}
//                     <Link href="/privacy" className="hover:text-[#FFD60A]">
//                       PRIVACY
//                     </Link>
//                   </p>
//                 </div>
//               </>
//             ) : (
//               // ========== STEP 2: SIGNUP FORM ==========
//               <>
//                 <div className="text-center">
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
//                     📝
//                   </div>
//                   <h1
//                     className="text-3xl font-extrabold tracking-tight text-gray-900"
//                     style={{ fontFamily: "var(--font-plus-jakarta)" }}
//                   >
//                     Create Your Profile
//                   </h1>
//                   <p className="mt-2 text-gray-600">
//                     Enter your details to access our executive network of master technicians.
//                   </p>
//                 </div>

//                 {/* Google Signup */}
//                 <button
//                   type="button"
//                   className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-[#FFD60A] hover:bg-[#FFD60A]/5 hover:shadow-md"
//                 >
//                   <FcGoogle className="h-5 w-5 transition-transform group-hover:scale-110" />
//                   Continue with Google
//                 </button>

//                 {/* Divider */}
//                 <div className="relative my-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-200"></div>
//                   </div>
//                   <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
//                     <span className="bg-white px-3 text-gray-500">
//                       OR JOIN WITH EMAIL
//                     </span>
//                   </div>
//                 </div>

//                 {/* Email Form */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
//                       FULL NAME
//                     </label>
//                     <input
//                       type="text"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Julian Montgomery"
//                       className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
//                       EMAIL ADDRESS
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="julian@email.com"
//                       className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
//                       PHONE NUMBER
//                     </label>
//                     <input
//                       type="tel"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       placeholder="+91 98785-43210"
//                       className="mt-1 block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
//                       PASSWORD
//                     </label>
//                     <div className="relative mt-1">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         placeholder="*********"
//                         className="block w-full rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] focus:bg-white"
//                         required
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
//                       >
//                         {showPassword ? "🙈" : "👁️"}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Checkboxes */}
//                   <div className="space-y-2">
//                     <label className="flex items-start gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={agreeTerms}
//                         onChange={(e) => setAgreeTerms(e.target.checked)}
//                         className="mt-0.5 rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
//                         required
//                       />
//                       <span className="text-gray-700">
//                         I agree to the{" "}
//                         <Link href="/terms" className="text-[#FFD60A] hover:underline">
//                           Terms of Service
//                         </Link>{" "}
//                         and{" "}
//                         <Link href="/privacy" className="text-[#FFD60A] hover:underline">
//                           Privacy Policy
//                         </Link>
//                         .
//                       </span>
//                     </label>
//                     <label className="flex items-start gap-2 text-sm">
//                       <input
//                         type="checkbox"
//                         checked={agreeSms}
//                         onChange={(e) => setAgreeSms(e.target.checked)}
//                         className="mt-0.5 rounded border-gray-300 text-[#FFD60A] focus:ring-[#FFD60A]"
//                       />
//                       <span className="text-gray-700">
//                         I consent to receiving service updates via SMS.
//                       </span>
//                     </label>
//                   </div>

//                   <button
//                     type="submit"
//                     className="mt-4 w-full rounded-full bg-[#FFD60A] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:brightness-105 hover:shadow-[#FFD60A]/30 active:scale-[0.98]"
//                   >
//                     Create My Account →
//                   </button>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-gray-600">
//                   Already have an account?{" "}
//                   <Link href="/login" className="font-semibold text-[#FFD60A] hover:underline">
//                     Login here
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }






// "use client";

// import { useState } from "react";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// import SignupChooseType from "../components/signup/SignupChooseType";
// import SignupForm from "../components/signup/SignupForm";

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-plus-jakarta",
// });

// export default function SignupPage() {
//   const [step, setStep] = useState<"choose" | "form">("choose");
//   const [accountType, setAccountType] = useState<"seeker" | "company" | null>(null);

//   const handleSelectType = (type: "seeker" | "company") => {
//     setAccountType(type);
//   };

//   const handleContinue = () => {
//     if (accountType) {
//       setStep("form");
//     }
//   };

//   return (
//     <main
//       className={`${inter.variable} ${plusJakarta.variable} relative isolate min-h-screen overflow-hidden bg-white font-sans`}
//       style={{ fontFamily: "var(--font-inter)" }}
//     >
//       {/* Light liquid glass background */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#FFD60A]/5 via-transparent to-[#FFD60A]/5" />
//         <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/10 blur-[120px]" />
//         <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/5 blur-[120px]" />
//       </div>

//       <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
//         <div className="w-full max-w-2xl transform transition-all duration-500">
//           <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl p-6 sm:p-8">
//             {step === "choose" ? (
//               <SignupChooseType
//                 accountType={accountType}
//                 onSelectType={handleSelectType}
//                 onContinue={handleContinue}
//               />
//             ) : (
//               <SignupForm accountType={accountType!} />
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }














"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupChooseType from "@/components/signup/SignupChooseType";
import SignupSeekerForm from "@/components/signup/SignupSeekerForm";
import SignupCompanyForm from "@/components/signup/SignupCompanyForm";
import SignupFreelancerForm from "@/components/signup/SignupFreelancerForm";
import { readStoredUser, storeUser } from "@/components/utils/auth";

export default function SignupPage() {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [accountType, setAccountType] = useState<"seeker" | "company" | "freelancer" | null>(null);
  const router = useRouter();

  const handleSelectType = (type: "seeker" | "company" | "freelancer") => {
    setAccountType(type);
  };

  const handleContinue = () => {
    if (accountType) {
      setStep("form");
    }
  };

  const handleBack = () => {
    setStep("choose");
    setAccountType(null);
  };

  const handleSignupComplete = (name: string, email: string) => {
    const selectedAccountType = accountType ?? "seeker";
    storeUser({
      ...readStoredUser(),
      name,
      email,
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`,
      accountType: selectedAccountType,
    });
    router.push(
      selectedAccountType === "company"
        ? "/company-dashboard"
        : selectedAccountType === "freelancer"
        ? "/freelancer"
        : "/dashboard"
    );
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white font-sans">
      {/* Light liquid glass background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD60A]/5 via-transparent to-[#FFD60A]/5" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FFD60A]/5 blur-[120px]" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl transform transition-all duration-500">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl p-6 sm:p-8">
            {step === "choose" ? (
              <SignupChooseType
                accountType={accountType}
                onSelectType={handleSelectType}
                onContinue={handleContinue}
              />
            ) : accountType === "seeker" ? (
              <SignupSeekerForm onBack={handleBack} onComplete={handleSignupComplete} />
            ) : accountType === "freelancer" ? (
              <SignupFreelancerForm onBack={handleBack} onComplete={handleSignupComplete} />
            ) : (
              <SignupCompanyForm onBack={handleBack} onComplete={handleSignupComplete} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
