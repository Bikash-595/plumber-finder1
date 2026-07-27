"use client";

import { FaCreditCard, FaWallet, FaPlus, FaTrash } from "react-icons/fa";

export default function WalletPage() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "06/24",
      isDefault: false,
    },
  ];

  const transactions = [
    { id: 1, description: "Payment to Elite LA Plumbing", amount: "-$250", date: "Mar 15, 2024", status: "completed" },
    { id: 2, description: "Refund from Premier Services", amount: "+$75", date: "Mar 10, 2024", status: "completed" },
    { id: 3, description: "Payment to Modern Chicago", amount: "-$120", date: "Mar 5, 2024", status: "completed" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Wallet & Payments</h1>
        <p className="mt-2 text-gray-600">Manage your payment methods and transaction history.</p>
      </div>

      {/* Balance Card */}
      <div className="rounded-xl bg-gradient-to-r from-[#FFD60A] to-amber-400 p-8 text-gray-900 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Account Balance</p>
            <p className="mt-2 text-4xl font-bold">$1,234.56</p>
          </div>
          <FaWallet className="h-12 w-12 opacity-50" />
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-4 py-2 font-medium text-gray-900 hover:bg-[#FFD60A]/90 transition">
            <FaPlus className="h-4 w-4" />
            Add Method
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <FaCreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{method.type}</p>
                      {method.isDefault && (
                        <span className="inline-block rounded-full bg-[#FFD60A]/20 px-2 py-1 text-xs font-semibold text-[#FFD60A]">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">•••• {method.last4}</p>
                    <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                <button className="text-red-600 hover:bg-red-50 rounded-lg p-2">
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Transactions</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{tx.description}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${tx.amount.startsWith("+") ? "text-green-600" : "text-gray-900"}`}>
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
