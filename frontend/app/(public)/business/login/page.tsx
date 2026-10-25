"use client";

import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

/** Company and freelancer login ("List Company" in the header). Customers log in at /login. */
export default function BusinessLoginPage() {
  return <Suspense fallback={null}><LoginForm portal="business" /></Suspense>;
}
