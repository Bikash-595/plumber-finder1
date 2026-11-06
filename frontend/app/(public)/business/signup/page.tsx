"use client";

import { Suspense } from "react";
import BusinessSignup from "@/components/signup/business-signup/BusinessSignup";

export default function BusinessSignupPage() {
  return <Suspense fallback={null}><BusinessSignup /></Suspense>;
}
