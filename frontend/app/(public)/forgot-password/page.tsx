"use client";

import { Suspense } from "react";
import ForgotPassword from "@/components/auth/forgot-password/ForgotPassword";

export default function ForgotPasswordPage() {
  return <Suspense fallback={null}><ForgotPassword /></Suspense>;
}
