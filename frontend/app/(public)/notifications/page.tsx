// app/notifications/page.tsx
import NotificationsList from "@/components/dashboard/NotificationsList";

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <NotificationsList />
      </div>
    </main>
  );
}
