"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import {
  Search,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Filter,
  Calendar,
  CreditCard,
  User,
  Mail,
} from "lucide-react";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColors = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-[#D9F99D] text-[#29231F] border-[#c1f070]",
  cancelled: "bg-red-50 text-red-700 border-red-200",
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

export default function AdminOrdersPage() {
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
      setLoading(true);
      setError("");

      try {
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
          console.error("Failed to load orders:", problem);
          setError("Unable to load orders. Please try again later.");
          return;
        }

        const profiles = profileResult.data || [];
        const items = itemResult.data || [];

        setOrders(
          (orderResult.data || []).map((order) => {
            const customer = profiles.find(
              (profile) => profile.id === order.customer_id,
            );

            return {
              ...order,
              customer_name: customer?.full_name || "Customer",
              customer_email: customer?.email || "No email registered",
              item_count: items
                .filter((item) => item.order_id === order.id)
                .reduce((sum, item) => sum + Number(item.quantity || 0), 0),
            };
          }),
        );
      } catch (err) {
        console.error("Unexpected error while loading orders:", err);
        setError("Something went wrong while loading orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [supabase]);

  async function updateStatus(status) {
    if (!selected || !statuses.includes(status)) return;

    const previousStatus = selected.status;
    setError("");

    // Show the selected status immediately.
    setSelected((current) => ({ ...current, status }));

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", selected.id);

      if (error) {
        console.error("Failed to update order status:", error);
        setSelected((current) =>
          current ? { ...current, status: previousStatus } : current,
        );
        setError("Unable to update the order status. Please try again.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === selected.id ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      console.error("Unexpected error while updating order status:", err);

      setSelected((current) =>
        current ? { ...current, status: previousStatus } : current,
      );
      setError("Something went wrong. Please try again later.");
    }
  }

  const filtered = orders.filter((order) => {
    const text = search.toLowerCase();

    return (
      (String(order.order_number || "")
        .toLowerCase()
        .includes(text) ||
        order.customer_name.toLowerCase().includes(text) ||
        order.customer_email.toLowerCase().includes(text)) &&
      (filter === "All" || order.status === filter)
    );
  });

  const stats = [
    { title: "Total Orders", value: orders.length, icon: ShoppingBag },
    {
      title: "Pending Orders",
      value: orders.filter((o) => o.status === "pending").length,
      icon: Clock,
    },
    {
      title: "Processing",
      value: orders.filter((o) => o.status === "processing").length,
      icon: Truck,
    },
    {
      title: "Paid Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#29231F]">
      <AdminSidebar />

      {/* Main Content Area with dynamic sidebar margin & bottom clearance */}
      <main className="ml-16 md:ml-64 min-w-0 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 transition-all duration-300">
        <div className="mx-auto w-full max-w-7xl space-y-7">
          {/* Page Header */}
          <header className="border-b border-[#E9DFD4] pb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2.5 py-0.5 rounded-full border border-[#cff281]">
              Admin / Orders
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
              Order Management
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500">
              Track customer orders, review payments, and manage fulfillment
              status.
            </p>
          </header>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-600">
              {error}
            </div>
          )}
          {/* Overview Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-5 shadow-sm transition hover:border-[#D9F99D]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      {item.title}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F] shadow-sm">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-[#29231F]">
                    {item.value}
                  </h2>
                </div>
              );
            })}
          </div>

          {/* Orders Section */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md shadow-sm">
            {/* Filter and Search Toolbar */}
            <div className="flex flex-col gap-3 border-b border-[#E9DFD4] p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-[#29231F]">
                  All Orders
                </h2>
                <p className="text-xs text-neutral-500">
                  Showing {filtered.length} of {orders.length} total orders
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                {/* Search Bar */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order ID or customer..."
                    className="w-full sm:w-64 rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-auto appearance-none rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] py-2.5 pl-3.5 pr-8 text-xs sm:text-sm font-semibold text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
                  >
                    <option value="All">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  <Filter
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Orders Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-[#E9DFD4]">
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Items",
                      "Total Amount",
                      "Payment",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th key={heading} className="px-5 py-3.5">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DFD4]/60 text-neutral-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-12 text-center text-neutral-500"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
                          Loading customer orders...
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-neutral-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-mono font-bold text-[#29231F]">
                          #{order.order_number || order.id?.slice(0, 8)}
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="font-bold text-[#29231F]">
                            {order.customer_name}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {order.customer_email}
                          </p>
                        </td>

                        <td className="px-5 py-3.5 text-neutral-600 font-medium whitespace-nowrap">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-5 py-3.5 font-semibold text-neutral-700">
                          {order.item_count}
                        </td>

                        <td className="px-5 py-3.5 font-bold text-[#29231F]">
                          ₹
                          {Number(order.total_amount || 0).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="inline-block rounded-full bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600 uppercase">
                            {order.payment_status || "Unpaid"}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              statusColors[order.status] ||
                              "bg-neutral-100 text-neutral-700 border-neutral-200"
                            }`}
                          >
                            {order.status || "pending"}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSelected(order)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E9DFD4] bg-white px-3 py-1.5 text-xs font-bold text-[#29231F] shadow-sm transition hover:bg-[#D9F99D] hover:border-[#D9F99D]"
                          >
                            <Eye size={14} /> Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}

                  {!loading && !filtered.length && (
                    <tr>
                      <td
                        colSpan={8}
                        className="p-12 text-center text-neutral-500 text-xs sm:text-sm"
                      >
                        No matching orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Order Details Slide/Modal View */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-[#E9DFD4] bg-white p-6 shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#E9DFD4] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D9F99D] text-[#29231F] px-2 py-0.5 rounded-full border border-[#c2f074]">
                  Order Details
                </span>
                <h2 className="mt-1 text-xl font-bold text-[#29231F]">
                  #{selected.order_number || selected.id?.slice(0, 8)}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] text-[#29231F] transition hover:bg-neutral-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-neutral-700">
                <User size={15} className="text-neutral-400" />
                <span>
                  Customer:{" "}
                  <strong className="text-[#29231F]">
                    {selected.customer_name}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <Mail size={15} className="text-neutral-400" />
                <span>Email: {selected.customer_email}</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <ShoppingBag size={15} className="text-neutral-400" />
                <span>Total Items: {selected.item_count}</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <Calendar size={15} className="text-neutral-400" />
                <span>Placed Date: {formatDate(selected.created_at)}</span>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <CreditCard size={15} className="text-neutral-400" />
                <span>
                  Payment Status:{" "}
                  <strong className="uppercase text-[#29231F]">
                    {selected.payment_status || "Pending"}
                  </strong>
                </span>
              </div>

              <div className="rounded-2xl border border-[#E9DFD4] bg-[#FAF7F2] p-4 flex items-center justify-between mt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Total Order Amount
                </span>
                <span className="text-lg font-bold text-[#29231F]">
                  ₹
                  {Number(selected.total_amount || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#29231F] mb-1.5">
                  Update Delivery Status
                </label>

                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#E9DFD4] bg-[#FAF7F2] px-4 py-3 text-xs sm:text-sm font-bold text-[#29231F] outline-none transition focus:border-[#29231F] focus:ring-2 focus:ring-[#D9F99D]"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-[#D9F99D] py-3 text-xs sm:text-sm font-bold text-[#29231F] shadow-sm transition hover:brightness-95 active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
