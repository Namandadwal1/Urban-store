"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, PackageCheck, Clock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

      const formatted = (data || []).map((order) => ({
        ...order,
        customer:
          profiles.data?.find((p) => p.id === order.customer_id)?.full_name ||
          "Customer",
        product:
          items.data?.find((item) => item.order_id === order.id)?.product_name ||
          "Standard Order",
      }));

      setOrders(formatted);
      setLoading(false);
    }

    fetchOrders();
  }, []);

  const filtered = orders.filter((order) =>
    `${order.order_number || ""} ${order.customer || ""} ${order.product || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Helper for dynamic status badge styling
  const getStatusBadge = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s.includes("delivered") || s.includes("completed") || s.includes("paid")) {
      return "bg-[#D9F99D] text-[#29231F] border-[#c1f070]";
    }
    if (s.includes("processing") || s.includes("shipped")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <section className="min-w-0 rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#29231F]">
            Recent Orders
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Latest customer transactions
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#29231F] hover:underline decoration-[#D9F99D] decoration-2"
        >
          View all <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mt-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order ID, customer, or product..."
          className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#29231F] outline-none transition-all focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
        />
      </div>

      {/* Loading & Error States */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-2 py-8 text-xs text-neutral-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
          Loading orders...
        </div>
      )}

      {/* Orders List Container */}
      {!loading && !error && (
        <div className="mt-4">
          
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E9DFD4] text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="pb-3 pl-1">Order ID</th>
                  <th className="pb-3">Customer / Product</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right pr-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DFD4]/60">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-neutral-50/60 transition-colors"
                  >
                    <td className="py-3.5 pl-1 font-mono font-semibold text-[#29231F]">
                      #{order.order_number || order.id?.slice(0, 8)}
                    </td>
                    <td className="py-3.5 pr-3">
                      <p className="font-bold text-[#29231F]">{order.customer}</p>
                      <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                        {order.product}
                      </p>
                    </td>
                    <td className="py-3.5 font-bold text-[#29231F]">
                      ₹{Number(order.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 text-right pr-1">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View (Visible only on small screens) */}
          <div className="block sm:hidden space-y-3">
            {filtered.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-[#E9DFD4] bg-[#FAF7F2]/60 p-3.5 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#29231F]">
                    #{order.order_number || order.id?.slice(0, 8)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-[#29231F]">{order.customer}</p>
                  <p className="text-[11px] text-neutral-500">{order.product}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#E9DFD4]/60">
                  <span className="text-[10px] font-semibold text-neutral-400">Total Amount</span>
                  <span className="text-xs font-bold text-[#29231F]">
                    ₹{Number(order.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-neutral-500">
              No matching orders found.
            </div>
          )}

        </div>
      )}
    </section>
  );
}