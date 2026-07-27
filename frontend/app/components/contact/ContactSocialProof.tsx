export default function ContactSocialProof() {
  const stats = [
    { label: "Happy Customers", value: "15K+", icon: "😊" },
    { label: "Verified Plumbers", value: "2,500+", icon: "👨‍🔧" },
    { label: "Cities Covered", value: "48+", icon: "🌆" },
    { label: "Response Time", value: "< 15 min", icon: "⚡" },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-lg p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 font-heading">Trusted by thousands</h2>
        <p className="mt-1 text-gray-500">Join our growing community of satisfied homeowners and professionals.</p>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl">{stat.icon}</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}