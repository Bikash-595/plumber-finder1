import { Suspense } from "react";
import MessagesInbox from "@/components/messages/MessagesInbox";

export default function CustomerMessagesPage() {
  return <Suspense fallback={null}><MessagesInbox base="/users" /></Suspense>;
}
