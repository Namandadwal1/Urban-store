
"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, IndianRupee, Users } from "lucide-react";
import { createClient } from "@/lib///supabase/client";

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

      const revenue = revenueData.data
        .filter((order) => order.payment_status?.toLowerCase() === "paid")
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
      {error && <p className="mb-4 text-sm text-red-600">Error: {error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.length > 0 && stats.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-2xl border border-[#E9DFD4] bg-white p-5 hover:shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5EFE8] text-[#A56A43]">
                <Icon size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">{item.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-[#29231F]">
                {loading ? "Loading..." : item.value}
              </h2>
              <p className="mt-1 text-xs text-gray-400">Live database data</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}