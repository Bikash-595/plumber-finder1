"use client";

import { Suspense } from "react";
import LoginForm from "@/components/login/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1f3b] to-[#17345a] px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
