// app/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

/** Customer login. Companies and freelancers log in at /business/login (the header's "List Company"). */
export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm portal="customer" /></Suspense>;
}
