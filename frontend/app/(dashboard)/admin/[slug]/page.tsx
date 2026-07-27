import { notFound } from "next/navigation";
import AdminPlaceholderPage from "@/components/admin-dashboard/AdminPlaceholderPage";

const pageMap: Record<string, { title: string; description: string; actionLabel?: string; actionHref?: string }> = {
  "live-statistics": {
    title: "Live Statistics",
    description: "Monitor platform-wide live usage metrics, traffic, bookings, and active service demand in real time.",
  },
  "revenue-analytics": {
    title: "Revenue Analytics",
    description: "Review earnings, subscriptions, payment flows, and high-level financial performance for the marketplace.",
  },
  "booking-analytics": {
    title: "Booking Analytics",
    description: "Track booking volume, conversion rates, cancellations, and emergency job performance.",
  },
  "user-activity": {
    title: "User Activity",
    description: "Analyze how platform users engage with services, saved plumbers, bookings, and notifications.",
  },
  "new-registrations": {
    title: "New Registrations",
    description: "View the latest account signups and user onboarding activity for the platform.",
  },
  "service-requests": {
    title: "Service Requests",
    description: "Manage incoming service requests, assignments, and request approvals across users and providers.",
  },
  "pending-approvals": {
    title: "Pending Approvals",
    description: "Review new user, company, freelancer, and booking approvals waiting for admin action.",
  },
  "reports": {
    title: "Reports & Complaints",
    description: "Handle complaints, escalated cases, fraud reports, and platform safety issues.",
  },
  bookings: {
    title: "Bookings",
    description: "Manage and monitor all booking requests, status changes, reschedules, and service assignments.",
  },
  payments: {
    title: "Payments",
    description: "Review payment transactions, refunds, withdrawals, commission settings, and subscription revenue.",
  },
  reviews: {
    title: "Reviews",
    description: "Moderate ratings, detect fake or reported reviews, and manage review replies and disputes.",
  },
  categories: {
    title: "Service Categories",
    description: "Add, edit, and manage plumbing categories such as emergency plumbing, drain cleaning and installations.",
  },
  locations: {
    title: "Locations",
    description: "Manage countries, states, cities, ZIP codes, service areas and location-based platform coverage.",
  },
  marketing: {
    title: "Marketing",
    description: "Control promotions, referral programs, featured listings, advertising placements and SEO campaigns.",
  },
  support: {
    title: "Support & Complaints",
    description: "Manage support tickets, complaints, escalations, priority cases, and fraud reports for the marketplace.",
  },
};

interface AdminPageProps {
  params: { slug: string };
}

export default function AdminDynamicPage({ params }: AdminPageProps) {
  const page = pageMap[params.slug];

  if (!page) {
    return notFound();
  }

  return (
    <AdminPlaceholderPage
      title={page.title}
      description={page.description}
      actionLabel="Back to admin"
      actionHref="/admin"
    />
  );
}
