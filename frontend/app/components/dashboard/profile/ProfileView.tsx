"use client";

import { FaUser } from "react-icons/fa";
import { userApi } from "@/components/utils/userApi";
import SignInPrompt from "../SignInPrompt";
import { useUserData } from "../useUserData";
import Notice from "../ui/Notice";
import PageHeader from "../ui/PageHeader";
import { Skeleton } from "../ui/Skeleton";
import AddressBook from "./AddressBook";
import ContactPreferencesForm from "./ContactPreferencesForm";
import PersonalInfoForm from "./PersonalInfoForm";
import ProfileActivity from "./ProfileActivity";
import ProfileCard from "./ProfileCard";
import ProfileCompleteness from "./ProfileCompleteness";

/** /dashboard/profile — who you are, how to reach you, and where the work is. */
export default function ProfileView() {
  const { signedIn, data: profile, setData, error } = useUserData(userApi.profile);
  const addresses = useUserData(userApi.addresses);
  if (!signedIn) return <SignInPrompt what="your profile" />;

  return (
    <div className="space-y-6">
      <PageHeader icon={FaUser} title="Profile" description="Your details, contact preferences and service addresses. Plumbers see these when you book." />
      <Notice>{error}</Notice>
      {!profile ? <div className="grid gap-6 lg:grid-cols-[320px_1fr]"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-96 rounded-2xl" /></div> : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <div className="min-w-0 space-y-4 lg:sticky lg:top-0">
            <ProfileCard profile={profile} addresses={addresses.data} />
            <ProfileActivity />
            <ProfileCompleteness profile={profile} addresses={addresses.data} />
          </div>
          <div className="min-w-0 space-y-6">
            <PersonalInfoForm key={`personal-${profile._id}`} profile={profile} onSaved={setData} />
            <ContactPreferencesForm key={`contact-${profile._id}`} profile={profile} onSaved={setData} />
            <AddressBook />
          </div>
        </div>
      )}
    </div>
  );
}
