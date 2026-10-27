"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, IndianRupee, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const formatNumber = (num) => new Intl.NumberFormat("en-IN").format(num);

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

export default function Stats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [products, orders, customers, revenueData] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount, payment_status"),
      ]);

      const results = [products, orders, customers, revenueData];
      const failed = results.find((result) => result.error);

      if (failed) {
        setError(failed.error.message);
        setLoading(false);
        return;
      }

      const revenue = (revenueData.data || [])
        .filter((order) => {
          const status = order.payment_status?.toLowerCase();
          return status === "paid" || status === "completed";
        })
        .reduce((total, order) => total + Number(order.total_amount || 0), 0);

      setStats([
        { title: "Total Products", value: formatNumber(products.count ?? 0), icon: Package },
        { title: "Total Orders", value: formatNumber(orders.count ?? 0), icon: ShoppingBag },
        { title: "Total Revenue", value: formatCurrency(revenue), icon: IndianRupee },
        { title: "Total Customers", value: formatNumber(customers.count ?? 0), icon: Users },
      ]);

      setLoading(false);
    }

    fetchStats();
  }, []);

  return (
    <section>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.length > 0 ? (
          stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-[#D9F99D] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  {/* Icon Container styled with #D9F99D */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F99D] text-[#29231F] shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Live
                  </span>
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {item.title}
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#29231F]">
                  {loading ? (
                    <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-200" />
                  ) : (
                    item.value
                  )}
                </h2>

                <p className="mt-1 text-[11px] font-medium text-neutral-400">
                  Database synchronized
                </p>
              </div>
            );
          })
        ) : loading ? (
          /* Loading Skeletons */
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E9DFD4] bg-white/80 p-5 shadow-sm animate-pulse"
            >
              <div className="h-11 w-11 rounded-xl bg-neutral-200 mb-4" />
              <div className="h-3 w-20 bg-neutral-200 rounded mb-2" />
              <div className="h-7 w-28 bg-neutral-200 rounded" />
            </div>
          ))
        ) : null}
      </div>
    </section>
  );
}