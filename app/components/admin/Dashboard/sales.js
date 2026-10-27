"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp } from "lucide-react";

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
      else setOrders(data || []);

      setLoading(false);
    }

    fetchSales();
  }, []);

  const days =
    period === "7D" ? 7 : period === "30D" ? 30 : period === "90D" ? 90 : 365;
  
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const paidOrders = orders.filter(
    (o) => o.payment_status?.toLowerCase() === "paid" || o.payment_status?.toLowerCase() === "completed"
  );

  const recentOrders = paidOrders.filter(
    (o) => new Date(o.created_at) >= start
  );

  const revenue = recentOrders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  // Generate 7-day chart datapoints
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    date.setHours(0, 0, 0, 0);

    const total = paidOrders
      .filter((o) => new Date(o.created_at).toDateString() === date.toDateString())
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    return { 
      day: date.toLocaleDateString("en-GB", { weekday: "short" }), 
      total 
    };
  });

  const max = Math.max(...chartData.map((d) => d.total), 1);

  return (
    <section className="rounded-2xl border border-[#E9DFD4] bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-sm">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#29231F]">
            Sales Overview
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Real-time revenue from paid orders
          </p>
        </div>

        {/* Period Selector Pills */}
        <div className="flex items-center gap-1 rounded-xl bg-[#FAF7F2] p-1 border border-[#E9DFD4] self-start sm:self-auto">
          {periods.map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                period === item
                  ? "bg-[#D9F99D] text-[#29231F] shadow-sm"
                  : "text-neutral-500 hover:text-[#29231F]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {error ? (
        <p className="mt-5 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
          {error}
        </p>
      ) : loading ? (
        <div className="mt-6 flex items-center justify-center gap-2 py-10 text-xs text-neutral-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#29231F] border-t-transparent" />
          Loading sales analytics...
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr] items-end">
          
          {/* Revenue Card */}
          <div className="flex flex-col justify-between rounded-xl bg-[#FAF7F2] p-4 border border-[#E9DFD4]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Total Revenue
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#29231F]">
                ₹{revenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E9DFD4]/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500">
                {recentOrders.length} paid orders
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <TrendingUp size={11} /> {period}
              </span>
            </div>
          </div>

          {/* Dynamic Visual Bar Chart */}
          <div className="flex h-52 items-end justify-between gap-2 sm:gap-4 border-b border-[#E9DFD4] pb-2 px-1">
            {chartData.map((d, index) => {
              const heightPercent = Math.max((d.total / max) * 100, 6);

              return (
                <div
                  key={index}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  {/* Hover Tooltip Value */}
                  <span className="text-[10px] font-bold text-[#29231F] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{d.total.toLocaleString("en-IN")}
                  </span>

                  {/* Chart Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[36px] rounded-t-lg bg-[#29231F] transition-all duration-500 group-hover:bg-[#D9F99D] group-hover:shadow-md cursor-pointer"
                  />

                  {/* Day Label */}
                  <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 group-hover:text-[#29231F]">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </section>
  );
}