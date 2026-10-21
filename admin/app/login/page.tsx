"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { loginAdmin } from "@/lib/adminAuth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Only return to a path inside this app.
  const next = params.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") && next !== "/login" ? next : "/";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginAdmin(email, password);
      router.replace(destination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0b1f3b] text-[#FFD60A]"><FaShieldAlt className="h-5 w-5" aria-hidden /></span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Plumber Finder Admin</h1>
          <p className="text-sm text-gray-500">Authorised staff only</p>
        </div>
      </div>
      <label className="mt-6 block text-sm font-semibold text-gray-700">Email
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0b1f3b] focus:ring-2 focus:ring-[#0b1f3b]/20" />
      </label>
      <label className="mt-4 block text-sm font-semibold text-gray-700">Password
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0b1f3b] focus:ring-2 focus:ring-[#0b1f3b]/20" />
      </label>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b1f3b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#17345a] disabled:opacity-60">
        <FaLock className="h-3.5 w-3.5" aria-hidden /> {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-6 text-center text-xs text-gray-400">Admin accounts are created by your developer with <code>npm run create-admin</code>.</p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1f3b] to-[#17345a] px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
