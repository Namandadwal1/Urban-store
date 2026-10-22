
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib///supabase/client";

const periods = ["7D", "30D", "90D", "1Y"];

export default function Sales() {
  const [period, setPeriod] = useState("7D");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("total_amount, payment_status, created_at");

      if (error) setError(error.message);
      else setOrders(data);

      setLoading(false);
    }

    fetchSales();
  }, []);

  const days = period === "7D" ? 7 : period === "30D" ? 30 : period === "90D" ? 90 : 365;
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const paidOrders = orders.filter(
    (o) => o.payment_status?.toLowerCase() === "paid"
  );

  const recentOrders = paidOrders.filter(
    (o) => new Date(o.created_at) >= start
  );

  const revenue = recentOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0), 0
  );

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    date.setHours(0, 0, 0, 0);

    const total = paidOrders
      .filter((o) => new Date(o.created_at).toDateString() === date.toDateString())
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    return { day: date.toLocaleDateString("en", { weekday: "short" }), total };
  });

  const max = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <section className="rounded-2xl border border-[#E9DFD4] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#29231F]">Sales Overview</h2>
          <p className="mt-1 text-sm text-gray-500">Paid order revenue</p>
        </div>

        <div className="flex gap-1 rounded-xl bg-[#F5F1EC] p-1">
          {periods.map((item) => (
            <button key={item} onClick={() => setPeriod(item)}
              className={`rounded-lg px-3 py-2 text-xs ${
                period === item ? "bg-[#29231F] text-white" : "text-gray-500"
              }`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-5 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-5 text-sm text-gray-500">Loading sales...</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[190px_1fr]">
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <h3 className="mt-2 text-3xl font-bold text-[#29231F]">
              ₹{revenue.toLocaleString("en-IN")}
            </h3>
            <p className="mt-2 text-xs text-gray-400">
              {recentOrders.length} paid orders · {period}
            </p>
          </div>

          <div className="flex h-48 items-end justify-around gap-3 border-b border-[#EEE7DF]">
            {chartData.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div title={`₹${d.total}`} className="w-full max-w-10 rounded-t-md bg-[#A56A43]"
                  style={{ height: `${(d.total / max) * 75}%`, minHeight: d.total ? "4px" : "0" }} />
                <span className="pb-2 text-xs text-gray-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}