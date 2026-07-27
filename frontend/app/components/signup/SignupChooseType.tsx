// "use client";

// import Link from "next/link";

// interface SignupChooseTypeProps {
//   accountType: "seeker" | "company" | null;
//   onSelectType: (type: "seeker" | "company") => void;
//   onContinue: () => void;
// }

// export default function SignupChooseType({
//   accountType,
//   onSelectType,
//   onContinue,
// }: SignupChooseTypeProps) {
//   return (
//     <>
//       <div className="text-center">
//         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
//           🔧
//         </div>
//         <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
//           Create Your Account
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Already have an account?{" "}
//           <Link href="/login" className="font-semibold text-[#FFD60A] hover:underline">
//             Log in →
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 grid gap-6 sm:grid-cols-2">
//         {/* Seeker Card */}
//         <button
//           onClick={() => onSelectType("seeker")}
//           className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
//             accountType === "seeker"
//               ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
//               : "border-gray-200 bg-white hover:border-[#FFD60A]"
//           }`}
//         >
//           <div className="mb-4 text-4xl">🔧</div>
//           <h2 className="text-xl font-bold text-gray-900 font-heading">
//             I&apos;m Looking for a Plumber
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Find and compare verified plumber companies near you.
//           </p>
//         </button>

//         {/* Company Card */}
//         <button
//           onClick={() => onSelectType("company")}
//           className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
//             accountType === "company"
//               ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
//               : "border-gray-200 bg-white hover:border-[#FFD60A]"
//           }`}
//         >
//           <div className="mb-4 text-4xl">🏢</div>
//           <h2 className="text-xl font-bold text-gray-900 font-heading">
//             I&apos;m a Plumbing Company
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">
//             List your business and get leads from thousands of users.
//           </p>
//         </button>
//       </div>

//       <div className="mt-8 text-center">
//         <button
//           onClick={onContinue}
//           disabled={!accountType}
//           className={`rounded-full px-8 py-2.5 text-sm font-semibold transition-all ${
//             accountType
//               ? "bg-[#FFD60A] text-white shadow-md hover:brightness-105 hover:shadow-[#FFD60A]/30 active:scale-[0.98]"
//               : "bg-gray-100 text-gray-400 cursor-not-allowed"
//           }`}
//         >
//           Continue →
//         </button>
//       </div>

//       {/* Footer */}
//       <div className="mt-10 text-center text-xs text-gray-500">
//         <p>
//           By creating an account, you agree to The Industrial Meller&apos;s{" "}
//           <Link href="/terms" className="underline hover:text-[#FFD60A]">
//             Terms of Service
//           </Link>{" "}
//           and{" "}
//           <Link href="/privacy" className="underline hover:text-[#FFD60A]">
//             Privacy Policy
//           </Link>
//           .
//         </p>
//         <p className="mt-4">
//           © 2023 THE INDUSTRIAL MILLER ALL RIGHTS RESERVED.
//           <br />
//           <Link href="/help" className="hover:text-[#FFD60A]">
//             HELP CENTER
//           </Link>{" "}
//           |{" "}
//           <Link href="/privacy" className="hover:text-[#FFD60A]">
//             PRIVACY
//           </Link>
//         </p>
//       </div>
//     </>
//   );
// }



















"use client";

import Link from "next/link";

interface SignupChooseTypeProps {
  accountType: "seeker" | "company" | "freelancer" | null;
  onSelectType: (type: "seeker" | "company" | "freelancer") => void;
  onContinue: () => void;
}

export default function SignupChooseType({
  accountType,
  onSelectType,
  onContinue,
}: SignupChooseTypeProps) {
  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD60A]/10 text-3xl">
          🔧
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading">
          Create Your Account
        </h1>
        <p className="mt-2 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#FFD60A] hover:underline">
            Log in →
          </Link>
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Seeker Card */}
        <button
          onClick={() => onSelectType("seeker")}
          className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
            accountType === "seeker"
              ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
              : "border-gray-200 bg-white hover:border-[#FFD60A]"
          }`}
        >
          <div className="mb-4 text-4xl">🔧</div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            I&apos;m Looking for a Plumber
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Find and compare verified plumber companies near you.
          </p>
        </button>

        {/* Company Card */}
        <button
          onClick={() => onSelectType("company")}
          className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
            accountType === "company"
              ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
              : "border-gray-200 bg-white hover:border-[#FFD60A]"
          }`}
        >
          <div className="mb-4 text-4xl">🏢</div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            I&apos;m a Plumbing Company
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            List your business and get leads from thousands of users.
          </p>
        </button>

        {/* Freelancer Card */}
        <button
          onClick={() => onSelectType("freelancer")}
          className={`group rounded-2xl border p-6 text-left transition-all hover:shadow-md hover:scale-[1.02] ${
            accountType === "freelancer"
              ? "border-[#FFD60A] bg-[#FFD60A]/5 shadow-md"
              : "border-gray-200 bg-white hover:border-[#FFD60A]"
          }`}
        >
          <div className="mb-4 text-4xl">🧰</div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            I&apos;m a Freelancer Plumber
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Offer plumbing services individually and manage your own leads.
          </p>
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onContinue}
          disabled={!accountType}
          className={`rounded-full px-8 py-2.5 text-sm font-semibold transition-all ${
            accountType
              ? "bg-[#FFD60A] text-white shadow-md hover:brightness-105 hover:shadow-[#FFD60A]/30 active:scale-[0.98]"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-gray-500">
        <p>
          By creating an account, you agree to The Industrial Meller&apos;s{" "}
          <Link href="/terms" className="underline hover:text-[#FFD60A]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[#FFD60A]">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="mt-4">
          © 2023 THE INDUSTRIAL MILLER ALL RIGHTS RESERVED.
          <br />
          <Link href="/help" className="hover:text-[#FFD60A]">
            HELP CENTER
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="hover:text-[#FFD60A]">
            PRIVACY
          </Link>
        </p>
      </div>
    </>
  );
}