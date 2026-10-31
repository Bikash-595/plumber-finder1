import { FaApple, FaGoogle, FaKey } from "react-icons/fa";
import Panel from "../ui/Panel";
import StatusPill from "../ui/StatusPill";

type Status = { hasPassword: boolean; googleLinked: boolean; appleLinked: boolean };

/** Which ways you can sign in to this account. */
export default function SignInMethods({ status }: { status?: Status }) {
  const methods = [
    { icon: FaKey, label: "Email & password", on: status?.hasPassword, off: "Not set" },
    { icon: FaGoogle, label: "Google", on: status?.googleLinked, off: "Not linked" },
    { icon: FaApple, label: "Apple", on: status?.appleLinked, off: "Not linked" },
  ];
  return (
    <Panel title="Sign-in methods" description="Ways you can get into your account." bodyClassName="">
      <ul className="divide-y divide-gray-100">
        {methods.map(({ icon: Icon, label, on, off }) => (
          <li key={label} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600"><Icon className="h-4 w-4" /></span>
            <span className="flex-1 text-sm font-semibold text-gray-900">{label}</span>
            {status ? <StatusPill tone={on ? "success" : "neutral"}>{on ? "Active" : off}</StatusPill> : <span className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
