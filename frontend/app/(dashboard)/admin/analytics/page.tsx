import AdminSectionPage from "@/components/admin-dashboard/AdminSectionPage";

const insights = [
  { label: "Weekly user growth", value: "+8.7%", change: "Compared to last week" },
  { label: "Company approvals", value: "52", change: "Pending verification" },
  { label: "Freelancers onboarded", value: "34", change: "This month" },
  { label: "Platform uptime", value: "99.98%", change: "Last 30 days" },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminSectionPage
      title="Analytics"
      description="Analyze platform performance metrics and make decisions with real-time data." 
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((insight) => (
          <div key={insight.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-500">{insight.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">{insight.value}</p>
            <p className="mt-2 text-sm text-gray-500">{insight.change}</p>
          </div>
        ))}
      </div>
    </AdminSectionPage>
  );
}
