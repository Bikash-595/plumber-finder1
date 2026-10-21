"use client";

import { useState } from "react";
import AdminSectionPage from "@/components/AdminSectionPage";
import { DataTable, FilterBar, Pager, Panel, useAdminQuery } from "@/components/AdminData";
import { adminApi, formatDate } from "@/lib/adminApi";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useAdminQuery(`users|${search}|${page}`, () => adminApi.users({ search, page }));

  return (
    <AdminSectionPage title="User Management" description="Customer accounts on the public site, with their sign-in methods and booking activity.">
      <Panel title="Customers" description="Search by name, email, or phone.">
        <FilterBar search={search} onSearch={(value) => { setSearch(value); setPage(1); }} status="all" onStatus={() => undefined} statuses={[{ value: "all", label: "All customers", count: data?.total }]} placeholder="Search customers…" />
        <DataTable head={["Name", "Email", "Phone", "Linked accounts", "Bookings", "Joined"]} loading={loading} error={error} empty={!data?.data.length}>
          {data?.data.map((user) => (
            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3 text-gray-600">{user.phone || "—"}</td>
              <td className="px-4 py-3 capitalize text-gray-700">{user.signInMethods.join(", ") || "—"}</td>
              <td className="px-4 py-3 text-gray-700">{user.bookingCount}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </DataTable>
        {data && <Pager page={data.page} limit={data.limit} total={data.total} onPage={setPage} />}
      </Panel>
    </AdminSectionPage>
  );
}
