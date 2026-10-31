"use client";

import { FaShieldAlt } from "react-icons/fa";
import { userApi } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import PasswordForm from "./PasswordForm";
import SecurityTips from "./SecurityTips";
import SignInMethods from "./SignInMethods";

/** /dashboard/security — password and sign-in methods. */
export default function SecurityView() {
  const { signedIn, data: status, reload, error } = useUserData(userApi.security);
  if (!signedIn) return <SignInPrompt what="your security settings" />;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaShieldAlt} title="Privacy & Security" description="Manage how you sign in to your account." />
      <Notice>{error}</Notice>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <PasswordForm key={String(status?.hasPassword)} hasPassword={status?.hasPassword !== false} ready={Boolean(status)} onChanged={reload} />
        <div className="space-y-6">
          <SignInMethods status={status} />
          <SecurityTips />
        </div>
      </div>
    </div>
  );
}
