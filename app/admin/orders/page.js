
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(date) {
  if (!date) return "—";

  const timestamp = Date.parse(date);

  if (Number.isNaN(timestamp)) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(timestamp);
}

export default function Page() {
  const [supabase] = useState(() => createClient());
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const revenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((total, order) => total + Number(order.total_amount || 0), 0);

  useEffect(() => {
    async function loadOrders() {
      const [orderResult, profileResult, itemResult] = await Promise.all([
        supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("id, full_name, email"),
        supabase.from("order_items").select("order_id, quantity"),
      ]);

      const problem =
        orderResult.error || profileResult.error || itemResult.error;

      if (problem) {
        setError(problem.message);
      } else {
        const profiles = profileResult.data || [];
        const items = itemResult.data || [];

        setOrders(
          (orderResult.data || []).map((order) => {
            const customer = profiles.find(
              (profile) => profile.id === order.customer_id
            );

            return {
              ...order,
              customer_name: customer?.full_name || "Unknown customer",
              customer_email: customer?.email || "No email",
              item_count: items
                .filter((item) => item.order_id === order.id)
                .reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0
                ),
            };
          })
        );
      }

      setLoading(false);
    }

    loadOrders();
  }, [supabase]);

  async function updateStatus(status) {
    if (!selected) return;

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", selected.id);

    if (error) {
      setError(error.message);
      return;
    }

    const updated = { ...selected, status };

    setOrders((old) =>
      old.map((order) => (order.id === selected.id ? updated : order))
    );
    setSelected(updated);
  }

  const filtered = orders.filter((order) => {
    const text = search.toLowerCase();

    return (
      (String(order.order_number).includes(text) ||
        order.customer_name.toLowerCase().includes(text) ||
        order.customer_email.toLowerCase().includes(text)) &&
      (filter === "All" || order.status === filter)
    );
  });

  const stats = [
    ["Total Orders", orders.length],
    ["Pending Orders", orders.filter((o) => o.status === "pending").length],
    [
      "Processing Orders",
      orders.filter((o) => o.status === "processing").length,
    ],
    ["Paid Order Value", `₹${revenue.toLocaleString("en-IN")}`],
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />

      <main className="ml-64 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-2 text-sm font-medium text-[#A56A43]">
            ADMIN / ORDERS
          </p>

          <h1 className="text-3xl font-bold text-[#29231F]">
            Order Management
          </h1>

          <p className="mb-8 mt-2 text-sm text-gray-500">
            Track customer orders and manage delivery status.
          </p>

          {error && (
            <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(([title, value]) => (
              <div
                key={title}
                className="rounded-xl border border-[#E9DFD4] bg-white p-5"
              >
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="mt-3 text-2xl font-bold">{value}</h2>
              </div>
            ))}
          </div>

          <section className="min-w-0 overflow-hidden rounded-xl border border-[#E9DFD4] bg-white">
            <div className="flex flex-col gap-3 border-b border-[#E9DFD4] p-5 xl:flex-row xl:items-center xl:justify-between">
              <h2 className="text-lg font-bold">All Orders</h2>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders or customers..."
                  className="min-w-0 rounded-lg border border-[#E9DFD4] px-4 py-2 outline-none focus:border-[#A56A43]"
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-lg border border-[#E9DFD4] bg-white px-4 py-2"
                >
                  <option value="All">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-[#FAF7F2] text-xs uppercase text-gray-500">
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Items",
                      "Total",
                      "Payment",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-4">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DFD4]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center">
                        Loading orders...
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-[#FAF7F2]/70"
                      >
                        <td className="px-5 py-4 font-semibold text-[#A56A43]">
                          #{order.order_number}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">
                            {order.customer_email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-5 py-4">{order.item_count}</td>

                        <td className="px-5 py-4 font-semibold">
                          ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          {order.payment_status}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs ${
                              statusColors[order.status] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(order)}
                            className="whitespace-nowrap rounded-lg border border-[#A56A43] px-3 py-2 text-[#A56A43] hover:bg-[#A56A43] hover:text-white"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}

                  {!loading && !filtered.length && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-8 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="border-t border-[#E9DFD4] px-5 py-4 text-sm text-gray-500">
              Showing {filtered.length} of {orders.length} orders
            </p>
          </section>
        </div>
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex justify-between">
              <div>
                <p className="text-sm text-[#A56A43]">ORDER DETAILS</p>
                <h2 className="text-2xl font-bold">
                  #{selected.order_number}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p>
                Customer: <strong>{selected.customer_name}</strong>
              </p>
              <p>Email: {selected.customer_email}</p>
              <p>Items: {selected.item_count}</p>
              <p>Order date: {formatDate(selected.created_at)}</p>
              <p>Payment: {selected.payment_status}</p>

              <p className="border-t border-[#E9DFD4] pt-4 text-lg font-bold">
                Total: ₹
                {Number(selected.total_amount || 0).toLocaleString("en-IN")}
              </p>

              <label className="block font-medium">
                Update Order Status
              </label>

              <select
                value={selected.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full rounded-lg border border-[#E9DFD4] bg-white px-4 py-3"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-lg bg-[#A56A43] py-3 text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
