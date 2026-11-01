import { Suspense } from "react";
import MessagesInbox from "@/components/messages/MessagesInbox";

export default function FreelancerMessagesPage() {
  return <Suspense fallback={null}><MessagesInbox base="/freelancers" /></Suspense>;
}
