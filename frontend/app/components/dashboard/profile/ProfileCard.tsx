import { FaCalendarAlt, FaClock, FaEnvelope, FaLanguage, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import UserAvatar from "@/components/UserAvatar";
import { formatAddress, type Address, type Profile } from "@/components/utils/userApi";
import { contactMethods, contactTimes } from "./profileOptions";

/** Summary card: photo, name and contact details as plumbers will see them. */
export default function ProfileCard({ profile, addresses }: { profile: Profile; addresses?: Address[] }) {
  const since = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : null;
  const home = addresses?.find((address) => address.isDefault);
  const method = contactMethods.find((option) => option.value === profile.preferredContact);
  const time = contactTimes.find((option) => option.value === profile.contactTime);
  const details = [
    { icon: FaEnvelope, text: profile.email },
    profile.phone && { icon: FaPhoneAlt, text: profile.phone },
    { icon: FaMapMarkerAlt, text: home ? formatAddress(home) : profile.city ? `${profile.city}, ${profile.state ?? ""} ${profile.zipCode ?? ""}`.trim() : profile.zipCode ? `ZIP ${profile.zipCode}` : "No address yet" },
    (method || time) && { icon: FaClock, text: [method?.label, time?.label.replace(/ \(.*\)/, "")].filter(Boolean).join(" · ") },
    profile.language && { icon: FaLanguage, text: profile.language },
    since && { icon: FaCalendarAlt, text: `Member since ${since}` },
  ].filter(Boolean) as { icon: typeof FaEnvelope; text: string }[];

  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="h-20 bg-gradient-to-r from-[#0b1f3b] to-[#24507f]" />
      <div className="-mt-10 px-6 pb-6">
        <UserAvatar name={profile.name} src={profile.avatarUrl} size={80} className="ring-4 ring-white" />
        <h2 className="mt-3 text-lg font-bold text-gray-900">{profile.name}</h2>
        <p className="text-sm text-gray-500">Customer account{profile.googleId ? " · Google" : profile.appleId ? " · Apple" : ""}</p>
        <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
          {details.map(({ icon: Icon, text }) => <li key={text} className="flex items-start gap-2.5"><Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" /><span className="min-w-0 break-words">{text}</span></li>)}
        </ul>
      </div>
    </aside>
  );
}
