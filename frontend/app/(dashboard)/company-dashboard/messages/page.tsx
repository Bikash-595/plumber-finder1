import { Suspense } from "react";
import MessagesInbox from "@/components/messages/MessagesInbox";

export default function CompanyMessagesPage() {
  return <Suspense fallback={null}><MessagesInbox base="/companies" /></Suspense>;
}
