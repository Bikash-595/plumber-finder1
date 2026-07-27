"use client";

import { FaFileInvoice, FaDownload, FaEye } from "react-icons/fa";

export default function InvoicesPage() {
  const invoices = [
    {
      id: "INV-001",
      plumber: "Elite Los Angeles Plumbing",
      amount: "$250.00",
      date: "Mar 15, 2024",
      status: "paid",
      dueDate: "Mar 22, 2024",
    },
    {
      id: "INV-002",
      plumber: "Premier New York Services",
      amount: "$150.00",
      date: "Mar 10, 2024",
      status: "paid",
      dueDate: "Mar 17, 2024",
    },
    {
      id: "INV-003",
      plumber: "Modern Chicago Plumbing",
      amount: "$120.00",
      date: "Mar 5, 2024",
      status: "pending",
      dueDate: "Mar 12, 2024",
    },
    {
      id: "INV-004",
      plumber: "Quick Fix Plumbing",
      amount: "$85.50",
      date: "Feb 28, 2024",
      status: "paid",
      dueDate: "Mar 7, 2024",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="mt-2 text-gray-600">View and download your invoices.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plumber</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{invoice.plumber}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      <FaEye className="h-4 w-4" />
                      View
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      <FaDownload className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
