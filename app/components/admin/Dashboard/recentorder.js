
"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { createClient } from "@/lib///supabase/client";

export default function RecentOrder() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, customer_id, status, total_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const [profiles, items] = await Promise.all([
        supabase.from("profiles").select("id, full_name"),
        supabase.from("order_items").select("order_id, product_name"),
      ]);

      if (profiles.error || items.error) {
        setError(profiles.error?.message || items.error?.message);
        setLoading(false);
        return;
      }

      const formatted = data.map((order) => ({
        ...order,
        customer: profiles.data.find(
          (p) => p.id === order.customer_id
        )?.full_name || "Unknown customer",
        product: items.data.find(
          (item) => item.order_id === order.id
        )?.product_name || "No product",
      }));

      setOrders(formatted);
      setLoading(false);
    }

    fetchOrders();
  }, []);

  const filtered = orders.filter((order) =>
    `${order.order_number} ${order.customer} ${order.product}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="min-w-0 rounded-2xl border border-[#E9DFD4] bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#29231F]">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-500">Latest customer transactions</p>
        </div>
        <a href="/admin/orders" className="text-sm text-[#A56A43]">
          View all
        </a>
      </div>

      <div className="relative mt-5">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders or customers..."
          className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-10 pr-3 text-sm outline-none"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-gray-500">Loading orders...</p>}

      {!loading && !error && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer / Product</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-[#F1EBE4]">
                  <td className="py-4 pr-3">#{order.order_number}</td>
                  <td className="py-4 pr-3">
                    <p className="font-medium">{order.customer}</p>
                    <p className="mt-1 text-xs text-gray-500">{order.product}</p>
                  </td>
                  <td className="py-4 pr-3">
                    ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4">
                    <span className="rounded-full bg-[#F5EFE8] px-2.5 py-1 text-xs text-[#A56A43]">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}